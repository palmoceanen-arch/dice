import { pool, getClient } from '../db/client.js';
import { logger } from '../utils/logger.js';

export interface BettingState {
  // Ставки игроков
  bets: Map<number, number>;  // userId -> amount
  
  // Статус ставок
  bettingPhase: 'waiting' | 'active' | 'resolved';
  
  // Банк (сумма всех ставок)
  pot: number;
  
  // Минимальная ставка для игры
  minBet: number;
  
  // Игроки, подтвердившие ставку
  confirmedPlayers: Set<number>;
}

export interface BetInfo {
  userId: number;
  nickname?: string; // Optional, will be added by handlers
  amount: number;
  confirmed: boolean;
}

// Хранилище состояний ставок для каждого лобби
const lobbyBettingStates = new Map<string, BettingState>();

// Rate limiting для защиты от спама
const betRateLimiter = new Map<number, number>();

export class BettingManager {
  /**
   * Инициализация системы ставок для лобби
   */
  static initialize(lobbyId: string, minBet: number = 10): BettingState {
    const state: BettingState = {
      bets: new Map(),
      bettingPhase: 'waiting',
      pot: 0,
      minBet,
      confirmedPlayers: new Set(),
    };
    
    lobbyBettingStates.set(lobbyId, state);
    logger.info('Betting initialized', { lobbyId, minBet });
    
    return state;
  }

  /**
   * Проверка активности ставок в лобби
   */
  static isActive(lobbyId: string): boolean {
    return lobbyBettingStates.has(lobbyId);
  }

  /**
   * Получение состояния ставок
   */
  static getState(lobbyId: string): BettingState | undefined {
    return lobbyBettingStates.get(lobbyId);
  }

  /**
   * Проверка rate limit
   */
  private static checkRateLimit(userId: number): boolean {
    const lastBet = betRateLimiter.get(userId) || 0;
    const now = Date.now();
    
    if (now - lastBet < 1000) { // 1 ставка в секунду
      return false;
    }
    
    betRateLimiter.set(userId, now);
    return true;
  }

  /**
   * Валидация ставки
   */
  static async validateBet(
    userId: number,
    amount: number,
    lobbyId: string
  ): Promise<{ valid: boolean; error?: string }> {
    // Rate limit
    if (!this.checkRateLimit(userId)) {
      return { valid: false, error: 'Too many requests. Please wait.' };
    }

    // Проверка существования лобби
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) {
      return { valid: false, error: 'Betting not initialized for this lobby' };
    }

    // Проверка фазы
    if (state.bettingPhase !== 'waiting') {
      return { valid: false, error: 'Betting phase is over' };
    }

    // Проверка минимума
    if (amount < state.minBet) {
      return { valid: false, error: `Minimum bet is ${state.minBet} pips` };
    }

    // Проверка баланса
    try {
      const result = await pool.query(
        'SELECT pips FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return { valid: false, error: 'User not found' };
      }
      
      const balance = result.rows[0].pips;
      if (balance < amount) {
        return { valid: false, error: 'Insufficient balance' };
      }
    } catch (err) {
      logger.error('Error checking balance', err);
      return { valid: false, error: 'Database error' };
    }

    return { valid: true };
  }

  /**
   * Размещение ставки (без подтверждения)
   */
  static async placeBet(
    userId: number,
    amount: number,
    lobbyId: string
  ): Promise<{ success: boolean; error?: string; newBalance?: number }> {
    // Валидация
    const validation = await this.validateBet(userId, amount, lobbyId);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const state = lobbyBettingStates.get(lobbyId)!;
    
    // Обновляем ставку (можно менять до подтверждения)
    state.bets.set(userId, amount);
    
    logger.info('Bet placed', { userId, amount, lobbyId });
    
    // Получаем текущий баланс
    const result = await pool.query(
      'SELECT pips FROM users WHERE id = $1',
      [userId]
    );
    
    return { 
      success: true, 
      newBalance: result.rows[0].pips 
    };
  }

  /**
   * Подтверждение ставки (списание с баланса)
   */
  static async confirmBet(
    userId: number,
    lobbyId: string
  ): Promise<{ success: boolean; error?: string; newBalance?: number }> {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) {
      return { success: false, error: 'Betting not initialized' };
    }

    const amount = state.bets.get(userId);
    if (!amount) {
      return { success: false, error: 'No bet placed' };
    }

    if (state.confirmedPlayers.has(userId)) {
      return { success: false, error: 'Bet already confirmed' };
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Списание с баланса
      const result = await client.query(
        'UPDATE users SET pips = pips - $1 WHERE id = $2 AND pips >= $1 RETURNING pips',
        [amount, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Insufficient balance');
      }
      
      // Запись в БД
      await client.query(
        'INSERT INTO game_bets (lobby_id, user_id, amount, status) VALUES ($1, $2, $3, $4)',
        [lobbyId, userId, amount, 'pending']
      );
      
      await client.query('COMMIT');
      
      // Обновляем состояние
      state.confirmedPlayers.add(userId);
      state.pot += amount;
      
      logger.info('Bet confirmed', { userId, amount, lobbyId, pot: state.pot });
      
      return { 
        success: true, 
        newBalance: result.rows[0].pips 
      };
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error('Error confirming bet', err, { userId, lobbyId, amount });
      
      // Provide more specific error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm bet';
      return { success: false, error: errorMessage };
    } finally {
      client.release();
    }
  }

  /**
   * Отмена ставки (до подтверждения)
   */
  static cancelBet(userId: number, lobbyId: string): boolean {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) return false;

    if (state.confirmedPlayers.has(userId)) {
      return false; // Нельзя отменить подтвержденную ставку
    }

    state.bets.delete(userId);
    logger.info('Bet cancelled', { userId, lobbyId });
    
    return true;
  }

  /**
   * Активация ставок (игра началась)
   */
  static async activateBets(lobbyId: string): Promise<boolean> {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) return false;

    try {
      await pool.query(
        'UPDATE game_bets SET status = $1 WHERE lobby_id = $2 AND status = $3',
        ['active', lobbyId, 'pending']
      );
      
      state.bettingPhase = 'active';
      logger.info('Bets activated', { lobbyId, pot: state.pot });
      
      return true;
    } catch (err) {
      logger.error('Error activating bets', err);
      return false;
    }
  }

  /**
   * Разрешение ставок (распределение выигрышей)
   */
  static async resolve(
    lobbyId: string,
    winners: number[]
  ): Promise<{ success: boolean; payouts?: Map<number, number> }> {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) {
      return { success: false };
    }

    if (state.bettingPhase !== 'active') {
      logger.warn('Attempting to resolve non-active betting', { lobbyId });
      return { success: false };
    }

    const client = await getClient();
    const payouts = new Map<number, number>();
    
    try {
      await client.query('BEGIN');
      
      if (winners.length === 0) {
        // Ничья - возврат ставок
        for (const [userId, amount] of state.bets) {
          await client.query(
            'UPDATE users SET pips = pips + $1 WHERE id = $2',
            [amount, userId]
          );
          payouts.set(userId, amount);
        }
        
        await client.query(
          'UPDATE game_bets SET status = $1, resolved_at = NOW() WHERE lobby_id = $2 AND status = $3',
          ['returned', lobbyId, 'active']
        );
        
        logger.info('Bets returned (draw)', { lobbyId, pot: state.pot });
      } else {
        // Распределение банка между победителями
        const winnerShare = Math.floor(state.pot / winners.length);
        
        for (const winnerId of winners) {
          await client.query(
            'UPDATE users SET pips = pips + $1 WHERE id = $2',
            [winnerShare, winnerId]
          );
          payouts.set(winnerId, winnerShare);
          
          await client.query(
            'UPDATE game_bets SET status = $1, resolved_at = NOW() WHERE lobby_id = $2 AND user_id = $3 AND status = $4',
            ['won', lobbyId, winnerId, 'active']
          );
        }
        
        // Проигравшие
        const losers = Array.from(state.bets.keys()).filter(id => !winners.includes(id));
        for (const loserId of losers) {
          await client.query(
            'UPDATE game_bets SET status = $1, resolved_at = NOW() WHERE lobby_id = $2 AND user_id = $3 AND status = $4',
            ['lost', lobbyId, loserId, 'active']
          );
        }
        
        logger.info('Bets resolved', { 
          lobbyId, 
          pot: state.pot, 
          winners, 
          winnerShare 
        });
      }
      
      await client.query('COMMIT');
      
      state.bettingPhase = 'resolved';
      
      return { success: true, payouts };
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error('Error resolving bets', err);
      return { success: false };
    } finally {
      client.release();
    }
  }

  /**
   * Возврат ставки при отключении игрока
   */
  static async refundBet(userId: number, lobbyId: string): Promise<boolean> {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) return false;

    const amount = state.bets.get(userId);
    if (!amount || !state.confirmedPlayers.has(userId)) {
      return false;
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Возврат на баланс
      await client.query(
        'UPDATE users SET pips = pips + $1 WHERE id = $2',
        [amount, userId]
      );
      
      // Обновление статуса
      await client.query(
        'UPDATE game_bets SET status = $1, resolved_at = NOW() WHERE lobby_id = $2 AND user_id = $3 AND status = $4',
        ['returned', lobbyId, userId, 'pending']
      );
      
      await client.query('COMMIT');
      
      // Обновляем состояние
      state.bets.delete(userId);
      state.confirmedPlayers.delete(userId);
      state.pot -= amount;
      
      logger.info('Bet refunded', { userId, amount, lobbyId });
      
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error('Error refunding bet', err);
      return false;
    } finally {
      client.release();
    }
  }

  /**
   * Получение информации о ставках в лобби
   */
  static getBetsInfo(lobbyId: string): BetInfo[] {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) return [];

    return Array.from(state.bets.entries()).map(([userId, amount]) => ({
      userId,
      amount,
      confirmed: state.confirmedPlayers.has(userId),
    }));
  }

  /**
   * Очистка состояния лобби
   */
  static cleanup(lobbyId: string): void {
    lobbyBettingStates.delete(lobbyId);
    logger.info('Betting state cleaned up', { lobbyId });
  }

  /**
   * Проверка готовности всех игроков
   */
  static areAllPlayersReady(lobbyId: string, playerIds: number[]): boolean {
    const state = lobbyBettingStates.get(lobbyId);
    if (!state) return false;

    return playerIds.every(id => state.confirmedPlayers.has(id));
  }
}
