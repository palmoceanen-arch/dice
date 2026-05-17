import type { PlayerStats } from '../types/index.js';
export interface RecordGameResultArgs {
    userId: number;
    won: boolean;
    totalPlayers: number;
}
/**
 * Compute level from cumulative XP.
 *
 * Inverse of `xp_for_level(L) = 50 * L * (L - 1)`. Stable for all
 * non-negative integer xp (and rounds down for fractional inputs).
 */
export declare function levelFromXp(xp: number): number;
/**
 * Cumulative XP required to reach `level`.
 *
 * Useful for rendering the progress bar in the profile widget without an
 * extra round-trip — the client just needs `currentXp`, `levelFromXp`,
 * and this function to lay out the bar.
 */
export declare function xpForLevel(level: number): number;
/**
 * XP gained by a player for a single game-end event.
 */
export declare function xpFromGame(won: boolean, totalPlayers: number): number;
/**
 * Returns the stats snapshot used by the Yandex profile widget /
 * `get_player_stats` WS message. Falls back to zero/level-1 for users
 * that pre-date the columns (defensive — the migration backfills
 * defaults but we don't want a missing-column read to 500 the request).
 */
export declare function getPlayerStats(userId: number): Promise<PlayerStats | null>;
/**
 * Apply a single game's result to a player's stats. Idempotent at the
 * per-call level (each call awards exactly one game's xp) — the caller
 * is responsible for invoking this once per game per player.
 *
 * On success, pushes a `stats_updated` WS message so the profile widget
 * refreshes without polling. Errors are logged but not thrown — stats
 * are a best-effort side-channel and should never block game-end
 * broadcasts.
 */
export declare function recordGameResult(args: RecordGameResultArgs): Promise<PlayerStats | null>;
//# sourceMappingURL=stats.d.ts.map