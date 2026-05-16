import type { WebSocket } from 'ws';
import type { GameMode } from '../types/index.js';
import { validateInitData, parseInitDataUnsafe, extractStartParam, validateYandexSignature, parseYandexPlayerUnsafe } from '../services/auth.js';
import { findOrCreateUser, findOrCreateYandexUser, getUserInventory, getShopItems, setNickname, equipItem, getUserByUsername, getUserById, updatePips, getUserPips } from '../services/users.js';
import { getFriends, addFriend, removeFriend, sendFriendRequest, getPendingFriendRequests, acceptFriendRequest, declineFriendRequest } from '../services/friends.js';
import { getReferralStats, getReferralList } from '../services/referrals.js';
import { activateBoost, getActiveBoosts, getBoostState } from '../services/boosts.js';
import { BettingManager } from '../services/betting.js';
import * as lobby from '../services/lobby.js';
import * as game from '../services/game.js';
import * as matchmaking from '../services/matchmaking.js';
import { getPlayerStats } from '../services/stats.js';
import * as connections from './connections.js';
import { setUserIdForWs } from './server.js';
import { config } from '../config.js';
import { query } from '../db/client.js';
import { sendGameInvite, createStarsInvoice } from '../services/telegram.js';
import { logger } from '../utils/logger.js';
import { metricsCollector } from '../utils/metrics.js';
import { validateRoll } from '../utils/anti-fraud.js';

// Storage for last frame of each player's throw (for reconnect)
// Key: lobbyId, Value: Map of playerId -> last frame data
const lastFrameStorage = new Map<string, Map<number, any>>();

// Message is already validated by server.ts, so we receive typed data
export async function handleMessage(ws: WebSocket, message: any, userId: number | null): Promise<number | null> {
  // Auth message - no userId required
  if (message.type === 'auth') {
    metricsCollector.authAttempt();
    if (message.platform === 'yandex') {
      return handleYandexAuth(ws, message.signedData ?? null, message.playerInfo ?? null);
    }
    return handleAuth(ws, message.initData);
  }
  
  // Admin gift - special handler for gift script (no auth required, sends to target user)
  if (message.type === 'admin_gift') {
    await handleAdminGift(message.targetUserId, message.item);
    return userId;
  }
  
  // All other messages require authentication (already checked in server.ts)
  if (!userId) {
    return null;
  }
  
  try {
    switch (message.type) {
      // Client ping (for connection check) - just ignore
      case '_client_ping':
        // Do nothing - this is just to check if connection is alive
        break;
        
      // Profile
      case 'set_nickname':
        await handleSetNickname(userId, message.nickname);
        break;
      case 'equip_item':
        await handleEquipItem(userId, message.itemId, message.slot);
        break;
      case 'get_shop_items':
        await handleGetShopItems(userId);
        break;
      case 'purchase_item':
        metricsCollector.purchaseAttempt();
        await handlePurchaseItem(userId, message.itemId);
        break;
        
      // Friends
      case 'search_user':
        await handleSearchUser(userId, message.username);
        break;
      case 'get_friends':
        await handleGetFriends(userId);
        break;
      case 'add_friend':
        await handleAddFriend(userId, message.friendId);
        break;
      case 'remove_friend':
        await handleRemoveFriend(userId, message.friendId);
        break;
      case 'get_friend_requests':
        await handleGetFriendRequests(userId);
        break;
      case 'respond_friend_request':
        await handleRespondFriendRequest(userId, message.requestId, message.accept);
        break;
        
      // Referrals
      case 'get_referral_stats':
        await handleGetReferralStats(userId);
        break;
      case 'get_referral_list':
        await handleGetReferralList(userId);
        break;
        
      // Lobby
      case 'create_lobby': {
        // New protocol: `bet` is the per-player stake in pips. `0`
        // (or omitted with `noBet: true`) means a no-bet lobby.
        //
        // Legacy protocol (Telegram callsites): `noBet: true`. When
        // both are absent we default to a regular betting lobby.
        const bet =
          typeof message.bet === 'number'
            ? message.bet
            : message.noBet === true
              ? 0
              : undefined;
        await handleCreateLobby(
          userId,
          message.gameMode,
          message.screenWidth,
          message.screenHeight,
          bet,
        );
        break;
      }
      case 'join_lobby':
        await handleJoinLobby(userId, message.lobbyId, message.screenWidth, message.screenHeight);
        break;
      case 'leave_lobby':
        await handleLeaveLobby(userId);
        break;
      case 'reconnect_game':
        await handleReconnectGame(userId, message.lobbyId);
        break;
      case 'vote_table':
        await handleVoteTable(userId, message.tableId);
        break;
      case 'start_game':
        await handleStartGame(userId);
        break;
      case 'restart_game':
        await handleRestartGame(userId);
        break;
        
      // Invitations
      case 'invite_friend':
        await handleInviteFriend(userId, message.friendId);
        break;
      case 'get_invitations':
        await handleGetInvitations(userId);
        break;
      case 'respond_invitation':
        await handleRespondInvitation(userId, message.invitationId, message.accept);
        break;
      
      // Game - Free Roll
      case 'roll_dice':
        await handleRollDice(userId, message.dice1, message.dice2);
        break;
      case 'throw_dice_sync':
        await handleThrowDiceSync(userId, message.throwData);
        break;
      case 'player_ready':
        await handlePlayerReady(userId);
        break;
      case 'throw_start':
        await handleThrowStart(userId, message.throwPower, message.effectId, message.selectedDice);
        break;
      case 'throw_frame':
        await handleThrowFrame(userId, message.frame);
        break;
      case 'throw_sound':
        await handleThrowSound(userId, message.soundType, message.velocity, message.time);
        break;
      case 'throw_end':
        await handleThrowEnd(userId, message.finalResult);
        break;
      case 'pass_turn':
        await handlePassTurn(userId);
        break;
      case 'greedy_pig_stop':
        await handleGreedyPigStop(userId);
        break;
      
      // Palmo's Dice actions
      case 'palmos_take':
        await handlePalmosTake(userId);
        break;
      case 'palmos_reroll':
        await handlePalmosReroll(userId, message.selectedDice);
        break;
      
      // Solo mode roll complete (for pips tracking)
      case 'solo_roll_complete':
        await handleSoloRollComplete(userId, message);
        break;
      
      // Boosts
      case 'activate_boost':
        await handleActivateBoost(userId, message.boostId, message.parity);
        break;
      
      case 'get_boost_states':
        await handleGetBoostStates(userId);
        break;
      
      // Custom dice
      case 'save_custom_dice':
        await handleSaveCustomDice(userId, message.config);
        break;

      // Yandex Games: push the player's locally-equipped dice / table /
      // effect configs to the server so the server can broadcast them to
      // opponents in multiplayer.
      case 'set_player_items':
        handleSetPlayerItems(userId, {
          dice: message.dice,
          table: message.table,
          effect: message.effect,
        });
        break;
      
      // Reactions
      case 'send_reaction':
        await handleSendReaction(userId, message.content);
        break;
      
      // Betting
      case 'place_bet':
        await handlePlaceBet(userId, message.amount);
        break;
      case 'confirm_bet':
        await handleConfirmBet(userId);
        break;
      case 'cancel_bet':
        await handleCancelBet(userId);
        break;

      // Matchmaking (Yandex quick-play)
      case 'mm_join_queue':
        await matchmaking.joinQueue({
          userId,
          mode: message.mode,
          betAmount: message.betAmount,
          gameMode: message.gameMode,
        });
        break;
      case 'mm_leave_queue':
        matchmaking.leaveQueue(userId);
        break;
      case 'mm_ready':
        matchmaking.markReady(userId);
        break;
      case 'sync_yandex_pips':
        await handleSyncYandexPips(userId, message.pips);
        break;
      case 'get_player_stats':
        await handleGetPlayerStats(userId);
        break;

      default:
        connections.send(userId, { type: 'error', message: `Unknown message type: ${message.type}` });
    }
  } catch (err) {
    logger.error(`Error handling ${message.type}`, err, { userId, action: message.type });
    connections.send(userId, { type: 'error', message: 'Internal server error' });
  }
  
  return userId;
}

// === Admin ===
async function handleAdminGift(targetUserId: number, item: any): Promise<void> {
  // Send gift notification to target user if they're online
  const conn = connections.getConnection(targetUserId);
  if (conn) {
    // Get updated inventory
    const inventory = await getUserInventory(targetUserId);
    
    // Send item_received notification
    connections.send(targetUserId, {
      type: 'item_received',
      item: Array.isArray(item) ? item : [item],
      inventory
    });
    
    logger.info('Admin gift sent', { targetUserId, item });
  }
}

// === Auth ===
async function handleYandexAuth(
  ws: WebSocket,
  signedData: string | null,
  playerInfo: { uuid?: string; publicName?: string; avatarUrlSmall?: string; avatarUrlMedium?: string; avatarUrlLarge?: string; lang?: string } | null,
): Promise<number | null> {
  // Verified payload (uuid) takes precedence over playerInfo.uuid. In prod we
  // require a valid HMAC; in dev we fall back to the unsafe parser so local
  // npm run dev works without YANDEX_APP_SECRET set.
  const verified = signedData ? validateYandexSignature(signedData) : null;

  let yandexPlayer: import('../types/index.js').YandexPlayer | null = null;
  if (verified) {
    yandexPlayer = {
      uuid: verified.uuid,
      publicName: playerInfo?.publicName,
      avatarUrlSmall: playerInfo?.avatarUrlSmall,
      avatarUrlMedium: playerInfo?.avatarUrlMedium,
      avatarUrlLarge: playerInfo?.avatarUrlLarge,
      lang: playerInfo?.lang,
    };
  } else if (config.isDev) {
    yandexPlayer = parseYandexPlayerUnsafe(signedData, playerInfo ?? null);
  }

  if (!yandexPlayer) {
    metricsCollector.authFailure();
    logger.warn('Yandex auth failed', { hasSignedData: !!signedData });
    ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid Yandex signature' }));
    return null;
  }

  const user = await findOrCreateYandexUser(yandexPlayer);
  const inventory = await getUserInventory(user.id);
  const activeBoosts = await getActiveBoosts(user.id);

  setUserIdForWs(ws, user.id);
  connections.addConnection(user, ws);

  const reconnectInfo = lobby.canReconnect(user.id);

  ws.send(JSON.stringify({
    type: 'auth_success',
    user,
    inventory,
    activeBoosts,
    canReconnect: reconnectInfo ? {
      lobbyId: reconnectInfo.lobbyId,
      timeLeft: reconnectInfo.timeLeft,
    } : null,
  }));

  metricsCollector.authSuccess();
  logger.info('Yandex user authenticated', {
    userId: user.id,
    yandexId: user.yandexId,
    nickname: user.nickname,
    canReconnect: !!reconnectInfo,
  });

  return user.id;
}

async function handleAuth(ws: WebSocket, initData: string): Promise<number | null> {
  const telegramUser = config.isDev 
    ? parseInitDataUnsafe(initData) 
    : validateInitData(initData);
  
  if (!telegramUser) {
    metricsCollector.authFailure();
    logger.warn('Auth failed: invalid initData');
    ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid initData' }));
    return null;
  }
  
  // Extract referral code from start_param
  const startParam = extractStartParam(initData);
  const referralCode = startParam?.startsWith('ref_') ? startParam.substring(4) : null;
  
  logger.info('Auth attempt', { 
    telegramId: telegramUser.id, 
    startParam, 
    referralCode,
    hasReferral: !!referralCode 
  });
  
  const user = await findOrCreateUser(telegramUser, referralCode);
  const inventory = await getUserInventory(user.id);
  
  // Get active boosts
  const activeBoosts = await getActiveBoosts(user.id);
  
  // Set userId in server map BEFORE sending auth_success
  setUserIdForWs(ws, user.id);
  
  connections.addConnection(user, ws);
  
  // Check if user can reconnect to a game
  const reconnectInfo = lobby.canReconnect(user.id);
  
  ws.send(JSON.stringify({
    type: 'auth_success',
    user,
    inventory,
    activeBoosts,
    // Include reconnect info if available
    canReconnect: reconnectInfo ? {
      lobbyId: reconnectInfo.lobbyId,
      timeLeft: reconnectInfo.timeLeft
    } : null
  }));
  
  metricsCollector.authSuccess();
  logger.info('User authenticated', { 
    userId: user.id, 
    nickname: user.nickname,
    canReconnect: !!reconnectInfo 
  });
  
  // Notify friends that user is online
  const friends = await getFriends(user.id);
  for (const friend of friends) {
    connections.send(friend.friendId, {
      type: 'friend_online',
      friendId: user.id,
      nickname: user.nickname,
    });
  }
  
  return user.id;
}

// === Profile ===
async function handleSetNickname(userId: number, nickname: string): Promise<void> {
  const success = await setNickname(userId, nickname);
  
  if (success) {
    connections.send(userId, { type: 'nickname_changed', nickname });
  } else {
    connections.send(userId, { type: 'error', message: 'Nickname is invalid or already taken' });
  }
}

// Stash the client-supplied dice/table/effect overrides on the
// connection. See `connections.ClientItemOverride` for the rationale.
// Called synchronously by the message dispatcher — no DB writes, no
// broadcasts; the next `game_started` / `throw_start` will pick the
// overrides up.
function handleSetPlayerItems(
  userId: number,
  items: {
    dice?: connections.ClientItemOverride | null;
    table?: connections.ClientItemOverride | null;
    effect?: connections.ClientItemOverride | null;
  },
): void {
  connections.setClientItemOverride(userId, 'dice', items.dice);
  connections.setClientItemOverride(userId, 'table', items.table);
  connections.setClientItemOverride(userId, 'effect', items.effect);
}

// Synthetic, per-user item IDs for client-supplied dice/table/effect
// configs (Yandex Cloud Save). Chosen well above the real `item_catalog`
// id range so they cannot collide with any DB row. The shape matches
// what client code uses to key configs in `availableItems`.
const SYNTHETIC_ITEM_ID_OFFSET = 1_000_000_000;
function syntheticItemId(userId: number, slot: 'dice' | 'table' | 'effect'): number {
  const slotOffset = slot === 'dice' ? 1 : slot === 'table' ? 2 : 3;
  return SYNTHETIC_ITEM_ID_OFFSET + userId * 10 + slotOffset;
}

// Build the `availableItems` payload for a game_started broadcast,
// merging DB-equipped items (Telegram path) with client-supplied
// overrides (Yandex path). Also returns the per-player effective IDs
// the client should treat as each player's equipped slot, so the
// `lobby.players[].user.equippedDiceId` fields can be patched to match.
export interface LobbyPlayerLike {
  user: { id: number; equippedDiceId: number | null; equippedTableId: number | null; equippedEffectId: number | null };
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
export async function buildAvailableItemsAndOverrides(
  players: LobbyPlayerLike[],
): Promise<{ availableItems: AvailableItem[]; equipOverrides: PlayerEquipOverride[] }> {
  const availableItems: AvailableItem[] = [];
  const seenItemIds = new Set<number>();
  const equipOverrides: PlayerEquipOverride[] = [];

  for (const player of players) {
    const userId = player.user.id;
    if (!userId) continue;

    const override: PlayerEquipOverride = { userId };
    const slots: Array<'dice' | 'table' | 'effect'> = ['dice', 'table', 'effect'];
    for (const slot of slots) {
      const clientItem = connections.getClientItemOverride(userId, slot);
      const dbItemId =
        slot === 'dice'
          ? player.user.equippedDiceId
          : slot === 'table'
            ? player.user.equippedTableId
            : player.user.equippedEffectId;

      if (clientItem) {
        // Client supplied an override — synthesize an id and inject the
        // config directly into availableItems.
        const id = syntheticItemId(userId, slot);
        if (!seenItemIds.has(id)) {
          seenItemIds.add(id);
          availableItems.push({
            id,
            type: slot,
            code: clientItem.code,
            name: clientItem.name,
            config: clientItem.config,
          });
        }
        if (slot === 'dice') override.equippedDiceId = id;
        else if (slot === 'table') override.equippedTableId = id;
        else override.equippedEffectId = id;
      } else if (dbItemId && !seenItemIds.has(dbItemId)) {
        seenItemIds.add(dbItemId);
        const result = await query<{ id: number; type: string; code: string; name: string; config: Record<string, unknown> | string | null }>(
          'SELECT id, type, code, name, config FROM item_catalog WHERE id = $1',
          [dbItemId],
        );
        if (result.rows[0]) {
          const row = result.rows[0];
          availableItems.push({
            id: row.id,
            type: row.type,
            code: row.code,
            name: row.name,
            config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
          });
        }
      }
    }

    if (
      override.equippedDiceId !== undefined ||
      override.equippedTableId !== undefined ||
      override.equippedEffectId !== undefined
    ) {
      equipOverrides.push(override);
    }
  }

  return { availableItems, equipOverrides };
}

// Apply client-side equip overrides to a lobby payload so opponents see
// the synthetic IDs and can match them up with `availableItems`.
export function applyEquipOverridesToLobby(
  lobbyPayload: { players?: LobbyPlayerLike[] } | null | undefined,
  overrides: PlayerEquipOverride[],
): void {
  if (!lobbyPayload?.players || overrides.length === 0) return;
  const byUser = new Map(overrides.map((o) => [o.userId, o]));
  for (const player of lobbyPayload.players) {
    const userId = player.user.id;
    if (!userId) continue;
    const o = byUser.get(userId);
    if (!o) continue;
    if (o.equippedDiceId !== undefined) player.user.equippedDiceId = o.equippedDiceId;
    if (o.equippedTableId !== undefined) player.user.equippedTableId = o.equippedTableId;
    if (o.equippedEffectId !== undefined) player.user.equippedEffectId = o.equippedEffectId;
  }
}

async function handleEquipItem(userId: number, itemId: number, slot: 'dice' | 'table' | 'effect'): Promise<void> {
  // Block table equip during active game
  const conn = connections.getConnection(userId);
  if (slot === 'table' && conn?.lobbyId) {
    const lobbyData = await lobby.getLobby(conn.lobbyId);
    if (lobbyData?.status === 'playing') {
      connections.send(userId, { type: 'error', message: 'Cannot change table during game' });
      return;
    }
  }
  
  const success = await equipItem(userId, itemId, slot);
  
  if (success) {
    // Update cached user data in connection
    connections.updateUserEquipment(userId, slot, itemId);
    
    // Clear dice config cache when equipping a dice to ensure fresh config is loaded
    if (slot === 'dice' && itemId) {
      lobby.clearDiceConfigCache(itemId);
    }
    
    connections.send(userId, { type: 'item_equipped', itemId, slot });
  } else {
    connections.send(userId, { type: 'error', message: 'Cannot equip this item' });
  }
}

async function handleGetShopItems(userId: number): Promise<void> {
  const items = await getShopItems();
  connections.send(userId, { type: 'shop_items', items });
}

async function handlePurchaseItem(userId: number, itemId: number): Promise<void> {
  // Get item details with config
  const itemResult = await query<{ 
    id: number; 
    name: string; 
    description: string; 
    price_stars: number;
    type: string;
    config: any;
  }>(
    'SELECT id, name, description, price_stars, type, config FROM item_catalog WHERE id = $1',
    [itemId]
  );
  
  if (itemResult.rows.length === 0) {
    connections.send(userId, { type: 'purchase_error', message: 'Item not found' });
    return;
  }
  
  const item = itemResult.rows[0];
  const config = typeof item.config === 'string' ? JSON.parse(item.config) : item.config;
  
  // Check if item is locked
  if (config?.locked) {
    connections.send(userId, { type: 'purchase_error', message: 'This item is not available yet' });
    return;
  }
  
  // Check if user already owns this item
  const ownershipResult = await query(
    'SELECT 1 FROM user_items WHERE user_id = $1 AND item_id = $2',
    [userId, itemId]
  );
  
  if (ownershipResult.rows.length > 0) {
    connections.send(userId, { type: 'purchase_error', message: 'You already own this item' });
    return;
  }
  
  // Check if item can be purchased with pips
  const pipsPrice = config?.pipsPrice;
  
  if (pipsPrice && pipsPrice > 0) {
    // Purchase with pips
    const userPips = await getUserPips(userId);
    
    if (userPips < pipsPrice) {
      connections.send(userId, { 
        type: 'purchase_error', 
        message: `Not enough pips. Need ${pipsPrice}, have ${userPips}` 
      });
      return;
    }
    
    // Deduct pips
    await query('UPDATE users SET pips = pips - $1 WHERE id = $2', [pipsPrice, userId]);
    
    // Grant item
    await query(
      'INSERT INTO user_items (user_id, item_id) VALUES ($1, $2)',
      [userId, itemId]
    );
    
    // Get updated inventory and pips
    const inventory = await getUserInventory(userId);
    const newPips = await getUserPips(userId);
    
    connections.send(userId, {
      type: 'purchase_success_pips',
      itemId: item.id,
      itemName: item.name,
      pipsSpent: pipsPrice,
      newPips,
      inventory
    });
    
    logger.info('[PIPS] Item purchased with pips', { userId, itemId, pipsPrice, newPips });
    return;
  }
  
  // Purchase with stars (existing logic)
  if (item.price_stars <= 0) {
    connections.send(userId, { type: 'purchase_error', message: 'Item not for sale' });
    return;
  }
  
  // Create invoice link
  const result = await createStarsInvoice(
    userId,
    item.id,
    item.name,
    item.description || `Purchase ${item.name} in Street Dice`,
    item.price_stars
  );
  
  if (result.success && result.invoiceUrl) {
    connections.send(userId, { 
      type: 'purchase_invoice', 
      invoiceUrl: result.invoiceUrl,
      itemId: item.id,
      itemName: item.name,
      priceStars: item.price_stars
    });
  } else {
    connections.send(userId, { type: 'purchase_error', message: result.error || 'Failed to create invoice' });
  }
}

// === Friends ===
async function handleSearchUser(userId: number, username: string): Promise<void> {
  const user = await getUserByUsername(username);
  
  if (user && user.id !== userId) {
    connections.send(userId, { 
      type: 'user_found', 
      user: {
        id: user.id,
        nickname: user.nickname,
        telegramUsername: user.telegramUsername,
        avatarUrl: user.avatarUrl,
      }
    });
  } else {
    connections.send(userId, { type: 'user_not_found', username });
  }
}

async function handleGetFriends(userId: number): Promise<void> {
  const friends = await getFriends(userId);
  connections.send(userId, { type: 'friends_list', friends });
}

async function handleAddFriend(userId: number, friendId: number): Promise<void> {
  const result = await sendFriendRequest(userId, friendId);
  
  if (result.success) {
    if (result.requestId) {
      // Friend request sent
      connections.send(userId, { type: 'friend_request_sent', friendId });
      
      // Notify the other user about the friend request
      const conn = connections.getConnection(userId);
      if (conn) {
        connections.send(friendId, {
          type: 'friend_request_received',
          request: {
            id: result.requestId,
            fromUserId: userId,
            fromNickname: conn.user.nickname,
            fromAvatarUrl: conn.user.avatarUrl,
          }
        });
      }
    } else {
      // Auto-accepted (reverse request existed) - both are now friends
      const friends = await getFriends(userId);
      connections.send(userId, { type: 'friends_list', friends });
      connections.send(userId, { type: 'friend_added', friendId });
      
      // Notify the other user
      const otherFriends = await getFriends(friendId);
      connections.send(friendId, { type: 'friends_list', friends: otherFriends });
      connections.send(friendId, { type: 'friend_added', oderId: userId });
    }
  } else {
    connections.send(userId, { type: 'error', message: 'Cannot send friend request' });
  }
}

async function handleRemoveFriend(userId: number, friendId: number): Promise<void> {
  const success = await removeFriend(userId, friendId);
  
  if (success) {
    // Update sender's friend list
    const friends = await getFriends(userId);
    connections.send(userId, { type: 'friends_list', friends });
    connections.send(userId, { type: 'friend_removed', friendId });
    
    // Notify the removed friend and update their list too
    const otherFriends = await getFriends(friendId);
    connections.send(friendId, { type: 'friends_list', friends: otherFriends });
    connections.send(friendId, { type: 'friend_removed_you', oderId: userId });
  } else {
    connections.send(userId, { type: 'error', message: 'Cannot remove this friend' });
  }
}

async function handleGetFriendRequests(userId: number): Promise<void> {
  const requests = await getPendingFriendRequests(userId);
  connections.send(userId, { 
    type: 'friend_requests_list', 
    requests: requests.map(r => ({
      id: r.id,
      fromUserId: r.from_user_id,
      fromNickname: r.from_nickname,
      fromAvatarUrl: r.from_avatar_url,
      createdAt: r.created_at,
    }))
  });
}

async function handleRespondFriendRequest(userId: number, requestId: number, accept: boolean): Promise<void> {
  if (accept) {
    const result = await acceptFriendRequest(requestId, userId);
    if (result.success && result.fromUserId) {
      // Update both users' friend lists
      const friends = await getFriends(userId);
      connections.send(userId, { type: 'friends_list', friends });
      connections.send(userId, { type: 'friend_request_accepted', requestId });
      
      const otherFriends = await getFriends(result.fromUserId);
      connections.send(result.fromUserId, { type: 'friends_list', friends: otherFriends });
      
      // Notify the requester that their request was accepted
      const conn = connections.getConnection(userId);
      connections.send(result.fromUserId, { 
        type: 'friend_request_was_accepted', 
        byUserId: userId,
        byNickname: conn?.user.nickname 
      });
    } else {
      connections.send(userId, { type: 'error', message: 'Cannot accept friend request' });
    }
  } else {
    const success = await declineFriendRequest(requestId, userId);
    if (success) {
      connections.send(userId, { type: 'friend_request_declined', requestId });
    } else {
      connections.send(userId, { type: 'error', message: 'Cannot decline friend request' });
    }
  }
}

// === Referrals ===
async function handleGetReferralStats(userId: number): Promise<void> {
  const stats = await getReferralStats(userId);
  
  // Get user's referral code
  const userResult = await query<{ referral_code: string }>(
    'SELECT referral_code FROM users WHERE id = $1',
    [userId]
  );
  
  const referralCode = userResult.rows[0]?.referral_code || '';
  
  connections.send(userId, {
    type: 'referral_stats',
    stats,
    referralCode,
  });
}

async function handleGetReferralList(userId: number): Promise<void> {
  const referrals = await getReferralList(userId);
  
  connections.send(userId, {
    type: 'referral_list',
    referrals,
  });
}

// === Lobby ===
async function handleCreateLobby(
  userId: number,
  gameMode: GameMode,
  screenWidth?: number,
  screenHeight?: number,
  bet?: number,
): Promise<void> {
  // Check if already in a lobby
  const conn = connections.getConnection(userId);
  if (conn?.lobbyId) {
    connections.send(userId, { type: 'error', message: 'Already in a lobby' });
    return;
  }

  if (matchmaking.isQueued(userId)) {
    matchmaking.leaveQueue(userId);
  }

  // `bet === 0` (and the legacy `noBet: true` path) opt into the no-bet
  // lobby flavour; any positive value or `undefined` keeps the regular
  // betting flow.
  const noBet = bet === 0;
  const betAmount = noBet ? 0 : bet ?? 10;
  const newLobby = await lobby.createLobby(userId, gameMode, noBet, betAmount);
  metricsCollector.lobbyCreated();
  
  // Store screen size
  if (screenWidth && screenHeight) {
    lobby.setPlayerScreenSize(newLobby.id, userId, screenWidth, screenHeight);
  }
  
  const lobbyData = await lobby.getLobby(newLobby.id);
  
  // Preload dice config for host (in case they changed dice)
  if (conn?.user.equippedDiceId) {
    await lobby.getDiceConfig(conn.user.equippedDiceId);
  }
  
  connections.send(userId, { type: 'lobby_created', lobby: lobbyData });
  logger.info('Lobby created', { userId, lobbyId: newLobby.id, gameMode });
  
  // Notify friends that user is now in lobby
  notifyFriendsStatusChanged(userId, 'in_lobby');
}

async function handleJoinLobby(userId: number, lobbyId: string, screenWidth?: number, screenHeight?: number): Promise<void> {
  if (matchmaking.isQueued(userId)) {
    matchmaking.leaveQueue(userId);
  }

  const success = await lobby.joinLobby(lobbyId, userId);
  
  if (success) {
    // Store screen size
    if (screenWidth && screenHeight) {
      lobby.setPlayerScreenSize(lobbyId, userId, screenWidth, screenHeight);
    }
    
    const lobbyData = await lobby.getLobby(lobbyId);
    connections.send(userId, { type: 'lobby_joined', lobby: lobbyData });
    
    // Initialize betting if 2+ players (skip entirely for no-bet lobbies).
    if (
      lobbyData &&
      !lobby.isNoBetLobby(lobbyId) &&
      lobbyData.players.length >= 2
    ) {
      if (!BettingManager.isActive(lobbyId)) {
        BettingManager.initialize(lobbyId, lobby.getLobbyBetAmount(lobbyId));
        logger.info('[BETTING] Initialized for lobby', { lobbyId, playerCount: lobbyData.players.length });
      }
    }
    
    // Notify friends that user is now in lobby
    notifyFriendsStatusChanged(userId, 'in_lobby');
    
    // Notify other players - use cached user data and preload dice config
    const conn = connections.getConnection(userId);
    if (conn) {
      // Preload dice config for this player (in case they changed dice)
      if (conn.user.equippedDiceId) {
        await lobby.getDiceConfig(conn.user.equippedDiceId);
      }
      
      const user = conn.user;
      
      // Get table name if equipped
      let equippedTableName: string | null = null;
      if (user.equippedTableId) {
        const tableResult = await query<{ name: string }>(
          `SELECT name FROM item_catalog WHERE id = $1 AND type = 'table'`,
          [user.equippedTableId]
        );
        if (tableResult.rows.length > 0) {
          equippedTableName = tableResult.rows[0].name;
        }
      }
      
      broadcastToLobby(lobbyId, {
        type: 'player_joined',
        player: {
          oderId: userId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          equippedDiceId: user.equippedDiceId,
          equippedTableId: user.equippedTableId,
          equippedTableName,
          equippedEffectId: user.equippedEffectId,
        }
      }, userId);
    }
  } else {
    connections.send(userId, { type: 'error', message: 'Cannot join lobby' });
  }
}

async function handleLeaveLobby(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId) {
    connections.send(userId, { type: 'error', message: 'Not in a lobby' });
    return;
  }
  
  const lobbyId = conn.lobbyId;
  
  // Get pending invitation users before leaving (to notify them if lobby closes)
  const pendingInviteUsers = await lobby.getPendingInvitationUsers(lobbyId);
  
  await lobby.leaveLobby(lobbyId, userId);
  
  // Get updated pips balance
  const newPips = await getUserPips(userId);
  
  connections.send(userId, { 
    type: 'lobby_left',
    newPips 
  });
  
  // Check if lobby was closed (no players left)
  const lobbyData = await lobby.getLobby(lobbyId);
  if (!lobbyData || lobbyData.status === 'finished') {
    // Notify all users with pending invitations that the lobby was closed
    for (const invitedUserId of pendingInviteUsers) {
      connections.send(invitedUserId, {
        type: 'invitation_cancelled',
        lobbyId,
      });
    }
  }
  
  // Notify other players
  broadcastToLobby(lobbyId, {
    type: 'player_left',
    oderId: userId,
  }, userId);
  
  // Notify friends that user is back online (not in lobby anymore)
  notifyFriendsStatusChanged(userId, 'online');
}

async function handleReconnectGame(userId: number, lobbyId: string): Promise<void> {
  // Check if user can reconnect
  const reconnectInfo = lobby.canReconnect(userId);
  if (!reconnectInfo || reconnectInfo.lobbyId !== lobbyId) {
    connections.send(userId, { type: 'reconnect_failed', message: 'Cannot reconnect to this game' });
    return;
  }
  
  // Reconnect the player
  const success = await lobby.reconnectPlayer(lobbyId, userId);
  if (!success) {
    connections.send(userId, { type: 'reconnect_failed', message: 'Reconnect failed' });
    return;
  }
  
  // Get current game state
  const lobbyData = await lobby.getLobby(lobbyId);
  const gameState = game.getGameState(lobbyId);
  const tableConfig = await lobby.getSelectedTableConfig(lobbyId);
  
  if (!lobbyData || !gameState) {
    connections.send(userId, { type: 'reconnect_failed', message: 'Game no longer exists' });
    return;
  }
  
  // Collect all equipped items from all players for client-side preloading
  const availableItems: any[] = [];
  const seenItemIds = new Set<number>();
  
  for (const player of lobbyData.players) {
    // Add dice
    if (player.user.equippedDiceId && !seenItemIds.has(player.user.equippedDiceId)) {
      seenItemIds.add(player.user.equippedDiceId);
      const diceResult = await query<{ id: number; type: string; code: string; name: string; config: Record<string, unknown> | string | null }>(
        'SELECT id, type, code, name, config FROM item_catalog WHERE id = $1',
        [player.user.equippedDiceId]
      );
      if (diceResult.rows[0]) {
        const row = diceResult.rows[0];
        availableItems.push({
          id: row.id,
          type: row.type,
          code: row.code,
          name: row.name,
          config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
        });
      }
    }
    
    // Add table
    if (player.user.equippedTableId && !seenItemIds.has(player.user.equippedTableId)) {
      seenItemIds.add(player.user.equippedTableId);
      const tableResult = await query<{ id: number; type: string; code: string; name: string; config: Record<string, unknown> | string | null }>(
        'SELECT id, type, code, name, config FROM item_catalog WHERE id = $1',
        [player.user.equippedTableId]
      );
      if (tableResult.rows[0]) {
        const row = tableResult.rows[0];
        availableItems.push({
          id: row.id,
          type: row.type,
          code: row.code,
          name: row.name,
          config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
        });
      }
    }
    
    // Add effect
    if (player.user.equippedEffectId && !seenItemIds.has(player.user.equippedEffectId)) {
      seenItemIds.add(player.user.equippedEffectId);
      const effectResult = await query<{ id: number; type: string; code: string; name: string; config: Record<string, unknown> | string | null }>(
        'SELECT id, type, code, name, config FROM item_catalog WHERE id = $1',
        [player.user.equippedEffectId]
      );
      if (effectResult.rows[0]) {
        const row = effectResult.rows[0];
        availableItems.push({
          id: row.id,
          type: row.type,
          code: row.code,
          name: row.name,
          config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
        });
      }
    }
  }
  
  // Send game state to reconnected player
  // Extract mode-specific state
  const modeState = gameState.modeState as Record<string, unknown> || {};
  
  // Convert Map to object for scores (Palmo's Dice uses Map)
  let scores = modeState.scores;
  if (scores instanceof Map) {
    scores = Object.fromEntries(scores);
  }
  
  // Get dice count from game state
  const diceCount = game.getDiceCount(lobbyId);
  
  // For Palmo's Dice, include current round state (dice on table)
  const currentRound = modeState.currentRound || null;
  
  // Get last frame for this player (if they were in middle of a throw)
  const lobbyFrames = lastFrameStorage.get(lobbyId);
  const lastFrame = lobbyFrames?.get(userId) || null;
  
  console.log(`[Reconnect] User ${userId} - Palmo's Dice state:`, {
    hasCurrentRound: !!currentRound,
    currentRoundPlayerId: (currentRound as any)?.playerId,
    hasLastFrame: !!lastFrame,
    lastFrameDiceCount: lastFrame?.dice?.length
  });
  
  connections.send(userId, {
    type: 'game_reconnected',
    lobby: { ...lobbyData, availableItems },
    currentTurn: gameState.currentTurn,
    playerOrder: gameState.playerOrder,
    phase: modeState.phase,
    pointValue: modeState.pointValue,
    penalties: modeState.penalties,
    scores,
    turnScore: modeState.turnScore,
    currentRound, // Include current round for Palmo's Dice
    lastFrame, // Include last frame for dice position restore
    tableConfig,
    throwSeed: gameState.throwSeed,
    minAspectRatio: lobby.getMinAspectRatio(lobbyId),
    diceCount,
  });
  
  // Notify other players that this player reconnected
  const player = lobbyData.players.find(p => p.oderId === userId);
  const playerNickname = player?.user?.nickname || 'Player';
  
  broadcastToLobby(lobbyId, {
    type: 'player_reconnected',
    oderId: userId,
    nickname: playerNickname,
  }, userId);
  
  console.log(`[Game] Player ${userId} reconnected to game ${lobbyId}`);
}

async function handleVoteTable(userId: number, tableId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId) {
    connections.send(userId, { type: 'error', message: 'Not in a lobby' });
    return;
  }
  
  await lobby.voteTable(conn.lobbyId, userId, tableId);
  
  // Get vote results and broadcast
  const results = lobby.getVoteResults(conn.lobbyId);
  broadcastToLobby(conn.lobbyId, {
    type: 'vote_update',
    votes: results,
    voterId: userId,
    tableId,
  });
  
  // Check if voting is complete (all players voted)
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  const votes = lobby.getVotes(conn.lobbyId);
  
  if (lobbyData && votes && votes.size === lobbyData.players.length) {
    // Select winning table
    const winner = results[0];
    if (winner) {
      await lobby.selectTable(conn.lobbyId, winner.tableId);
      broadcastToLobby(conn.lobbyId, {
        type: 'table_selected',
        tableId: winner.tableId,
      });
    }
  }
}

async function handleStartGame(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId) {
    connections.send(userId, { type: 'error', message: 'Not in a lobby' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.hostId !== userId) {
    connections.send(userId, { type: 'error', message: 'Only host can start the game' });
    return;
  }
  
  // Check if betting is required (2+ players). No-bet lobbies (e.g. the
  // Yandex Games build) always skip the betting UI and go straight into
  // gameplay regardless of player count.
  const playerIds = lobby.getLobbyPlayers(conn.lobbyId);
  const skipBetting = lobby.isNoBetLobby(conn.lobbyId);

  if (!skipBetting && playerIds.length >= 2) {
    // Check if betting is already active
    if (BettingManager.isActive(conn.lobbyId)) {
      const state = BettingManager.getState(conn.lobbyId);
      
      // If betting phase is not 'waiting', game is already starting
      if (state && state.bettingPhase !== 'waiting') {
        connections.send(userId, { type: 'error', message: 'Game is already starting' });
        return;
      }
    }
    
    logger.info('[BETTING] Showing betting UI', { lobbyId: conn.lobbyId, playerCount: playerIds.length });
    
    // Show betting UI to all players
    for (const playerId of playerIds) {
      const balance = await getUserPips(playerId);
      connections.send(playerId, {
        type: 'show_betting_ui',
        minBet: 10,
        balance
      });
    }
    
    return; // Don't start game yet - wait for bets
  }
  
  // No betting required (1 player) - start game immediately
  const success = await lobby.startGame(conn.lobbyId);
  
  if (success) {
    metricsCollector.gameStarted();
    
    const updatedLobby = await lobby.getLobby(conn.lobbyId);
    const currentTurn = game.getCurrentTurn(conn.lobbyId);
    const playerOrder = game.getPlayerOrder(conn.lobbyId);
    const minAspectRatio = lobby.getMinAspectRatio(conn.lobbyId);
    const gameState = game.getGameState(conn.lobbyId);
    
    // Preload dice configs for all players to cache (for fast throw_start)
    if (updatedLobby) {
      for (const player of updatedLobby.players) {
        if (player.user.equippedDiceId) {
          await lobby.getDiceConfig(player.user.equippedDiceId);
        }
      }
    }
    
    // Collect all equipped items (DB-backed and client-supplied) so the
    // client can preload every other player's dice / table / effect
    // config for replays. Patches lobby.players[*].user.equipped*Id to
    // the synthetic IDs when a client-supplied override is in play, so
    // the client can map players → configs via `availableItems` like
    // before.
    const { availableItems, equipOverrides } = await buildAvailableItemsAndOverrides(
      updatedLobby?.players ?? [],
    );
    applyEquipOverridesToLobby(updatedLobby, equipOverrides);
    
    // Get selected table config (fallback to host's equipped table if not selected)
    let tableConfig = await lobby.getSelectedTableConfig(conn.lobbyId);
    if (!tableConfig) {
      // Prefer a client-supplied table override (Yandex Cloud Save) over
      // the DB-equipped table.
      const hostTableOverride = connections.getClientItemOverride(userId, 'table');
      if (hostTableOverride && hostTableOverride.config) {
        tableConfig = hostTableOverride.config;
      } else {
        // Fallback: get host's equipped table config from connection cache
        const host = conn.user;
        if (host.equippedTableId) {
          const tableResult = await query<{ config: Record<string, unknown> | string | null }>(
            'SELECT config FROM item_catalog WHERE id = $1',
            [host.equippedTableId]
          );
          if (tableResult.rows[0]?.config) {
            const cfg = tableResult.rows[0].config;
            tableConfig = typeof cfg === 'string' ? JSON.parse(cfg) : cfg;
          }
        }
      }
    }
    
    // Build mode-specific data
    let modeData: Record<string, unknown> = {};
    if (updatedLobby?.gameMode === 'street_craps') {
      const crapsState = gameState?.modeState as { phase?: string; pointValue?: number | null } | undefined;
      modeData = {
        phase: crapsState?.phase || 'come_out',
        pointValue: crapsState?.pointValue || null,
      };
    } else if (updatedLobby?.gameMode === 'mexico') {
      const mexicoState = gameState?.modeState as { penalties?: Map<number, number> } | undefined;
      modeData = {
        penalties: mexicoState?.penalties ? Object.fromEntries(mexicoState.penalties) : {},
      };
    }
    
    broadcastToLobby(conn.lobbyId, {
      type: 'game_started',
      lobby: { ...updatedLobby, availableItems },
      currentTurn,
      playerOrder,
      minAspectRatio,
      tableConfig,
      throwSeed: gameState?.throwSeed,
      diceCount: game.getDiceCount(conn.lobbyId),
      ...modeData,
    });
    
    logger.info('Game started', { 
      lobbyId: conn.lobbyId, 
      gameMode: updatedLobby?.gameMode,
      players: playerOrder.length 
    });
    
    // Notify friends of all players that they are now in game
    for (const playerId of playerOrder) {
      notifyFriendsStatusChanged(playerId, 'in_game');
    }
  } else {
    connections.send(userId, { type: 'error', message: 'Cannot start game yet' });
  }
}

async function handleRestartGame(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId) {
    connections.send(userId, { type: 'error', message: 'Not in a lobby' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.hostId !== userId) {
    connections.send(userId, { type: 'error', message: 'Only host can restart the game' });
    return;
  }
  
  // Check if betting is required (2+ players)
  const playerIds = lobby.getLobbyPlayers(conn.lobbyId);
  
  if (playerIds.length >= 2) {
    // Initialize betting for new game
    BettingManager.initialize(conn.lobbyId, lobby.getLobbyBetAmount(conn.lobbyId));
    logger.info('[BETTING] Initialized for restart', { lobbyId: conn.lobbyId, playerCount: playerIds.length });
    
    // Show betting UI to all players with their balances
    for (const playerId of playerIds) {
      const balance = await getUserPips(playerId);
      connections.send(playerId, {
        type: 'show_betting_ui',
        minBet: 10,
        balance
      });
    }
    
    logger.info('[BETTING] Showing betting UI for restart', { lobbyId: conn.lobbyId });
    return; // Wait for bets to be placed
  }
  
  // Single player - start game immediately
  await startGameAfterBetting(conn.lobbyId);
}

// Helper function to start game (used by both handleStartGame and handleRestartGame)
async function startGameAfterBetting(lobbyId: string): Promise<void> {
  const lobbyData = await lobby.getLobby(lobbyId);
  if (!lobbyData) return;
  
  // Re-initialize the game
  await game.initializeGame(lobbyId, lobbyData.gameMode);
  
  const currentTurn = game.getCurrentTurn(lobbyId);
  const playerOrder = game.getPlayerOrder(lobbyId);
  const minAspectRatio = lobby.getMinAspectRatio(lobbyId);
  const gameState = game.getGameState(lobbyId);
  
  // Collect all equipped items (DB-backed and client-supplied) for
  // client-side preloading. See `buildAvailableItemsAndOverrides`.
  const { availableItems, equipOverrides } = await buildAvailableItemsAndOverrides(lobbyData.players);
  applyEquipOverridesToLobby(lobbyData, equipOverrides);
  
  // Build mode-specific data
  let modeData: Record<string, unknown> = {};
  if (lobbyData.gameMode === 'street_craps') {
    const crapsState = gameState?.modeState as { phase?: string; pointValue?: number | null } | undefined;
    modeData = {
      phase: crapsState?.phase || 'come_out',
      pointValue: crapsState?.pointValue || null,
    };
  } else if (lobbyData.gameMode === 'mexico') {
    const mexicoState = gameState?.modeState as { penalties?: Map<number, number> } | undefined;
    modeData = {
      penalties: mexicoState?.penalties ? Object.fromEntries(mexicoState.penalties) : {},
    };
  }
  
  broadcastToLobby(lobbyId, {
    type: 'game_started',
    lobby: { ...lobbyData, availableItems },
    currentTurn,
    playerOrder,
    minAspectRatio,
    throwSeed: gameState?.throwSeed,
    diceCount: game.getDiceCount(lobbyId),
    ...modeData,
  });
}

// === Invitations ===
async function handleInviteFriend(userId: number, friendId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId) {
    connections.send(userId, { type: 'error', message: 'Create a lobby first' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData) {
    connections.send(userId, { type: 'error', message: 'Lobby not found' });
    return;
  }
  
  const invitation = await lobby.createInvitation(conn.lobbyId, userId, friendId, lobbyData.gameMode);
  
  if (invitation) {
    connections.send(userId, { type: 'invitation_sent', friendId });
    
    // Get sender info from connection
    const senderConn = connections.getConnection(userId);
    
    // Check if friend is online (has active connection)
    const friendConn = connections.getConnection(friendId);
    
    if (friendConn) {
      // Friend is online - send WebSocket notification
      connections.send(friendId, {
        type: 'invitation_received',
        invitation: {
          ...invitation,
          fromUser: { nickname: senderConn?.user.nickname },
        }
      });
    } else {
      // Friend is offline - send Telegram bot message
      const friend = await getUserById(friendId);
      if (friend?.telegramId && senderConn?.user.nickname) {
        const sent = await sendGameInvite(
          friend.telegramId,
          senderConn.user.nickname,
          conn.lobbyId,
          lobbyData.gameMode
        );
        if (sent) {
          console.log(`[Invite] Sent Telegram invite to ${friend.nickname} (${friend.telegramId})`);
        }
      }
    }
  } else {
    connections.send(userId, { type: 'error', message: 'Already invited' });
  }
}

async function handleGetInvitations(userId: number): Promise<void> {
  const invitations = await lobby.getPendingInvitations(userId);
  connections.send(userId, { type: 'invitations_list', invitations });
}

async function handleRespondInvitation(userId: number, invitationId: number, accept: boolean): Promise<void> {
  const result = await lobby.respondToInvitation(invitationId, accept);
  
  if (accept && result.lobbyId) {
    // Auto-join the lobby
    await handleJoinLobby(userId, result.lobbyId);
  } else {
    connections.send(userId, { type: 'invitation_declined' });
    
    // Notify the sender that their invite was declined so they can re-invite
    if (result.fromUserId && result.toUserId) {
      connections.send(result.fromUserId, {
        type: 'invitation_response',
        toUserId: result.toUserId,
        accepted: false,
      });
    }
  }
}

// === Game - Free Roll ===

// Player ready handler - notify observers to preload dice config
async function handlePlayerReady(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    return;
  }
  
  // Use cached user data from connection
  const user = conn.user;
  
  // Get dice config from cache
  let diceConfig = null;
  if (user.equippedDiceId) {
    diceConfig = await lobby.getDiceConfig(user.equippedDiceId);
  }
  
  // Broadcast player_ready to all other players with dice config
  // This allows observers to preload the config before throw_start
  broadcastToLobby(conn.lobbyId, {
    type: 'player_ready',
    playerId: userId,
    playerNickname: user.nickname,
    equippedDiceId: user.equippedDiceId,
    diceConfig
  }, userId);
}

// Streaming throw handlers
async function handleThrowStart(userId: number, throwPower: number, effectId: number | null, selectedDice?: number[]): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  // Use cached lobby status instead of DB query for performance
  const lobbyStatus = lobby.getLobbyStatusCached(conn.lobbyId);
  if (!lobbyStatus || lobbyStatus.status !== 'playing') {
    connections.send(userId, { type: 'error', message: 'Game not active' });
    return;
  }
  
  // Check turn for Free Roll
  if (lobbyStatus.gameMode === 'free_roll') {
    const currentTurn = game.getCurrentTurn(conn.lobbyId);
    if (currentTurn !== userId) {
      connections.send(userId, { type: 'error', message: 'Not your turn' });
      return;
    }
  }
  
  // Use cached user data from connection
  const user = conn.user;

  // Prefer a client-supplied dice override (Yandex Cloud Save) over the
  // server's DB-equipped dice. See `Connection.clientItems`.
  const clientDice = connections.getClientItemOverride(userId, 'dice');
  let diceConfig: Record<string, unknown> | null = null;
  let equippedDiceIdForBroadcast: number | null | undefined = user.equippedDiceId;
  if (clientDice && clientDice.config) {
    diceConfig = clientDice.config;
    equippedDiceIdForBroadcast = syntheticItemId(userId, 'dice');
  } else if (user.equippedDiceId) {
    diceConfig = await lobby.getDiceConfig(user.equippedDiceId);
    if (!diceConfig) {
      logger.warn('Dice config not found for throw_start', { userId, diceId: user.equippedDiceId });
    }
  } else {
    // Player has no equipped dice (standard dice) - use classic_white config from presets
    diceConfig = {
      baseColor: '#ffffff',
      dotColor: '#000000',
      borderColor: '#ffffff',
      roughness: 0.3,
      metalness: 0.25,
      clearcoat: 0,
      clearcoatRoughness: 0,
      opacity: 1,
      dotSize: 29,
      dotShape: 'circle',
      dotDepth: 1.3,
      bevelRadius: 0.16, // Match classic_white preset
    };
  }
  
  // Broadcast throw_start to all other players with dice config and selected dice info
  // CRITICAL: This must arrive BEFORE throw_frame messages
  broadcastToLobby(conn.lobbyId, {
    type: 'throw_start',
    playerId: userId,
    playerNickname: user.nickname,
    throwPower,
    effectId,
    equippedDiceId: equippedDiceIdForBroadcast,
    diceConfig,
    selectedDice // Pass selected dice for Palmo's Dice rerolls
  }, userId);
}

async function handleThrowFrame(userId: number, frame: any): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) return;
  
  // Save last frame for this player (for reconnect)
  if (!lastFrameStorage.has(conn.lobbyId)) {
    lastFrameStorage.set(conn.lobbyId, new Map());
  }
  lastFrameStorage.get(conn.lobbyId)!.set(userId, frame);
  
  // Broadcast frame to all other players (no validation for speed)
  broadcastToLobby(conn.lobbyId, {
    type: 'throw_frame',
    playerId: userId,
    frame
  }, userId);
}

async function handleThrowSound(userId: number, soundType: string, velocity: number, time: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) return;
  
  // Broadcast sound with timestamp to all other players
  broadcastToLobby(conn.lobbyId, {
    type: 'throw_sound',
    playerId: userId,
    soundType,
    velocity,
    time
  }, userId);
}

async function handleThrowEnd(userId: number, finalResult: { dice1: number; dice2: number; total: number; diceValues?: number[] }): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  // Use cached lobby status for fast validation
  const lobbyStatus = lobby.getLobbyStatusCached(conn.lobbyId);
  if (!lobbyStatus || lobbyStatus.status !== 'playing') return;
  
  // Get dice count for this game mode
  const diceCount = game.getDiceCount(conn.lobbyId);
  
  // Validate dice values based on game mode
  if (diceCount === 2) {
    // Legacy 2-dice validation
    const { dice1, dice2 } = finalResult;
    if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
      connections.send(userId, { type: 'error', message: 'Invalid dice values' });
      return;
    }
  } else {
    // Multi-dice validation
    const diceValues = finalResult.diceValues || [];
    if (diceValues.length !== diceCount) {
      connections.send(userId, { type: 'error', message: `Expected ${diceCount} dice, got ${diceValues.length}` });
      return;
    }
    if (diceValues.some(d => d < 1 || d > 6)) {
      connections.send(userId, { type: 'error', message: 'Invalid dice values' });
      return;
    }
  }
  
  // Broadcast throw_end to all other players
  broadcastToLobby(conn.lobbyId, {
    type: 'throw_end',
    playerId: userId,
    finalResult
  }, userId);
  
  // For game logic that needs full lobby data, load it only if needed
  const needsFullLobbyData = lobbyStatus.gameMode !== 'free_roll';
  
  // Process game logic based on mode
  if (lobbyStatus.gameMode === 'poker_dice') {
    // Poker Dice mode - uses 5 dice
    const diceValues = finalResult.diceValues || [];
    const result = game.processRollMulti(conn.lobbyId, userId, diceValues);
    
    if (result) {
      // Save roll (non-blocking)
      game.saveRoll(conn.lobbyId, userId, diceValues[0] || 0, diceValues[1] || 0, result.outcome).catch(err => 
        logger.error('Failed to save roll', err)
      );
      
      // Handle game over - get payouts first
      let payoutsObj: Record<number, number> | undefined;
      if (result.gameOver) {
        const payouts: Map<number, number> | null = await game.endGame(conn.lobbyId);
        
        if (payouts && payouts.size > 0) {
          payoutsObj = {};
          payouts.forEach((amount: number, userId: number) => {
            payoutsObj![userId] = amount;
          });
        }
      }
      
      // Broadcast poker dice result to all players
      broadcastToLobby(conn.lobbyId, {
        type: 'poker_dice_result',
        playerId: userId,
        diceValues,
        outcome: result.outcome,
        message: result.message,
        nextTurn: result.nextTurn, // Add nextTurn for proper turn handling
        gameOver: result.gameOver,
        winners: result.winners,
        data: result.data,
        payouts: payoutsObj,
      });
      
      // Handle turn change
      if (result.nextTurn !== null) {
        broadcastTurnChange(conn.lobbyId, result.nextTurn);
      }
    }
  } else if (lobbyStatus.gameMode === 'street_craps') {
    // Load full lobby data only when needed for game logic
    const lobbyData = await lobby.getLobby(conn.lobbyId);
    if (!lobbyData) return;
    
    const { dice1, dice2, total } = finalResult;
    const crapsResult = game.processStreetCrapsRoll(conn.lobbyId, total);
    
    // Save roll with result (non-blocking - don't wait)
    game.saveRoll(conn.lobbyId, userId, dice1, dice2, crapsResult.outcome).catch(err => 
      logger.error('Failed to save roll', err)
    );
    
    // Broadcast craps result to all players
    broadcastToLobby(conn.lobbyId, {
      type: 'craps_result',
      playerId: userId,
      dice1,
      dice2,
      total,
      outcome: crapsResult.outcome,
      message: crapsResult.message,
      phase: crapsResult.newPhase,
      pointValue: crapsResult.pointValue,
      shooterWins: crapsResult.shooterWins,
      nextTurn: crapsResult.passTurn ? game.getNextPlayer(conn.lobbyId, userId) : null, // Add nextTurn
    });
    
    // Pass turn only on seven_out
    if (crapsResult.passTurn) {
      const nextPlayer = game.getNextPlayer(conn.lobbyId, userId);
      if (nextPlayer) {
        game.setCurrentTurn(conn.lobbyId, nextPlayer);
        broadcastTurnChange(conn.lobbyId, nextPlayer);
      }
    }
  } else if (lobbyStatus.gameMode === 'mexico') {
    // Mexico mode - use new game mode system
    const { dice1, dice2 } = finalResult;
    const result = game.processRoll(conn.lobbyId, userId, dice1, dice2);
    
    if (result) {
      // Save roll with result (non-blocking - don't wait)
      game.saveRoll(conn.lobbyId, userId, dice1, dice2, result.outcome).catch(err => 
        logger.error('Failed to save roll', err)
      );
      
      // Handle game over - get payouts first
      let payoutsObj: Record<number, number> | undefined;
      if (result.gameOver) {
        const payouts: Map<number, number> | null = await game.endGame(conn.lobbyId);
        
        if (payouts && payouts.size > 0) {
          payoutsObj = {};
          payouts.forEach((amount: number, userId: number) => {
            payoutsObj![userId] = amount;
          });
        }
      }
      
      // Broadcast mexico result to all players (with payouts if game over)
      broadcastToLobby(conn.lobbyId, {
        type: 'mexico_result',
        playerId: userId,
        dice1,
        dice2,
        total: dice1 + dice2,
        outcome: result.outcome,
        message: result.message,
        gameOver: result.gameOver,
        winners: result.winners,
        data: result.data,
        payouts: payoutsObj, // Include payouts in result
      });
      
      // Handle turn change
      if (result.nextTurn !== null) {
        broadcastTurnChange(conn.lobbyId, result.nextTurn);
      }
    }
  } else if (lobbyStatus.gameMode === 'greedy_pig') {
    // Greedy Pig mode
    const { dice1, dice2 } = finalResult;
    const result = game.processRoll(conn.lobbyId, userId, dice1, dice2);
    
    if (result) {
      // Save roll with result (non-blocking - don't wait)
      game.saveRoll(conn.lobbyId, userId, dice1, dice2, result.outcome).catch(err => 
        logger.error('Failed to save roll', err)
      );
      
      // Handle game over - get payouts first
      let payoutsObj: Record<number, number> | undefined;
      if (result.gameOver) {
        const payouts: Map<number, number> | null = await game.endGame(conn.lobbyId);
        
        if (payouts && payouts.size > 0) {
          payoutsObj = {};
          payouts.forEach((amount: number, userId: number) => {
            payoutsObj![userId] = amount;
          });
        }
      }
      
      // Broadcast greedy pig result to all players (with payouts if game over)
      logger.info('Greedy Pig result (roll)', { 
        outcome: result.outcome, 
        nextTurn: result.nextTurn,
        playerId: userId 
      });
      
      broadcastToLobby(conn.lobbyId, {
        type: 'greedy_pig_result',
        playerId: userId,
        dice1,
        dice2,
        total: dice1 + dice2,
        outcome: result.outcome,
        message: result.message,
        nextTurn: result.nextTurn,
        gameOver: result.gameOver,
        winners: result.winners,
        data: result.data,
        payouts: payoutsObj, // Include payouts in result
      });
      
      // Handle turn change (only if turn passes to next player)
      if (result.nextTurn !== null) {
        broadcastTurnChange(conn.lobbyId, result.nextTurn);
      }
    }
  } else if (lobbyStatus.gameMode === 'free_roll') {
    // Free Roll mode (non-blocking save)
    const { dice1, dice2 } = finalResult;
    const total = dice1 + dice2;
    
    game.saveRoll(conn.lobbyId, userId, dice1, dice2).catch(err => 
      logger.error('Failed to save roll', err)
    );
    
    // Award pips in solo mode only (single player)
    const lobbyData = await lobby.getLobby(conn.lobbyId);
    logger.info('[PIPS] Checking solo mode', { 
      lobbyId: conn.lobbyId, 
      userId, 
      playerCount: lobbyData?.players.length 
    });
    
    if (lobbyData && lobbyData.players.length === 1) {
      const earnedPips = total; // Simple sum for free roll
      logger.info('[PIPS] Awarding pips', { userId, earnedPips, total });
      
      updatePips(userId, earnedPips); // Non-blocking update
      
      // Get updated pips count and send to client
      getUserPips(userId).then(currentPips => {
        logger.info('[PIPS] Sending update to client', { userId, earnedPips, currentPips });
        connections.send(userId, {
          type: 'pips_updated',
          earnedPips,
          totalPips: currentPips
        });
      }).catch(err => {
        logger.error('Failed to get user pips', err, { userId });
      });
    } else {
      logger.info('[PIPS] Not solo mode, skipping pips award', { 
        playerCount: lobbyData?.players.length 
      });
    }
    
    const nextPlayer = game.getNextPlayer(conn.lobbyId, userId);
    if (nextPlayer) {
      game.setCurrentTurn(conn.lobbyId, nextPlayer);
      broadcastTurnChange(conn.lobbyId, nextPlayer);
    }
  }
}

async function handleThrowDiceSync(userId: number, throwData: any): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.status !== 'playing') {
    connections.send(userId, { type: 'error', message: 'Game not active' });
    return;
  }
  
  // Check if it's player's turn (for Free Roll)
  if (lobbyData.gameMode === 'free_roll') {
    const currentTurn = game.getCurrentTurn(conn.lobbyId);
    if (currentTurn !== userId) {
      connections.send(userId, { type: 'error', message: 'Not your turn' });
      return;
    }
  }
  
  // Validate throw data - new frame-based format
  if (!throwData.finalResult || !throwData.frames || !throwData.frames.dice1 || !throwData.frames.dice2) {
    connections.send(userId, { type: 'error', message: 'Invalid throw data' });
    return;
  }
  
  const { dice1, dice2 } = throwData.finalResult;
  if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
    connections.send(userId, { type: 'error', message: 'Invalid dice values' });
    return;
  }
  
  // Save roll to database
  await game.saveRoll(conn.lobbyId, userId, dice1, dice2);
  
  // Get user info for broadcast
  const user = await getUserById(userId);
  if (!user) return;
  
  // Broadcast synchronized throw to all players in lobby
  broadcastToLobby(conn.lobbyId, {
    type: 'dice_throw_sync',
    playerId: userId,
    playerNickname: user.nickname,
    throwData: {
      ...throwData,
      playerId: userId,
      playerNickname: user.nickname,
    }
  });
  
  // For Free Roll, automatically pass turn to next player
  if (lobbyData.gameMode === 'free_roll') {
    const nextPlayer = game.getNextPlayer(conn.lobbyId, userId);
    if (nextPlayer) {
      game.setCurrentTurn(conn.lobbyId, nextPlayer);
      broadcastTurnChange(conn.lobbyId, nextPlayer);
    }
  }
}

async function handleRollDice(userId: number, dice1: number, dice2: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.status !== 'playing') {
    connections.send(userId, { type: 'error', message: 'Game not active' });
    return;
  }
  
  // Validate dice values
  if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
    connections.send(userId, { type: 'error', message: 'Invalid dice values' });
    return;
  }
  
  // Check if it's player's turn (for Free Roll)
  if (lobbyData.gameMode === 'free_roll') {
    const currentTurn = game.getCurrentTurn(conn.lobbyId);
    if (currentTurn !== userId) {
      connections.send(userId, { type: 'error', message: 'Not your turn' });
      return;
    }
  }
  
  // Save roll to database
  await game.saveRoll(conn.lobbyId, userId, dice1, dice2);
  
  // Get user info from connection cache
  const user = conn.user;
  
  // Broadcast roll to all players in lobby
  broadcastToLobby(conn.lobbyId, {
    type: 'dice_rolled',
    playerId: userId,
    playerNickname: user.nickname,
    dice1,
    dice2,
    total: dice1 + dice2,
    equippedDiceId: user.equippedDiceId,
    equippedEffectId: user.equippedEffectId,
  });
  
  // For Free Roll, automatically pass turn to next player
  if (lobbyData.gameMode === 'free_roll') {
    const nextPlayer = game.getNextPlayer(conn.lobbyId, userId);
    if (nextPlayer) {
      game.setCurrentTurn(conn.lobbyId, nextPlayer);
      broadcastTurnChange(conn.lobbyId, nextPlayer);
    }
  }
}

async function handlePassTurn(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.status !== 'playing' || lobbyData.gameMode !== 'free_roll') {
    connections.send(userId, { type: 'error', message: 'Cannot pass turn in this game mode' });
    return;
  }
  
  // Check if it's player's turn
  const currentTurn = game.getCurrentTurn(conn.lobbyId);
  if (currentTurn !== userId) {
    connections.send(userId, { type: 'error', message: 'Not your turn' });
    return;
  }
  
  // Pass turn to next player
  const nextPlayer = game.getNextPlayer(conn.lobbyId, userId);
  if (nextPlayer) {
    game.setCurrentTurn(conn.lobbyId, nextPlayer);
    broadcastToLobby(conn.lobbyId, {
      type: 'turn_passed',
      fromPlayerId: userId,
      toPlayerId: nextPlayer,
    });
    broadcastTurnChange(conn.lobbyId, nextPlayer);
  }
}

async function handleGreedyPigStop(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.status !== 'playing' || lobbyData.gameMode !== 'greedy_pig') {
    connections.send(userId, { type: 'error', message: 'Cannot stop in this game mode' });
    return;
  }
  
  // Check if it's player's turn
  const currentTurn = game.getCurrentTurn(conn.lobbyId);
  if (currentTurn !== userId) {
    connections.send(userId, { type: 'error', message: 'Not your turn' });
    return;
  }
  
  // Process stop action
  const result = game.processGreedyPigStop(conn.lobbyId);
  if (!result) {
    connections.send(userId, { type: 'error', message: 'Failed to process stop' });
    return;
  }
  
  // Handle game over - get payouts first
  let payoutsObj: Record<number, number> | undefined;
  if (result.gameOver) {
    const payouts: Map<number, number> | null = await game.endGame(conn.lobbyId);
    
    if (payouts && payouts.size > 0) {
      payoutsObj = {};
      payouts.forEach((amount: number, userId: number) => {
        payoutsObj![userId] = amount;
      });
    }
  }
  
  // Broadcast result to all players (with payouts if game over)
  logger.info('Greedy Pig result', { 
    outcome: result.outcome, 
    nextTurn: result.nextTurn,
    playerId: userId 
  });
  
  broadcastToLobby(conn.lobbyId, {
    type: 'greedy_pig_result',
    playerId: userId,
    outcome: result.outcome,
    message: result.message,
    nextTurn: result.nextTurn,
    gameOver: result.gameOver,
    winners: result.winners,
    data: result.data,
    payouts: payoutsObj, // Include payouts in result
  });
  
  // Handle turn change
  if (result.nextTurn !== null) {
    broadcastTurnChange(conn.lobbyId, result.nextTurn);
  }
}

// === Palmo's Dice ===
async function handlePalmosTake(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.status !== 'playing' || lobbyData.gameMode !== 'poker_dice') {
    connections.send(userId, { type: 'error', message: 'Cannot take in this game mode' });
    return;
  }
  
  // Check if it's player's turn
  const currentTurn = game.getCurrentTurn(conn.lobbyId);
  if (currentTurn !== userId) {
    connections.send(userId, { type: 'error', message: 'Not your turn' });
    return;
  }
  
  // Process take action
  const result = game.processPalmosTake(conn.lobbyId, userId);
  if (!result) {
    connections.send(userId, { type: 'error', message: 'Failed to process take' });
    return;
  }
  
  // Handle game over - get payouts first
  let payoutsObj: Record<number, number> | undefined;
  if (result.gameOver) {
    const payouts: Map<number, number> | null = await game.endGame(conn.lobbyId);
    
    if (payouts && payouts.size > 0) {
      payoutsObj = {};
      payouts.forEach((amount: number, userId: number) => {
        payoutsObj![userId] = amount;
      });
    }
  }
  
  // Broadcast result to all players
  broadcastToLobby(conn.lobbyId, {
    type: 'palmos_result',
    playerId: userId,
    action: 'take',
    outcome: result.outcome,
    message: result.message,
    nextTurn: result.nextTurn,
    gameOver: result.gameOver,
    winners: result.winners,
    data: result.data,
    payouts: payoutsObj,
  });
  
  // Handle turn change
  if (result.nextTurn !== null) {
    broadcastTurnChange(conn.lobbyId, result.nextTurn);
  }
}

async function handlePalmosReroll(userId: number, selectedDice: number[]): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  const lobbyData = await lobby.getLobby(conn.lobbyId);
  if (!lobbyData || lobbyData.status !== 'playing' || lobbyData.gameMode !== 'poker_dice') {
    connections.send(userId, { type: 'error', message: 'Cannot reroll in this game mode' });
    return;
  }
  
  // Check if it's player's turn
  const currentTurn = game.getCurrentTurn(conn.lobbyId);
  if (currentTurn !== userId) {
    connections.send(userId, { type: 'error', message: 'Not your turn' });
    return;
  }
  
  // Validate selected dice
  if (!Array.isArray(selectedDice) || selectedDice.length === 0 || selectedDice.length > 5) {
    connections.send(userId, { type: 'error', message: 'Invalid dice selection' });
    return;
  }
  
  // Store selected dice for reroll (client will throw these dice)
  game.setPalmosRerollSelection(conn.lobbyId, userId, selectedDice);
  
  // Broadcast selection to all players so they can see which dice are being rerolled
  broadcastToLobby(conn.lobbyId, {
    type: 'palmos_reroll_selection',
    playerId: userId,
    playerNickname: conn.user.nickname,
    selectedDice,
  });
  
  // Send confirmation to client to start throw animation
  connections.send(userId, {
    type: 'palmos_reroll_ready',
    selectedDice,
  });
}

// === Helpers ===
function broadcastToLobby(lobbyId: string, message: object, excludeUserId?: number): void {
  const players = lobby.getLobbyPlayers(lobbyId);
  for (const oderId of players) {
    if (oderId !== excludeUserId) {
      // Don't send game events to disconnected players (waiting for reconnect)
      if (lobby.isPlayerDisconnected(oderId)) {
        continue;
      }
      connections.send(oderId, message);
    }
  }
}

// Broadcast turn change with new throw seed for anti-cheat
function broadcastTurnChange(lobbyId: string, playerId: number): void {
  const newSeed = game.regenerateThrowSeed(lobbyId);
  broadcastToLobby(lobbyId, {
    type: 'turn_changed',
    playerId,
    throwSeed: newSeed,
  });
}

export function handleDisconnect(userId: number): void {
  // Pop the player out of the matchmaking queue first — they're gone,
  // no point trying to match them. Safe to call even if they weren't
  // queued.
  matchmaking.handleDisconnect(userId);

  const conn = connections.getConnection(userId);
  if (conn) {
    console.log(`User ${conn.user.nickname} (${userId}) disconnected`);
    
    // If in a game lobby, mark as disconnected (allow reconnect)
    if (conn.lobbyId && conn.inGame) {
      // Mark as disconnected instead of leaving immediately
      lobby.markPlayerDisconnected(conn.lobbyId, userId);
      
      // Notify other players that this player disconnected (but may reconnect)
      broadcastToLobby(conn.lobbyId, {
        type: 'player_disconnected',
        oderId: userId,
        reconnectTimeoutMs: 30000
      }, userId);
    } else if (conn.lobbyId) {
      // Not in game yet (voting/waiting), leave immediately
      lobby.leaveLobby(conn.lobbyId, userId);
      broadcastToLobby(conn.lobbyId, {
        type: 'player_left',
        oderId: userId,
      }, userId);
    }
    
    // Notify friends that user is offline
    getFriends(userId).then(friends => {
      for (const friend of friends) {
        connections.send(friend.friendId, {
          type: 'friend_offline',
          friendId: userId,
        });
      }
    });
    
    connections.removeConnection(userId);
  }
}

// Notify friends about user's status change (joined lobby, started game, etc.)
async function notifyFriendsStatusChanged(userId: number, status: 'online' | 'in_lobby' | 'in_game' | 'offline'): Promise<void> {
  const friends = await getFriends(userId);
  for (const friend of friends) {
    connections.send(friend.friendId, {
      type: 'friend_status_changed',
      friendId: userId,
      status
    });
  }
}

// === Solo Roll Complete (for pips tracking) ===
async function handleSoloRollComplete(userId: number, data: any): Promise<void> {
  const earnedPips = data.earnedPips || 0;
  const boostMultiplier = data.boostMultiplier || 1;
  const boostBonus = data.boostBonus || 0;
  
  // Validate roll for fraud (with boost info)
  const validation = validateRoll(userId, earnedPips, boostMultiplier, boostBonus);
  
  if (!validation.allowed) {
    logger.warn('[PIPS] Roll rejected', { userId, earnedPips, boostMultiplier, boostBonus, reason: validation.reason });
    connections.send(userId, {
      type: 'error',
      message: validation.reason || 'Roll validation failed'
    });
    return;
  }
  
  logger.info('[PIPS] Solo roll complete', { userId, earnedPips, boostMultiplier, boostBonus });
  
  // Update pips in database
  updatePips(userId, earnedPips);
  
  // Get updated total (optional - client already has it in localStorage)
  getUserPips(userId).then(totalPips => {
    logger.info('[PIPS] Updated pips in DB', { userId, totalPips });
  }).catch(err => {
    logger.error('[PIPS] Failed to get updated pips', err, { userId });
  });
}

// === Boosts ===
async function handleGetBoostStates(userId: number): Promise<void> {
  logger.info('[BOOST] Get states request', { userId });
  
  const boostIds = ['double', 'triple', 'snake_eyes', 'golden'];
  const boostStates = [];
  
  for (const boostId of boostIds) {
    const state = await getBoostState(userId, boostId);
    
    if (state) {
      const now = new Date();
      const isActive = state.expiresAt > now;
      
      boostStates.push({
        boostId: state.boostId,
        active: isActive,
        activeUntil: isActive ? state.expiresAt.toISOString() : null,
        availableAt: state.availableAt.toISOString(),
        selectedParity: state.selectedParity
      });
    } else {
      // Never used before - available now (set to past time)
      const pastTime = new Date(Date.now() - 1000); // 1 second ago
      boostStates.push({
        boostId,
        active: false,
        activeUntil: null,
        availableAt: pastTime.toISOString(),
        selectedParity: null
      });
    }
  }
  
  connections.send(userId, {
    type: 'boost_states',
    boosts: boostStates
  });
}

async function handleActivateBoost(userId: number, boostId: string, parity?: 'even' | 'odd'): Promise<void> {
  logger.info('[BOOST] Activation request', { userId, boostId, parity });
  
  // Determine boost type
  let boostType: 'double' | 'triple_even' | 'triple_odd' | 'snake_eyes' | 'golden';
  
  if (boostId === 'double') {
    boostType = 'double';
  } else if (boostId === 'triple') {
    if (!parity) {
      connections.send(userId, { type: 'error', message: 'Parity required for triple boost' });
      return;
    }
    boostType = parity === 'even' ? 'triple_even' : 'triple_odd';
  } else if (boostId === 'snake_eyes') {
    boostType = 'snake_eyes';
  } else if (boostId === 'golden') {
    boostType = 'golden';
  } else {
    connections.send(userId, { type: 'error', message: 'Invalid boost ID' });
    return;
  }
  
  // Activate boost
  const result = await activateBoost(userId, boostId, boostType, parity);
  
  if (!result.success) {
    connections.send(userId, { type: 'error', message: result.error || 'Failed to activate boost' });
    return;
  }
  
  // Send success response
  connections.send(userId, {
    type: 'boost_activated',
    boostId,
    activeUntil: result.activeUntil,
    selectedParity: parity
  });
  
  // Schedule expiration notification
  if (result.activeUntil && result.availableAt) {
    const duration = result.activeUntil - Date.now();
    setTimeout(() => {
      connections.send(userId, {
        type: 'boost_expired',
        boostId,
        availableAt: result.availableAt
      });
    }, duration);
  }
}

// === Custom Dice ===
async function handleSaveCustomDice(userId: number, config: any): Promise<void> {
  // Check if user has a design key
  const keyResult = await query<{ id: number; item_id: number }>(`
    SELECT ui.id, ic.id as item_id
    FROM user_items ui
    JOIN item_catalog ic ON ui.item_id = ic.id
    WHERE ui.user_id = $1 AND ic.type = 'key' AND ic.code = 'design_key'
    LIMIT 1
  `, [userId]);
  
  if (keyResult.rows.length === 0) {
    connections.send(userId, { type: 'error', message: 'No Design Key available' });
    return;
  }
  
  // Remove the key from inventory
  await query('DELETE FROM user_items WHERE id = $1', [keyResult.rows[0].id]);
  
  // Create custom dice item
  const timestamp = Date.now();
  const diceName = `Custom Dice #${timestamp.toString().slice(-6)}`;
  const diceCode = `custom_${userId}_${timestamp}`;
  
  const diceResult = await query<{ id: number }>(`
    INSERT INTO item_catalog (type, code, name, description, price_stars, rarity, config)
    VALUES ('dice', $1, $2, 'Custom designed dice', 0, 'legendary', $3)
    RETURNING id
  `, [diceCode, diceName, JSON.stringify(config)]);
  
  const newDiceId = diceResult.rows[0].id;
  
  // Grant to user
  await query('INSERT INTO user_items (user_id, item_id) VALUES ($1, $2)', [userId, newDiceId]);
  
  // Get updated inventory
  const inventory = await getUserInventory(userId);
  
  connections.send(userId, {
    type: 'custom_dice_created',
    dice: {
      id: newDiceId,
      code: diceCode,
      name: diceName,
      config
    },
    inventory
  });
  
  logger.info('Custom dice created', { userId, diceCode });
}

// === Betting ===
async function handlePlaceBet(userId: number, amount: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn || !conn.lobbyId) {
    connections.send(userId, { type: 'bet_error', message: 'Not in a lobby' });
    return;
  }

  const result = await BettingManager.placeBet(userId, amount, conn.lobbyId);
  
  if (!result.success) {
    connections.send(userId, { type: 'bet_error', message: result.error });
    return;
  }

  // Отправляем подтверждение игроку
  connections.send(userId, {
    type: 'bet_placed',
    userId,
    amount,
    newBalance: result.newBalance
  });

  // Уведомляем всех в лобби об обновлении ставок
  const betsInfo = BettingManager.getBetsInfo(conn.lobbyId);
  const state = BettingManager.getState(conn.lobbyId);
  
  // Add nicknames to bets
  const betsWithNicknames = await Promise.all(betsInfo.map(async (bet) => {
    const userConn = connections.getConnection(bet.userId);
    return {
      ...bet,
      nickname: userConn?.user?.nickname || `Player${bet.userId}`
    };
  }));
  
  const playerIds = lobby.getLobbyPlayers(conn.lobbyId);
  for (const playerId of playerIds) {
    connections.send(playerId, {
      type: 'pot_updated',
      pot: state?.pot || 0,
      bets: betsWithNicknames
    });
  }

  logger.info('Bet placed', { userId, amount, lobbyId: conn.lobbyId });
}

async function handleConfirmBet(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn || !conn.lobbyId) {
    connections.send(userId, { type: 'bet_error', message: 'Not in a lobby' });
    return;
  }

  const result = await BettingManager.confirmBet(userId, conn.lobbyId);
  
  if (!result.success) {
    connections.send(userId, { type: 'bet_error', message: result.error });
    return;
  }

  // Отправляем подтверждение игроку
  connections.send(userId, {
    type: 'bet_confirmed',
    userId,
    newBalance: result.newBalance
  });

  // Уведомляем всех в лобби
  const betsInfo = BettingManager.getBetsInfo(conn.lobbyId);
  const state = BettingManager.getState(conn.lobbyId);
  
  // Add nicknames to bets
  const betsWithNicknames = await Promise.all(betsInfo.map(async (bet) => {
    const userConn = connections.getConnection(bet.userId);
    return {
      ...bet,
      nickname: userConn?.user?.nickname || `Player${bet.userId}`
    };
  }));
  
  const playerIds = lobby.getLobbyPlayers(conn.lobbyId);
  for (const playerId of playerIds) {
    connections.send(playerId, {
      type: 'pot_updated',
      pot: state?.pot || 0,
      bets: betsWithNicknames
    });
  }

  // Проверяем, все ли игроки подтвердили ставки
  if (BettingManager.areAllPlayersReady(conn.lobbyId, playerIds)) {
    // Активируем ставки и начинаем игру через 3 секунды
    await BettingManager.activateBets(conn.lobbyId);
    
    for (const playerId of playerIds) {
      connections.send(playerId, {
        type: 'betting_complete',
        pot: state?.pot || 0,
        startingIn: 3
      });
    }

    logger.info('[BETTING] All bets confirmed, starting game in 3s', { lobbyId: conn.lobbyId, pot: state?.pot });
    
    // Capture lobbyId before setTimeout to avoid null issues
    const lobbyId = conn.lobbyId;
    
    // Start game after 3 seconds
    setTimeout(async () => {
      // First update lobby status to 'playing' via lobby.startGame
      const startSuccess = await lobby.startGame(lobbyId);
      if (!startSuccess) {
        logger.error('[BETTING] Failed to start game via lobby.startGame', { lobbyId });
        return;
      }
      // Then broadcast game_started event
      await startGameAfterBetting(lobbyId);
    }, 3000);
  }

  logger.info('Bet confirmed', { userId, lobbyId: conn.lobbyId });
}

async function handleCancelBet(userId: number): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn || !conn.lobbyId) {
    connections.send(userId, { type: 'bet_error', message: 'Not in a lobby' });
    return;
  }

  const success = BettingManager.cancelBet(userId, conn.lobbyId);
  
  if (!success) {
    connections.send(userId, { type: 'bet_error', message: 'Cannot cancel confirmed bet' });
    return;
  }

  // Отправляем подтверждение
  connections.send(userId, {
    type: 'bet_cancelled',
    userId
  });

  // Уведомляем всех в лобби
  const betsInfo = BettingManager.getBetsInfo(conn.lobbyId);
  const state = BettingManager.getState(conn.lobbyId);
  
  // Add nicknames to bets
  const betsWithNicknames = await Promise.all(betsInfo.map(async (bet) => {
    const userConn = connections.getConnection(bet.userId);
    return {
      ...bet,
      nickname: userConn?.user?.nickname || `Player${bet.userId}`
    };
  }));
  
  const playerIds = lobby.getLobbyPlayers(conn.lobbyId);
  for (const playerId of playerIds) {
    connections.send(playerId, {
      type: 'pot_updated',
      pot: state?.pot || 0,
      bets: betsWithNicknames
    });
  }

  logger.info('Bet cancelled', { userId, lobbyId: conn.lobbyId });
}

// === Reactions ===
async function handleSendReaction(userId: number, content: string): Promise<void> {
  const conn = connections.getConnection(userId);
  if (!conn?.lobbyId || !conn.inGame) {
    connections.send(userId, { type: 'error', message: 'Not in game' });
    return;
  }
  
  // Validate content (max 50 chars, prevent spam)
  if (!content || content.length > 50) {
    connections.send(userId, { type: 'error', message: 'Invalid reaction content' });
    return;
  }
  
  // Get nickname from cached connection (no DB query needed)
  const playerNickname = conn.user.nickname;
  
  // Broadcast reaction to all players in lobby (except sender)
  const reactionMessage = {
    type: 'reaction_received',
    playerId: userId,
    playerNickname: playerNickname,
    content: content,
    timestamp: Date.now()
  };
  
  // Send to all players in lobby using broadcastToLobby helper
  broadcastToLobby(conn.lobbyId, reactionMessage, userId);
  
  logger.info('Reaction sent', { userId, lobbyId: conn.lobbyId, content });
}

// === Player stats (Yandex profile widget / matchmaking level) ===
async function handleSyncYandexPips(userId: number, pips: number): Promise<void> {
  const result = await query<{ id: number }>(
    `UPDATE users
       SET pips = $2
     WHERE id = $1 AND platform = 'yandex' AND COALESCE(pips, 0) = 0
     RETURNING id`,
    [userId, pips],
  );

  if (result.rows.length === 0) return;
  await handleGetPlayerStats(userId);
}

async function handleGetPlayerStats(userId: number): Promise<void> {
  const stats = await getPlayerStats(userId);
  if (!stats) {
    connections.send(userId, { type: 'player_stats', stats: null });
    return;
  }
  connections.send(userId, { type: 'player_stats', stats });
}
