import pg from 'pg';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
const { Pool } = pg;
export const pool = new Pool({
    connectionString: config.database.url,
    ssl: config.database.url.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    // Pool configuration
    max: config.database.poolSize,
    idleTimeoutMillis: config.database.idleTimeout,
    connectionTimeoutMillis: config.database.connectionTimeout,
});
// Connection events
pool.on('connect', () => {
    logger.debug('New database connection established');
});
pool.on('error', (err) => {
    logger.error('Database pool error', err);
});
pool.on('remove', () => {
    logger.debug('Database connection removed from pool');
});
// Query helper with logging
export async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        // Log slow queries
        if (duration > 100) {
            logger.warn('Slow query detected', {
                query: text.substring(0, 100),
                duration,
                rows: result.rowCount
            });
        }
        else if (config.isDev) {
            logger.debug('Query executed', {
                query: text.substring(0, 50),
                duration,
                rows: result.rowCount
            });
        }
        return result;
    }
    catch (err) {
        logger.error('Query failed', err, {
            query: text.substring(0, 100),
            params: params?.slice(0, 3) // Log first 3 params only
        });
        throw err;
    }
}
export async function getClient() {
    return pool.connect();
}
// Get pool stats for monitoring
export function getPoolStats() {
    return {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
    };
}
//# sourceMappingURL=client.js.map