/**
 * Simple metrics collection for monitoring
 * Exposes /metrics endpoint for Prometheus or manual checks
 */
const metrics = {
    connectionsTotal: 0,
    connectionsActive: 0,
    lobbiesCreated: 0,
    lobbiesActive: 0,
    gamesStarted: 0,
    gamesFinished: 0,
    messagesReceived: 0,
    messagesSent: 0,
    messagesErrors: 0,
    authAttempts: 0,
    authSuccesses: 0,
    authFailures: 0,
    purchaseAttempts: 0,
    purchaseSuccesses: 0,
    purchaseFailures: 0,
    avgMessageProcessingMs: 0,
    maxMessageProcessingMs: 0,
    startTime: Date.now(),
};
// Rolling average for message processing time
let processingTimes = [];
const MAX_PROCESSING_SAMPLES = 1000;
export const metricsCollector = {
    // Connection metrics
    connectionOpened() {
        metrics.connectionsTotal++;
        metrics.connectionsActive++;
    },
    connectionClosed() {
        metrics.connectionsActive = Math.max(0, metrics.connectionsActive - 1);
    },
    // Lobby metrics
    lobbyCreated() {
        metrics.lobbiesCreated++;
        metrics.lobbiesActive++;
    },
    lobbyClosed() {
        metrics.lobbiesActive = Math.max(0, metrics.lobbiesActive - 1);
    },
    // Game metrics
    gameStarted() {
        metrics.gamesStarted++;
    },
    gameFinished() {
        metrics.gamesFinished++;
    },
    // Message metrics
    messageReceived() {
        metrics.messagesReceived++;
    },
    messageSent() {
        metrics.messagesSent++;
    },
    messageError() {
        metrics.messagesErrors++;
    },
    // Auth metrics
    authAttempt() {
        metrics.authAttempts++;
    },
    authSuccess() {
        metrics.authSuccesses++;
    },
    authFailure() {
        metrics.authFailures++;
    },
    // Purchase metrics
    purchaseAttempt() {
        metrics.purchaseAttempts++;
    },
    purchaseSuccess() {
        metrics.purchaseSuccesses++;
    },
    purchaseFailure() {
        metrics.purchaseFailures++;
    },
    // Performance metrics
    recordProcessingTime(ms) {
        processingTimes.push(ms);
        if (processingTimes.length > MAX_PROCESSING_SAMPLES) {
            processingTimes.shift();
        }
        // Update max
        if (ms > metrics.maxMessageProcessingMs) {
            metrics.maxMessageProcessingMs = ms;
        }
        // Update average
        const sum = processingTimes.reduce((a, b) => a + b, 0);
        metrics.avgMessageProcessingMs = Math.round(sum / processingTimes.length * 100) / 100;
    },
    // Get all metrics
    getMetrics() {
        return {
            ...metrics,
            uptimeSeconds: Math.floor((Date.now() - metrics.startTime) / 1000),
        };
    },
    // Format for Prometheus
    getPrometheusMetrics() {
        const m = this.getMetrics();
        return `
# HELP streetdice_connections_total Total WebSocket connections
# TYPE streetdice_connections_total counter
streetdice_connections_total ${m.connectionsTotal}

# HELP streetdice_connections_active Active WebSocket connections
# TYPE streetdice_connections_active gauge
streetdice_connections_active ${m.connectionsActive}

# HELP streetdice_lobbies_created Total lobbies created
# TYPE streetdice_lobbies_created counter
streetdice_lobbies_created ${m.lobbiesCreated}

# HELP streetdice_lobbies_active Active lobbies
# TYPE streetdice_lobbies_active gauge
streetdice_lobbies_active ${m.lobbiesActive}

# HELP streetdice_games_started Total games started
# TYPE streetdice_games_started counter
streetdice_games_started ${m.gamesStarted}

# HELP streetdice_games_finished Total games finished
# TYPE streetdice_games_finished counter
streetdice_games_finished ${m.gamesFinished}

# HELP streetdice_messages_received Total messages received
# TYPE streetdice_messages_received counter
streetdice_messages_received ${m.messagesReceived}

# HELP streetdice_messages_sent Total messages sent
# TYPE streetdice_messages_sent counter
streetdice_messages_sent ${m.messagesSent}

# HELP streetdice_messages_errors Total message errors
# TYPE streetdice_messages_errors counter
streetdice_messages_errors ${m.messagesErrors}

# HELP streetdice_auth_attempts Total auth attempts
# TYPE streetdice_auth_attempts counter
streetdice_auth_attempts ${m.authAttempts}

# HELP streetdice_auth_successes Successful auths
# TYPE streetdice_auth_successes counter
streetdice_auth_successes ${m.authSuccesses}

# HELP streetdice_auth_failures Failed auths
# TYPE streetdice_auth_failures counter
streetdice_auth_failures ${m.authFailures}

# HELP streetdice_message_processing_avg_ms Average message processing time
# TYPE streetdice_message_processing_avg_ms gauge
streetdice_message_processing_avg_ms ${m.avgMessageProcessingMs}

# HELP streetdice_message_processing_max_ms Max message processing time
# TYPE streetdice_message_processing_max_ms gauge
streetdice_message_processing_max_ms ${m.maxMessageProcessingMs}

# HELP streetdice_uptime_seconds Server uptime in seconds
# TYPE streetdice_uptime_seconds counter
streetdice_uptime_seconds ${m.uptimeSeconds}
`.trim();
    },
    // Reset max processing time (call periodically)
    resetMaxProcessingTime() {
        metrics.maxMessageProcessingMs = 0;
    },
};
// Reset max processing time every 5 minutes
setInterval(() => {
    metricsCollector.resetMaxProcessingTime();
}, 300000);
//# sourceMappingURL=metrics.js.map