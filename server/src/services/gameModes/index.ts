// Game modes registry
export { FreeRollMode } from './freeRoll.js';
export { StreetCrapsMode } from './streetCraps.js';
export { MexicoMode } from './mexico.js';
export { GreedyPigMode, handleStop as handleGreedyPigStop, getTurnScore as getGreedyPigTurnScore } from './greedyPig.js';
export { PalmosDiceMode } from './palmosDice.js';

// Base interface for all game modes
export interface GameModeHandler {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  diceCount: number; // Number of dice used in this mode (2 for classic games, 5 for poker dice)
  
  // Initialize game state
  initialize(lobbyId: string, playerOrder: number[]): GameState;
  
  // Process a dice roll and return result (legacy 2-dice signature)
  processRoll(state: GameState, playerId: number, dice1: number, dice2: number): RollResult;
  
  // Process a dice roll with variable number of dice
  processRollMulti?(state: GameState, playerId: number, diceValues: number[]): RollResult;
  
  // Check if game is over
  isGameOver(state: GameState): boolean;
  
  // Get winner(s) if game is over
  getWinners(state: GameState): number[];
}

export interface GameState {
  lobbyId: string;
  gameMode: string;
  playerOrder: number[];
  currentTurn: number;
  turnIndex: number;
  // Anti-cheat: random seed for throw randomization
  throwSeed: number;
  // Mode-specific state
  modeState: unknown;
}

export interface RollResult {
  outcome: string;
  message: string;
  nextTurn: number | null; // null = same player continues
  playerEliminated?: number;
  gameOver: boolean;
  winners?: number[];
  // Additional data for UI
  data?: Record<string, unknown>;
}

// Registry of game modes
const gameModes: Record<string, GameModeHandler> = {};

export function registerGameMode(mode: GameModeHandler): void {
  gameModes[mode.name] = mode;
}

export function getGameMode(name: string): GameModeHandler | null {
  return gameModes[name] || null;
}

export function getAllGameModes(): string[] {
  return Object.keys(gameModes);
}
