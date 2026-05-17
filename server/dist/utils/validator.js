/**
 * Message validation using Zod
 * Validates all incoming WebSocket messages
 */
import { z } from 'zod';
// === Base schemas ===
const GameModeSchema = z.enum(['free_roll', 'street_craps', 'mexico', 'greedy_pig', 'poker_dice']);
const SlotSchema = z.enum(['dice', 'table', 'effect']);
// Sanitize string - remove potential XSS
const SafeString = z.string().transform(s => s.replace(/[<>'"&]/g, '').trim());
// Allow any Unicode letter (including Cyrillic, CJK, etc.) and digit, plus
// underscore. Matches the sanitizer in users.ts → generateNickname() which
// strips everything outside `\p{L}\p{N}` before assigning a default name; if
// we only accepted ASCII here a user whose default is e.g. "ПавелСлонов"
// could not edit their own nickname.
const NicknameSchema = SafeString
    .refine(s => s.length >= 3 && s.length <= 32, 'Nickname must be 3-32 characters')
    .refine(s => /^[\p{L}\p{N}_]+$/u.test(s), 'Nickname can only contain letters, numbers, and underscores');
const UsernameSearchSchema = SafeString
    .refine(s => s.length >= 1 && s.length <= 64, 'Username must be 1-64 characters');
// === Message schemas ===
// Telegram path: `initData` is the Telegram Mini App init payload.
// Yandex path: `platform: 'yandex'` plus `signedData` (HMAC payload from
// `ysdk.getPlayer({signed:true})`) and optional `playerInfo`. The dispatch
// in handlers.ts picks the right path based on `platform`; this schema
// must accept either shape, otherwise valid Yandex auth messages are
// rejected before they reach the dispatcher.
const YandexAuthPlayerInfoSchema = z.object({
    uuid: z.string().min(1).max(128).optional(),
    publicName: z.string().max(256).optional(),
    avatarUrlSmall: z.string().max(2048).optional(),
    avatarUrlMedium: z.string().max(2048).optional(),
    avatarUrlLarge: z.string().max(2048).optional(),
    lang: z.string().max(16).optional(),
});
const AuthMessageSchema = z
    .object({
    type: z.literal('auth'),
    platform: z.enum(['telegram', 'yandex']).optional(),
    initData: z.string().min(1).max(4096).optional(),
    signedData: z.string().min(1).max(8192).nullable().optional(),
    playerInfo: YandexAuthPlayerInfoSchema.nullable().optional(),
})
    .superRefine((data, ctx) => {
    if (data.platform === 'yandex') {
        // Yandex auth doesn't require initData; signedData may be null for
        // unauthorized guests, the server falls back to a per-device uuid in
        // dev / rejects in prod.
        return;
    }
    if (!data.initData) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['initData'],
            message: 'Required',
        });
    }
});
const SetNicknameSchema = z.object({
    type: z.literal('set_nickname'),
    nickname: NicknameSchema,
});
const EquipItemSchema = z.object({
    type: z.literal('equip_item'),
    itemId: z.number().int().positive(),
    slot: SlotSchema,
});
const GetShopItemsSchema = z.object({
    type: z.literal('get_shop_items'),
});
const PurchaseItemSchema = z.object({
    type: z.literal('purchase_item'),
    itemId: z.number().int().positive(),
});
const SearchUserSchema = z.object({
    type: z.literal('search_user'),
    username: UsernameSearchSchema,
});
const GetFriendsSchema = z.object({
    type: z.literal('get_friends'),
});
const AddFriendSchema = z.object({
    type: z.literal('add_friend'),
    friendId: z.number().int().positive(),
});
const RemoveFriendSchema = z.object({
    type: z.literal('remove_friend'),
    friendId: z.number().int().positive(),
});
const GetFriendRequestsSchema = z.object({
    type: z.literal('get_friend_requests'),
});
const RespondFriendRequestSchema = z.object({
    type: z.literal('respond_friend_request'),
    requestId: z.number().int().positive(),
    accept: z.boolean(),
});
const GetReferralStatsSchema = z.object({
    type: z.literal('get_referral_stats'),
});
const GetReferralListSchema = z.object({
    type: z.literal('get_referral_list'),
});
// Bet amounts allowed in Yandex create-lobby and matchmaking flows.
const MmBetAmountSchema = z
    .number()
    .int()
    .refine((n) => [0, 10, 50, 100, 500].includes(n), {
    message: 'Bet amount must be one of 0 / 10 / 50 / 100 / 500',
});
const CreateLobbySchema = z.object({
    type: z.literal('create_lobby'),
    gameMode: GameModeSchema,
    screenWidth: z.number().int().positive().max(10000).optional(),
    screenHeight: z.number().int().positive().max(10000).optional(),
    // Per-player stake in pips. `0` is treated as a no-bet lobby (the
    // server skips the in-round BettingManager flow and awards a fixed
    // pip prize to the winner(s)). The set of allowed amounts is
    // `MmBetAmountSchema` — kept in lockstep with the matchmaking queue
    // and the UI chip buttons.
    bet: MmBetAmountSchema.optional(),
    // Legacy flag for Telegram callsites that haven't been migrated. New
    // code should use `bet: 0` instead. Defaults to false.
    noBet: z.boolean().optional(),
});
const JoinLobbySchema = z.object({
    type: z.literal('join_lobby'),
    lobbyId: z.string().min(1).max(16),
    screenWidth: z.number().int().positive().max(10000).optional(),
    screenHeight: z.number().int().positive().max(10000).optional(),
});
const LeaveLobbySchema = z.object({
    type: z.literal('leave_lobby'),
});
const ReconnectGameSchema = z.object({
    type: z.literal('reconnect_game'),
    lobbyId: z.string().min(1).max(16),
});
const VoteTableSchema = z.object({
    type: z.literal('vote_table'),
    tableId: z.number().int().positive(),
});
const StartGameSchema = z.object({
    type: z.literal('start_game'),
});
const RestartGameSchema = z.object({
    type: z.literal('restart_game'),
});
const InviteFriendSchema = z.object({
    type: z.literal('invite_friend'),
    friendId: z.number().int().positive(),
});
const GetInvitationsSchema = z.object({
    type: z.literal('get_invitations'),
});
const RespondInvitationSchema = z.object({
    type: z.literal('respond_invitation'),
    invitationId: z.number().int().positive(),
    accept: z.boolean(),
});
const RollDiceSchema = z.object({
    type: z.literal('roll_dice'),
    dice1: z.number().int().min(1).max(6),
    dice2: z.number().int().min(1).max(6),
});
// Throw data schemas (for streaming)
const Vec3Schema = z.tuple([z.number(), z.number(), z.number()]);
const PlayerReadySchema = z.object({
    type: z.literal('player_ready'),
});
const ThrowStartSchema = z.object({
    type: z.literal('throw_start'),
    throwPower: z.number().min(0).max(100),
    effectId: z.number().int().positive().nullable(),
});
const ThrowShakeSchema = z.object({
    type: z.literal('throw_shake'),
    frame: z.object({
        dice1: z.object({
            position: Vec3Schema,
            quaternion: z.tuple([z.number(), z.number(), z.number(), z.number()]),
        }),
        dice2: z.object({
            position: Vec3Schema,
            quaternion: z.tuple([z.number(), z.number(), z.number(), z.number()]),
        }),
    }),
});
const ThrowFrameSchema = z.object({
    type: z.literal('throw_frame'),
    frame: z.object({
        dice1: z.object({
            position: Vec3Schema,
            quaternion: z.tuple([z.number(), z.number(), z.number(), z.number()]),
        }),
        dice2: z.object({
            position: Vec3Schema,
            quaternion: z.tuple([z.number(), z.number(), z.number(), z.number()]),
        }),
    }),
});
const ThrowSoundSchema = z.object({
    type: z.literal('throw_sound'),
    soundType: z.enum(['dice_hit', 'table_hit']),
    velocity: z.number().min(0).max(100),
    time: z.number().min(0), // Time offset from throw start in ms
});
const ThrowEndSchema = z.object({
    type: z.literal('throw_end'),
    finalResult: z.object({
        dice1: z.number().int().min(1).max(6),
        dice2: z.number().int().min(1).max(6),
        total: z.number().int().min(2).max(30), // Max 30 for 5 dice (poker dice)
        diceValues: z.array(z.number().int().min(1).max(6)).optional(), // For multi-dice games
    }),
});
const ThrowDiceSyncSchema = z.object({
    type: z.literal('throw_dice_sync'),
    throwData: z.object({
        throwPower: z.number().min(0).max(100),
        deltaY: z.number(),
        deltaZ: z.number(),
        dice: z.tuple([
            z.object({
                initialPosition: Vec3Schema,
                initialVelocity: Vec3Schema,
                initialAngularVelocity: Vec3Schema,
            }),
            z.object({
                initialPosition: Vec3Schema,
                initialVelocity: Vec3Schema,
                initialAngularVelocity: Vec3Schema,
            }),
        ]),
        effectId: z.number().int().positive().nullable().optional(),
        finalResult: z.object({
            dice1: z.number().int().min(1).max(6),
            dice2: z.number().int().min(1).max(6),
            total: z.number().int().min(2).max(30), // Max 30 for 5 dice
            diceValues: z.array(z.number().int().min(1).max(6)).optional(),
        }),
    }),
});
const PassTurnSchema = z.object({
    type: z.literal('pass_turn'),
});
const GreedyPigStopSchema = z.object({
    type: z.literal('greedy_pig_stop'),
});
const PalmosTakeSchema = z.object({
    type: z.literal('palmos_take'),
});
const PalmosRerollSchema = z.object({
    type: z.literal('palmos_reroll'),
    selectedDice: z.array(z.number().int().min(0).max(4)).min(1).max(5), // Indices 0-4 for 5 dice
});
const SendReactionSchema = z.object({
    type: z.literal('send_reaction'),
    content: z.string().min(1).max(50),
});
const SoloRollCompleteSchema = z.object({
    type: z.literal('solo_roll_complete'),
    dice1: z.number().int().min(1).max(6),
    dice2: z.number().int().min(1).max(6),
    total: z.number().int().min(2).max(30), // Max 30 for 5 dice
    earnedPips: z.number().int().min(2).max(1441), // Max: 66 (mexico) * 5 (golden) + 1111 (snake eyes) = 1441
    boostMultiplier: z.number().int().refine(val => [1, 2, 3, 5].includes(val), {
        message: 'Boost multiplier must be 1, 2, 3, or 5'
    }).optional().default(1),
    boostBonus: z.number().int().refine(val => [0, 1111].includes(val), {
        message: 'Boost bonus must be 0 or 1111'
    }).optional().default(0),
});
const ActivateBoostSchema = z.object({
    type: z.literal('activate_boost'),
    boostId: z.enum(['double', 'triple', 'snake_eyes', 'golden']),
    parity: z.enum(['even', 'odd']).optional(),
});
const GetBoostStatesSchema = z.object({
    type: z.literal('get_boost_states'),
});
const AdminGiftSchema = z.object({
    type: z.literal('admin_gift'),
    targetUserId: z.number().int().positive(),
    item: z.unknown(),
});
const SaveCustomDiceSchema = z.object({
    type: z.literal('save_custom_dice'),
    config: z.object({
        baseColor: z.string(),
        dotColor: z.string(),
        borderColor: z.string(),
        roughness: z.number().min(0).max(1),
        metalness: z.number().min(0).max(1),
        clearcoat: z.number().min(0).max(1),
        clearcoatRoughness: z.number().min(0).max(1),
        opacity: z.number().min(0.1).max(1),
        dotSize: z.number().int().min(10).max(31),
        dotShape: z.string(),
        dotDepth: z.number().min(0).max(2),
        bevelRadius: z.number().min(0).max(0.2),
    }),
});
// Lets a client (currently only the Yandex Games build) push the dice /
// table / effect configs it picked from its local Cloud Save to the
// server, so the server can broadcast them to the *other* players in a
// multiplayer match. Without this, the server only knows about the
// equipped item IDs in the database (which never change on Yandex —
// every Yandex user is stuck on `classic_white` — so opponents would
// always see white dice regardless of what each player picked locally).
//
// `code` is a short identifier (e.g. `classic_red`, `yandex_custom`)
// used purely for telemetry / debugging on the server side — the
// authoritative payload is `config`. Each slot is optional so the
// client can clear an override by sending `dice: null` etc.
const PlayerItemSlotSchema = z.object({
    code: z.string().min(1).max(64),
    name: z.string().min(1).max(128),
    config: z.record(z.unknown()).nullable(),
}).nullable();
const SetPlayerItemsSchema = z.object({
    type: z.literal('set_player_items'),
    dice: PlayerItemSlotSchema.optional(),
    table: PlayerItemSlotSchema.optional(),
    effect: PlayerItemSlotSchema.optional(),
});
// === Betting schemas ===
const PlaceBetSchema = z.object({
    type: z.literal('place_bet'),
    amount: z.number().int().positive().max(1000000), // Max 1M pips
});
const ConfirmBetSchema = z.object({
    type: z.literal('confirm_bet'),
});
const CancelBetSchema = z.object({
    type: z.literal('cancel_bet'),
});
// === Matchmaking schemas ===
const MmJoinQueueSchema = z.object({
    type: z.literal('mm_join_queue'),
    mode: z.enum(['duel', 'any']),
    betAmount: MmBetAmountSchema,
    // Reserved for future "let me pick the mode" UI. The default
    // `poker_dice` (Palmo's Dice) is enforced server-side if omitted.
    gameMode: GameModeSchema.optional(),
});
const MmLeaveQueueSchema = z.object({
    type: z.literal('mm_leave_queue'),
});
const MmReadySchema = z.object({
    type: z.literal('mm_ready'),
});
const SyncYandexPipsSchema = z.object({
    type: z.literal('sync_yandex_pips'),
    pips: z.number().int().min(0).max(1000000000),
});
const GetPlayerStatsSchema = z.object({
    type: z.literal('get_player_stats'),
});
// === Client ping (for connection check) ===
const ClientPingSchema = z.object({
    type: z.literal('_client_ping'),
    t: z.number().optional(), // timestamp
});
// === Message type union ===
const MessageSchemas = {
    auth: AuthMessageSchema,
    set_nickname: SetNicknameSchema,
    equip_item: EquipItemSchema,
    get_shop_items: GetShopItemsSchema,
    purchase_item: PurchaseItemSchema,
    search_user: SearchUserSchema,
    get_friends: GetFriendsSchema,
    add_friend: AddFriendSchema,
    remove_friend: RemoveFriendSchema,
    get_friend_requests: GetFriendRequestsSchema,
    respond_friend_request: RespondFriendRequestSchema,
    get_referral_stats: GetReferralStatsSchema,
    get_referral_list: GetReferralListSchema,
    create_lobby: CreateLobbySchema,
    join_lobby: JoinLobbySchema,
    leave_lobby: LeaveLobbySchema,
    reconnect_game: ReconnectGameSchema,
    vote_table: VoteTableSchema,
    start_game: StartGameSchema,
    restart_game: RestartGameSchema,
    invite_friend: InviteFriendSchema,
    get_invitations: GetInvitationsSchema,
    respond_invitation: RespondInvitationSchema,
    roll_dice: RollDiceSchema,
    player_ready: PlayerReadySchema,
    throw_start: ThrowStartSchema,
    throw_frame: ThrowFrameSchema,
    throw_sound: ThrowSoundSchema,
    throw_end: ThrowEndSchema,
    throw_dice_sync: ThrowDiceSyncSchema,
    pass_turn: PassTurnSchema,
    greedy_pig_stop: GreedyPigStopSchema,
    palmos_take: PalmosTakeSchema,
    palmos_reroll: PalmosRerollSchema,
    send_reaction: SendReactionSchema,
    solo_roll_complete: SoloRollCompleteSchema,
    activate_boost: ActivateBoostSchema,
    get_boost_states: GetBoostStatesSchema,
    admin_gift: AdminGiftSchema,
    save_custom_dice: SaveCustomDiceSchema,
    set_player_items: SetPlayerItemsSchema,
    place_bet: PlaceBetSchema,
    confirm_bet: ConfirmBetSchema,
    cancel_bet: CancelBetSchema,
    mm_join_queue: MmJoinQueueSchema,
    mm_leave_queue: MmLeaveQueueSchema,
    mm_ready: MmReadySchema,
    sync_yandex_pips: SyncYandexPipsSchema,
    get_player_stats: GetPlayerStatsSchema,
    _client_ping: ClientPingSchema,
};
/**
 * Validate incoming WebSocket message
 */
export function validateMessage(rawData) {
    // Parse JSON
    let parsed;
    try {
        parsed = JSON.parse(rawData);
    }
    catch {
        return { success: false, error: 'Invalid JSON' };
    }
    // Check if it's an object with type
    if (typeof parsed !== 'object' || parsed === null || !('type' in parsed)) {
        return { success: false, error: 'Missing message type' };
    }
    const messageType = parsed.type;
    if (typeof messageType !== 'string') {
        return { success: false, error: 'Invalid message type' };
    }
    // Get schema for this message type
    const schema = MessageSchemas[messageType];
    if (!schema) {
        return { success: false, error: `Unknown message type: ${messageType}`, type: messageType };
    }
    // Validate against schema
    const result = schema.safeParse(parsed);
    if (!result.success) {
        const errorMessage = result.error.errors
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
        return { success: false, error: errorMessage, type: messageType };
    }
    return { success: true, data: result.data, type: messageType };
}
/**
 * Check if message type requires authentication
 */
export function requiresAuth(messageType) {
    return messageType !== 'auth' && messageType !== 'admin_gift' && messageType !== '_client_ping';
}
//# sourceMappingURL=validator.js.map