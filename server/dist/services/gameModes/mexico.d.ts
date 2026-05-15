import type { GameModeHandler } from './index.js';
/**
 * Mexico Mode
 *
 * Rules:
 * - Each player rolls 2 dice once per round
 * - Score = higher die as tens + lower die as ones (e.g., 6+4 = 64)
 * - Special combinations (strongest to weakest):
 *   1. MEXICO (2-1) = strongest!
 *   2. Doubles: 66 > 55 > 44 > 33 > 22 > 11
 *   3. Regular: 65 > 64 > 63 > 62 > 61 > 54 > 53... > 32 > 31
 * - Player with lowest score gets a penalty point
 * - 5 penalty points = eliminated
 * - Last player standing wins
 */
export declare const MexicoMode: GameModeHandler;
//# sourceMappingURL=mexico.d.ts.map