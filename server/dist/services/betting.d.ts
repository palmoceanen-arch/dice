export interface BettingState {
    bets: Map<number, number>;
    bettingPhase: 'waiting' | 'active' | 'resolved';
    pot: number;
    minBet: number;
    confirmedPlayers: Set<number>;
}
export interface BetInfo {
    userId: number;
    nickname?: string;
    amount: number;
    confirmed: boolean;
}
export declare class BettingManager {
    /**
     * Инициализация системы ставок для лобби
     */
    static initialize(lobbyId: string, minBet?: number): BettingState;
    /**
     * Проверка активности ставок в лобби
     */
    static isActive(lobbyId: string): boolean;
    /**
     * Получение состояния ставок
     */
    static getState(lobbyId: string): BettingState | undefined;
    /**
     * Проверка rate limit
     */
    private static checkRateLimit;
    /**
     * Валидация ставки
     */
    static validateBet(userId: number, amount: number, lobbyId: string): Promise<{
        valid: boolean;
        error?: string;
    }>;
    /**
     * Размещение ставки (без подтверждения)
     */
    static placeBet(userId: number, amount: number, lobbyId: string): Promise<{
        success: boolean;
        error?: string;
        newBalance?: number;
    }>;
    /**
     * Подтверждение ставки (списание с баланса)
     */
    static confirmBet(userId: number, lobbyId: string): Promise<{
        success: boolean;
        error?: string;
        newBalance?: number;
    }>;
    /**
     * Отмена ставки (до подтверждения)
     */
    static cancelBet(userId: number, lobbyId: string): boolean;
    /**
     * Активация ставок (игра началась)
     */
    static activateBets(lobbyId: string): Promise<boolean>;
    /**
     * Разрешение ставок (распределение выигрышей)
     */
    static resolve(lobbyId: string, winners: number[]): Promise<{
        success: boolean;
        payouts?: Map<number, number>;
    }>;
    /**
     * Возврат ставки при отключении игрока
     */
    static refundBet(userId: number, lobbyId: string): Promise<boolean>;
    /**
     * Получение информации о ставках в лобби
     */
    static getBetsInfo(lobbyId: string): BetInfo[];
    /**
     * Очистка состояния лобби
     */
    static cleanup(lobbyId: string): void;
    /**
     * Проверка готовности всех игроков
     */
    static areAllPlayersReady(lobbyId: string, playerIds: number[]): boolean;
}
//# sourceMappingURL=betting.d.ts.map