import type { GameModeHandler, GameState, RollResult } from './index.js';

interface GreedyPigState {
  // Total scores per player
  scores: Map<number, number>;
  // Current turn score (accumulated this turn)
  turnScore: number;
  // Target score to win
  targetScore: number;
}

/**
 * Greedy Pig Mode
 * 
 * Rules:
 * - Goal: First to reach 100 points wins
 * - Your Turn: Roll 2 dice as many times as you want
 *   - Sum of each roll adds to your turn score
 * - Risks:
 *   - One 1: Turn score is lost, turn passes to opponent
 *   - Two 1s (1-1): Turn score lost + total score resets to 0!
 * - Stop: You can stop anytime and add turn score to total
 * - Victory: First to reach 100+ points wins
 */
export const GreedyPigMode: GameModeHandler = {
  name: 'greedy_pig',
  minPlayers: 2,
  maxPlayers: 6,
  diceCount: 2,
  
  initialize(lobbyId: string, playerOrder: number[]): GameState {
    const scores = new Map<number, number>();
    playerOrder.forEach(id => scores.set(id, 0));
    
    return {
      lobbyId,
      gameMode: 'greedy_pig',
      playerOrder,
      currentTurn: playerOrder[0],
      turnIndex: 0,
      throwSeed: Math.floor(Math.random() * 0xFFFFFFFF),
      modeState: {
        scores,
        turnScore: 0,
        targetScore: 100,
      } as GreedyPigState,
    };
  },
  
  processRoll(state: GameState, playerId: number, dice1: number, dice2: number): RollResult {
    const pigState = state.modeState as GreedyPigState;
    const total = dice1 + dice2;
    
    // Check for 1s
    const hasOne = dice1 === 1 || dice2 === 1;
    const hasDoubleOnes = dice1 === 1 && dice2 === 1;
    
    if (hasDoubleOnes) {
      // Double 1s - lose turn score AND reset total score to 0
      const lostTurnScore = pigState.turnScore;
      const lostTotalScore = pigState.scores.get(playerId) || 0;
      
      pigState.turnScore = 0;
      pigState.scores.set(playerId, 0);
      
      // Move to next player
      const nextPlayer = getNextPlayer(state);
      state.currentTurn = nextPlayer;
      state.turnIndex = state.playerOrder.indexOf(nextPlayer);
      
      return {
        outcome: 'double_ones',
        message: `Snake Eyes! 🐍 Lost ${lostTurnScore} turn points AND ${lostTotalScore} total points reset to 0!`,
        nextTurn: nextPlayer,
        gameOver: false,
        data: {
          dice1,
          dice2,
          total,
          lostTurnScore,
          lostTotalScore,
          turnScore: 0,
          scores: Object.fromEntries(pigState.scores),
        },
      };
    } else if (hasOne) {
      // Single 1 - lose turn score only
      const lostTurnScore = pigState.turnScore;
      pigState.turnScore = 0;
      
      // Move to next player
      const nextPlayer = getNextPlayer(state);
      state.currentTurn = nextPlayer;
      state.turnIndex = state.playerOrder.indexOf(nextPlayer);
      
      return {
        outcome: 'pig_out',
        message: `Pig Out! 🐷 Lost ${lostTurnScore} turn points!`,
        nextTurn: nextPlayer,
        gameOver: false,
        data: {
          dice1,
          dice2,
          total,
          lostTurnScore,
          turnScore: 0,
          scores: Object.fromEntries(pigState.scores),
        },
      };
    } else {
      // No 1s - add to turn score
      pigState.turnScore += total;
      const currentTotal = pigState.scores.get(playerId) || 0;
      const potentialTotal = currentTotal + pigState.turnScore;
      
      return {
        outcome: 'roll',
        message: `+${total}`,
        nextTurn: null, // Same player continues
        gameOver: false,
        data: {
          dice1,
          dice2,
          total,
          turnScore: pigState.turnScore,
          currentTotal,
          potentialTotal,
          scores: Object.fromEntries(pigState.scores),
        },
      };
    }
  },
  
  isGameOver(state: GameState): boolean {
    const pigState = state.modeState as GreedyPigState;
    for (const score of pigState.scores.values()) {
      if (score >= pigState.targetScore) {
        return true;
      }
    }
    return false;
  },
  
  getWinners(state: GameState): number[] {
    const pigState = state.modeState as GreedyPigState;
    const winners: number[] = [];
    let maxScore = 0;
    
    for (const [playerId, score] of pigState.scores.entries()) {
      if (score >= pigState.targetScore) {
        if (score > maxScore) {
          maxScore = score;
          winners.length = 0;
          winners.push(playerId);
        } else if (score === maxScore) {
          winners.push(playerId);
        }
      }
    }
    
    return winners;
  },
};

/**
 * Handle player stopping (banking their turn score)
 */
export function handleStop(state: GameState): RollResult {
  const pigState = state.modeState as GreedyPigState;
  const playerId = state.currentTurn;
  
  // Add turn score to total
  const currentTotal = pigState.scores.get(playerId) || 0;
  const bankedScore = pigState.turnScore;
  const newTotal = currentTotal + bankedScore;
  
  pigState.scores.set(playerId, newTotal);
  pigState.turnScore = 0;
  
  // Check for win
  const gameOver = newTotal >= pigState.targetScore;
  
  if (gameOver) {
    return {
      outcome: 'game_over',
      message: `🏆 Banked ${bankedScore} points! Total: ${newTotal} - Winner!`,
      nextTurn: null,
      gameOver: true,
      winners: [playerId],
      data: {
        bankedScore,
        newTotal,
        scores: Object.fromEntries(pigState.scores),
      },
    };
  }
  
  // Move to next player
  const nextPlayer = getNextPlayer(state);
  state.currentTurn = nextPlayer;
  state.turnIndex = state.playerOrder.indexOf(nextPlayer);
  
  return {
    outcome: 'stop',
    message: `Banked ${bankedScore} points! Total: ${newTotal}`,
    nextTurn: nextPlayer,
    gameOver: false,
    data: {
      bankedScore,
      newTotal,
      scores: Object.fromEntries(pigState.scores),
    },
  };
}

/**
 * Get current turn score
 */
export function getTurnScore(state: GameState): number {
  const pigState = state.modeState as GreedyPigState;
  return pigState.turnScore;
}

/**
 * Get next player in order
 */
function getNextPlayer(state: GameState): number {
  const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
  return state.playerOrder[nextIndex];
}
