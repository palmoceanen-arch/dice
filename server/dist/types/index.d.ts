export interface User {
    id: number;
    telegramId: number;
    nickname: string;
    telegramUsername: string | null;
    firstName: string | null;
    avatarUrl: string | null;
    equippedDiceId: number | null;
    equippedTableId: number | null;
    equippedEffectId: number | null;
    referralCode?: string | null;
    pips?: number;
    lastOnline: Date;
    createdAt: Date;
}
export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}
export type ItemType = 'dice' | 'table' | 'effect' | 'key';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export interface Item {
    id: number;
    type: ItemType;
    code: string;
    name: string;
    description: string | null;
    priceStars: number;
    rarity: ItemRarity;
    textureUrl: string | null;
    config: Record<string, unknown> | null;
    isAvailable: boolean;
}
export interface UserItem {
    id: number;
    oderId: number;
    itemId: number;
    purchasedAt: Date;
}
export type FriendStatus = 'active' | 'blocked';
export type FriendSource = 'search' | 'game' | 'invite';
export interface Friend {
    id: number;
    oderId: number;
    friendId: number;
    status: FriendStatus;
    source: FriendSource;
    createdAt: Date;
}
export interface FriendWithUser extends Friend {
    user: User;
    onlineStatus: 'online' | 'in_lobby' | 'in_game' | 'offline';
}
export type GameMode = 'free_roll' | 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice';
export type LobbyStatus = 'voting' | 'waiting' | 'playing' | 'finished';
export interface Lobby {
    id: string;
    hostId: number;
    gameMode: GameMode;
    status: LobbyStatus;
    selectedTableId: number | null;
    maxPlayers: number;
    createdAt: Date;
    startedAt: Date | null;
    finishedAt: Date | null;
}
export interface LobbyPlayer {
    lobbyId: string;
    oderId: number;
    status: 'invited' | 'joined' | 'left';
    tableVote: number | null;
    joinedAt: Date;
}
export interface LobbyWithPlayers extends Lobby {
    players: (LobbyPlayer & {
        user: User;
    })[];
}
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export interface Invitation {
    id: number;
    lobbyId: string;
    fromUserId: number;
    toUserId: number;
    gameMode: GameMode;
    status: InvitationStatus;
    createdAt: Date;
    expiresAt: Date;
}
export type CrapsPhase = 'betting' | 'come_out' | 'point';
export type BetType = 'pass' | 'dont_pass' | 'side';
export type BetStatus = 'pending' | 'active' | 'won' | 'lost';
export interface GameSession {
    id: number;
    lobbyId: string;
    shooterId: number;
    phase: CrapsPhase;
    pointValue: number | null;
    status: 'active' | 'finished';
    createdAt: Date;
}
export interface Bet {
    id: number;
    sessionId: number;
    userId: number;
    betType: BetType;
    amount: number;
    againstUserId: number | null;
    status: BetStatus;
    createdAt: Date;
}
export interface Roll {
    id: number;
    lobbyId: string;
    sessionId: number | null;
    userId: number;
    dice1: number;
    dice2: number;
    total: number;
    result: string | null;
    rolledAt: Date;
    diceValues?: number[];
}
export interface WSMessage {
    type: string;
    [key: string]: unknown;
}
export interface AuthMessage extends WSMessage {
    type: 'auth';
    initData: string;
}
export interface AuthSuccessMessage extends WSMessage {
    type: 'auth_success';
    user: User;
    inventory: Item[];
}
export interface DiceThrowData {
    playerId: number;
    playerNickname: string;
    timestamp: number;
    throwPower: number;
    deltaY: number;
    deltaZ: number;
    dice: [
        {
            initialPosition: [number, number, number];
            initialVelocity: [number, number, number];
            initialAngularVelocity: [number, number, number];
            skinId: number | null;
        },
        {
            initialPosition: [number, number, number];
            initialVelocity: [number, number, number];
            initialAngularVelocity: [number, number, number];
            skinId: number | null;
        }
    ];
    effectId: number | null;
    finalResult: {
        dice1: number;
        dice2: number;
        total: number;
    };
}
export type BoostType = 'double' | 'triple_even' | 'triple_odd' | 'snake_eyes' | 'golden';
export interface UserBoost {
    id: number;
    userId: number;
    boostId: string;
    boostType: BoostType;
    activatedAt: Date;
    expiresAt: Date;
    availableAt: Date;
    selectedParity?: 'even' | 'odd';
}
//# sourceMappingURL=index.d.ts.map