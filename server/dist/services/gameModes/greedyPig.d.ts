import type { GameModeHandler, GameState, RollResult } from './index.js';
/**
 * Greedy Pig Mode
 *
 * Rules:
 * - Goal: First to reach 100 points wins
 * - Your Turn: Roll 2 dice as many times as you want
 *   - Sum of each roll adds to your turn score
 * - Risks:
 *   - One 1: Turn score is lost, turn passes to opponent
 *   - Two 1s (1-1): Turn score lost + total score resets to 0!
 * - Stop: You can stop anytime and add turn score to total
 * - Victory: First to reach 100+ points wins
 */
export declare const GreedyPigMode: GameModeHandler;
/**
 * Handle player stopping (banking their turn score)
 */
export declare function handleStop(state: GameState): RollResult;
/**
 * Get current turn score
 */
export declare function getTurnScore(state: GameState): number;
//# sourceMappingURL=greedyPig.d.ts.map