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

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = process.env.LOG_LEVEL as LogLevel || 'info';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };
  
  // In development, use readable format
  if (process.env.NODE_ENV !== 'production') {
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
  }
  
  // In production, use JSON for log aggregators
  return JSON.stringify(logEntry);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (shouldLog('debug')) {
      console.log(formatLog('debug', message, context));
    }
  },
  
  info(message: string, context?: LogContext) {
    if (shouldLog('info')) {
      console.log(formatLog('info', message, context));
    }
  },
  
  warn(message: string, context?: LogContext) {
    if (shouldLog('warn')) {
      console.warn(formatLog('warn', message, context));
    }
  },
  
  error(message: string, error?: Error | unknown, context?: LogContext) {
    if (shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : error,
      };
      console.error(formatLog('error', message, errorContext));
    }
  },
  
  // Request/action timing helper
  time(action: string, context?: LogContext): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.info(`${action} completed`, { ...context, action, duration });
    };
  },
};
