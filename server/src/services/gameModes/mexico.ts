import type { GameModeHandler, GameState, RollResult } from './index.js';

interface MexicoState {
  // Penalty points per player (5 = eliminated)
  penalties: Map<number, number>;
  // Current round results: playerId -> score
  roundResults: Map<number, number>;
  // Players who have rolled this round
  rolledThisRound: Set<number>;
  // Eliminated players
  eliminated: Set<number>;
  // Max penalties before elimination
  maxPenalties: number;
}

/**
 * Mexico Mode
 * 
 * Rules:
 * - Each player rolls 2 dice once per round
 * - Score = higher die as tens + lower die as ones (e.g., 6+4 = 64)
 * - Special combinations (strongest to weakest):
 *   1. MEXICO (2-1) = strongest!
 *   2. Doubles: 66 > 55 > 44 > 33 > 22 > 11
 *   3. Regular: 65 > 64 > 63 > 62 > 61 > 54 > 53... > 32 > 31
 * - Player with lowest score gets a penalty point
 * - 5 penalty points = eliminated
 * - Last player standing wins
 */
export const MexicoMode: GameModeHandler = {
  name: 'mexico',
  minPlayers: 2,
  maxPlayers: 6,
  diceCount: 2,
  
  initialize(lobbyId: string, playerOrder: number[]): GameState {
    const penalties = new Map<number, number>();
    playerOrder.forEach(id => penalties.set(id, 0));
    
    return {
      lobbyId,
      gameMode: 'mexico',
      playerOrder,
      currentTurn: playerOrder[0],
      turnIndex: 0,
      throwSeed: Math.floor(Math.random() * 0xFFFFFFFF),
      modeState: {
        penalties,
        roundResults: new Map<number, number>(),
        rolledThisRound: new Set<number>(),
        eliminated: new Set<number>(),
        maxPenalties: 5,
      } as MexicoState,
    };
  },
  
  processRoll(state: GameState, playerId: number, dice1: number, dice2: number): RollResult {
    const mexicoState = state.modeState as MexicoState;
    
    // Calculate score
    const score = calculateMexicoScore(dice1, dice2);
    const scoreName = getMexicoScoreName(dice1, dice2);
    
    // Record result
    mexicoState.roundResults.set(playerId, score);
    mexicoState.rolledThisRound.add(playerId);
    
    // Get active players (not eliminated)
    const activePlayers = state.playerOrder.filter(id => !mexicoState.eliminated.has(id));
    
    // Check if all active players have rolled
    const allRolled = activePlayers.every(id => mexicoState.rolledThisRound.has(id));
    
    if (allRolled) {
      // End of round - find loser(s)
      return endRound(state, mexicoState, activePlayers, dice1, dice2, scoreName);
    } else {
      // Move to next player who hasn't rolled
      const nextPlayer = findNextPlayer(state, mexicoState, activePlayers);
      state.currentTurn = nextPlayer;
      state.turnIndex = state.playerOrder.indexOf(nextPlayer);
      
      return {
        outcome: 'roll',
        message: `${scoreName}`,
        nextTurn: nextPlayer,
        gameOver: false,
        data: {
          dice1,
          dice2,
          score,
          scoreName,
          penalties: Object.fromEntries(mexicoState.penalties),
          roundResults: Object.fromEntries(mexicoState.roundResults),
        },
      };
    }
  },
  
  isGameOver(state: GameState): boolean {
    const mexicoState = state.modeState as MexicoState;
    const activePlayers = state.playerOrder.filter(id => !mexicoState.eliminated.has(id));
    return activePlayers.length <= 1;
  },
  
  getWinners(state: GameState): number[] {
    const mexicoState = state.modeState as MexicoState;
    return state.playerOrder.filter(id => !mexicoState.eliminated.has(id));
  },
};

/**
 * Calculate Mexico score from dice
 * Higher = better
 * Mexico (2-1) = 1000
 * Doubles = 100 + value (66=166, 11=111)
 * Regular = tens + ones (65=65, 31=31)
 */
function calculateMexicoScore(dice1: number, dice2: number): number {
  const high = Math.max(dice1, dice2);
  const low = Math.min(dice1, dice2);
  
  // Mexico (2-1) is the strongest
  if (high === 2 && low === 1) {
    return 1000;
  }
  
  // Doubles are stronger than regular numbers
  if (dice1 === dice2) {
    return 100 + dice1; // 66=166, 55=155, ..., 11=111
  }
  
  // Regular: higher die as tens, lower as ones
  return high * 10 + low;
}

/**
 * Get human-readable name for the score
 */
function getMexicoScoreName(dice1: number, dice2: number): string {
  const high = Math.max(dice1, dice2);
  const low = Math.min(dice1, dice2);
  
  if (high === 2 && low === 1) {
    return 'MEXICO! 🇲🇽';
  }
  
  if (dice1 === dice2) {
    return `Double ${dice1}s!`;
  }
  
  return `${high}${low}`;
}

/**
 * Find next player who hasn't rolled this round
 */
function findNextPlayer(state: GameState, mexicoState: MexicoState, activePlayers: number[]): number {
  let idx = state.turnIndex;
  for (let i = 0; i < state.playerOrder.length; i++) {
    idx = (idx + 1) % state.playerOrder.length;
    const playerId = state.playerOrder[idx];
    if (activePlayers.includes(playerId) && !mexicoState.rolledThisRound.has(playerId)) {
      return playerId;
    }
  }
  return activePlayers[0]; // Fallback
}

/**
 * End the round, assign penalty, check for elimination
 */
function endRound(
  state: GameState,
  mexicoState: MexicoState,
  activePlayers: number[],
  dice1: number,
  dice2: number,
  scoreName: string
): RollResult {
  // Find lowest score(s)
  let lowestScore = Infinity;
  const losers: number[] = [];
  
  for (const playerId of activePlayers) {
    const score = mexicoState.roundResults.get(playerId) || 0;
    if (score < lowestScore) {
      lowestScore = score;
      losers.length = 0;
      losers.push(playerId);
    } else if (score === lowestScore) {
      losers.push(playerId);
    }
  }
  
  // Assign penalties to losers
  const eliminated: number[] = [];
  for (const loserId of losers) {
    const currentPenalties = (mexicoState.penalties.get(loserId) || 0) + 1;
    mexicoState.penalties.set(loserId, currentPenalties);
    
    if (currentPenalties >= mexicoState.maxPenalties) {
      mexicoState.eliminated.add(loserId);
      eliminated.push(loserId);
    }
  }
  
  // Clear round data for next round
  mexicoState.roundResults.clear();
  mexicoState.rolledThisRound.clear();
  
  // Check if game is over
  const remainingPlayers = state.playerOrder.filter(id => !mexicoState.eliminated.has(id));
  const gameOver = remainingPlayers.length <= 1;
  
  // Find next player for new round
  let nextPlayer: number | null = null;
  if (!gameOver) {
    // Start new round with first remaining player
    nextPlayer = remainingPlayers[0];
    state.currentTurn = nextPlayer;
    state.turnIndex = state.playerOrder.indexOf(nextPlayer);
  }
  
  // Build message
  let message = `${scoreName}\n`;
  if (losers.length === 1) {
    message += `Lowest roll! +1 penalty`;
  } else {
    message += `Tied for lowest! All get +1 penalty`;
  }
  
  if (eliminated.length > 0) {
    message += `\nEliminated!`;
  }
  
  if (gameOver && remainingPlayers.length === 1) {
    message = `🏆 Winner!`;
  }
  
  return {
    outcome: gameOver ? 'game_over' : 'round_end',
    message,
    nextTurn: nextPlayer,
    playerEliminated: eliminated[0],
    gameOver,
    winners: gameOver ? remainingPlayers : undefined,
    data: {
      dice1,
      dice2,
      score: calculateMexicoScore(dice1, dice2),
      scoreName,
      losers,
      eliminated,
      penalties: Object.fromEntries(mexicoState.penalties),
      remainingPlayers,
    },
  };
}
