/**
 * Message validation using Zod
 * Validates all incoming WebSocket messages
 */
import { z } from 'zod';
declare const MessageSchemas: {
    readonly auth: z.ZodEffects<z.ZodObject<{
        type: z.ZodLiteral<"auth">;
        platform: z.ZodOptional<z.ZodEnum<["telegram", "yandex"]>>;
        initData: z.ZodOptional<z.ZodString>;
        signedData: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        playerInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            uuid: z.ZodOptional<z.ZodString>;
            publicName: z.ZodOptional<z.ZodString>;
            avatarUrlSmall: z.ZodOptional<z.ZodString>;
            avatarUrlMedium: z.ZodOptional<z.ZodString>;
            avatarUrlLarge: z.ZodOptional<z.ZodString>;
            lang: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            uuid?: string | undefined;
            publicName?: string | undefined;
            lang?: string | undefined;
            avatarUrlSmall?: string | undefined;
            avatarUrlMedium?: string | undefined;
            avatarUrlLarge?: string | undefined;
        }, {
            uuid?: string | undefined;
            publicName?: string | undefined;
            lang?: string | undefined;
            avatarUrlSmall?: string | undefined;
            avatarUrlMedium?: string | undefined;
            avatarUrlLarge?: string | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        type: "auth";
        initData?: string | undefined;
        platform?: "telegram" | "yandex" | undefined;
        signedData?: string | null | undefined;
        playerInfo?: {
            uuid?: string | undefined;
            publicName?: string | undefined;
            lang?: string | undefined;
            avatarUrlSmall?: string | undefined;
            avatarUrlMedium?: string | undefined;
            avatarUrlLarge?: string | undefined;
        } | null | undefined;
    }, {
        type: "auth";
        initData?: string | undefined;
        platform?: "telegram" | "yandex" | undefined;
        signedData?: string | null | undefined;
        playerInfo?: {
            uuid?: string | undefined;
            publicName?: string | undefined;
            lang?: string | undefined;
            avatarUrlSmall?: string | undefined;
            avatarUrlMedium?: string | undefined;
            avatarUrlLarge?: string | undefined;
        } | null | undefined;
    }>, {
        type: "auth";
        initData?: string | undefined;
        platform?: "telegram" | "yandex" | undefined;
        signedData?: string | null | undefined;
        playerInfo?: {
            uuid?: string | undefined;
            publicName?: string | undefined;
            lang?: string | undefined;
            avatarUrlSmall?: string | undefined;
            avatarUrlMedium?: string | undefined;
            avatarUrlLarge?: string | undefined;
        } | null | undefined;
    }, {
        type: "auth";
        initData?: string | undefined;
        platform?: "telegram" | "yandex" | undefined;
        signedData?: string | null | undefined;
        playerInfo?: {
            uuid?: string | undefined;
            publicName?: string | undefined;
            lang?: string | undefined;
            avatarUrlSmall?: string | undefined;
            avatarUrlMedium?: string | undefined;
            avatarUrlLarge?: string | undefined;
        } | null | undefined;
    }>;
    readonly set_nickname: z.ZodObject<{
        type: z.ZodLiteral<"set_nickname">;
        nickname: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "set_nickname";
        nickname: string;
    }, {
        type: "set_nickname";
        nickname: string;
    }>;
    readonly equip_item: z.ZodObject<{
        type: z.ZodLiteral<"equip_item">;
        itemId: z.ZodNumber;
        slot: z.ZodEnum<["dice", "table", "effect"]>;
    }, "strip", z.ZodTypeAny, {
        type: "equip_item";
        itemId: number;
        slot: "dice" | "table" | "effect";
    }, {
        type: "equip_item";
        itemId: number;
        slot: "dice" | "table" | "effect";
    }>;
    readonly get_shop_items: z.ZodObject<{
        type: z.ZodLiteral<"get_shop_items">;
    }, "strip", z.ZodTypeAny, {
        type: "get_shop_items";
    }, {
        type: "get_shop_items";
    }>;
    readonly purchase_item: z.ZodObject<{
        type: z.ZodLiteral<"purchase_item">;
        itemId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "purchase_item";
        itemId: number;
    }, {
        type: "purchase_item";
        itemId: number;
    }>;
    readonly search_user: z.ZodObject<{
        type: z.ZodLiteral<"search_user">;
        username: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    }, "strip", z.ZodTypeAny, {
        type: "search_user";
        username: string;
    }, {
        type: "search_user";
        username: string;
    }>;
    readonly get_friends: z.ZodObject<{
        type: z.ZodLiteral<"get_friends">;
    }, "strip", z.ZodTypeAny, {
        type: "get_friends";
    }, {
        type: "get_friends";
    }>;
    readonly add_friend: z.ZodObject<{
        type: z.ZodLiteral<"add_friend">;
        friendId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "add_friend";
        friendId: number;
    }, {
        type: "add_friend";
        friendId: number;
    }>;
    readonly remove_friend: z.ZodObject<{
        type: z.ZodLiteral<"remove_friend">;
        friendId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "remove_friend";
        friendId: number;
    }, {
        type: "remove_friend";
        friendId: number;
    }>;
    readonly get_friend_requests: z.ZodObject<{
        type: z.ZodLiteral<"get_friend_requests">;
    }, "strip", z.ZodTypeAny, {
        type: "get_friend_requests";
    }, {
        type: "get_friend_requests";
    }>;
    readonly respond_friend_request: z.ZodObject<{
        type: z.ZodLiteral<"respond_friend_request">;
        requestId: z.ZodNumber;
        accept: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: "respond_friend_request";
        requestId: number;
        accept: boolean;
    }, {
        type: "respond_friend_request";
        requestId: number;
        accept: boolean;
    }>;
    readonly get_referral_stats: z.ZodObject<{
        type: z.ZodLiteral<"get_referral_stats">;
    }, "strip", z.ZodTypeAny, {
        type: "get_referral_stats";
    }, {
        type: "get_referral_stats";
    }>;
    readonly get_referral_list: z.ZodObject<{
        type: z.ZodLiteral<"get_referral_list">;
    }, "strip", z.ZodTypeAny, {
        type: "get_referral_list";
    }, {
        type: "get_referral_list";
    }>;
    readonly create_lobby: z.ZodObject<{
        type: z.ZodLiteral<"create_lobby">;
        gameMode: z.ZodEnum<["free_roll", "street_craps", "mexico", "greedy_pig", "poker_dice"]>;
        screenWidth: z.ZodOptional<z.ZodNumber>;
        screenHeight: z.ZodOptional<z.ZodNumber>;
        bet: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, number>>;
        noBet: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "create_lobby";
        gameMode: "free_roll" | "street_craps" | "mexico" | "greedy_pig" | "poker_dice";
        screenWidth?: number | undefined;
        screenHeight?: number | undefined;
        bet?: number | undefined;
        noBet?: boolean | undefined;
    }, {
        type: "create_lobby";
        gameMode: "free_roll" | "street_craps" | "mexico" | "greedy_pig" | "poker_dice";
        screenWidth?: number | undefined;
        screenHeight?: number | undefined;
        bet?: number | undefined;
        noBet?: boolean | undefined;
    }>;
    readonly join_lobby: z.ZodObject<{
        type: z.ZodLiteral<"join_lobby">;
        lobbyId: z.ZodString;
        screenWidth: z.ZodOptional<z.ZodNumber>;
        screenHeight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "join_lobby";
        lobbyId: string;
        screenWidth?: number | undefined;
        screenHeight?: number | undefined;
    }, {
        type: "join_lobby";
        lobbyId: string;
        screenWidth?: number | undefined;
        screenHeight?: number | undefined;
    }>;
    readonly leave_lobby: z.ZodObject<{
        type: z.ZodLiteral<"leave_lobby">;
    }, "strip", z.ZodTypeAny, {
        type: "leave_lobby";
    }, {
        type: "leave_lobby";
    }>;
    readonly reconnect_game: z.ZodObject<{
        type: z.ZodLiteral<"reconnect_game">;
        lobbyId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "reconnect_game";
        lobbyId: string;
    }, {
        type: "reconnect_game";
        lobbyId: string;
    }>;
    readonly vote_table: z.ZodObject<{
        type: z.ZodLiteral<"vote_table">;
        tableId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "vote_table";
        tableId: number;
    }, {
        type: "vote_table";
        tableId: number;
    }>;
    readonly start_game: z.ZodObject<{
        type: z.ZodLiteral<"start_game">;
    }, "strip", z.ZodTypeAny, {
        type: "start_game";
    }, {
        type: "start_game";
    }>;
    readonly restart_game: z.ZodObject<{
        type: z.ZodLiteral<"restart_game">;
    }, "strip", z.ZodTypeAny, {
        type: "restart_game";
    }, {
        type: "restart_game";
    }>;
    readonly invite_friend: z.ZodObject<{
        type: z.ZodLiteral<"invite_friend">;
        friendId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "invite_friend";
        friendId: number;
    }, {
        type: "invite_friend";
        friendId: number;
    }>;
    readonly get_invitations: z.ZodObject<{
        type: z.ZodLiteral<"get_invitations">;
    }, "strip", z.ZodTypeAny, {
        type: "get_invitations";
    }, {
        type: "get_invitations";
    }>;
    readonly respond_invitation: z.ZodObject<{
        type: z.ZodLiteral<"respond_invitation">;
        invitationId: z.ZodNumber;
        accept: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: "respond_invitation";
        accept: boolean;
        invitationId: number;
    }, {
        type: "respond_invitation";
        accept: boolean;
        invitationId: number;
    }>;
    readonly roll_dice: z.ZodObject<{
        type: z.ZodLiteral<"roll_dice">;
        dice1: z.ZodNumber;
        dice2: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "roll_dice";
        dice1: number;
        dice2: number;
    }, {
        type: "roll_dice";
        dice1: number;
        dice2: number;
    }>;
    readonly player_ready: z.ZodObject<{
        type: z.ZodLiteral<"player_ready">;
    }, "strip", z.ZodTypeAny, {
        type: "player_ready";
    }, {
        type: "player_ready";
    }>;
    readonly throw_start: z.ZodObject<{
        type: z.ZodLiteral<"throw_start">;
        throwPower: z.ZodNumber;
        effectId: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "throw_start";
        throwPower: number;
        effectId: number | null;
    }, {
        type: "throw_start";
        throwPower: number;
        effectId: number | null;
    }>;
    readonly throw_frame: z.ZodObject<{
        type: z.ZodLiteral<"throw_frame">;
        frame: z.ZodObject<{
            dice1: z.ZodObject<{
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                quaternion: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            }, {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            }>;
            dice2: z.ZodObject<{
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                quaternion: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            }, {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            }>;
        }, "strip", z.ZodTypeAny, {
            dice1: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
            dice2: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
        }, {
            dice1: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
            dice2: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "throw_frame";
        frame: {
            dice1: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
            dice2: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
        };
    }, {
        type: "throw_frame";
        frame: {
            dice1: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
            dice2: {
                position: [number, number, number];
                quaternion: [number, number, number, number];
            };
        };
    }>;
    readonly throw_sound: z.ZodObject<{
        type: z.ZodLiteral<"throw_sound">;
        soundType: z.ZodEnum<["dice_hit", "table_hit"]>;
        velocity: z.ZodNumber;
        time: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "throw_sound";
        soundType: "dice_hit" | "table_hit";
        velocity: number;
        time: number;
    }, {
        type: "throw_sound";
        soundType: "dice_hit" | "table_hit";
        velocity: number;
        time: number;
    }>;
    readonly throw_end: z.ZodObject<{
        type: z.ZodLiteral<"throw_end">;
        finalResult: z.ZodObject<{
            dice1: z.ZodNumber;
            dice2: z.ZodNumber;
            total: z.ZodNumber;
            diceValues: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            dice1: number;
            dice2: number;
            total: number;
            diceValues?: number[] | undefined;
        }, {
            dice1: number;
            dice2: number;
            total: number;
            diceValues?: number[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "throw_end";
        finalResult: {
            dice1: number;
            dice2: number;
            total: number;
            diceValues?: number[] | undefined;
        };
    }, {
        type: "throw_end";
        finalResult: {
            dice1: number;
            dice2: number;
            total: number;
            diceValues?: number[] | undefined;
        };
    }>;
    readonly throw_dice_sync: z.ZodObject<{
        type: z.ZodLiteral<"throw_dice_sync">;
        throwData: z.ZodObject<{
            throwPower: z.ZodNumber;
            deltaY: z.ZodNumber;
            deltaZ: z.ZodNumber;
            dice: z.ZodTuple<[z.ZodObject<{
                initialPosition: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                initialVelocity: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                initialAngularVelocity: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }>, z.ZodObject<{
                initialPosition: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                initialVelocity: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                initialAngularVelocity: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }>], null>;
            effectId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            finalResult: z.ZodObject<{
                dice1: z.ZodNumber;
                dice2: z.ZodNumber;
                total: z.ZodNumber;
                diceValues: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            }, "strip", z.ZodTypeAny, {
                dice1: number;
                dice2: number;
                total: number;
                diceValues?: number[] | undefined;
            }, {
                dice1: number;
                dice2: number;
                total: number;
                diceValues?: number[] | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            dice: [{
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }];
            throwPower: number;
            finalResult: {
                dice1: number;
                dice2: number;
                total: number;
                diceValues?: number[] | undefined;
            };
            deltaY: number;
            deltaZ: number;
            effectId?: number | null | undefined;
        }, {
            dice: [{
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }];
            throwPower: number;
            finalResult: {
                dice1: number;
                dice2: number;
                total: number;
                diceValues?: number[] | undefined;
            };
            deltaY: number;
            deltaZ: number;
            effectId?: number | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "throw_dice_sync";
        throwData: {
            dice: [{
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }];
            throwPower: number;
            finalResult: {
                dice1: number;
                dice2: number;
                total: number;
                diceValues?: number[] | undefined;
            };
            deltaY: number;
            deltaZ: number;
            effectId?: number | null | undefined;
        };
    }, {
        type: "throw_dice_sync";
        throwData: {
            dice: [{
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }, {
                initialPosition: [number, number, number];
                initialVelocity: [number, number, number];
                initialAngularVelocity: [number, number, number];
            }];
            throwPower: number;
            finalResult: {
                dice1: number;
                dice2: number;
                total: number;
                diceValues?: number[] | undefined;
            };
            deltaY: number;
            deltaZ: number;
            effectId?: number | null | undefined;
        };
    }>;
    readonly pass_turn: z.ZodObject<{
        type: z.ZodLiteral<"pass_turn">;
    }, "strip", z.ZodTypeAny, {
        type: "pass_turn";
    }, {
        type: "pass_turn";
    }>;
    readonly greedy_pig_stop: z.ZodObject<{
        type: z.ZodLiteral<"greedy_pig_stop">;
    }, "strip", z.ZodTypeAny, {
        type: "greedy_pig_stop";
    }, {
        type: "greedy_pig_stop";
    }>;
    readonly palmos_take: z.ZodObject<{
        type: z.ZodLiteral<"palmos_take">;
    }, "strip", z.ZodTypeAny, {
        type: "palmos_take";
    }, {
        type: "palmos_take";
    }>;
    readonly palmos_reroll: z.ZodObject<{
        type: z.ZodLiteral<"palmos_reroll">;
        selectedDice: z.ZodArray<z.ZodNumber, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "palmos_reroll";
        selectedDice: number[];
    }, {
        type: "palmos_reroll";
        selectedDice: number[];
    }>;
    readonly send_reaction: z.ZodObject<{
        type: z.ZodLiteral<"send_reaction">;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "send_reaction";
        content: string;
    }, {
        type: "send_reaction";
        content: string;
    }>;
    readonly solo_roll_complete: z.ZodObject<{
        type: z.ZodLiteral<"solo_roll_complete">;
        dice1: z.ZodNumber;
        dice2: z.ZodNumber;
        total: z.ZodNumber;
        earnedPips: z.ZodNumber;
        boostMultiplier: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodNumber, number, number>>>;
        boostBonus: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodNumber, number, number>>>;
    }, "strip", z.ZodTypeAny, {
        type: "solo_roll_complete";
        dice1: number;
        dice2: number;
        total: number;
        earnedPips: number;
        boostMultiplier: number;
        boostBonus: number;
    }, {
        type: "solo_roll_complete";
        dice1: number;
        dice2: number;
        total: number;
        earnedPips: number;
        boostMultiplier?: number | undefined;
        boostBonus?: number | undefined;
    }>;
    readonly activate_boost: z.ZodObject<{
        type: z.ZodLiteral<"activate_boost">;
        boostId: z.ZodEnum<["double", "triple", "snake_eyes", "golden"]>;
        parity: z.ZodOptional<z.ZodEnum<["even", "odd"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "activate_boost";
        boostId: "double" | "snake_eyes" | "golden" | "triple";
        parity?: "even" | "odd" | undefined;
    }, {
        type: "activate_boost";
        boostId: "double" | "snake_eyes" | "golden" | "triple";
        parity?: "even" | "odd" | undefined;
    }>;
    readonly get_boost_states: z.ZodObject<{
        type: z.ZodLiteral<"get_boost_states">;
    }, "strip", z.ZodTypeAny, {
        type: "get_boost_states";
    }, {
        type: "get_boost_states";
    }>;
    readonly admin_gift: z.ZodObject<{
        type: z.ZodLiteral<"admin_gift">;
        targetUserId: z.ZodNumber;
        item: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        type: "admin_gift";
        targetUserId: number;
        item?: unknown;
    }, {
        type: "admin_gift";
        targetUserId: number;
        item?: unknown;
    }>;
    readonly save_custom_dice: z.ZodObject<{
        type: z.ZodLiteral<"save_custom_dice">;
        config: z.ZodObject<{
            baseColor: z.ZodString;
            dotColor: z.ZodString;
            borderColor: z.ZodString;
            roughness: z.ZodNumber;
            metalness: z.ZodNumber;
            clearcoat: z.ZodNumber;
            clearcoatRoughness: z.ZodNumber;
            opacity: z.ZodNumber;
            dotSize: z.ZodNumber;
            dotShape: z.ZodString;
            dotDepth: z.ZodNumber;
            bevelRadius: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            baseColor: string;
            dotColor: string;
            borderColor: string;
            roughness: number;
            metalness: number;
            clearcoat: number;
            clearcoatRoughness: number;
            opacity: number;
            dotSize: number;
            dotShape: string;
            dotDepth: number;
            bevelRadius: number;
        }, {
            baseColor: string;
            dotColor: string;
            borderColor: string;
            roughness: number;
            metalness: number;
            clearcoat: number;
            clearcoatRoughness: number;
            opacity: number;
            dotSize: number;
            dotShape: string;
            dotDepth: number;
            bevelRadius: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "save_custom_dice";
        config: {
            baseColor: string;
            dotColor: string;
            borderColor: string;
            roughness: number;
            metalness: number;
            clearcoat: number;
            clearcoatRoughness: number;
            opacity: number;
            dotSize: number;
            dotShape: string;
            dotDepth: number;
            bevelRadius: number;
        };
    }, {
        type: "save_custom_dice";
        config: {
            baseColor: string;
            dotColor: string;
            borderColor: string;
            roughness: number;
            metalness: number;
            clearcoat: number;
            clearcoatRoughness: number;
            opacity: number;
            dotSize: number;
            dotShape: string;
            dotDepth: number;
            bevelRadius: number;
        };
    }>;
    readonly set_player_items: z.ZodObject<{
        type: z.ZodLiteral<"set_player_items">;
        dice: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            name: z.ZodString;
            config: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        }, {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        }>>>;
        table: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            name: z.ZodString;
            config: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        }, {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        }>>>;
        effect: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            name: z.ZodString;
            config: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        }, {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        type: "set_player_items";
        dice?: {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        } | null | undefined;
        table?: {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        } | null | undefined;
        effect?: {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        } | null | undefined;
    }, {
        type: "set_player_items";
        dice?: {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        } | null | undefined;
        table?: {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        } | null | undefined;
        effect?: {
            code: string;
            config: Record<string, unknown> | null;
            name: string;
        } | null | undefined;
    }>;
    readonly place_bet: z.ZodObject<{
        type: z.ZodLiteral<"place_bet">;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "place_bet";
        amount: number;
    }, {
        type: "place_bet";
        amount: number;
    }>;
    readonly confirm_bet: z.ZodObject<{
        type: z.ZodLiteral<"confirm_bet">;
    }, "strip", z.ZodTypeAny, {
        type: "confirm_bet";
    }, {
        type: "confirm_bet";
    }>;
    readonly cancel_bet: z.ZodObject<{
        type: z.ZodLiteral<"cancel_bet">;
    }, "strip", z.ZodTypeAny, {
        type: "cancel_bet";
    }, {
        type: "cancel_bet";
    }>;
    readonly mm_join_queue: z.ZodObject<{
        type: z.ZodLiteral<"mm_join_queue">;
        mode: z.ZodEnum<["duel", "any"]>;
        betAmount: z.ZodEffects<z.ZodNumber, number, number>;
        gameMode: z.ZodOptional<z.ZodEnum<["free_roll", "street_craps", "mexico", "greedy_pig", "poker_dice"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "mm_join_queue";
        betAmount: number;
        mode: "duel" | "any";
        gameMode?: "free_roll" | "street_craps" | "mexico" | "greedy_pig" | "poker_dice" | undefined;
    }, {
        type: "mm_join_queue";
        betAmount: number;
        mode: "duel" | "any";
        gameMode?: "free_roll" | "street_craps" | "mexico" | "greedy_pig" | "poker_dice" | undefined;
    }>;
    readonly mm_leave_queue: z.ZodObject<{
        type: z.ZodLiteral<"mm_leave_queue">;
    }, "strip", z.ZodTypeAny, {
        type: "mm_leave_queue";
    }, {
        type: "mm_leave_queue";
    }>;
    readonly mm_ready: z.ZodObject<{
        type: z.ZodLiteral<"mm_ready">;
    }, "strip", z.ZodTypeAny, {
        type: "mm_ready";
    }, {
        type: "mm_ready";
    }>;
    readonly sync_yandex_pips: z.ZodObject<{
        type: z.ZodLiteral<"sync_yandex_pips">;
        pips: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "sync_yandex_pips";
        pips: number;
    }, {
        type: "sync_yandex_pips";
        pips: number;
    }>;
    readonly get_player_stats: z.ZodObject<{
        type: z.ZodLiteral<"get_player_stats">;
    }, "strip", z.ZodTypeAny, {
        type: "get_player_stats";
    }, {
        type: "get_player_stats";
    }>;
    readonly _client_ping: z.ZodObject<{
        type: z.ZodLiteral<"_client_ping">;
        t: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "_client_ping";
        t?: number | undefined;
    }, {
        type: "_client_ping";
        t?: number | undefined;
    }>;
};
export type MessageType = keyof typeof MessageSchemas;
export interface ValidationResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    type?: string;
}
/**
 * Validate incoming WebSocket message
 */
export declare function validateMessage(rawData: string): ValidationResult;
/**
 * Check if message type requires authentication
 */
export declare function requiresAuth(messageType: string): boolean;
export {};
//# sourceMappingURL=validator.d.ts.map