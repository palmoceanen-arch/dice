import type { GameMode } from '../types/index.js';
import { type GameState, type RollResult } from './gameModes/index.js';
export declare function initializeGame(lobbyId: string, gameMode: GameMode): Promise<void>;
export declare function getGameState(lobbyId: string): GameState | null;
export declare function getThrowSeed(lobbyId: string): number | null;
export declare function regenerateThrowSeed(lobbyId: string): number | null;
export declare function getCurrentTurn(lobbyId: string): number | null;
export declare function setCurrentTurn(lobbyId: string, playerId: number): void;
export declare function getNextPlayer(lobbyId: string, currentPlayerId: number): number | null;
export declare function getPlayerOrder(lobbyId: string): number[];
/**
 * Process a dice roll for any game mode (legacy 2-dice version)
 */
export declare function processRoll(lobbyId: string, playerId: number, dice1: number, dice2: number): RollResult | null;
/**
 * Process a dice roll with variable number of dice
 */
export declare function processRollMulti(lobbyId: string, playerId: number, diceValues: number[]): RollResult | null;
/**
 * Get the number of dice required for a game mode
 */
export declare function getDiceCount(lobbyId: string): number;
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
export declare function processStreetCrapsRoll(lobbyId: string, total: number): StreetCrapsResult;
export declare function saveRoll(lobbyId: string, userId: number, dice1: number, dice2: number, result?: string): Promise<void>;
export declare function getRolls(lobbyId: string, limit?: number): Promise<{
    id: number;
    userId: number;
    dice1: number;
    dice2: number;
    total: number;
    result: string | null;
    rolledAt: Date;
}[]>;
export declare function endGame(lobbyId: string): Promise<Map<number, number> | null>;
/**
 * Handle Greedy Pig "Stop" action (bank turn score)
 */
export declare function processGreedyPigStop(lobbyId: string): RollResult | null;
/**
 * Get current turn score for Greedy Pig
 */
export declare function getGreedyPigCurrentTurnScore(lobbyId: string): number;
/**
 * Store selected dice for Palmo's Dice reroll
 */
export declare function setPalmosRerollSelection(lobbyId: string, userId: number, selectedDice: number[]): void;
/**
 * Get and clear selected dice for Palmo's Dice reroll
 */
export declare function getPalmosRerollSelection(lobbyId: string, userId: number): number[] | null;
/**
 * Handle Palmo's Dice "Take" action (take current points and end turn)
 */
export declare function processPalmosTake(lobbyId: string, userId: number): RollResult | null;
export declare function createGameSession(lobbyId: string, shooterId: number): Promise<number>;
export declare function getGameSession(lobbyId: string): Promise<{
    id: number;
    shooterId: number;
    phase: 'come_out' | 'point';
    pointValue: number | null;
    status: string;
} | null>;
export declare function endGameSession(sessionId: number): Promise<void>;
//# sourceMappingURL=game.d.ts.map