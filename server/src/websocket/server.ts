import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../config.js';
import { handleMessage, handleDisconnect } from './handlers.js';
import { checkRateLimit } from '../utils/rate-limiter.js';
import { validateMessage, requiresAuth } from '../utils/validator.js';
import { logger } from '../utils/logger.js';
import { metricsCollector } from '../utils/metrics.js';
import { registerForShutdown, isServerShuttingDown } from '../utils/graceful-shutdown.js';

// Store userId per WebSocket
const wsUserMap = new WeakMap<WebSocket, number>();

// Store IP per WebSocket for rate limiting before auth
const wsIpMap = new WeakMap<WebSocket, string>();

// Message queue per WebSocket to ensure sequential processing
const messageQueues = new WeakMap<WebSocket, Promise<void>>();

export function getUserIdForWs(ws: WebSocket): number | null {
  return wsUserMap.get(ws) ?? null;
}

export function setUserIdForWs(ws: WebSocket, userId: number): void {
  wsUserMap.set(ws, userId);
}

export function createWebSocketServer(): WebSocketServer {
  const wss = new WebSocketServer({ port: config.server.wsPort });
  
  logger.info(`WebSocket server started`, { port: config.server.wsPort });
  
  // Register for graceful shutdown
  registerForShutdown({ wss });
  
  wss.on('connection', (ws: WebSocket, req) => {
    // Reject new connections during shutdown
    if (isServerShuttingDown()) {
      ws.close(1001, 'Server is shutting down');
      return;
    }
    
    metricsCollector.connectionOpened();
    
    // Get client IP for rate limiting
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() 
      || req.socket.remoteAddress 
      || 'unknown';
    wsIpMap.set(ws, ip);
    
    logger.debug('New connection', { ip });
    
    // Heartbeat - check every 5 seconds, disconnect after 10 seconds without response
    let isAlive = true;
    let missedPings = 0;
    const MAX_MISSED_PINGS = 2; // 2 missed pings = 10 seconds
    
    ws.on('pong', () => { 
      isAlive = true;
      missedPings = 0;
      
      // Update connection health
      const userId = getUserIdForWs(ws);
      if (userId) {
        import('./connections.js').then(({ markPongReceived }) => {
          markPongReceived(userId);
        });
      }
    });
    
    const pingInterval = setInterval(() => {
      if (!isAlive) {
        missedPings++;
        
        if (missedPings >= MAX_MISSED_PINGS) {
          logger.debug('Connection timeout, terminating', { ip, missedPings });
          ws.terminate();
          return;
        }
        
        // Update connection health after first missed ping
        const userId = getUserIdForWs(ws);
        if (userId) {
          import('./connections.js').then(({ updateConnectionHealth }) => {
            updateConnectionHealth(userId);
          });
        }
      }
      
      isAlive = false;
      ws.ping();
    }, 5000); // Check every 5 seconds
    
    // Initialize message queue for sequential processing
    messageQueues.set(ws, Promise.resolve());
    
    ws.on('message', (data: Buffer) => {
      metricsCollector.messageReceived();
      const startTime = Date.now();
      
      // Parse message type first to check if it needs queuing
      let messageType: string | undefined;
      let parsedData: any;
      try {
        const rawData = data.toString();
        parsedData = JSON.parse(rawData);
        messageType = parsedData.type;
      } catch {
        // Invalid JSON, will be handled in queue
      }
      
      // Fast-path for high-frequency non-state-changing messages
      // ONLY throw_frame and throw_sound - they must be processed immediately
      // throw_start must go through queue to arrive BEFORE frames
      const isFastPath = messageType === 'throw_frame' || messageType === 'throw_sound';
      
      if (isFastPath && parsedData) {
        // Process immediately in parallel without blocking queue
        (async () => {
          try {
            const userId = getUserIdForWs(ws);
            if (!userId) return;
            
            await handleMessage(ws, parsedData, userId);
            
            const processingTime = Date.now() - startTime;
            metricsCollector.recordProcessingTime(processingTime);
          } catch (err) {
            logger.error('Error handling fast-path message', err);
          }
        })();
        return;
      }
      
      // Queue messages to process sequentially (prevents race conditions)
      const currentQueue = messageQueues.get(ws) || Promise.resolve();
      const newQueue = currentQueue.then(async () => {
        try {
          const rawData = data.toString();
          const userId = getUserIdForWs(ws);
          const clientIp = wsIpMap.get(ws) || 'unknown';
          
          // 1. Validate message format
          const validation = validateMessage(rawData);
          if (!validation.success) {
            logger.warn('Invalid message', { 
              error: validation.error, 
              userId: userId ?? undefined, 
              ip: clientIp,
              type: validation.type 
            });
            metricsCollector.messageError();
            ws.send(JSON.stringify({ type: 'error', message: validation.error }));
            return;
          }
          
          const messageType = validation.type!;
          
          // 2. Check rate limit
          const rateLimitId = userId ? `user:${userId}` : `ip:${clientIp}`;
          const rateLimit = checkRateLimit(rateLimitId, messageType);
          
          if (!rateLimit.allowed) {
            logger.warn('Rate limit exceeded', { 
              userId: userId ?? undefined, 
              ip: clientIp, 
              type: messageType,
              blocked: rateLimit.blocked,
              resetIn: rateLimit.resetIn 
            });
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: rateLimit.blocked 
                ? `Too many requests. Try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds.`
                : 'Rate limit exceeded'
            }));
            return;
          }
          
          // 3. Check authentication requirement
          if (requiresAuth(messageType) && !userId) {
            ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
            return;
          }
          
          // 4. Process message
          const newUserId = await handleMessage(ws, validation.data, userId);
          if (newUserId && !userId) {
            setUserIdForWs(ws, newUserId);
          }
          
          // Record processing time
          const processingTime = Date.now() - startTime;
          metricsCollector.recordProcessingTime(processingTime);
          
          // Log slow messages
          if (processingTime > 100) {
            logger.warn('Slow message processing', { 
              type: messageType, 
              userId: userId ?? undefined, 
              duration: processingTime 
            });
          }
        } catch (err) {
          logger.error('Error handling message', err);
          metricsCollector.messageError();
          ws.send(JSON.stringify({ type: 'error', message: 'Internal server error' }));
        }
      });
      messageQueues.set(ws, newQueue);
    });
    
    ws.on('close', () => {
      clearInterval(pingInterval);
      metricsCollector.connectionClosed();
      
      const userId = getUserIdForWs(ws);
      if (userId) {
        logger.info('User disconnected', { userId });
        handleDisconnect(userId);
      }
    });
    
    ws.on('error', (err) => {
      logger.error('WebSocket error', err, { ip });
    });
  });
  
  return wss;
}
