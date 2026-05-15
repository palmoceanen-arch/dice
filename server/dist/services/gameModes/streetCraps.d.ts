import type { GameModeHandler } from './index.js';
/**
 * Street Craps Mode
 * Classic street dice rules.
 *
 * Come Out Roll:
 * - 7 or 11 = Natural (shooter wins, keeps rolling)
 * - 2, 3, or 12 = Craps (shooter loses bet, keeps rolling)
 * - 4, 5, 6, 8, 9, 10 = Point is set
 *
 * Point Phase:
 * - Roll the point = Shooter wins, new come out
 * - Roll 7 = Seven out, dice pass to next player
 * - Any other = Keep rolling
 */
export declare const StreetCrapsMode: GameModeHandler;
//# sourceMappingURL=streetCraps.d.ts.map