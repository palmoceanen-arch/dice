// Game modes registry
export { FreeRollMode } from './freeRoll.js';
export { StreetCrapsMode } from './streetCraps.js';
export { MexicoMode } from './mexico.js';
export { GreedyPigMode, handleStop as handleGreedyPigStop, getTurnScore as getGreedyPigTurnScore } from './greedyPig.js';
export { PalmosDiceMode } from './palmosDice.js';
// Registry of game modes
const gameModes = {};
export function registerGameMode(mode) {
    gameModes[mode.name] = mode;
}
export function getGameMode(name) {
    return gameModes[name] || null;
}
export function getAllGameModes() {
    return Object.keys(gameModes);
}
//# sourceMappingURL=index.js.map