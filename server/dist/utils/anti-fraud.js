/**
 * Anti-fraud protection for pips system
 */
import { logger } from './logger.js';
// Track roll history per user
const userRollHistory = new Map();
// Cleanup old data every 5 minutes
setInterval(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    for (const [userId, history] of userRollHistory.entries()) {
        // Remove timestamps older than 5 minutes
        history.timestamps = history.timestamps.filter(t => t > fiveMinutesAgo);
        // Remove user if no recent activity
        if (history.timestamps.length === 0) {
            userRollHistory.delete(userId);
        }
    }
}, 5 * 60 * 1000);
/**
 * Validate roll and detect fraud
 * Returns { allowed: boolean, reason?: string }
 */
export function validateRoll(userId, earnedPips, boostMultiplier = 1, boostBonus = 0) {
    const now = Date.now();
    logger.info('[FRAUD] Validating roll', { userId, earnedPips, boostMultiplier, boostBonus });
    // Get or create history
    let history = userRollHistory.get(userId);
    if (!history) {
        history = {
            timestamps: [],
            rollData: [],
            suspiciousCount: 0,
        };
        userRollHistory.set(userId, history);
    }
    logger.info('[FRAUD] User history', {
        userId,
        suspiciousCount: history.suspiciousCount,
        recentRolls: history.timestamps.length
    });
    // 1. Validate boost multiplier is reasonable (1, 2, 3, or 5)
    if (![1, 2, 3, 5].includes(boostMultiplier)) {
        logger.warn('[FRAUD] Invalid boost multiplier', { userId, boostMultiplier });
        history.suspiciousCount++;
        return { allowed: false, reason: 'Invalid boost' };
    }
    // 2. Validate boost bonus (0 or 1111 for snake eyes)
    if (![0, 1111].includes(boostBonus)) {
        logger.warn('[FRAUD] Invalid boost bonus', { userId, boostBonus });
        history.suspiciousCount++;
        return { allowed: false, reason: 'Invalid boost' };
    }
    // 3. Check pips value with boost consideration
    // Calculate expected range based on boost
    // Base roll: 2-12 (2 dice) or 2-30 (5 dice poker) or up to 66 (mexico scoring)
    const minBasePips = 2;
    const maxBasePips = 66; // Mexico max (21 in mexico scoring, but we use 66 for safety)
    const minExpectedPips = minBasePips * boostMultiplier + boostBonus;
    const maxExpectedPips = maxBasePips * boostMultiplier + boostBonus;
    logger.info('[FRAUD] Check #3: Pips range', {
        userId,
        earnedPips,
        expectedRange: `${minExpectedPips}-${maxExpectedPips}`
    });
    if (earnedPips < minExpectedPips || earnedPips > maxExpectedPips) {
        logger.warn('[FRAUD] Invalid pips value for boost', {
            userId,
            earnedPips,
            boostMultiplier,
            boostBonus,
            expectedRange: `${minExpectedPips}-${maxExpectedPips}`
        });
        history.suspiciousCount++;
        return { allowed: false, reason: 'Invalid pips value' };
    }
    // 4. Verify earnedPips matches formula: basePips * multiplier + bonus
    // This catches cases where client sends wrong earnedPips
    const calculatedBasePips = (earnedPips - boostBonus) / boostMultiplier;
    logger.info('[FRAUD] Check #4: Formula validation', {
        userId,
        earnedPips,
        boostMultiplier,
        boostBonus,
        calculatedBasePips
    });
    // Base pips should be an integer between 2 and 66
    if (!Number.isInteger(calculatedBasePips) || calculatedBasePips < minBasePips || calculatedBasePips > maxBasePips) {
        logger.warn('[FRAUD] Pips calculation mismatch', {
            userId,
            earnedPips,
            boostMultiplier,
            boostBonus,
            calculatedBasePips
        });
        history.suspiciousCount++;
        return { allowed: false, reason: 'Invalid pips calculation' };
    }
    // 5. Check minimum delay between rolls (1.5 seconds)
    // 5. Check minimum delay between rolls (1.5 seconds)
    const lastRoll = history.timestamps[history.timestamps.length - 1];
    if (lastRoll && now - lastRoll < 1500) {
        logger.warn('[FRAUD] Too fast roll', { userId, delay: now - lastRoll });
        history.suspiciousCount++;
        return { allowed: false, reason: 'Too fast' };
    }
    // 6. Check rate limit: max 30 rolls per minute
    // 6. Check rate limit: max 30 rolls per minute
    const oneMinuteAgo = now - 60 * 1000;
    const recentRolls = history.timestamps.filter(t => t > oneMinuteAgo);
    if (recentRolls.length >= 30) {
        logger.warn('[FRAUD] Rate limit exceeded', { userId, rollsPerMinute: recentRolls.length });
        history.suspiciousCount++;
        return { allowed: false, reason: 'Rate limit exceeded' };
    }
    // 7. Check suspicious patterns: too many max values
    // Adjusted for boost multiplier
    const maxValueThreshold = 11 * boostMultiplier + boostBonus;
    const last10Rolls = history.rollData.slice(-10);
    if (last10Rolls.length >= 10) {
        const highValueCount = last10Rolls.filter(r => r.pips >= maxValueThreshold).length;
        // If more than 8 out of 10 rolls are max values, suspicious
        if (highValueCount > 8) {
            logger.warn('[FRAUD] Suspicious pattern: too many high values', {
                userId,
                highValueCount,
                threshold: maxValueThreshold
            });
            history.suspiciousCount++;
            // Don't block, just log for now
        }
    }
    // 8. Check total pips per hour (adjusted for boosts)
    const oneHourAgo = now - 60 * 60 * 1000;
    const rollsLastHour = history.rollData.filter(r => r.timestamp > oneHourAgo);
    const totalPipsLastHour = rollsLastHour.reduce((sum, r) => sum + r.pips, 0);
    // Calculate reasonable max based on actual rolls and boosts
    // Max roll is 12, with x5 boost = 60 pips per roll
    // With snake eyes bonus: 2 * 5 + 1111 = 1121 pips per roll (extreme case)
    // Realistic average with boosts: ~20-30 pips per roll
    const maxPipsPerRollWithBoost = 1200; // Extreme case: snake eyes with x5 boost
    const maxPipsPerHour = rollsLastHour.length * maxPipsPerRollWithBoost;
    // Only check if user has made many rolls (more than 200 per hour is suspicious anyway)
    if (rollsLastHour.length > 200) {
        if (totalPipsLastHour > maxPipsPerHour) {
            logger.warn('[FRAUD] Excessive pips per hour', {
                userId,
                totalPipsLastHour,
                maxAllowed: maxPipsPerHour,
                rollsLastHour: rollsLastHour.length
            });
            history.suspiciousCount++;
            return { allowed: false, reason: 'Excessive activity' };
        }
    }
    // 9. Auto-ban if too many suspicious activities
    if (history.suspiciousCount >= 5) {
        logger.error('[FRAUD] User auto-flagged for review', {
            userId,
            suspiciousCount: history.suspiciousCount
        });
        return { allowed: false, reason: 'Account flagged for review' };
    }
    // All checks passed - record roll
    history.timestamps.push(now);
    history.rollData.push({ timestamp: now, pips: earnedPips });
    // Keep only last 100 timestamps
    if (history.timestamps.length > 100) {
        history.timestamps = history.timestamps.slice(-100);
    }
    // Keep only last 100 roll data entries
    if (history.rollData.length > 100) {
        history.rollData = history.rollData.slice(-100);
    }
    return { allowed: true };
}
/**
 * Get fraud stats for monitoring
 */
export function getFraudStats() {
    const stats = {
        totalUsers: userRollHistory.size,
        suspiciousUsers: 0,
        flaggedUsers: 0,
    };
    for (const history of userRollHistory.values()) {
        if (history.suspiciousCount > 0)
            stats.suspiciousUsers++;
        if (history.suspiciousCount >= 5)
            stats.flaggedUsers++;
    }
    return stats;
}
/**
 * Reset user's fraud counter (admin action)
 */
export function resetFraudCounter(userId) {
    const history = userRollHistory.get(userId);
    if (history) {
        history.suspiciousCount = 0;
        logger.info('[FRAUD] Reset counter for user', { userId });
    }
}
//# sourceMappingURL=anti-fraud.js.map