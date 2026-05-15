import { UserBoost, BoostType } from '../types/index.js';
/**
 * Get active boosts for a user
 */
export declare function getActiveBoosts(userId: number): Promise<UserBoost[]>;
/**
 * Get boost state for a specific boost
 */
export declare function getBoostState(userId: number, boostId: string): Promise<UserBoost | null>;
/**
 * Check if boost is available (not on cooldown and not active)
 */
export declare function isBoostAvailable(userId: number, boostId: string): Promise<boolean>;
/**
 * Activate a boost
 */
export declare function activateBoost(userId: number, boostId: string, boostType: BoostType, selectedParity?: 'even' | 'odd'): Promise<{
    success: boolean;
    activeUntil?: number;
    availableAt?: number;
    error?: string;
}>;
/**
 * Calculate pips multiplier based on active boosts
 */
export declare function calculatePipsMultiplier(userId: number, dice1: number, dice2: number): Promise<{
    multiplier: number;
    bonus: number;
}>;
/**
 * Clean up expired boosts (optional maintenance task)
 */
export declare function cleanupExpiredBoosts(): Promise<number>;
//# sourceMappingURL=boosts.d.ts.map