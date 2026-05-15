/**
 * Anti-fraud protection for pips system
 */
/**
 * Validate roll and detect fraud
 * Returns { allowed: boolean, reason?: string }
 */
export declare function validateRoll(userId: number, earnedPips: number, boostMultiplier?: number, boostBonus?: number): {
    allowed: boolean;
    reason?: string;
};
/**
 * Get fraud stats for monitoring
 */
export declare function getFraudStats(): {
    totalUsers: number;
    suspiciousUsers: number;
    flaggedUsers: number;
};
/**
 * Reset user's fraud counter (admin action)
 */
export declare function resetFraudCounter(userId: number): void;
//# sourceMappingURL=anti-fraud.d.ts.map