import type { GameMode } from '../types/index.js';
export type QueueMode = 'duel' | 'any';
export declare const ALLOWED_BETS: ReadonlyArray<number>;
export interface JoinQueueArgs {
    userId: number;
    mode: QueueMode;
    betAmount: number;
    gameMode?: GameMode;
}
export declare function joinQueue(args: JoinQueueArgs): Promise<void>;
export declare function leaveQueue(userId: number): void;
export declare function isQueued(userId: number): boolean;
export declare function getQueueSize(): number;
/**
 * Mark a player as ready for the pending match they were matched into.
 * If all matched players are ready, the match starts immediately (rather
 * than waiting for the deadline). No-op if the user isn't in a pending
 * match — the client may send the signal late after the deadline has
 * already cancelled the match, and that's fine.
 */
export declare function markReady(userId: number): void;
/**
 * Called when a user disconnects. Removes them from the queue silently
 * — no `mm_left` broadcast (they're gone, nothing to notify). If they
 * were in a pending match (post-`mm_match_found`, pre-`game_started`),
 * the whole match is cancelled and the other players get a refund —
 * playing 1×1 with a disconnected opponent is no game.
 */
export declare function handleDisconnect(userId: number): void;
//# sourceMappingURL=matchmaking.d.ts.map