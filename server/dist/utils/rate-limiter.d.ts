/**
 * Rate limiter for WebSocket connections
 * Prevents spam and abuse
 */
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number;
    blocked: boolean;
}
/**
 * Check if request is allowed under rate limit
 * @param identifier - User ID or IP address
 * @param messageType - Type of WebSocket message
 */
export declare function checkRateLimit(identifier: string, messageType: string): RateLimitResult;
/**
 * Reset rate limit for identifier (e.g., after successful auth)
 */
export declare function resetRateLimit(identifier: string, messageType?: string): void;
/**
 * Get current rate limit stats for monitoring
 */
export declare function getRateLimitStats(): {
    totalTracked: number;
    blockedCount: number;
};
//# sourceMappingURL=rate-limiter.d.ts.map