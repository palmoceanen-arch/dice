/**
 * Graceful shutdown handler
 * Saves game state and closes connections properly
 */
import { pool } from '../db/client.js';
import { logger } from './logger.js';
let isShuttingDown = false;
let shutdownContext = {};
/**
 * Register servers for graceful shutdown
 */
export function registerForShutdown(context) {
    shutdownContext = { ...shutdownContext, ...context };
}
/**
 * Perform graceful shutdown
 */
async function shutdown(signal) {
    if (isShuttingDown) {
        logger.warn('Shutdown already in progress');
        return;
    }
    isShuttingDown = true;
    logger.info(`Received ${signal}, starting graceful shutdown...`);
    const timeout = setTimeout(() => {
        logger.error('Shutdown timeout, forcing exit');
        process.exit(1);
    }, 30000); // 30 second timeout
    try {
        // 1. Stop accepting new connections
        if (shutdownContext.wss) {
            logger.info('Closing WebSocket server...');
            // Notify all clients
            shutdownContext.wss.clients.forEach(client => {
                if (client.readyState === 1) { // OPEN
                    client.send(JSON.stringify({
                        type: 'server_shutdown',
                        message: 'Server is restarting, please reconnect in a moment',
                    }));
                    client.close(1001, 'Server shutdown');
                }
            });
            // Close server
            await new Promise((resolve) => {
                shutdownContext.wss.close(() => resolve());
            });
            logger.info('WebSocket server closed');
        }
        // 2. Close HTTP server
        if (shutdownContext.httpServer) {
            logger.info('Closing HTTP server...');
            await new Promise((resolve) => {
                shutdownContext.httpServer.close(() => resolve());
            });
            logger.info('HTTP server closed');
        }
        // 3. Run custom shutdown handler (save game state, etc.)
        if (shutdownContext.onShutdown) {
            logger.info('Running custom shutdown handler...');
            await shutdownContext.onShutdown();
            logger.info('Custom shutdown handler completed');
        }
        // 4. Close database pool
        logger.info('Closing database connections...');
        await pool.end();
        logger.info('Database connections closed');
        clearTimeout(timeout);
        logger.info('Graceful shutdown completed');
        process.exit(0);
    }
    catch (err) {
        logger.error('Error during shutdown', err);
        clearTimeout(timeout);
        process.exit(1);
    }
}
/**
 * Setup shutdown signal handlers
 */
export function setupShutdownHandlers() {
    // Handle different termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    // Handle uncaught errors
    process.on('uncaughtException', (err) => {
        logger.error('Uncaught exception', err);
        shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled rejection', reason);
        // Don't shutdown on unhandled rejection, just log
    });
}
/**
 * Check if server is shutting down
 */
export function isServerShuttingDown() {
    return isShuttingDown;
}
//# sourceMappingURL=graceful-shutdown.js.map