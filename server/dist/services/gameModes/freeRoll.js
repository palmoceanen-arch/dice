/**
 * Free Roll Mode
 * Simple mode where players take turns rolling dice.
 * No scoring, no winners - just practice/fun.
 */
export const FreeRollMode = {
    name: 'free_roll',
    minPlayers: 1,
    maxPlayers: 6,
    diceCount: 2,
    initialize(lobbyId, playerOrder) {
        return {
            lobbyId,
            gameMode: 'free_roll',
            playerOrder,
            currentTurn: playerOrder[0],
            turnIndex: 0,
            throwSeed: Math.floor(Math.random() * 0xFFFFFFFF),
            modeState: {},
        };
    },
    processRoll(state, playerId, dice1, dice2) {
        const total = dice1 + dice2;
        // Move to next player
        const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
        const nextTurn = state.playerOrder[nextIndex];
        // Update state
        state.turnIndex = nextIndex;
        state.currentTurn = nextTurn;
        return {
            outcome: 'roll',
            message: `Rolled ${dice1} + ${dice2} = ${total}`,
            nextTurn,
            gameOver: false,
            data: { dice1, dice2, total },
        };
    },
    isGameOver(_state) {
        return false; // Free roll never ends automatically
    },
    getWinners(_state) {
        return []; // No winners in free roll
    },
};
//# sourceMappingURL=freeRoll.js.map