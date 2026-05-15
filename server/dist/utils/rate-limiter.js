/**
 * Rate limiter for WebSocket connections
 * Prevents spam and abuse
 */
// Different limits for different message types
const RATE_LIMITS = {
    // Auth - very strict (prevent brute force)
    auth: { windowMs: 60000, maxRequests: 5, blockDurationMs: 300000 },
    // High-frequency game messages - more lenient
    throw_frame: { windowMs: 1000, maxRequests: 60, blockDurationMs: 5000 },
    throw_sound: { windowMs: 1000, maxRequests: 30, blockDurationMs: 5000 },
    // Normal game actions
    player_ready: { windowMs: 5000, maxRequests: 10, blockDurationMs: 10000 },
    throw_start: { windowMs: 5000, maxRequests: 10, blockDurationMs: 10000 },
    throw_end: { windowMs: 5000, maxRequests: 10, blockDurationMs: 10000 },
    roll_dice: { windowMs: 5000, maxRequests: 10, blockDurationMs: 10000 },
    // Lobby actions
    create_lobby: { windowMs: 60000, maxRequests: 5, blockDurationMs: 60000 },
    join_lobby: { windowMs: 30000, maxRequests: 10, blockDurationMs: 30000 },
    invite_friend: { windowMs: 60000, maxRequests: 20, blockDurationMs: 60000 },
    // Social actions
    add_friend: { windowMs: 60000, maxRequests: 10, blockDurationMs: 120000 },
    search_user: { windowMs: 30000, maxRequests: 15, blockDurationMs: 60000 },
    // Shop
    purchase_item: { windowMs: 60000, maxRequests: 5, blockDurationMs: 120000 },
    // Default for everything else
    default: { windowMs: 10000, maxRequests: 30, blockDurationMs: 30000 },
};
// Store: Map<identifier, Map<messageType, RateLimitEntry>>
const rateLimitStore = new Map();
// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, typeMap] of rateLimitStore) {
        for (const [type, entry] of typeMap) {
            if (entry.resetAt < now && entry.blockedUntil < now) {
                typeMap.delete(type);
            }
        }
        if (typeMap.size === 0) {
            rateLimitStore.delete(key);
        }
    }
}, 60000);
/**
 * Check if request is allowed under rate limit
 * @param identifier - User ID or IP address
 * @param messageType - Type of WebSocket message
 */
export function checkRateLimit(identifier, messageType) {
    const config = RATE_LIMITS[messageType] || RATE_LIMITS.default;
    const now = Date.now();
    // Get or create entry map for this identifier
    let typeMap = rateLimitStore.get(identifier);
    if (!typeMap) {
        typeMap = new Map();
        rateLimitStore.set(identifier, typeMap);
    }
    // Get or create entry for this message type
    let entry = typeMap.get(messageType);
    if (!entry || entry.resetAt < now) {
        entry = {
            count: 0,
            resetAt: now + config.windowMs,
            blocked: false,
            blockedUntil: 0,
        };
        typeMap.set(messageType, entry);
    }
    // Check if blocked
    if (entry.blocked && entry.blockedUntil > now) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.blockedUntil - now,
            blocked: true,
        };
    }
    // Unblock if block expired
    if (entry.blocked && entry.blockedUntil <= now) {
        entry.blocked = false;
        entry.count = 0;
        entry.resetAt = now + config.windowMs;
    }
    // Increment count
    entry.count++;
    // Check if exceeded
    if (entry.count > config.maxRequests) {
        entry.blocked = true;
        entry.blockedUntil = now + config.blockDurationMs;
        return {
            allowed: false,
            remaining: 0,
            resetIn: config.blockDurationMs,
            blocked: true,
        };
    }
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetIn: entry.resetAt - now,
        blocked: false,
    };
}
/**
 * Reset rate limit for identifier (e.g., after successful auth)
 */
export function resetRateLimit(identifier, messageType) {
    if (messageType) {
        rateLimitStore.get(identifier)?.delete(messageType);
    }
    else {
        rateLimitStore.delete(identifier);
    }
}
/**
 * Get current rate limit stats for monitoring
 */
export function getRateLimitStats() {
    let totalTracked = 0;
    let blockedCount = 0;
    const now = Date.now();
    for (const typeMap of rateLimitStore.values()) {
        for (const entry of typeMap.values()) {
            totalTracked++;
            if (entry.blocked && entry.blockedUntil > now) {
                blockedCount++;
            }
        }
    }
    return { totalTracked, blockedCount };
}
//# sourceMappingURL=rate-limiter.js.map