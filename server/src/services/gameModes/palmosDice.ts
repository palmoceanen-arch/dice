import type { GameModeHandler, GameState, RollResult } from './index.js';

interface PalmosDiceState {
  // Scores per player
  scores: Map<number, number>;
  // Current round state for each player
  currentRound: {
    playerId: number;
    rollsLeft: number; // 3, 2, 1, 0
    rollsUsed: number; // Track how many rolls have been used
    currentDice: number[]; // Current 5 dice values
    selectedForReroll: boolean[]; // Which dice are selected for reroll
  } | null;
  // Target score to win
  targetScore: number;
}

/**
 * Palmo's Dice Mode
 * 
 * Rules:
 * - Goal: First to reach 200 points wins
 * - Uses 5 dice (D6: 1-6)
 * - Each turn: roll 5 dice, then decide to take points or reroll
 * - Can reroll selected dice up to 3 times total per turn
 * - BUST: If 2+ ones appear in a reroll, lose 20 points (not below 0)
 * - Combinations award points (see evaluateHand)
 */

// Evaluate hand and return points
function evaluateHand(dice: number[]): { points: number; name: string } {
  if (dice.length !== 5) {
    throw new Error("Palmo's Dice requires exactly 5 dice");
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
  
  // Five of a Kind - 100 points
  if (countValues[0] === 5) {
    return {
      points: 100,
      name: `Пятёрка (${sorted[0]}s)`
    };
  }
  
  // Four of a Kind - 70 points
  if (countValues[0] === 4) {
    const fourValue = dieValues.find(v => counts.get(v) === 4)!;
    return {
      points: 70,
      name: `Каре (${fourValue}s)`
    };
  }
  
  // Large Straight (1-2-3-4-5 or 2-3-4-5-6) - 60 points
  const isLargeStraight = 
    (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3 && sorted[3] === 4 && sorted[4] === 5) ||
    (sorted[0] === 2 && sorted[1] === 3 && sorted[2] === 4 && sorted[3] === 5 && sorted[4] === 6);
  
  if (isLargeStraight) {
    return {
      points: 60,
      name: sorted[4] === 5 ? 'Большой стрит (1-5)' : 'Большой стрит (2-6)'
    };
  }
  
  // Full House (3 + 2) - 50 points
  if (countValues[0] === 3 && countValues[1] === 2) {
    const threeValue = dieValues.find(v => counts.get(v) === 3)!;
    const twoValue = dieValues.find(v => counts.get(v) === 2)!;
    return {
      points: 50,
      name: `Фулл-хаус (${threeValue}s и ${twoValue}s)`
    };
  }
  
  // Straight (4 in a row) - 40 points
  // Check all possible 4-in-a-row sequences
  const hasFourInRow = 
    (counts.has(1) && counts.has(2) && counts.has(3) && counts.has(4)) ||
    (counts.has(2) && counts.has(3) && counts.has(4) && counts.has(5)) ||
    (counts.has(3) && counts.has(4) && counts.has(5) && counts.has(6));
  
  if (hasFourInRow) {
    return {
      points: 40,
      name: 'Стрит (4 подряд)'
    };
  }
  
  // Three of a Kind - 30 points
  if (countValues[0] === 3) {
    const threeValue = dieValues.find(v => counts.get(v) === 3)!;
    return {
      points: 30,
      name: `Тройка (${threeValue}s)`
    };
  }
  
  // Two Pair - 20 points
  if (countValues[0] === 2 && countValues[1] === 2) {
    const pairs = dieValues.filter(v => counts.get(v) === 2).sort((a, b) => b - a);
    return {
      points: 20,
      name: `Две пары (${pairs[0]}s и ${pairs[1]}s)`
    };
  }
  
  // One Pair - 10 points
  if (countValues[0] === 2) {
    const pairValue = dieValues.find(v => counts.get(v) === 2)!;
    return {
      points: 10,
      name: `Пара (${pairValue}s)`
    };
  }
  
  // Nothing - 0 points
  return {
    points: 0,
    name: 'Ничего'
  };
}

// Check if reroll resulted in bust (2+ ones)
function checkBust(rerolledDice: number[]): boolean {
  const onesCount = rerolledDice.filter(d => d === 1).length;
  return onesCount >= 2;
}

function getNextPlayer(state: GameState): number {
  const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
  return state.playerOrder[nextIndex];
}

export const PalmosDiceMode: GameModeHandler = {
  name: 'poker_dice', // Keep same name for compatibility
  minPlayers: 2,
  maxPlayers: 6,
  diceCount: 5,
  
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
        currentRound: null,
        targetScore: 200,
      } as PalmosDiceState,
    };
  },
  
  // Legacy 2-dice signature (not used)
  processRoll(_state: GameState, _playerId: number, _dice1: number, _dice2: number): RollResult {
    throw new Error("Palmo's Dice requires processRollMulti with 5 dice");
  },
  
  // Process roll with 5 dice
  processRollMulti(state: GameState, playerId: number, diceValues: number[]): RollResult {
    if (diceValues.length !== 5) {
      throw new Error("Palmo's Dice requires exactly 5 dice");
    }
    
    const palmosState = state.modeState as PalmosDiceState;
    
    // First roll of the turn
    if (!palmosState.currentRound || palmosState.currentRound.playerId !== playerId) {
      palmosState.currentRound = {
        playerId,
        rollsLeft: 2, // 3 total rolls, this is the first
        rollsUsed: 1, // First roll used
        currentDice: diceValues,
        selectedForReroll: [false, false, false, false, false],
      };
      
      const hand = evaluateHand(diceValues);
      
      return {
        outcome: 'roll',
        message: `${hand.name} (${hand.points} очков). Взять или перебросить?`,
        nextTurn: playerId, // Same player continues
        gameOver: false,
        data: {
          dice: diceValues,
          hand: hand.name,
          points: hand.points,
          rollsLeft: 2,
          rollsUsed: 1,
          canReroll: true,
        },
      };
    }
    
    // Reroll - check for bust first
    const round = palmosState.currentRound;
    
    // Check if player has rolls left
    if (round.rollsLeft <= 0) {
      return {
        outcome: 'error',
        message: 'Нет бросков! Нужно взять очки.',
        nextTurn: playerId,
        gameOver: false,
        data: {},
      };
    }
    
    const rerolledIndices: number[] = [];
    const rerolledValues: number[] = [];
    
    // Identify which dice were rerolled (changed values)
    for (let i = 0; i < 5; i++) {
      if (diceValues[i] !== round.currentDice[i]) {
        rerolledIndices.push(i);
        rerolledValues.push(diceValues[i]);
      }
    }
    
    // Check for bust (2+ ones in ALL dice on table after reroll, not just rerolled ones)
    const onesCount = diceValues.filter(d => d === 1).length;
    
    if (onesCount >= 2) {
      // BUST! Lose 20 points
      const currentScore = palmosState.scores.get(playerId) || 0;
      const newScore = Math.max(0, currentScore - 20);
      palmosState.scores.set(playerId, newScore);
      
      // End turn, move to next player
      palmosState.currentRound = null;
      const nextPlayer = getNextPlayer(state);
      state.currentTurn = nextPlayer;
      state.turnIndex = state.playerOrder.indexOf(nextPlayer);
      
      return {
        outcome: 'result', // Use 'result' instead of 'bust' for proper turn handling
        message: `СГОРАНИЕ! ${onesCount} единиц на столе. -20 очков. Счёт: ${newScore}`,
        nextTurn: nextPlayer,
        gameOver: false,
        data: {
          dice: diceValues,
          bust: true, // Flag to show it was a bust
          onesCount,
          penalty: -20,
          newScore,
          scores: Object.fromEntries(palmosState.scores), // Include all scores
        },
      };
    }
    
    // No bust - update current dice and decrease rolls left
    round.currentDice = diceValues;
    round.rollsLeft--;
    round.rollsUsed++;
    
    const hand = evaluateHand(diceValues);
    const canReroll = round.rollsLeft > 0;
    
    // If this was the 3rd roll (no rolls left), automatically take the points
    if (!canReroll) {
      const currentScore = palmosState.scores.get(playerId) || 0;
      const newScore = currentScore + hand.points;
      palmosState.scores.set(playerId, newScore);
      
      // Check if game is over
      const gameOver = newScore >= palmosState.targetScore;
      
      // End turn, move to next player
      palmosState.currentRound = null;
      const nextPlayer = getNextPlayer(state);
      state.currentTurn = nextPlayer;
      state.turnIndex = state.playerOrder.indexOf(nextPlayer);
      
      return {
        outcome: 'result',
        message: `${hand.name}. +${hand.points} очков. Счёт: ${newScore}`,
        nextTurn: nextPlayer,
        gameOver,
        data: {
          dice: diceValues,
          hand: hand.name,
          points: hand.points,
          newScore,
          scores: Object.fromEntries(palmosState.scores),
          autoTake: true, // Flag to indicate automatic take after 3rd roll
        },
      };
    }
    
    // Still have rolls left - player can choose
    return {
      outcome: 'roll',
      message: `${hand.name} (${hand.points} очков). Взять или перебросить?`,
      nextTurn: playerId, // Same player continues
      gameOver: false,
      data: {
        dice: diceValues,
        hand: hand.name,
        points: hand.points,
        rollsLeft: round.rollsLeft,
        rollsUsed: round.rollsUsed,
        canReroll,
      },
    };
  },
  
  isGameOver(state: GameState): boolean {
    const palmosState = state.modeState as PalmosDiceState;
    
    // Check if any player reached target score
    for (const score of palmosState.scores.values()) {
      if (score >= palmosState.targetScore) {
        return true;
      }
    }
    
    return false;
  },
  
  getWinners(state: GameState): number[] {
    const palmosState = state.modeState as PalmosDiceState;
    
    // Find player(s) with highest score
    let maxScore = -1;
    const winners: number[] = [];
    
    for (const [playerId, score] of palmosState.scores.entries()) {
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
