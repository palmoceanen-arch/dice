/**
 * Structured logger with levels and context
 * Production-ready logging with JSON output
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
interface LogContext {
    userId?: number;
    lobbyId?: string;
    action?: string;
    duration?: number;
    [key: string]: unknown;
}
export declare const logger: {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error | unknown, context?: LogContext): void;
    time(action: string, context?: LogContext): () => void;
};
export {};
//# sourceMappingURL=logger.d.ts.map