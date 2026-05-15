import { config } from './config.js';
import { createWebSocketServer } from './websocket/server.js';
import { pool } from './db/client.js';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createHash } from 'crypto';
import { handlePreCheckoutQuery, handleSuccessfulPayment } from './services/telegram.js';
import { getUserInventory } from './services/users.js';
import * as connections from './websocket/connections.js';
import { logger } from './utils/logger.js';
import { metricsCollector } from './utils/metrics.js';
import { setupShutdownHandlers, registerForShutdown } from './utils/graceful-shutdown.js';
import { getRateLimitStats } from './utils/rate-limiter.js';
import { getFraudStats } from './utils/anti-fraud.js';

// Setup graceful shutdown handlers first
setupShutdownHandlers();

// Generate secret token from bot token (must match setup-webhook.ts)
function generateSecretToken(botToken: string): string {
  return createHash('sha256').update(botToken + '_webhook_secret').digest('hex').substring(0, 32);
}

const WEBHOOK_SECRET = config.bot.token ? generateSecretToken(config.bot.token) : '';

// Parse JSON body from request
async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
    req.on('error', reject);
  });
}

// Get database statistics
async function getDatabaseStats(): Promise<Record<string, number>> {
  const queries = [
    { name: 'total_users', query: 'SELECT COUNT(*) as count FROM users' },
    { name: 'users_today', query: "SELECT COUNT(*) as count FROM users WHERE created_at > NOW() - INTERVAL '1 day'" },
    { name: 'active_users_24h', query: "SELECT COUNT(*) as count FROM users WHERE last_online > NOW() - INTERVAL '1 day'" },
    { name: 'total_items', query: 'SELECT COUNT(*) as count FROM item_catalog WHERE is_available = true' },
    { name: 'total_purchases', query: 'SELECT COUNT(*) as count FROM purchases WHERE status = \'completed\'' },
    { name: 'purchases_today', query: "SELECT COUNT(*) as count FROM purchases WHERE status = 'completed' AND created_at > NOW() - INTERVAL '1 day'" },
    { name: 'total_friends', query: 'SELECT COUNT(*) as count FROM friends WHERE status = \'active\'' },
    { name: 'total_matches', query: 'SELECT COUNT(*) as count FROM match_history' },
    { name: 'matches_today', query: "SELECT COUNT(*) as count FROM match_history WHERE started_at > NOW() - INTERVAL '1 day'" },
    { name: 'pending_invitations', query: "SELECT COUNT(*) as count FROM invitations WHERE status = 'pending'" },
    { name: 'friend_requests', query: "SELECT COUNT(*) as count FROM friend_requests WHERE status = 'pending'" },
  ];
  
  const stats: Record<string, number> = {};
  
  for (const { name, query: sql } of queries) {
    try {
      const result = await pool.query<{ count: string }>(sql);
      stats[name] = parseInt(result.rows[0].count, 10);
    } catch (err) {
      logger.error(`Failed to get stat ${name}`, err);
      stats[name] = 0;
    }
  }
  
  return stats;
}

// Get analytics data
async function getAnalytics(): Promise<any> {
  try {
    // Revenue stats
    const revenueResult = await pool.query(`
      SELECT 
        COUNT(*) as total_purchases,
        SUM(stars_amount) as total_revenue,
        AVG(stars_amount) as avg_purchase,
        COUNT(DISTINCT user_id) as paying_users
      FROM purchases 
      WHERE status = 'completed'
    `);
    
    const revenueToday = await pool.query(`
      SELECT 
        COUNT(*) as purchases_today,
        COALESCE(SUM(stars_amount), 0) as revenue_today
      FROM purchases 
      WHERE status = 'completed' 
      AND created_at > NOW() - INTERVAL '1 day'
    `);
    
    const revenueYesterday = await pool.query(`
      SELECT 
        COUNT(*) as purchases_yesterday,
        COALESCE(SUM(stars_amount), 0) as revenue_yesterday
      FROM purchases 
      WHERE status = 'completed' 
      AND created_at > NOW() - INTERVAL '2 days'
      AND created_at <= NOW() - INTERVAL '1 day'
    `);
    
    // User stats
    const userStats = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN last_online > NOW() - INTERVAL '1 day' THEN 1 END) as dau,
        COUNT(CASE WHEN last_online > NOW() - INTERVAL '7 days' THEN 1 END) as wau,
        COUNT(CASE WHEN last_online > NOW() - INTERVAL '30 days' THEN 1 END) as mau,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as new_users_today
      FROM users
    `);
    
    // Retention
    const retention = await pool.query(`
      SELECT 
        COUNT(CASE WHEN last_online > NOW() - INTERVAL '1 day' AND created_at <= NOW() - INTERVAL '1 day' THEN 1 END) as day1_retained,
        COUNT(CASE WHEN created_at <= NOW() - INTERVAL '1 day' THEN 1 END) as day1_cohort,
        COUNT(CASE WHEN last_online > NOW() - INTERVAL '7 days' AND created_at <= NOW() - INTERVAL '7 days' THEN 1 END) as day7_retained,
        COUNT(CASE WHEN created_at <= NOW() - INTERVAL '7 days' THEN 1 END) as day7_cohort
      FROM users
    `);
    
    // Game stats
    const gameStats = await pool.query(`
      SELECT 
        COUNT(*) as total_matches,
        COUNT(CASE WHEN finished_at IS NOT NULL THEN 1 END) as completed_matches,
        COUNT(CASE WHEN started_at > NOW() - INTERVAL '1 day' THEN 1 END) as matches_today,
        AVG(EXTRACT(EPOCH FROM (finished_at - started_at))) as avg_match_duration
      FROM match_history
    `);
    
    // Top items
    const topItems = await pool.query(`
      SELECT 
        ic.name,
        ic.type,
        ic.price_stars,
        COUNT(p.id) as purchase_count,
        SUM(p.stars_amount) as total_revenue
      FROM purchases p
      JOIN item_catalog ic ON p.item_id = ic.id
      WHERE p.status = 'completed'
      GROUP BY ic.id, ic.name, ic.type, ic.price_stars
      ORDER BY purchase_count DESC
      LIMIT 5
    `);
    
    // Daily new users (last 7 days)
    const dailyUsers = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Daily revenue (last 7 days)
    const dailyRevenue = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as purchases,
        SUM(stars_amount) as revenue
      FROM purchases
      WHERE status = 'completed'
      AND created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Game mode popularity
    const gameModes = await pool.query(`
      SELECT 
        game_mode,
        COUNT(*) as match_count
      FROM match_history
      GROUP BY game_mode
      ORDER BY match_count DESC
    `);
    
    // Conversion funnel
    const totalUsers = userStats.rows[0].total_users;
    const usersWithMatches = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM match_players
    `);
    const payingUsers = revenueResult.rows[0].paying_users;
    
    return {
      revenue: {
        total: parseInt(revenueResult.rows[0].total_revenue || '0'),
        today: parseInt(revenueToday.rows[0].revenue_today || '0'),
        yesterday: parseInt(revenueYesterday.rows[0].revenue_yesterday || '0'),
        avg_purchase: parseFloat(revenueResult.rows[0].avg_purchase || '0'),
        total_purchases: parseInt(revenueResult.rows[0].total_purchases || '0'),
        purchases_today: parseInt(revenueToday.rows[0].purchases_today || '0'),
        paying_users: parseInt(payingUsers || '0'),
      },
      users: {
        total: parseInt(userStats.rows[0].total_users || '0'),
        dau: parseInt(userStats.rows[0].dau || '0'),
        wau: parseInt(userStats.rows[0].wau || '0'),
        mau: parseInt(userStats.rows[0].mau || '0'),
        new_today: parseInt(userStats.rows[0].new_users_today || '0'),
      },
      retention: {
        day1: retention.rows[0].day1_cohort > 0 
          ? Math.round((retention.rows[0].day1_retained / retention.rows[0].day1_cohort) * 100)
          : 0,
        day7: retention.rows[0].day7_cohort > 0
          ? Math.round((retention.rows[0].day7_retained / retention.rows[0].day7_cohort) * 100)
          : 0,
      },
      games: {
        total: parseInt(gameStats.rows[0].total_matches || '0'),
        completed: parseInt(gameStats.rows[0].completed_matches || '0'),
        today: parseInt(gameStats.rows[0].matches_today || '0'),
        avg_duration: parseFloat(gameStats.rows[0].avg_match_duration || '0'),
        completion_rate: gameStats.rows[0].total_matches > 0
          ? Math.round((gameStats.rows[0].completed_matches / gameStats.rows[0].total_matches) * 100)
          : 0,
      },
      conversion: {
        registration_to_play: totalUsers > 0 
          ? Math.round((usersWithMatches.rows[0].count / totalUsers) * 100)
          : 0,
        registration_to_purchase: totalUsers > 0
          ? Math.round((payingUsers / totalUsers) * 100)
          : 0,
        play_to_purchase: usersWithMatches.rows[0].count > 0
          ? Math.round((payingUsers / usersWithMatches.rows[0].count) * 100)
          : 0,
      },
      topItems: topItems.rows,
      dailyUsers: dailyUsers.rows,
      dailyRevenue: dailyRevenue.rows,
      gameModes: gameModes.rows,
    };
  } catch (err) {
    logger.error('Failed to get analytics', err);
    throw err;
  }
}

// Simple auth check for admin endpoints
function checkAdminAuth(req: IncomingMessage): boolean {
  const auth = req.headers.authorization;
  if (!auth) return false;
  
  // Basic auth: admin:your_password
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const expectedAuth = 'Basic ' + Buffer.from('admin:' + adminPassword).toString('base64');
  
  return auth === expectedAuth;
}

// HTTP server for Telegram webhooks and metrics
function createHttpServer() {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // CORS headers - must be set for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.writeHead(204); // No Content
      res.end();
      return;
    }
    
    // Check auth for admin endpoints (after OPTIONS handling)
    if (req.url?.startsWith('/admin') || req.url === '/metrics/json') {
      if (!checkAdminAuth(req)) {
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Admin Area"' });
        res.end('Unauthorized');
        return;
      }
    }
    
    // Telegram webhook endpoint
    if (req.method === 'POST' && req.url === '/telegram/webhook') {
      // Verify secret token from Telegram
      const secretToken = req.headers['x-telegram-bot-api-secret-token'];
      if (WEBHOOK_SECRET && secretToken !== WEBHOOK_SECRET) {
        logger.warn('Webhook: Invalid secret token');
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      
      const update = await parseBody(req);
      
      if (!update) {
        res.writeHead(400);
        res.end('Invalid JSON');
        return;
      }
      
      logger.debug('Webhook received', { updateType: Object.keys(update).join(',') });
      
      // Handle pre_checkout_query
      if (update.pre_checkout_query) {
        await handlePreCheckoutQuery(update.pre_checkout_query);
      }
      
      // Handle successful_payment (comes in message)
      if (update.message?.successful_payment) {
        const payment = update.message.successful_payment;
        const telegramUserId = update.message.from.id;
        
        const result = await handleSuccessfulPayment(telegramUserId, payment);
        
        if (result.success && result.itemId && result.oderId) {
          metricsCollector.purchaseSuccess();
          
          // Mark referral purchase (for referral rewards)
          const userId = result.oderId;
          import('./services/referrals.js').then(({ markReferralPurchase }) => {
            markReferralPurchase(userId).catch(err => {
              logger.error('Failed to mark referral purchase', err);
            });
          });
          
          // Get updated inventory
          const inventory = await getUserInventory(result.oderId);
          
          // Send purchase success to user via WebSocket
          connections.send(result.oderId, {
            type: 'purchase_success',
            itemId: result.itemId,
            inventory
          });
          
          logger.info('Purchase completed', { 
            userId: result.oderId, 
            itemId: result.itemId 
          });
        } else {
          metricsCollector.purchaseFailure();
        }
      }
      
      res.writeHead(200);
      res.end('OK');
      return;
    }
    
    // Health check
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }));
      return;
    }
    
    // Metrics endpoint (Prometheus format)
    if (req.method === 'GET' && req.url === '/metrics') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(metricsCollector.getPrometheusMetrics());
      return;
    }
    
    // JSON metrics endpoint
    if (req.method === 'GET' && req.url === '/metrics/json') {
      const metrics = metricsCollector.getMetrics();
      const rateLimitStats = getRateLimitStats();
      const fraudStats = getFraudStats();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ...metrics,
        rateLimit: rateLimitStats,
        fraud: fraudStats,
        memory: process.memoryUsage(),
      }, null, 2));
      return;
    }
    
    // Database stats endpoint
    if (req.method === 'GET' && req.url === '/admin/stats') {
      try {
        const stats = await getDatabaseStats();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats, null, 2));
      } catch (err) {
        logger.error('Failed to get database stats', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to get stats' }));
      }
      return;
    }
    
    // Analytics endpoint
    if (req.method === 'GET' && req.url === '/admin/analytics') {
      try {
        const analytics = await getAnalytics();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(analytics, null, 2));
      } catch (err) {
        logger.error('Failed to get analytics', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to get analytics' }));
      }
      return;
    }
    
    res.writeHead(404);
    res.end('Not Found');
  });
  
  const httpPort = config.server.port;
  server.listen(httpPort, () => {
    logger.info('HTTP server started', { port: httpPort });
  });
  
  // Register HTTP server for graceful shutdown
  registerForShutdown({ httpServer: server });
  
  return server;
}

async function main() {
  logger.info('Starting Street Dice server...', {
    env: config.isDev ? 'development' : 'production',
    nodeVersion: process.version,
  });
  
  // Test database connection
  try {
    const result = await pool.query('SELECT NOW()');
    logger.info('Database connected', { 
      serverTime: result.rows[0].now 
    });
  } catch (err) {
    logger.error('Failed to connect to database', err);
    process.exit(1);
  }
  
  // Start WebSocket server
  const wss = createWebSocketServer();
  
  // Start HTTP server for webhooks and metrics
  createHttpServer();
  
  logger.info('Server started successfully!', {
    wsPort: config.server.wsPort,
    httpPort: config.server.port,
  });
}

main().catch(err => {
  logger.error('Fatal error during startup', err);
  process.exit(1);
});
