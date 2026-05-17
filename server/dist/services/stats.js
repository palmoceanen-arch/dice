// Player progression / matchmaking stats.
//
// Owns the `xp` / `level` / `games_played` / `wins` / `losses` columns on
// the `users` table (added by migrate-yandex.ts → `idx_users_level`).
//
// XP / level model
// ----------------
//   xp_per_game = PARTICIPATION_XP
//                 + (won ? WIN_XP : 0)
//                 + (totalPlayers - 1) * PER_OPPONENT_XP
//
// Cumulative XP to reach level L is `50 * L * (L - 1)` (level 1 = 0 XP,
// level 2 = 100 XP, level 3 = 300 XP, level 4 = 600 XP, …). Solving for L
// gives `floor((1 + sqrt(1 + xp / 12.5)) / 2)` which is a single
// fixed-cost computation — no loop, no per-level table.
//
// The flow is plain Postgres UPDATEs (no transactions, no ORM) so it can
// be called from the hot path in `game.endGame` without serializing
// game-end broadcasts. Each call also pushes a `stats_updated` WS message
// to the player so the Yandex profile widget refreshes immediately.
import { query } from '../db/client.js';
import * as connections from '../websocket/connections.js';
import { logger } from '../utils/logger.js';
// XP awards. Tuned so a single-game win in a 3-player lobby gives ~60xp
// (well under the level-2 threshold of 100xp), pushing a brand-new player
// to level 2 in 2-3 winning games. Adjust here, not at callsites.
const PARTICIPATION_XP = 10;
const WIN_XP = 40;
const PER_OPPONENT_XP = 5;
// Solo (single-player) games don't count toward matchmaking stats. The
// Yandex Free Roll path already lives outside this code path, but the
// flag is enforced defensively in case some future single-player mode
// reaches `recordGameResult`.
const MIN_PLAYERS_FOR_STATS = 2;
/**
 * Compute level from cumulative XP.
 *
 * Inverse of `xp_for_level(L) = 50 * L * (L - 1)`. Stable for all
 * non-negative integer xp (and rounds down for fractional inputs).
 */
export function levelFromXp(xp) {
    if (!Number.isFinite(xp) || xp <= 0)
        return 1;
    return Math.max(1, Math.floor((1 + Math.sqrt(1 + xp / 12.5)) / 2));
}
/**
 * Cumulative XP required to reach `level`.
 *
 * Useful for rendering the progress bar in the profile widget without an
 * extra round-trip — the client just needs `currentXp`, `levelFromXp`,
 * and this function to lay out the bar.
 */
export function xpForLevel(level) {
    if (level <= 1)
        return 0;
    return 50 * level * (level - 1);
}
/**
 * XP gained by a player for a single game-end event.
 */
export function xpFromGame(won, totalPlayers) {
    const opponents = Math.max(0, totalPlayers - 1);
    return PARTICIPATION_XP + (won ? WIN_XP : 0) + opponents * PER_OPPONENT_XP;
}
/**
 * Returns the stats snapshot used by the Yandex profile widget /
 * `get_player_stats` WS message. Falls back to zero/level-1 for users
 * that pre-date the columns (defensive — the migration backfills
 * defaults but we don't want a missing-column read to 500 the request).
 */
export async function getPlayerStats(userId) {
    const result = await query(`SELECT id, xp, level, games_played, wins, losses, pips
     FROM users WHERE id = $1`, [userId]);
    if (result.rows.length === 0)
        return null;
    const row = result.rows[0];
    return {
        userId: row.id,
        xp: toInt(row.xp),
        level: Math.max(1, toInt(row.level) || 1),
        gamesPlayed: toInt(row.games_played),
        wins: toInt(row.wins),
        losses: toInt(row.losses),
        pips: toInt(row.pips),
    };
}
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
export async function recordGameResult(args) {
    const { userId, won, totalPlayers } = args;
    if (totalPlayers < MIN_PLAYERS_FOR_STATS)
        return null;
    const gained = xpFromGame(won, totalPlayers);
    try {
        const result = await query(`UPDATE users
         SET xp           = COALESCE(xp,           0) + $2,
             games_played = COALESCE(games_played, 0) + 1,
             wins         = COALESCE(wins,         0) + $3,
             losses       = COALESCE(losses,       0) + $4,
             level        = GREATEST(
                              COALESCE(level, 1),
                              FLOOR((1 + sqrt(1 + (COALESCE(xp, 0) + $2) / 12.5)) / 2)::int
                            )
       WHERE id = $1
       RETURNING id, xp, level, games_played, wins, losses, pips`, [userId, gained, won ? 1 : 0, won ? 0 : 1]);
        if (result.rows.length === 0)
            return null;
        const row = result.rows[0];
        const stats = {
            userId: row.id,
            xp: toInt(row.xp),
            level: Math.max(1, toInt(row.level) || 1),
            gamesPlayed: toInt(row.games_played),
            wins: toInt(row.wins),
            losses: toInt(row.losses),
            pips: toInt(row.pips),
        };
        // Best-effort push to the player; if they're disconnected the
        // matchmaking UI will refetch via `get_player_stats` on reopen.
        connections.send(userId, {
            type: 'stats_updated',
            stats,
            xpGained: gained,
            won,
            totalPlayers,
        });
        return stats;
    }
    catch (err) {
        logger.error('Failed to record game result', err, { userId, won, totalPlayers });
        return null;
    }
}
function toInt(v) {
    if (v == null)
        return 0;
    if (typeof v === 'number')
        return Math.floor(v);
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
}
//# sourceMappingURL=stats.js.map