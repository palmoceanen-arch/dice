import type { GameModeHandler, GameState, RollResult } from './index.js';

interface StreetCrapsState {
  phase: 'come_out' | 'point';
  pointValue: number | null;
}

/**
 * Street Craps Mode
 * Classic street dice rules.
 * 
 * Come Out Roll:
 * - 7 or 11 = Natural (shooter wins, keeps rolling)
 * - 2, 3, or 12 = Craps (shooter loses bet, keeps rolling)
 * - 4, 5, 6, 8, 9, 10 = Point is set
 * 
 * Point Phase:
 * - Roll the point = Shooter wins, new come out
 * - Roll 7 = Seven out, dice pass to next player
 * - Any other = Keep rolling
 */
export const StreetCrapsMode: GameModeHandler = {
  name: 'street_craps',
  minPlayers: 2,
  maxPlayers: 6,
  diceCount: 2,
  
  initialize(lobbyId: string, playerOrder: number[]): GameState {
    return {
      lobbyId,
      gameMode: 'street_craps',
      playerOrder,
      currentTurn: playerOrder[0],
      turnIndex: 0,
      throwSeed: Math.floor(Math.random() * 0xFFFFFFFF),
      modeState: {
        phase: 'come_out',
        pointValue: null,
      } as StreetCrapsState,
    };
  },
  
  processRoll(state: GameState, _playerId: number, dice1: number, dice2: number): RollResult {
    const total = dice1 + dice2;
    const crapsState = state.modeState as StreetCrapsState;
    
    if (crapsState.phase === 'come_out') {
      // Come Out Roll
      if (total === 7 || total === 11) {
        // Natural - shooter wins, keeps shooting
        return {
          outcome: 'natural',
          message: total === 7 ? 'Natural 7! Shooter wins!' : 'Yo-leven! Shooter wins!',
          nextTurn: null, // Same player continues
          gameOver: false,
          data: {
            phase: 'come_out',
            pointValue: null,
            shooterWins: true,
          },
        };
      } else if (total === 2 || total === 3 || total === 12) {
        // Craps - shooter loses and passes dice
        const names: Record<number, string> = { 2: 'Snake Eyes', 3: 'Ace Deuce', 12: 'Boxcars' };
        
        crapsState.phase = 'come_out';
        crapsState.pointValue = null;
        
        // Move to next player
        const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
        const nextTurn = state.playerOrder[nextIndex];
        state.turnIndex = nextIndex;
        state.currentTurn = nextTurn;
        
        return {
          outcome: 'craps',
          message: `${names[total]}! Craps! Pass the dice!`,
          nextTurn,
          gameOver: false,
          data: {
            phase: 'come_out',
            pointValue: null,
            shooterWins: false,
          },
        };
      } else {
        // Point is set
        crapsState.phase = 'point';
        crapsState.pointValue = total;
        return {
          outcome: 'point_set',
          message: `Point is ${total}!`,
          nextTurn: null, // Same player continues
          gameOver: false,
          data: {
            phase: 'point',
            pointValue: total,
            shooterWins: null,
          },
        };
      }
    } else {
      // Point Phase
      if (total === crapsState.pointValue) {
        // Point hit - shooter wins, new come out roll
        crapsState.phase = 'come_out';
        crapsState.pointValue = null;
        return {
          outcome: 'point_hit',
          message: `${total}! Point hit! Shooter wins!`,
          nextTurn: null, // Same player continues
          gameOver: false,
          data: {
            phase: 'come_out',
            pointValue: null,
            shooterWins: true,
          },
        };
      } else if (total === 7) {
        // Seven out - shooter loses and passes dice
        crapsState.phase = 'come_out';
        crapsState.pointValue = null;
        
        // Move to next player
        const nextIndex = (state.turnIndex + 1) % state.playerOrder.length;
        const nextTurn = state.playerOrder[nextIndex];
        state.turnIndex = nextIndex;
        state.currentTurn = nextTurn;
        
        return {
          outcome: 'seven_out',
          message: 'Seven out! Pass the dice!',
          nextTurn,
          gameOver: false,
          data: {
            phase: 'come_out',
            pointValue: null,
            shooterWins: false,
          },
        };
      } else {
        // Continue rolling
        return {
          outcome: 'continue',
          message: `${total}. Roll again for ${crapsState.pointValue}!`,
          nextTurn: null, // Same player continues
          gameOver: false,
          data: {
            phase: 'point',
            pointValue: crapsState.pointValue,
            shooterWins: null,
          },
        };
      }
    }
  },
  
  isGameOver(_state: GameState): boolean {
    return false; // Street craps continues until players leave
  },
  
  getWinners(_state: GameState): number[] {
    return []; // No overall winner in street craps
  },
};
