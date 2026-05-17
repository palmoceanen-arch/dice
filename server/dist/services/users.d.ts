import type { User, TelegramUser, YandexPlayer, Item } from '../types/index.js';
export declare function findOrCreateUser(telegramUser: TelegramUser, referralCode?: string | null): Promise<User>;
export declare function findOrCreateYandexUser(player: YandexPlayer): Promise<User>;
export declare function getUserByYandexId(yandexId: string): Promise<User | null>;
export declare function getUserById(id: number): Promise<User | null>;
export declare function getUserByTelegramId(telegramId: number): Promise<User | null>;
export declare function getUserByUsername(username: string): Promise<User | null>;
export declare function setNickname(userId: number, nickname: string): Promise<boolean>;
export declare function getUserInventory(userId: number): Promise<Item[]>;
export declare function getShopItems(): Promise<Item[]>;
export declare function equipItem(userId: number, itemId: number, slot: 'dice' | 'table' | 'effect'): Promise<boolean>;
export declare function updateLastOnline(userId: number): Promise<void>;
/**
 * Update user's pips (points earned from dice rolls)
 * Uses optimistic update - doesn't wait for DB response
 */
export declare function updatePips(userId: number, pipsToAdd: number): Promise<void>;
/**
 * Get user's current pips count
 */
export declare function getUserPips(userId: number): Promise<number>;
//# sourceMappingURL=users.d.ts.map