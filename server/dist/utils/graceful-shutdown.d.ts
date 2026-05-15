/**
 * Graceful shutdown handler
 * Saves game state and closes connections properly
 */
import type { WebSocketServer } from 'ws';
import type { Server } from 'http';
interface ShutdownContext {
    wss?: WebSocketServer;
    httpServer?: Server;
    onShutdown?: () => Promise<void>;
}
/**
 * Register servers for graceful shutdown
 */
export declare function registerForShutdown(context: ShutdownContext): void;
/**
 * Setup shutdown signal handlers
 */
export declare function setupShutdownHandlers(): void;
/**
 * Check if server is shutting down
 */
export declare function isServerShuttingDown(): boolean;
export {};
//# sourceMappingURL=graceful-shutdown.d.ts.map