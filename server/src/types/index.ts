// User types
export type AuthPlatform = 'telegram' | 'yandex';

export interface User {
  id: number;
  telegramId: number | null;
  yandexId: string | null;
  platform: AuthPlatform;
  nickname: string;
  telegramUsername: string | null;
  firstName: string | null;
  avatarUrl: string | null;
  equippedDiceId: number | null;
  equippedTableId: number | null;
  equippedEffectId: number | null;
  referralCode?: string | null;
  pips?: number; // Points earned from dice rolls
  // Player progression / matchmaking stats. Cross-platform fields stored
  // on the users row; the Yandex Games build surfaces them in the
  // multiplayer profile widget and uses `level` to band the quick-play
  // matchmaking queue. Telegram build currently doesn't render these
  // (they still accumulate silently).
  xp?: number;
  level?: number;
  gamesPlayed?: number;
  wins?: number;
  losses?: number;
  lastOnline: Date;
  createdAt: Date;
}

// Snapshot of progression / score fields returned by `get_player_stats` and
// `stats_updated` WS messages. Kept separate from `User` so we can ship just
// the delta without re-sending the whole user payload.
export interface PlayerStats {
  userId: number;
  xp: number;
  level: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  pips: number;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

// Yandex Games player payload (subset of ysdk.getPlayer() result we care about).
// Yandex returns the canonical id in the signed payload under `uuid`; the public
// name / avatar URLs come from the unsigned player object.
export interface YandexPlayer {
  uuid: string;
  publicName?: string;
  avatarUrlSmall?: string;
  avatarUrlMedium?: string;
  avatarUrlLarge?: string;
  lang?: string;
}

// Item types
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

// Friend types
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

// Lobby types
export type GameMode = 'free_roll' | 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice';
export type LobbyStatus = 'voting' | 'waiting' | 'playing' | 'finished';

export interface Lobby {
  id: string;
  hostId: number;
  gameMode: GameMode;
  status: LobbyStatus;
  selectedTableId: number | null;
  maxPlayers: number;
  // When true, the lobby is "no-bet": the in-round BettingManager flow
  // is skipped and the winner(s) receive a fixed pip prize at game end.
  // Used by the Yandex Games build where real-money / pip-stake betting
  // is not allowed by the portal's compliance rules. Defaults to false
  // (classic Telegram behaviour).
  noBet: boolean;
  betAmount: number;
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
  players: (LobbyPlayer & { user: User })[];
}

// Invitation types
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

// Street Craps types
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
  // For games with more than 2 dice (e.g., poker dice with 5)
  diceValues?: number[];
}

// WebSocket message types
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

// Dice throw synchronization
export interface DiceThrowData {
  playerId: number;
  playerNickname: string;
  timestamp: number;
  
  // Throw parameters
  throwPower: number;
  deltaY: number;
  deltaZ: number;
  
  // Dice data
  dice: [{
    initialPosition: [number, number, number];
    initialVelocity: [number, number, number];
    initialAngularVelocity: [number, number, number];
    skinId: number | null;
  }, {
    initialPosition: [number, number, number];
    initialVelocity: [number, number, number];
    initialAngularVelocity: [number, number, number];
    skinId: number | null;
  }];
  
  // Effects
  effectId: number | null;
  
  // Final result for validation
  finalResult: {
    dice1: number;
    dice2: number;
    total: number;
  };
}

// Boost types
export type BoostType = 'double' | 'triple_even' | 'triple_odd' | 'snake_eyes' | 'golden';

export interface UserBoost {
  id: number;
  userId: number;
  boostId: string;
  boostType: BoostType;
  activatedAt: Date;
  expiresAt: Date;
  availableAt: Date; // When cooldown ends
  selectedParity?: 'even' | 'odd'; // For triple boost
}
