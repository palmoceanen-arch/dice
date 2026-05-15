export { FreeRollMode } from './freeRoll.js';
export { StreetCrapsMode } from './streetCraps.js';
export { MexicoMode } from './mexico.js';
export { GreedyPigMode, handleStop as handleGreedyPigStop, getTurnScore as getGreedyPigTurnScore } from './greedyPig.js';
export { PalmosDiceMode } from './palmosDice.js';
export interface GameModeHandler {
    name: string;
    minPlayers: number;
    maxPlayers: number;
    diceCount: number;
    initialize(lobbyId: string, playerOrder: number[]): GameState;
    processRoll(state: GameState, playerId: number, dice1: number, dice2: number): RollResult;
    processRollMulti?(state: GameState, playerId: number, diceValues: number[]): RollResult;
    isGameOver(state: GameState): boolean;
    getWinners(state: GameState): number[];
}
export interface GameState {
    lobbyId: string;
    gameMode: string;
    playerOrder: number[];
    currentTurn: number;
    turnIndex: number;
    throwSeed: number;
    modeState: unknown;
}
export interface RollResult {
    outcome: string;
    message: string;
    nextTurn: number | null;
    playerEliminated?: number;
    gameOver: boolean;
    winners?: number[];
    data?: Record<string, unknown>;
}
export declare function registerGameMode(mode: GameModeHandler): void;
export declare function getGameMode(name: string): GameModeHandler | null;
export declare function getAllGameModes(): string[];
//# sourceMappingURL=index.d.ts.map