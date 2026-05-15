import 'dotenv/config';
export const config = {
    database: {
        url: process.env.DATABASE_URL || 'postgresql://localhost:5432/streetdice',
        // Connection pool settings - increased for Neon serverless
        poolSize: parseInt(process.env.DB_POOL_SIZE || '30'), // Increased from 20
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'), // Increased from 5000
    },
    bot: {
        token: process.env.BOT_TOKEN || '',
    },
    server: {
        port: parseInt(process.env.PORT || '3001'),
        wsPort: parseInt(process.env.WS_PORT || '3002'),
    },
    isDev: process.env.NODE_ENV !== 'production',
    logLevel: process.env.LOG_LEVEL || 'info',
};
//# sourceMappingURL=config.js.map