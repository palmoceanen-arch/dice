import type { WebSocket } from 'ws';
import type { User } from '../types/index.js';
export interface Connection {
    ws: WebSocket;
    user: User;
    lobbyId: string | null;
    inGame: boolean;
    connectionHealth: 'good' | 'unstable' | 'poor';
    lastPongTime: number;
}
export declare function addConnection(user: User, ws: WebSocket): void;
export declare function removeConnection(userId: number): void;
export declare function getConnection(userId: number): Connection | undefined;
export declare function getUserIdByTelegramId(telegramId: number): number | undefined;
export declare function isOnline(userId: number): boolean;
export declare function updateUserEquipment(userId: number, slot: 'dice' | 'table' | 'effect', itemId: number): void;
export declare function setLobby(userId: number, lobbyId: string | null): void;
export declare function getLobbyId(userId: number): string | null;
export declare function send(userId: number, message: object): void;
export declare function broadcast(userIds: number[], message: object): void;
export declare function broadcastToLobby(lobbyId: string, message: object, excludeUserId?: number): void;
export declare function getOnlineUserIds(): number[];
export declare function getLobbyUserIds(lobbyId: string): number[];
export declare function updateConnectionHealth(userId: number): void;
export declare function markPongReceived(userId: number): void;
export declare function getConnectionHealth(userId: number): 'good' | 'unstable' | 'poor' | 'offline';
//# sourceMappingURL=connections.d.ts.map