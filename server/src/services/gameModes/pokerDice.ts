import type { GameModeHandler, GameState, RollResult } from './index.js';

interface PokerDiceState {
  // Scores per player (best hand value)
  scores: Map<number, number>;
  // Current round results: playerId -> { dice: number[], handRank: number, handName: string }
  roundResults: Map<number, { dice: number[], handRank: number, handName: string }>;
  // Players who have rolled this round
  rolledThisRound: Set<number>;
  // Number of rounds played
  roundsPlayed: number;
  // Total rounds to play
  totalRounds: number;
}

/**
 * Poker Dice Mode
 * 
 * Rules:
 * - Uses 5 dice (standard six-sided dice)
 * - Each player rolls once per round
 * - Best poker hand wins the round
 * - Play 5 rounds, player with most round wins is the winner
 * 
 * Hand Rankings (highest to lowest):
 * 1. Five of a Kind (e.g., 6-6-6-6-6) = 10000 + die value
 * 2. Four of a Kind (e.g., 5-5-5-5-2) = 9000 + die value
 * 3. Full House (3 of one + 2 of another, e.g., 4-4-4-3-3) = 8000 + higher value
 * 4. Straight (1-2-3-4-5 or 2-3-4-5-6) = 7000 + highest die
 * 5. Three of a Kind (e.g., 3-3-3-6-2) = 6000 + die value
 * 6. Two Pair (e.g., 5-5-3-3-1) = 5000 + higher pair value
 * 7. One Pair (e.g., 4-4-6-3-1) = 4000 + pair value
 * 8. High Card (no matches) = highest die value
 */

// Evaluate poker hand from 5 dice
function evaluatePokerHand(dice: number[]): { rank: number; name: string } {
  if (dice.length !== 5) {
    throw new Error('Poker dice requires exactly 5 dice');
  }
  
  // Sort dice for easier analysis
  const sorted = [...dice].sort((a, b) => a - b);
  
  // Count occurrences of each die value
  const counts = new Map<number, number>();
  for (const die of sorted) {
    counts.set(die, (counts.get(die) || 0) + 1);
  }
  
  const countValues = Array.from(counts.values()).sort((a, b) => b - a);
  const dieValues = Array.from(counts.keys()).sort((a, b) => b - a);
  
  // Five of a Kind
  if (countValues[0] === 5) {
    return {
      rank: 10000 + sorted[0],
      name: `Five ${sorted[0]}s`
    };
  }
  
  // Four of a Kind
  if (countValues[0] === 4) {
    const fourValue = dieValues.find(v => counts.get(v) === 4)!;
    return {
      rank: 9000 + fourValue,
      name: `Four ${fourValue}s`
    };
  }
  
  // Full House (3 + 2)
  if (countValues[0] === 3 && countValues[1] === 2) {
    const threeValue = dieValues.find(v => counts.get(v) === 3)!;
    const twoValue = dieValues.find(v => counts.get(v) === 2)!;
    return {
      rank: 8000 + threeValue * 10 + twoValue,
      name: `Full House (${threeValue}s over ${twoValue}s)`
    };
  }
  
  // Straight (1-2-3-4-5 or 2-3-4-5-6)
  const isStraight = 
    (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3 && sorted[3] === 4 && sorted[4] === 5) ||
    (sorted[0] === 2 && sorted[1] === 3 && sorted[2] === 4 && sorted[3] === 5 && sorted[4] === 6);
  
  if (isStraight) {
    return {
      rank: 7000 + sorted[4],
      name: sorted[4] === 5 ? 'Straight (1-2-3-4-5)' : 'Straight (2-3-4-5-6)'
    };
  }
  
  // Three of a Kind
  if (countValues[0] === 3) {
    const threeValue = dieValues.find(v => counts.get(v) === 3)!;
    return {
      rank: 6000 + threeValue,
      name: `Three ${threeValue}s`
    };
  }
  
  // Two Pair
  if (countValues[0] === 2 && countValues[1] === 2) {
    const pairs = dieValues.filter(v => counts.get(v) === 2).sort((a, b) => b - a);
    return {
      rank: 5000 + pairs[0] * 10 + pairs[1],
      name: `Two Pair (${pairs[0]}s and ${pairs[1]}s)`
    };
  }
  
  // One Pair
  if (countValues[0] === 2) {
    const pairValue = dieValues.find(v => counts.get(v) === 2)!;
    return {
      rank: 4000 + pairValue,
      name: `Pair of ${pairValue}s`
    };
  }
  
  // High Card
  const highCard = Math.max(...sorted);
  return {
    rank: highCard,
    name: `High Card (${highCard})`
  };
}

function getNextPlayer(state: GameState): number {
  const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
  return state.playerOrder[nextIndex];
}

export const PokerDiceMode: GameModeHandler = {
  name: 'poker_dice',
  minPlayers: 2,
  maxPlayers: 6,
  diceCount: 5, // Uses 5 dice instead of 2
  
  initialize(lobbyId: string, playerOrder: number[]): GameState {
    const scores = new Map<number, number>();
    playerOrder.forEach(id => scores.set(id, 0));
    
    return {
      lobbyId,
      gameMode: 'poker_dice',
      playerOrder,
      currentTurn: playerOrder[0],
      turnIndex: 0,
      throwSeed: Math.floor(Math.random() * 0xFFFFFFFF),
      modeState: {
        scores,
        roundResults: new Map(),
        rolledThisRound: new Set(),
        roundsPlayed: 0,
        totalRounds: 5,
      } as PokerDiceState,
    };
  },
  
  // Legacy 2-dice signature (not used for poker dice)
  processRoll(_state: GameState, _playerId: number, _dice1: number, _dice2: number): RollResult {
    throw new Error('Poker Dice requires processRollMulti with 5 dice');
  },
  
  // Process roll with 5 dice
  processRollMulti(state: GameState, playerId: number, diceValues: number[]): RollResult {
    if (diceValues.length !== 5) {
      throw new Error('Poker Dice requires exactly 5 dice');
    }
    
    const pokerState = state.modeState as PokerDiceState;
    
    // Evaluate hand
    const hand = evaluatePokerHand(diceValues);
    
    // Record result
    pokerState.roundResults.set(playerId, {
      dice: diceValues,
      handRank: hand.rank,
      handName: hand.name
    });
    pokerState.rolledThisRound.add(playerId);
    
    // Check if all players have rolled
    const allRolled = state.playerOrder.every(id => pokerState.rolledThisRound.has(id));
    
    if (allRolled) {
      // End of round - find winner(s)
      return endRound(state, pokerState, diceValues, hand);
    } else {
      // Move to next player
      const nextPlayer = getNextPlayer(state);
      state.currentTurn = nextPlayer;
      state.turnIndex = state.playerOrder.indexOf(nextPlayer);
      
      return {
        outcome: 'roll',
        message: `${hand.name}! Next player's turn.`,
        nextTurn: nextPlayer,
        gameOver: false,
        data: {
          dice: diceValues,
          handRank: hand.rank,
          handName: hand.name,
        },
      };
    }
  },
  
  isGameOver(state: GameState): boolean {
    const pokerState = state.modeState as PokerDiceState;
    return pokerState.roundsPlayed >= pokerState.totalRounds;
  },
  
  getWinners(state: GameState): number[] {
    const pokerState = state.modeState as PokerDiceState;
    
    // Find player(s) with most round wins
    let maxScore = -1;
    const winners: number[] = [];
    
    for (const [playerId, score] of pokerState.scores.entries()) {
      if (score > maxScore) {
        maxScore = score;
        winners.length = 0;
        winners.push(playerId);
      } else if (score === maxScore) {
        winners.push(playerId);
      }
    }
    
    return winners;
  },
};

function endRound(
  state: GameState,
  pokerState: PokerDiceState,
  lastDice: number[],
  lastHand: { rank: number; name: string }
): RollResult {
  // Find best hand(s) this round
  let bestRank = -1;
  const roundWinners: number[] = [];
  
  for (const [playerId, result] of pokerState.roundResults.entries()) {
    if (result.handRank > bestRank) {
      bestRank = result.handRank;
      roundWinners.length = 0;
      roundWinners.push(playerId);
    } else if (result.handRank === bestRank) {
      roundWinners.push(playerId);
    }
  }
  
  // Award points to round winner(s)
  for (const winnerId of roundWinners) {
    const currentScore = pokerState.scores.get(winnerId) || 0;
    pokerState.scores.set(winnerId, currentScore + 1);
  }
  
  // Increment rounds played
  pokerState.roundsPlayed++;
  
  // Check if game is over
  const gameOver = pokerState.roundsPlayed >= pokerState.totalRounds;
  
  if (gameOver) {
    const winners = PokerDiceMode.getWinners(state);
    const winnerNames = roundWinners.map(id => {
      const result = pokerState.roundResults.get(id);
      return result ? result.handName : 'Unknown';
    }).join(', ');
    
    return {
      outcome: 'game_over',
      message: `Game Over! Round won by ${winnerNames}`,
      nextTurn: null,
      gameOver: true,
      winners,
      data: {
        dice: lastDice,
        handRank: lastHand.rank,
        handName: lastHand.name,
        roundWinners,
        finalScores: Object.fromEntries(pokerState.scores),
      },
    };
  } else {
    // Start new round
    pokerState.roundResults.clear();
    pokerState.rolledThisRound.clear();
    
    // First player starts next round
    const nextPlayer = state.playerOrder[0];
    state.currentTurn = nextPlayer;
    state.turnIndex = 0;
    
    const winnerNames = roundWinners.map(id => {
      const result = pokerState.roundResults.get(id);
      return result ? result.handName : 'Unknown';
    }).join(', ');
    
    return {
      outcome: 'round_end',
      message: `Round ${pokerState.roundsPlayed}/${pokerState.totalRounds} won by ${winnerNames}! Next round starting...`,
      nextTurn: nextPlayer,
      gameOver: false,
      data: {
        dice: lastDice,
        handRank: lastHand.rank,
        handName: lastHand.name,
        roundWinners,
        roundScores: Object.fromEntries(pokerState.scores),
        roundsPlayed: pokerState.roundsPlayed,
        totalRounds: pokerState.totalRounds,
      },
    };
  }
}
