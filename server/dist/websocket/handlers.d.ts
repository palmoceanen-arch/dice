import type { WebSocket } from 'ws';
export declare function handleMessage(ws: WebSocket, message: any, userId: number | null): Promise<number | null>;
export interface LobbyPlayerLike {
    user: {
        id: number;
        equippedDiceId: number | null;
        equippedTableId: number | null;
        equippedEffectId: number | null;
    };
}
export interface AvailableItem {
    id: number;
    type: string;
    code: string;
    name: string;
    config: Record<string, unknown> | null;
}
export interface PlayerEquipOverride {
    userId: number;
    equippedDiceId?: number;
    equippedTableId?: number;
    equippedEffectId?: number;
}
export declare function buildAvailableItemsAndOverrides(players: LobbyPlayerLike[]): Promise<{
    availableItems: AvailableItem[];
    equipOverrides: PlayerEquipOverride[];
}>;
export declare function applyEquipOverridesToLobby(lobbyPayload: {
    players?: LobbyPlayerLike[];
} | null | undefined, overrides: PlayerEquipOverride[]): void;
export declare function handleDisconnect(userId: number): void;
//# sourceMappingURL=handlers.d.ts.map