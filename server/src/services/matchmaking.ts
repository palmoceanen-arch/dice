// Matchmaking queue for the Yandex Games build.
//
// In-memory only — there's no DB table for the queue. Players ping us
// with `mm_join_queue` over WebSocket, we hold them in a `Set` keyed by
// `userId`, and a 1-second sweep tries to pair them with compatible
// opponents (level-banded, same bet, same game mode). When a match is
// found the server:
//
//   1. picks the longest-waiting player as the host;
//   2. creates a lobby (`no_bet` iff the bet is 0);
//   3. moves the other matched players into the lobby
//      (`lobby.joinLobby`);
//   4. assigns the host's equipped table (`lobby.selectTable`) so the
//      `voting -> waiting` transition is satisfied for the multi-player
//      `lobby.startGame` precondition;
//   5. if the bet is > 0, initializes `BettingManager` and auto-places +
//      confirms each player's bet (their balance was checked at enqueue
//      time and is rechecked here under a single transaction);
//   6. broadcasts `mm_match_found` to each matched player with the
//      lobby id and metadata, so the Yandex UI can switch to the in-lobby
//      view immediately;
//   7. after `MATCH_FOUND_GRACE_MS` calls `lobby.startGame` and
//      broadcasts `game_started` (mirroring the normal handler).
//
// Disconnects / `leaveQueue` simply remove the entry. A disconnect after
// the lobby has been created falls through to the regular lobby
// disconnect/reconnect path (which refunds pending/confirmed bets).

import * as lobby from './lobby.js';
import * as game from './game.js';
import * as connections from '../websocket/connections.js';
import { getUserById, getUserPips } from './users.js';
import { query } from '../db/client.js';
import { logger } from '../utils/logger.js';
import { metricsCollector } from '../utils/metrics.js';
import { BettingManager } from './betting.js';
import type { GameMode } from '../types/index.js';

export type QueueMode = 'duel' | 'any';

// Default game mode for quick-play. Palmo's Dice is the Yandex flagship
// (clear winner, fixed-pip payout). Surfaced as a per-queue field so we
// can expose other modes from the UI later without changing the queue.
const DEFAULT_GAME_MODE: GameMode = 'poker_dice';

// Bet amounts allowed at queue join. Kept in lockstep with the chip
// row in `MultiplayerLobbyUI.renderQuickPlay` — both ends use this
// allow-list so adding a new chip is a one-line change.
export const ALLOWED_BETS: ReadonlyArray<number> = [0, 10, 50, 100, 500];

// Skill band expansion schedule (in seconds since enqueue). Players are
// only paired if their levels differ by no more than the active band.
// The final `Infinity` entry guarantees a match will eventually happen.
const SKILL_BANDS: ReadonlyArray<{ afterMs: number; band: number }> = [
  { afterMs: 0,      band: 5 },
  { afterMs: 10_000, band: 10 },
  { afterMs: 20_000, band: 25 },
  { afterMs: 30_000, band: Infinity },
];

// Quick-play 'any' lobby sizing.
const ANY_MIN_PLAYERS = 3;
const ANY_MAX_PLAYERS = 5;
// After we have `ANY_MIN_PLAYERS` queued for 'any', wait this long for
// extras before sealing the lobby. If the queue reaches
// `ANY_MAX_PLAYERS` first we seal immediately.
const ANY_GATHER_EXTRA_MS = 8_000;

// How long every matched player has to confirm `mm_ready` before the
// server cancels the match. A 10-second window is long enough to catch
// a user who briefly tabbed away or stepped from the screen but short
// enough that the ones who *are* ready don't sit on a stale "Ready?"
// modal indefinitely. If everyone confirms earlier the match starts
// immediately — the deadline is just the fallback.
const READY_DEADLINE_MS = 10_000;

// Extra delay between the last `mm_ready` (or the deadline elapsing
// with everyone ready) and the actual `game_started` broadcast. Gives
// the client a beat to render the lobby / play the "match found!"
// sound before dice start rolling.
const MATCH_START_GRACE_MS = 800;

// How often the queue sweep runs. 1s is plenty — match found events are
// rare and the sweep is O(n) where n is queued players.
const SWEEP_INTERVAL_MS = 1_000;
const QUEUE_TIMEOUT_MS = 90_000;

interface QueueEntry {
  userId: number;
  mode: QueueMode;
  gameMode: GameMode;
  betAmount: number;
  level: number;
  enqueuedAt: number;
  // Set once `ANY_MIN_PLAYERS` players are gathered; the entry is
  // sealed when `Date.now() - minReachedAt >= ANY_GATHER_EXTRA_MS`.
  // Only used by 'any' mode.
  minReachedAt?: number;
}

// State for a match that has been found but is still waiting on
// `mm_ready` confirmations from every player. The match is finalized
// (and `game_started` broadcast) when either everyone has confirmed or
// the deadline elapses with everyone ready; otherwise the match is
// cancelled, bets are refunded, and the players land back on the
// matchmaking home screen.
interface PendingMatch {
  lobbyId: string;
  userIds: number[];
  readyIds: Set<number>;
  gameMode: GameMode;
  betAmount: number;
  noBet: boolean;
  deadline: number;
  timer: ReturnType<typeof setTimeout>;
  finalized: boolean;
}

const queue = new Map<number, QueueEntry>();
const pendingMatches = new Map<string, PendingMatch>();
const pendingByUser = new Map<number, string>();
let sweepTimer: ReturnType<typeof setInterval> | null = null;

function ensureSweeper(): void {
  if (sweepTimer) return;
  sweepTimer = setInterval(() => {
    try {
      sweep();
    } catch (err) {
      logger.error('Matchmaking sweep failed', err);
    }
  }, SWEEP_INTERVAL_MS);
  // Don't keep the process alive just for the queue sweeper.
  if (typeof (sweepTimer as { unref?: () => void }).unref === 'function') {
    (sweepTimer as { unref?: () => void }).unref!();
  }
}

function currentBand(entry: QueueEntry, now: number): number {
  const waited = now - entry.enqueuedAt;
  let band = SKILL_BANDS[0].band;
  for (const step of SKILL_BANDS) {
    if (waited >= step.afterMs) band = step.band;
  }
  return band;
}

function isCompatible(a: QueueEntry, b: QueueEntry, now: number): boolean {
  if (a.gameMode !== b.gameMode) return false;
  if (a.betAmount !== b.betAmount) return false;
  const diff = Math.abs(a.level - b.level);
  // Use the larger of the two bands so the player who has been waiting
  // longer can "pull in" a stricter newcomer.
  return diff <= Math.max(currentBand(a, now), currentBand(b, now));
}

export interface JoinQueueArgs {
  userId: number;
  mode: QueueMode;
  betAmount: number;
  gameMode?: GameMode;
}

export async function joinQueue(args: JoinQueueArgs): Promise<void> {
  const { userId, mode } = args;

  // If they're already in a lobby/game, refuse — matchmaking is mutually
  // exclusive with active multiplayer state.
  const conn = connections.getConnection(userId);
  if (conn?.lobbyId || conn?.inGame) {
    connections.send(userId, { type: 'mm_error', code: 'busy', message: 'Leave current lobby first' });
    return;
  }

  // Validate bet amount against the allow-list. Anything else is a UI
  // bug or a malicious client — refuse rather than coerce.
  const betAmount = Number(args.betAmount);
  if (!ALLOWED_BETS.includes(betAmount)) {
    connections.send(userId, {
      type: 'mm_error',
      code: 'bad_bet',
      message: 'Invalid bet amount',
    });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    connections.send(userId, { type: 'mm_error', code: 'no_user', message: 'User not found' });
    return;
  }

  // Pre-flight balance check. We re-check at match-confirm time too —
  // this is just to fail fast and avoid sitting in the queue with no
  // hope of confirming the bet.
  if (betAmount > 0) {
    const pips = await getUserPips(userId);
    if (pips < betAmount) {
      connections.send(userId, {
        type: 'mm_error',
        code: 'insufficient_pips',
        message: 'Not enough pips for this bet',
        required: betAmount,
        balance: pips,
      });
      return;
    }
  }

  if (queue.has(userId)) {
    // Re-queue with the new settings rather than erroring — UX is
    // "press Find Match again" without the user thinking about a hidden
    // state.
    queue.delete(userId);
  }

  const entry: QueueEntry = {
    userId,
    mode,
    gameMode: args.gameMode ?? DEFAULT_GAME_MODE,
    betAmount,
    level: Math.max(1, user.level ?? 1),
    enqueuedAt: Date.now(),
  };
  queue.set(userId, entry);
  ensureSweeper();

  connections.send(userId, {
    type: 'mm_queued',
    mode: entry.mode,
    gameMode: entry.gameMode,
    betAmount: entry.betAmount,
    level: entry.level,
    queueSize: queueSizeForMode(entry.mode),
  });

  // Kick the sweep immediately so the case "two players queue up in the
  // same tick" doesn't wait a second for the next tick.
  sweep();
}

export function leaveQueue(userId: number): void {
  if (!queue.has(userId)) return;
  queue.delete(userId);
  connections.send(userId, { type: 'mm_left' });
}

export function isQueued(userId: number): boolean {
  return queue.has(userId);
}

export function getQueueSize(): number {
  return queue.size;
}

function queueSizeForMode(mode: QueueMode): number {
  let n = 0;
  for (const entry of queue.values()) if (entry.mode === mode) n++;
  return n;
}

// Sweep the queue once: pair duels, seal 'any' lobbies.
function sweep(): void {
  if (queue.size === 0) return;
  const now = Date.now();
  expireTimedOutEntries(now);
  if (queue.size === 0) return;

  // --- Duels ---------------------------------------------------------
  const duelEntries = Array.from(queue.values())
    .filter((e) => e.mode === 'duel')
    .sort((a, b) => a.enqueuedAt - b.enqueuedAt);

  while (duelEntries.length >= 2) {
    const first = duelEntries.shift()!;
    const partnerIdx = duelEntries.findIndex((other) => isCompatible(first, other, now));
    if (partnerIdx === -1) continue;
    const partner = duelEntries.splice(partnerIdx, 1)[0];
    // Remove both from the queue before kicking off the async lobby
    // setup so a concurrent sweep can't double-place them.
    queue.delete(first.userId);
    queue.delete(partner.userId);
    void startMatch(first, [partner]);
  }

  // --- Any (3-5) -----------------------------------------------------
  // Group by (gameMode, betAmount) so different requested modes / bets
  // don't get mashed together.
  const anyBuckets = new Map<string, QueueEntry[]>();
  for (const entry of queue.values()) {
    if (entry.mode !== 'any') continue;
    const key = `${entry.gameMode}|${entry.betAmount}`;
    const list = anyBuckets.get(key) ?? [];
    list.push(entry);
    anyBuckets.set(key, list);
  }

  for (const [, entries] of anyBuckets) {
    if (entries.length < ANY_MIN_PLAYERS) continue;
    entries.sort((a, b) => a.enqueuedAt - b.enqueuedAt);

    // Greedy banding around the longest-waiting player. Pull in
    // everyone whose level is within the active band of the seed; cap
    // at ANY_MAX_PLAYERS.
    const seed = entries[0];
    const compatible: QueueEntry[] = [seed];
    for (let i = 1; i < entries.length && compatible.length < ANY_MAX_PLAYERS; i++) {
      const cand = entries[i];
      if (isCompatible(seed, cand, now)) compatible.push(cand);
    }
    if (compatible.length < ANY_MIN_PLAYERS) continue;

    // Stamp the "min reached at" marker so we can wait for extras.
    for (const e of compatible) {
      if (e.minReachedAt == null) e.minReachedAt = now;
    }
    const groupMinReached = Math.min(
      ...compatible.map((e) => e.minReachedAt ?? now),
    );

    const sealNow =
      compatible.length >= ANY_MAX_PLAYERS ||
      now - groupMinReached >= ANY_GATHER_EXTRA_MS;
    if (!sealNow) continue;

    const [host, ...rest] = compatible;
    for (const e of compatible) queue.delete(e.userId);
    void startMatch(host, rest);
  }
}

function expireTimedOutEntries(now: number): void {
  for (const entry of queue.values()) {
    if (now - entry.enqueuedAt < QUEUE_TIMEOUT_MS) continue;
    queue.delete(entry.userId);
    connections.send(entry.userId, {
      type: 'mm_error',
      code: 'timeout',
      message: 'Matchmaking timed out. Try another bet or mode.',
    });
  }
}

async function startMatch(host: QueueEntry, others: QueueEntry[]): Promise<void> {
  const allUserIds = [host.userId, ...others.map((o) => o.userId)];
  const betAmount = host.betAmount;
  const noBet = betAmount === 0;

  try {
    const created = await lobby.createLobby(host.userId, host.gameMode, noBet, betAmount);
    const lobbyId = created.id;

    // Add the other matched players. If any of them have since
    // disconnected, we just skip them — the rest can still play.
    for (const other of others) {
      const joined = await lobby.joinLobby(lobbyId, other.userId);
      if (!joined) {
        logger.warn('Matchmaking: failed to join opponent into lobby', {
          lobbyId,
          userId: other.userId,
        });
      }
    }

    // Pick the host's equipped table as the lobby table so the
    // multi-player `startGame` precondition (`status === 'waiting'`) is
    // satisfied. Falls back to *any* table id we can find — never
    // crash on first-run users without a table equipped.
    const tableId = await pickTableId(host.userId);
    if (tableId != null) {
      await lobby.selectTable(lobbyId, tableId);
    }

    // Pre-charge bets (only if there's a bet to charge). We do this
    // before broadcasting `mm_match_found` so a player with a stale
    // balance gets a clean "insufficient_pips" error instead of being
    // dropped into an already-started game.
    if (!noBet) {
      BettingManager.initialize(lobbyId, betAmount);
      const failed = await chargeAllBets(lobbyId, allUserIds, betAmount);
      if (failed.length > 0) {
        // Refund anyone who *did* manage to confirm before we aborted.
        for (const userId of allUserIds) {
          if (!failed.includes(userId)) {
            try {
              await BettingManager.refundBet(userId, lobbyId);
            } catch (err) {
              logger.error('Matchmaking: refund failed during abort', err, { userId, lobbyId });
            }
          }
        }
        BettingManager.cleanup(lobbyId);
        // Tear down the lobby so we don't leak it.
        for (const userId of allUserIds) {
          await safeLeaveLobby(lobbyId, userId);
        }
        for (const userId of allUserIds) {
          connections.send(userId, {
            type: 'mm_error',
            code: failed.includes(userId) ? 'insufficient_pips' : 'opponent_unavailable',
            message: failed.includes(userId)
              ? 'Not enough pips to cover your bet'
              : 'Match cancelled — opponent could not cover the bet',
            betAmount,
          });
        }
        return;
      }
      await BettingManager.activateBets(lobbyId);
    }

    const lobbyData = await lobby.getLobby(lobbyId);
    const matchedUserIds = lobbyData?.players.map((p) => p.oderId) ?? allUserIds;

    // Set up the pending-match record so we can wait for everyone to
    // confirm `mm_ready`. The match is finalized either when everyone
    // confirms or the deadline elapses (handled in `finalizePendingMatch`).
    const pending: PendingMatch = {
      lobbyId,
      userIds: matchedUserIds,
      readyIds: new Set(),
      gameMode: host.gameMode,
      betAmount,
      noBet,
      deadline: Date.now() + READY_DEADLINE_MS,
      timer: setTimeout(() => {
        void finalizePendingMatch(lobbyId);
      }, READY_DEADLINE_MS),
      finalized: false,
    };
    pendingMatches.set(lobbyId, pending);
    for (const uid of matchedUserIds) {
      pendingByUser.set(uid, lobbyId);
    }

    for (const userId of matchedUserIds) {
      connections.send(userId, {
        type: 'mm_match_found',
        lobby: lobbyData,
        lobbyId,
        gameMode: host.gameMode,
        betAmount,
        pot: betAmount * matchedUserIds.length,
        readyDeadlineMs: READY_DEADLINE_MS,
        totalCount: matchedUserIds.length,
      });
    }
  } catch (err) {
    logger.error('Matchmaking: failed to start match', err, {
      hostId: host.userId,
      otherIds: others.map((o) => o.userId),
    });
    // Re-queue everyone so the failure doesn't strand them.
    for (const userId of allUserIds) {
      connections.send(userId, {
        type: 'mm_error',
        code: 'start_failed',
        message: 'Failed to start match, try again',
      });
    }
  }
}

// Place and confirm bets for every matched player. Returns the list of
// user ids that could not be charged (empty on success).
async function chargeAllBets(
  lobbyId: string,
  userIds: number[],
  amount: number,
): Promise<number[]> {
  const failed: number[] = [];
  for (const userId of userIds) {
    const place = await BettingManager.placeBet(userId, amount, lobbyId);
    if (!place.success) {
      failed.push(userId);
      continue;
    }
    const confirm = await BettingManager.confirmBet(userId, lobbyId);
    if (!confirm.success) {
      failed.push(userId);
    }
  }
  return failed;
}

async function safeLeaveLobby(lobbyId: string, userId: number): Promise<void> {
  try {
    await lobby.leaveLobby(lobbyId, userId);
  } catch (err) {
    logger.error('Matchmaking: leaveLobby cleanup failed', err, { lobbyId, userId });
  }
}

async function autoStartMatch(
  lobbyId: string,
  userIds: number[],
  gameMode: GameMode,
): Promise<void> {
  try {
    const ok = await lobby.startGame(lobbyId);
    if (!ok) {
      logger.warn('Matchmaking: auto-start refused by lobby', { lobbyId });
      return;
    }

    const lobbyData = await lobby.getLobby(lobbyId);
    const currentTurn = game.getCurrentTurn(lobbyId);
    const playerOrder = game.getPlayerOrder(lobbyId);
    const minAspectRatio = lobby.getMinAspectRatio(lobbyId);
    const gameState = game.getGameState(lobbyId);

    // Preload dice configs for clients' first throw_start.
    if (lobbyData) {
      for (const p of lobbyData.players) {
        if (p.user.equippedDiceId) {
          await lobby.getDiceConfig(p.user.equippedDiceId);
        }
      }
    }

    // Build mode-specific data, mirroring handlers.handleStartGame so
    // matchmaking-started games look identical to manually-started ones
    // on the client.
    let modeData: Record<string, unknown> = {};
    if (gameMode === 'street_craps') {
      const crapsState = gameState?.modeState as { phase?: string; pointValue?: number | null } | undefined;
      modeData = {
        phase: crapsState?.phase ?? 'come_out',
        pointValue: crapsState?.pointValue ?? null,
      };
    } else if (gameMode === 'mexico') {
      const mexicoState = gameState?.modeState as { penalties?: Map<number, number> } | undefined;
      modeData = {
        penalties: mexicoState?.penalties ? Object.fromEntries(mexicoState.penalties) : {},
      };
    }

    const tableConfig = await lobby.getSelectedTableConfig(lobbyId);

    for (const userId of userIds) {
      connections.send(userId, {
        type: 'game_started',
        lobby: lobbyData,
        currentTurn,
        playerOrder,
        minAspectRatio,
        tableConfig,
        throwSeed: gameState?.throwSeed,
        diceCount: game.getDiceCount(lobbyId),
        ...modeData,
      });
    }

    metricsCollector.gameStarted();
  } catch (err) {
    logger.error('Matchmaking: auto-start failed', err, { lobbyId });
  }
}

async function pickTableId(userId: number): Promise<number | null> {
  // 1. host's equipped table
  const user = await getUserById(userId);
  if (user?.equippedTableId != null) return user.equippedTableId;
  // 2. any available table in the catalog (deterministic by id)
  const result = await query<{ id: number }>(
    `SELECT id FROM item_catalog WHERE type = 'table' AND is_available = true
     ORDER BY id LIMIT 1`,
  );
  return result.rows[0]?.id ?? null;
}

/**
 * Mark a player as ready for the pending match they were matched into.
 * If all matched players are ready, the match starts immediately (rather
 * than waiting for the deadline). No-op if the user isn't in a pending
 * match — the client may send the signal late after the deadline has
 * already cancelled the match, and that's fine.
 */
export function markReady(userId: number): void {
  const lobbyId = pendingByUser.get(userId);
  if (!lobbyId) return;
  const pending = pendingMatches.get(lobbyId);
  if (!pending || pending.finalized) return;
  if (!pending.userIds.includes(userId)) return;
  if (pending.readyIds.has(userId)) return;
  pending.readyIds.add(userId);

  // Mirror progress to every player in the match so each client can
  // show "2/3 ready" UI without polling.
  for (const otherId of pending.userIds) {
    connections.send(otherId, {
      type: 'mm_ready_state',
      lobbyId: pending.lobbyId,
      userId,
      readyCount: pending.readyIds.size,
      totalCount: pending.userIds.length,
    });
  }

  // Everyone in — start the game.
  if (pending.readyIds.size >= pending.userIds.length) {
    clearTimeout(pending.timer);
    // Give clients a beat to dismiss the "Ready?" modal before dice fly.
    setTimeout(() => {
      void finalizePendingMatch(lobbyId);
    }, MATCH_START_GRACE_MS);
  }
}

/**
 * Called when the ready deadline elapses OR everyone has confirmed
 * ready. Decides whether to start the game or cancel the match (and
 * refund bets) based on how many players confirmed in time.
 */
async function finalizePendingMatch(lobbyId: string): Promise<void> {
  const pending = pendingMatches.get(lobbyId);
  if (!pending || pending.finalized) return;
  pending.finalized = true;
  clearTimeout(pending.timer);
  pendingMatches.delete(lobbyId);
  for (const uid of pending.userIds) {
    if (pendingByUser.get(uid) === lobbyId) {
      pendingByUser.delete(uid);
    }
  }

  const allReady = pending.readyIds.size >= pending.userIds.length;
  if (allReady) {
    await autoStartMatch(lobbyId, pending.userIds, pending.gameMode);
    return;
  }

  // Not everyone confirmed in time — cancel.
  const unreadyIds = pending.userIds.filter((id) => !pending.readyIds.has(id));
  await cancelPendingMatch(pending, 'not_ready', unreadyIds);
}

/**
 * Tear down a pending match: refund any active bets, remove every
 * player from the lobby (which deletes it), and notify clients with
 * `mm_match_cancelled` so they can leave the "Ready?" modal.
 */
async function cancelPendingMatch(
  pending: PendingMatch,
  reason: 'not_ready' | 'disconnected' | 'declined',
  unreadyIds: number[],
): Promise<void> {
  pending.finalized = true;
  clearTimeout(pending.timer);
  pendingMatches.delete(pending.lobbyId);
  for (const uid of pending.userIds) {
    if (pendingByUser.get(uid) === pending.lobbyId) {
      pendingByUser.delete(uid);
    }
  }

  // Refund every player's bet if there was one. We charged everyone in
  // `startMatch` so everyone gets refunded — even the unready ones,
  // since the match never started.
  if (!pending.noBet) {
    for (const uid of pending.userIds) {
      try {
        await BettingManager.refundBet(uid, pending.lobbyId);
      } catch (err) {
        logger.error('Matchmaking: refund failed during pending cancel', err, {
          lobbyId: pending.lobbyId,
          userId: uid,
        });
      }
    }
    BettingManager.cleanup(pending.lobbyId);
  }

  // Tear down the lobby so it doesn't leak.
  for (const uid of pending.userIds) {
    await safeLeaveLobby(pending.lobbyId, uid);
  }

  for (const uid of pending.userIds) {
    connections.send(uid, {
      type: 'mm_match_cancelled',
      lobbyId: pending.lobbyId,
      reason,
      unreadyIds,
      betAmount: pending.betAmount,
    });
  }

  logger.info('Matchmaking: pending match cancelled', {
    lobbyId: pending.lobbyId,
    reason,
    unreadyCount: unreadyIds.length,
    totalCount: pending.userIds.length,
  });
}

/**
 * Called when a user disconnects. Removes them from the queue silently
 * — no `mm_left` broadcast (they're gone, nothing to notify). If they
 * were in a pending match (post-`mm_match_found`, pre-`game_started`),
 * the whole match is cancelled and the other players get a refund —
 * playing 1×1 with a disconnected opponent is no game.
 */
export function handleDisconnect(userId: number): void {
  queue.delete(userId);

  const lobbyId = pendingByUser.get(userId);
  if (!lobbyId) return;
  const pending = pendingMatches.get(lobbyId);
  if (!pending || pending.finalized) return;
  // Fire-and-forget — the disconnect path itself isn't async.
  void cancelPendingMatch(pending, 'disconnected', [userId]);
}
