import 'dotenv/config';
export declare const config: {
    database: {
        url: string;
        poolSize: number;
        idleTimeout: number;
        connectionTimeout: number;
    };
    bot: {
        token: string;
    };
    server: {
        port: number;
        wsPort: number;
    };
    isDev: boolean;
    logLevel: string;
};
//# sourceMappingURL=config.d.ts.map