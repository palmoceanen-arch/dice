import type { GameMode, Lobby, LobbyWithPlayers, Invitation } from '../types/index.js';
export declare function clearDiceConfigCache(itemId: number): void;
export declare function clearAllDiceConfigCache(): void;
export declare function getLobbyStatusCached(lobbyId: string): {
    status: 'voting' | 'playing' | 'finished';
    gameMode: GameMode;
} | null;
export declare function getDiceConfig(diceId: number): Promise<Record<string, unknown> | null>;
export declare function createLobby(hostId: number, gameMode: GameMode, noBet?: boolean, betAmount?: number): Promise<Lobby>;
export declare function isNoBetLobby(lobbyId: string): boolean;
export declare function getLobbyBetAmount(lobbyId: string): number;
export declare function getLobby(lobbyId: string): Promise<LobbyWithPlayers | null>;
export declare function joinLobby(lobbyId: string, userId: number): Promise<boolean>;
export interface LeaveLobbyResult {
    closed: boolean;
    closedReason?: 'empty' | 'insufficient_players';
    remainingPlayers: number[];
}
export declare function leaveLobby(lobbyId: string, userId: number): Promise<LeaveLobbyResult>;
export declare function closeLobby(lobbyId: string): Promise<void>;
export declare function getPendingInvitationUsers(lobbyId: string): Promise<number[]>;
export declare function voteTable(lobbyId: string, userId: number, tableId: number): Promise<boolean>;
export declare function getVotes(lobbyId: string): Map<number, number> | null;
export declare function getVoteResults(lobbyId: string): {
    tableId: number;
    count: number;
}[];
export declare function selectTable(lobbyId: string, tableId: number): Promise<void>;
export declare function getSelectedTableConfig(lobbyId: string): Promise<Record<string, unknown> | null>;
export declare function startGame(lobbyId: string): Promise<boolean>;
export declare function createInvitation(lobbyId: string, fromUserId: number, toUserId: number, gameMode: GameMode): Promise<Invitation | null>;
export declare function getPendingInvitations(userId: number): Promise<(Invitation & {
    fromUser: {
        nickname: string;
    };
})[]>;
export declare function respondToInvitation(invitationId: number, accept: boolean): Promise<{
    lobbyId: string | null;
    fromUserId: number | null;
    toUserId: number | null;
}>;
export declare function getLobbyPlayers(lobbyId: string): number[];
export declare function addRestartVote(lobbyId: string, userId: number): void;
export declare function removeRestartVote(lobbyId: string, userId: number): void;
export declare function getRestartVotes(lobbyId: string): number[];
export declare function clearRestartVotes(lobbyId: string): void;
export declare function setPlayerScreenSize(lobbyId: string, userId: number, width: number, height: number): void;
export declare function getMinAspectRatio(lobbyId: string): number | null;
export declare function markPlayerDisconnected(lobbyId: string, userId: number): void;
export declare function canReconnect(userId: number): {
    lobbyId: string;
    timeLeft: number;
} | null;
export declare function reconnectPlayer(lobbyId: string, userId: number): Promise<boolean>;
export declare function isPlayerDisconnected(userId: number): boolean;
//# sourceMappingURL=lobby.d.ts.map