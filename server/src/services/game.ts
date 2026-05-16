import { query } from '../db/client.js';
import type { GameMode } from '../types/index.js';
import * as lobby from './lobby.js';
import { BettingManager } from './betting.js';
import { metricsCollector } from '../utils/metrics.js';
import { recordGameResult } from './stats.js';
import {
  type GameState,
  type RollResult,
  type GameModeHandler,
  registerGameMode,
  getGameMode,
  FreeRollMode,
  StreetCrapsMode,
  MexicoMode,
  GreedyPigMode,
  PalmosDiceMode,
  handleGreedyPigStop,
  getGreedyPigTurnScore,
} from './gameModes/index.js';

// Register all game modes
registerGameMode(FreeRollMode);
registerGameMode(StreetCrapsMode);
registerGameMode(MexicoMode);
registerGameMode(GreedyPigMode);
registerGameMode(PalmosDiceMode);

// In-memory game state for active games
const activeGames = new Map<string, GameState>();

export async function initializeGame(lobbyId: string, gameMode: GameMode): Promise<void> {
  const lobbyData = await lobby.getLobby(lobbyId);
  if (!lobbyData) return;
  
  const handler = getGameMode(gameMode);
  if (!handler) {
    console.error(`Unknown game mode: ${gameMode}`);
    return;
  }
  
  // Set player order (host goes first)
  const playerOrder = [
    lobbyData.hostId, 
    ...lobbyData.players.filter(p => p.oderId !== lobbyData.hostId).map(p => p.oderId)
  ];
  
  const state = handler.initialize(lobbyId, playerOrder);
  activeGames.set(lobbyId, state);
  
  console.log(`Game initialized for lobby ${lobbyId}, mode: ${gameMode}, players: ${playerOrder.length}`);
}

export function getGameState(lobbyId: string): GameState | null {
  return activeGames.get(lobbyId) || null;
}

export function getThrowSeed(lobbyId: string): number | null {
  const state = activeGames.get(lobbyId);
  return state?.throwSeed ?? null;
}

export function regenerateThrowSeed(lobbyId: string): number | null {
  const state = activeGames.get(lobbyId);
  if (!state) return null;
  
  state.throwSeed = Math.floor(Math.random() * 0xFFFFFFFF);
  return state.throwSeed;
}

export function getCurrentTurn(lobbyId: string): number | null {
  const state = activeGames.get(lobbyId);
  return state?.currentTurn || null;
}

export function setCurrentTurn(lobbyId: string, playerId: number): void {
  const state = activeGames.get(lobbyId);
  if (!state) return;
  
  state.currentTurn = playerId;
  state.turnIndex = state.playerOrder.indexOf(playerId);
}

export function getNextPlayer(lobbyId: string, currentPlayerId: number): number | null {
  const state = activeGames.get(lobbyId);
  if (!state) return null;
  
  const currentIndex = state.playerOrder.indexOf(currentPlayerId);
  if (currentIndex === -1) return null;
  
  const nextIndex = (currentIndex + 1) % state.playerOrder.length;
  return state.playerOrder[nextIndex];
}

export function getPlayerOrder(lobbyId: string): number[] {
  const state = activeGames.get(lobbyId);
  return state?.playerOrder || [];
}

/**
 * Process a dice roll for any game mode (legacy 2-dice version)
 */
export function processRoll(lobbyId: string, playerId: number, dice1: number, dice2: number): RollResult | null {
  const state = activeGames.get(lobbyId);
  if (!state) return null;
  
  const handler = getGameMode(state.gameMode);
  if (!handler) return null;
  
  return handler.processRoll(state, playerId, dice1, dice2);
}

/**
 * Process a dice roll with variable number of dice
 */
export function processRollMulti(lobbyId: string, playerId: number, diceValues: number[]): RollResult | null {
  const state = activeGames.get(lobbyId);
  if (!state) return null;
  
  const handler = getGameMode(state.gameMode);
  if (!handler) return null;
  
  // Use processRollMulti if available, otherwise fall back to processRoll for 2-dice games
  if (handler.processRollMulti) {
    return handler.processRollMulti(state, playerId, diceValues);
  } else if (diceValues.length === 2) {
    return handler.processRoll(state, playerId, diceValues[0], diceValues[1]);
  } else {
    console.error(`Game mode ${state.gameMode} does not support ${diceValues.length} dice`);
    return null;
  }
}

/**
 * Get the number of dice required for a game mode
 */
export function getDiceCount(lobbyId: string): number {
  const state = activeGames.get(lobbyId);
  if (!state) return 2; // Default to 2 dice
  
  const handler = getGameMode(state.gameMode);
  return handler?.diceCount || 2;
}

/**
 * Legacy Street Craps function for backward compatibility
 */
export interface StreetCrapsResult {
  outcome: 'natural' | 'craps' | 'point_set' | 'point_hit' | 'seven_out' | 'continue';
  message: string;
  newPhase: 'come_out' | 'point';
  pointValue: number | null;
  shooterWins: boolean | null;
  passTurn: boolean;
}

export function processStreetCrapsRoll(lobbyId: string, total: number): StreetCrapsResult {
  const state = activeGames.get(lobbyId);
  if (!state || state.gameMode !== 'street_craps') {
    return {
      outcome: 'continue',
      message: 'Not a street craps game',
      newPhase: 'come_out',
      pointValue: null,
      shooterWins: null,
      passTurn: false,
    };
  }
  
  // Save current turn before processing (processRoll may change it)
  const originalTurn = state.currentTurn;
  
  // Reconstruct dice from total (approximate - for legacy compatibility)
  const dice1 = Math.min(6, Math.max(1, Math.floor(total / 2)));
  const dice2 = total - dice1;
  
  const result = processRoll(lobbyId, originalTurn, dice1, dice2);
  if (!result) {
    return {
      outcome: 'continue',
      message: 'Error processing roll',
      newPhase: 'come_out',
      pointValue: null,
      shooterWins: null,
      passTurn: false,
    };
  }
  
  return {
    outcome: result.outcome as StreetCrapsResult['outcome'],
    message: result.message,
    newPhase: (result.data?.phase as 'come_out' | 'point') || 'come_out',
    pointValue: (result.data?.pointValue as number | null) || null,
    shooterWins: (result.data?.shooterWins as boolean | null) ?? null,
    // Check if turn changed by comparing with original turn
    passTurn: result.nextTurn !== null && result.nextTurn !== originalTurn,
  };
}

export async function saveRoll(lobbyId: string, userId: number, dice1: number, dice2: number, result?: string): Promise<void> {
  const total = dice1 + dice2;
  
  await query(
    `INSERT INTO rolls (lobby_id, user_id, dice1, dice2, total, result)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [lobbyId, userId, dice1, dice2, total, result || null]
  );
}

export async function getRolls(lobbyId: string, limit = 50): Promise<{
  id: number;
  userId: number;
  dice1: number;
  dice2: number;
  total: number;
  result: string | null;
  rolledAt: Date;
}[]> {
  const result = await query<{
    id: number;
    user_id: number;
    dice1: number;
    dice2: number;
    total: number;
    result: string | null;
    rolled_at: string;
  }>(
    `SELECT id, user_id, dice1, dice2, total, result, rolled_at
     FROM rolls
     WHERE lobby_id = $1
     ORDER BY rolled_at DESC
     LIMIT $2`,
    [lobbyId, limit]
  );
  
  return result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    dice1: row.dice1,
    dice2: row.dice2,
    total: row.total,
    result: row.result,
    rolledAt: new Date(row.rolled_at),
  }));
}

// Fixed pip prize awarded to each winner in a no-bet lobby. Kept small so
// the Yandex Games path can't be used as an unbounded pip farm by abusing
// trivially-winnable lobbies; tune in one place if needed.
const NO_BET_WINNER_PIPS = 100;

export async function endGame(lobbyId: string): Promise<Map<number, number> | null> {
  const state = activeGames.get(lobbyId);
  let payouts: Map<number, number> | null = null;
  let winnerIds: number[] = [];

  // Resolve bets if betting is active
  if (state && BettingManager.isActive(lobbyId)) {
    const handler = getGameMode(state.gameMode);
    if (handler) {
      const winners = handler.getWinners(state);
      winnerIds = winners;
      const result = await BettingManager.resolve(lobbyId, winners);
      if (result.success && result.payouts) {
        payouts = result.payouts;
      }
    }
    BettingManager.cleanup(lobbyId);
  } else if (state && lobby.isNoBetLobby(lobbyId)) {
    // No-bet lobby (Yandex Games): no in-round pot to resolve. Award a
    // fixed pip prize to every winner reported by the mode handler.
    const handler = getGameMode(state.gameMode);
    if (handler) {
      const winners = handler.getWinners(state);
      winnerIds = winners;
      if (winners.length > 0) {
        payouts = new Map();
        for (const winnerId of winners) {
          try {
            await query(
              'UPDATE users SET pips = pips + $1 WHERE id = $2',
              [NO_BET_WINNER_PIPS, winnerId],
            );
            payouts.set(winnerId, NO_BET_WINNER_PIPS);
          } catch (err) {
            console.error('[no-bet] failed to award pips', { lobbyId, winnerId, err });
          }
        }
      }
    }
  } else if (state) {
    // Fallback for any future lobby flavour: still capture the winner
    // list so matchmaking stats (xp / level / W-L) update correctly.
    const handler = getGameMode(state.gameMode);
    if (handler) {
      winnerIds = handler.getWinners(state);
    }
  }

  // Record matchmaking stats (xp / level / wins / losses / games_played)
  // for every player that participated. `recordGameResult` is
  // best-effort and never throws — failures are logged inside the
  // service. Solo (<2 players) is filtered there as well.
  if (state) {
    const winnerSet = new Set(winnerIds);
    const totalPlayers = state.playerOrder.length;
    for (const playerId of state.playerOrder) {
      recordGameResult({
        userId: playerId,
        won: winnerSet.has(playerId),
        totalPlayers,
      }).catch(err => {
        console.error('Failed to record game result:', err);
      });
    }
  }

  // Increment games played for all players (for referral tracking)
  if (state) {
    for (const playerId of state.playerOrder) {
      // Import and call incrementReferralGames asynchronously
      import('./referrals.js').then(({ incrementReferralGames }) => {
        incrementReferralGames(playerId).catch(err => {
          console.error('Failed to increment referral games:', err);
        });
      });
    }
  }
  
  activeGames.delete(lobbyId);
  metricsCollector.gameFinished();
  console.log(`Game ended for lobby ${lobbyId}`);
  
  return payouts;
}

/**
 * Handle Greedy Pig "Stop" action (bank turn score)
 */
export function processGreedyPigStop(lobbyId: string): RollResult | null {
  const state = activeGames.get(lobbyId);
  if (!state || state.gameMode !== 'greedy_pig') return null;
  
  return handleGreedyPigStop(state);
}

/**
 * Get current turn score for Greedy Pig
 */
export function getGreedyPigCurrentTurnScore(lobbyId: string): number {
  const state = activeGames.get(lobbyId);
  if (!state || state.gameMode !== 'greedy_pig') return 0;
  
  return getGreedyPigTurnScore(state);
}

// Palmo's Dice reroll selection storage
const palmosRerollSelections = new Map<string, { userId: number; selectedDice: number[] }>();

/**
 * Store selected dice for Palmo's Dice reroll
 */
export function setPalmosRerollSelection(lobbyId: string, userId: number, selectedDice: number[]): void {
  palmosRerollSelections.set(lobbyId, { userId, selectedDice });
}

/**
 * Get and clear selected dice for Palmo's Dice reroll
 */
export function getPalmosRerollSelection(lobbyId: string, userId: number): number[] | null {
  const selection = palmosRerollSelections.get(lobbyId);
  if (!selection || selection.userId !== userId) return null;
  
  palmosRerollSelections.delete(lobbyId);
  return selection.selectedDice;
}

/**
 * Handle Palmo's Dice "Take" action (take current points and end turn)
 */
export function processPalmosTake(lobbyId: string, userId: number): RollResult | null {
  const state = activeGames.get(lobbyId);
  if (!state || state.gameMode !== 'poker_dice') {
    console.log('[Palmos] processPalmosTake: invalid state or game mode');
    return null;
  }
  
  const palmosState = state.modeState as any;
  
  console.log('[Palmos] processPalmosTake:', {
    userId,
    hasCurrentRound: !!palmosState.currentRound,
    currentRoundPlayerId: palmosState.currentRound?.playerId,
    currentDice: palmosState.currentRound?.currentDice
  });
  
  // Check if player has a current round
  if (!palmosState.currentRound || palmosState.currentRound.playerId !== userId) {
    console.log('[Palmos] No current round or wrong player');
    return null;
  }
  
  // Evaluate current hand and award points
  const hand = evaluateHandFromState(palmosState.currentRound.currentDice);
  
  console.log('[Palmos] Hand evaluated:', hand);
  
  const currentScore = palmosState.scores.get(userId) || 0;
  const newScore = currentScore + hand.points;
  palmosState.scores.set(userId, newScore);
  
  console.log('[Palmos] Score updated:', { currentScore, newScore });
  
  // Clear current round
  palmosState.currentRound = null;
  
  // Check if game is over
  const gameOver = newScore >= palmosState.targetScore;
  
  if (gameOver) {
    const winners = PalmosDiceMode.getWinners(state);
    
    return {
      outcome: 'game_over',
      message: `Взял ${hand.points} очков! Победа! Финальный счёт: ${newScore}`,
      nextTurn: null,
      gameOver: true,
      winners,
      data: {
        hand: hand.name,
        points: hand.points,
        newScore,
        scores: Object.fromEntries(palmosState.scores),
      },
    };
  }
  
  // Move to next player
  const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
  const nextPlayer = state.playerOrder[nextIndex];
  state.currentTurn = nextPlayer;
  state.turnIndex = nextIndex;
  
  return {
    outcome: 'take',
    message: `Взял ${hand.points} очков! Счёт: ${newScore}`,
    nextTurn: nextPlayer,
    gameOver: false,
    data: {
      hand: hand.name,
      points: hand.points,
      newScore,
      scores: Object.fromEntries(palmosState.scores),
    },
  };
}

// Helper function to evaluate hand (same logic as in palmosDice.ts)
function evaluateHandFromState(dice: number[]): { points: number; name: string } {
  if (dice.length !== 5) {
    return { points: 0, name: 'Ошибка' };
  }
  
  const sorted = [...dice].sort((a, b) => a - b);
  const counts = new Map<number, number>();
  for (const die of sorted) {
    counts.set(die, (counts.get(die) || 0) + 1);
  }
  
  const countValues = Array.from(counts.values()).sort((a, b) => b - a);
  const dieValues = Array.from(counts.keys()).sort((a, b) => b - a);
  
  // Five of a Kind - 100 points
  if (countValues[0] === 5) {
    return { points: 100, name: `Пятёрка (${sorted[0]}s)` };
  }
  
  // Four of a Kind - 70 points
  if (countValues[0] === 4) {
    const fourValue = dieValues.find(v => counts.get(v) === 4)!;
    return { points: 70, name: `Каре (${fourValue}s)` };
  }
  
  // Large Straight - 60 points
  const isLargeStraight = 
    (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3 && sorted[3] === 4 && sorted[4] === 5) ||
    (sorted[0] === 2 && sorted[1] === 3 && sorted[2] === 4 && sorted[3] === 5 && sorted[4] === 6);
  
  if (isLargeStraight) {
    return { points: 60, name: sorted[4] === 5 ? 'Большой стрит (1-5)' : 'Большой стрит (2-6)' };
  }
  
  // Full House - 50 points
  if (countValues[0] === 3 && countValues[1] === 2) {
    const threeValue = dieValues.find(v => counts.get(v) === 3)!;
    const twoValue = dieValues.find(v => counts.get(v) === 2)!;
    return { points: 50, name: `Фулл-хаус (${threeValue}s и ${twoValue}s)` };
  }
  
  // Straight (4 in a row) - 40 points
  const hasFourInRow = 
    (counts.has(1) && counts.has(2) && counts.has(3) && counts.has(4)) ||
    (counts.has(2) && counts.has(3) && counts.has(4) && counts.has(5)) ||
    (counts.has(3) && counts.has(4) && counts.has(5) && counts.has(6));
  
  if (hasFourInRow) {
    return { points: 40, name: 'Стрит (4 подряд)' };
  }
  
  // Three of a Kind - 30 points
  if (countValues[0] === 3) {
    const threeValue = dieValues.find(v => counts.get(v) === 3)!;
    return { points: 30, name: `Тройка (${threeValue}s)` };
  }
  
  // Two Pair - 20 points
  if (countValues[0] === 2 && countValues[1] === 2) {
    const pairs = dieValues.filter(v => counts.get(v) === 2).sort((a, b) => b - a);
    return { points: 20, name: `Две пары (${pairs[0]}s и ${pairs[1]}s)` };
  }
  
  // One Pair - 10 points
  if (countValues[0] === 2) {
    const pairValue = dieValues.find(v => counts.get(v) === 2)!;
    return { points: 10, name: `Пара (${pairValue}s)` };
  }
  
  // Nothing - 0 points
  return { points: 0, name: 'Ничего' };
}

// Database session functions (for future use)
export async function createGameSession(lobbyId: string, shooterId: number): Promise<number> {
  const result = await query<{ id: number }>(
    `INSERT INTO game_sessions (lobby_id, shooter_id, phase, status)
     VALUES ($1, $2, 'come_out', 'active')
     RETURNING id`,
    [lobbyId, shooterId]
  );
  
  return result.rows[0].id;
}

export async function getGameSession(lobbyId: string): Promise<{
  id: number;
  shooterId: number;
  phase: 'come_out' | 'point';
  pointValue: number | null;
  status: string;
} | null> {
  const result = await query<{
    id: number;
    shooter_id: number;
    phase: string;
    point_value: number | null;
    status: string;
  }>(
    `SELECT id, shooter_id, phase, point_value, status
     FROM game_sessions
     WHERE lobby_id = $1 AND status = 'active'
     ORDER BY created_at DESC
     LIMIT 1`,
    [lobbyId]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    shooterId: row.shooter_id,
    phase: row.phase as 'come_out' | 'point',
    pointValue: row.point_value,
    status: row.status,
  };
}

export function endGameSession(sessionId: number): Promise<void> {
  return query(
    `UPDATE game_sessions SET status = 'finished' WHERE id = $1`,
    [sessionId]
  ).then(() => {});
}
