import { query } from '../db/client.js';
import type { User, FriendWithUser } from '../types/index.js';
import * as connections from '../websocket/connections.js';

interface FriendRow {
  id: number;
  user_id: number;
  friend_id: number;
  status: string;
  source: string;
  created_at: string;
  // Friend user data
  friend_user_id: number;
  friend_telegram_id: number;
  friend_nickname: string;
  friend_telegram_username: string | null;
  friend_first_name: string | null;
  friend_avatar_url: string | null;
}

interface FriendRequestRow {
  id: number;
  from_user_id: number;
  to_user_id: number;
  status: string;
  created_at: string;
  from_nickname: string;
  from_telegram_username: string | null;
  from_avatar_url: string | null;
}

export async function getFriends(userId: number): Promise<FriendWithUser[]> {
  const result = await query<FriendRow>(
    `SELECT 
      f.id, f.user_id, f.friend_id, f.status, f.source, f.created_at,
      u.id as friend_user_id, u.telegram_id as friend_telegram_id, 
      u.nickname as friend_nickname, u.telegram_username as friend_telegram_username,
      u.first_name as friend_first_name, u.avatar_url as friend_avatar_url
     FROM friends f
     JOIN users u ON u.id = f.friend_id
     WHERE f.user_id = $1 AND f.status = 'active'
     ORDER BY u.nickname`,
    [userId]
  );
  
  return result.rows.map(row => {
    const conn = connections.getConnection(row.friend_id);
    let onlineStatus: 'online' | 'in_lobby' | 'in_game' | 'offline' = 'offline';
    
    if (conn) {
      if (conn.lobbyId) {
        onlineStatus = conn.inGame ? 'in_game' : 'in_lobby';
      } else {
        onlineStatus = 'online';
      }
    }
    
    return {
      id: row.id,
      oderId: row.user_id,
      friendId: row.friend_id,
      status: row.status as 'active' | 'blocked',
      source: row.source as 'search' | 'game' | 'invite',
      createdAt: new Date(row.created_at),
      user: {
        id: row.friend_user_id,
        telegramId: row.friend_telegram_id,
        yandexId: null,
        platform: 'telegram',
        nickname: row.friend_nickname,
        telegramUsername: row.friend_telegram_username,
        firstName: row.friend_first_name,
        avatarUrl: row.friend_avatar_url,
        equippedDiceId: null,
        equippedTableId: null,
        equippedEffectId: null,
        lastOnline: new Date(),
        createdAt: new Date(),
      },
      onlineStatus,
    };
  });
}

// Send friend request (doesn't add immediately)
export async function sendFriendRequest(fromUserId: number, toUserId: number): Promise<{ success: boolean; requestId?: number }> {
  // Can't add yourself
  if (fromUserId === toUserId) return { success: false };
  
  // Check if already friends
  const existingFriend = await query(
    'SELECT 1 FROM friends WHERE user_id = $1 AND friend_id = $2',
    [fromUserId, toUserId]
  );
  if (existingFriend.rows.length > 0) return { success: false };
  
  // Check if request already exists
  const existingRequest = await query(
    `SELECT id FROM friend_requests WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending'`,
    [fromUserId, toUserId]
  );
  if (existingRequest.rows.length > 0) return { success: false };
  
  // Check if reverse request exists (they already sent us a request)
  const reverseRequest = await query<{ id: number }>(
    `SELECT id FROM friend_requests WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending'`,
    [toUserId, fromUserId]
  );
  if (reverseRequest.rows.length > 0) {
    // Auto-accept the reverse request
    await acceptFriendRequest(reverseRequest.rows[0].id, fromUserId);
    return { success: true };
  }
  
  // Create friend request
  const result = await query<{ id: number }>(
    `INSERT INTO friend_requests (from_user_id, to_user_id) VALUES ($1, $2) RETURNING id`,
    [fromUserId, toUserId]
  );
  
  return { success: true, requestId: result.rows[0].id };
}

// Get pending friend requests for a user
export async function getPendingFriendRequests(userId: number): Promise<FriendRequestRow[]> {
  const result = await query<FriendRequestRow>(
    `SELECT fr.id, fr.from_user_id, fr.to_user_id, fr.status, fr.created_at,
            u.nickname as from_nickname, u.telegram_username as from_telegram_username, u.avatar_url as from_avatar_url
     FROM friend_requests fr
     JOIN users u ON u.id = fr.from_user_id
     WHERE fr.to_user_id = $1 AND fr.status = 'pending'
     ORDER BY fr.created_at DESC`,
    [userId]
  );
  return result.rows;
}

// Accept friend request
export async function acceptFriendRequest(requestId: number, userId: number): Promise<{ success: boolean; fromUserId?: number }> {
  // Get request and verify it's for this user
  const request = await query<{ from_user_id: number; to_user_id: number }>(
    `SELECT from_user_id, to_user_id FROM friend_requests WHERE id = $1 AND status = 'pending'`,
    [requestId]
  );
  
  if (request.rows.length === 0 || request.rows[0].to_user_id !== userId) {
    return { success: false };
  }
  
  const fromUserId = request.rows[0].from_user_id;
  
  // Update request status
  await query(`UPDATE friend_requests SET status = 'accepted' WHERE id = $1`, [requestId]);
  
  // Add friend (both directions)
  await query(
    `INSERT INTO friends (user_id, friend_id, source) VALUES ($1, $2, 'search') ON CONFLICT DO NOTHING`,
    [userId, fromUserId]
  );
  await query(
    `INSERT INTO friends (user_id, friend_id, source) VALUES ($1, $2, 'search') ON CONFLICT DO NOTHING`,
    [fromUserId, userId]
  );
  
  return { success: true, fromUserId };
}

// Decline friend request
export async function declineFriendRequest(requestId: number, userId: number): Promise<boolean> {
  const result = await query(
    `UPDATE friend_requests SET status = 'declined' WHERE id = $1 AND to_user_id = $2 AND status = 'pending'`,
    [requestId, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

// Legacy addFriend - now sends a request instead
export async function addFriend(userId: number, friendId: number, source: 'search' | 'game' | 'invite' = 'search'): Promise<boolean> {
  const result = await sendFriendRequest(userId, friendId);
  return result.success;
}

export async function removeFriend(userId: number, friendId: number): Promise<boolean> {
  const result = await query(
    'DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
    [userId, friendId]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function areFriends(userId: number, friendId: number): Promise<boolean> {
  const result = await query(
    `SELECT 1 FROM friends WHERE user_id = $1 AND friend_id = $2 AND status = 'active'`,
    [userId, friendId]
  );
  return result.rows.length > 0;
}
