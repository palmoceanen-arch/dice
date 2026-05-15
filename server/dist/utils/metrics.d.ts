/**
 * Simple metrics collection for monitoring
 * Exposes /metrics endpoint for Prometheus or manual checks
 */
interface Metrics {
    connectionsTotal: number;
    connectionsActive: number;
    lobbiesCreated: number;
    lobbiesActive: number;
    gamesStarted: number;
    gamesFinished: number;
    messagesReceived: number;
    messagesSent: number;
    messagesErrors: number;
    authAttempts: number;
    authSuccesses: number;
    authFailures: number;
    purchaseAttempts: number;
    purchaseSuccesses: number;
    purchaseFailures: number;
    avgMessageProcessingMs: number;
    maxMessageProcessingMs: number;
    startTime: number;
}
export declare const metricsCollector: {
    connectionOpened(): void;
    connectionClosed(): void;
    lobbyCreated(): void;
    lobbyClosed(): void;
    gameStarted(): void;
    gameFinished(): void;
    messageReceived(): void;
    messageSent(): void;
    messageError(): void;
    authAttempt(): void;
    authSuccess(): void;
    authFailure(): void;
    purchaseAttempt(): void;
    purchaseSuccess(): void;
    purchaseFailure(): void;
    recordProcessingTime(ms: number): void;
    getMetrics(): Metrics & {
        uptimeSeconds: number;
    };
    getPrometheusMetrics(): string;
    resetMaxProcessingTime(): void;
};
export {};
//# sourceMappingURL=metrics.d.ts.map