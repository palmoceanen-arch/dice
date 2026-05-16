import type { WebSocket } from 'ws';
import type { User } from '../types/index.js';

// Snapshot of an item config supplied by the client (currently only the
// Yandex Games build, which keeps inventory in Cloud Save rather than in
// the server DB). When set, the server uses this in place of the DB
// `item_catalog` row for multiplayer broadcasts so opponents render the
// dice/table/effect skin the player actually picked locally.
export interface ClientItemOverride {
  code: string;
  name: string;
  config: Record<string, unknown> | null;
}

export interface Connection {
  ws: WebSocket;
  user: User;
  lobbyId: string | null;
  inGame: boolean;
  connectionHealth: 'good' | 'unstable' | 'poor';
  lastPongTime: number;
  // Per-slot client overrides. Optional — when absent the server falls
  // back to `user.equippedDiceId` / etc. (the Telegram flow). The
  // Yandex client sends `set_player_items` after auth and after every
  // local equip change to keep these in sync with Cloud Save.
  clientItems?: {
    dice?: ClientItemOverride | null;
    table?: ClientItemOverride | null;
    effect?: ClientItemOverride | null;
  };
}

// Map oderId -> Connection
const connections = new Map<number, Connection>();

// Map oderId -> oderId for quick lookup
const userIdByTelegramId = new Map<number, number>();

export function addConnection(user: User, ws: WebSocket): void {
  // Close existing connection if any
  const existing = connections.get(user.id);
  if (existing) {
    existing.ws.close();
  }
  
  connections.set(user.id, { 
    ws, 
    user, 
    lobbyId: null, 
    inGame: false,
    connectionHealth: 'good',
    lastPongTime: Date.now()
  });
  if (user.telegramId !== null && user.telegramId !== undefined) {
    userIdByTelegramId.set(user.telegramId, user.id);
  }
}

export function removeConnection(userId: number): void {
  const conn = connections.get(userId);
  if (conn) {
    if (conn.user.telegramId !== null && conn.user.telegramId !== undefined) {
      userIdByTelegramId.delete(conn.user.telegramId);
    }
    connections.delete(userId);
  }
}

export function getConnection(userId: number): Connection | undefined {
  return connections.get(userId);
}

export function getUserIdByTelegramId(telegramId: number): number | undefined {
  return userIdByTelegramId.get(telegramId);
}

export function isOnline(userId: number): boolean {
  return connections.has(userId);
}

export function updateUserEquipment(userId: number, slot: 'dice' | 'table' | 'effect', itemId: number): void {
  const conn = connections.get(userId);
  if (conn) {
    if (slot === 'dice') {
      conn.user.equippedDiceId = itemId;
    } else if (slot === 'table') {
      conn.user.equippedTableId = itemId;
    } else if (slot === 'effect') {
      conn.user.equippedEffectId = itemId;
    }
  }
}

// Set or clear a client-supplied item override on the connection. Passing
// `override === null` clears that slot; passing `undefined` leaves it
// alone. See `Connection.clientItems` for the rationale.
export function setClientItemOverride(
  userId: number,
  slot: 'dice' | 'table' | 'effect',
  override: ClientItemOverride | null | undefined,
): void {
  if (override === undefined) return;
  const conn = connections.get(userId);
  if (!conn) return;
  if (!conn.clientItems) {
    conn.clientItems = {};
  }
  conn.clientItems[slot] = override;
}

export function getClientItemOverride(
  userId: number,
  slot: 'dice' | 'table' | 'effect',
): ClientItemOverride | null | undefined {
  return connections.get(userId)?.clientItems?.[slot];
}

export function setLobby(userId: number, lobbyId: string | null): void {
  const conn = connections.get(userId);
  if (conn) {
    conn.lobbyId = lobbyId;
  }
}

export function getLobbyId(userId: number): string | null {
  return connections.get(userId)?.lobbyId || null;
}

export function send(userId: number, message: object): void {
  const conn = connections.get(userId);
  if (conn && conn.ws.readyState === 1) { // WebSocket.OPEN
    conn.ws.send(JSON.stringify(message));
  }
}

export function broadcast(userIds: number[], message: object): void {
  const json = JSON.stringify(message);
  for (const userId of userIds) {
    const conn = connections.get(userId);
    if (conn && conn.ws.readyState === 1) {
      conn.ws.send(json);
    }
  }
}

export function broadcastToLobby(lobbyId: string, message: object, excludeUserId?: number): void {
  const json = JSON.stringify(message);
  for (const [userId, conn] of connections) {
    if (conn.lobbyId === lobbyId && userId !== excludeUserId && conn.ws.readyState === 1) {
      conn.ws.send(json);
    }
  }
}

export function getOnlineUserIds(): number[] {
  return Array.from(connections.keys());
}

export function getLobbyUserIds(lobbyId: string): number[] {
  const userIds: number[] = [];
  for (const [userId, conn] of connections) {
    if (conn.lobbyId === lobbyId) {
      userIds.push(userId);
    }
  }
  return userIds;
}

// Update connection health based on pong response time
export function updateConnectionHealth(userId: number): void {
  const conn = connections.get(userId);
  if (!conn) return;
  
  const now = Date.now();
  const timeSinceLastPong = now - conn.lastPongTime;
  
  let newHealth: 'good' | 'unstable' | 'poor';
  
  if (timeSinceLastPong < 5000) {
    newHealth = 'good';
  } else if (timeSinceLastPong < 10000) {
    newHealth = 'unstable';
  } else {
    newHealth = 'poor';
  }
  
  // Only notify if health changed
  if (newHealth !== conn.connectionHealth) {
    const oldHealth = conn.connectionHealth;
    conn.connectionHealth = newHealth;
    
    // Notify user about their connection status
    if (newHealth === 'unstable' || newHealth === 'poor') {
      send(userId, {
        type: 'connection_health',
        health: newHealth,
        message: newHealth === 'unstable' 
          ? 'Connection unstable' 
          : 'Poor connection - you may be disconnected soon'
      });
    }
    
    // Notify friends and lobby members about connection issues
    if (newHealth === 'poor' || (oldHealth === 'good' && newHealth === 'unstable')) {
      notifyConnectionStatusChange(userId, newHealth);
    }
  }
  
  conn.lastPongTime = now;
}

export function markPongReceived(userId: number): void {
  const conn = connections.get(userId);
  if (conn) {
    conn.lastPongTime = Date.now();
    
    // If connection was bad and now recovered, update to good
    if (conn.connectionHealth !== 'good') {
      conn.connectionHealth = 'good';
      
      // Notify about recovery
      send(userId, {
        type: 'connection_health',
        health: 'good',
        message: 'Connection restored'
      });
      
      notifyConnectionStatusChange(userId, 'good');
    }
  }
}

// Notify friends and lobby members about connection status change
async function notifyConnectionStatusChange(userId: number, health: 'good' | 'unstable' | 'poor'): Promise<void> {
  const conn = connections.get(userId);
  if (!conn) return;
  
  // Import getFriends dynamically to avoid circular dependency
  const { getFriends } = await import('../services/friends.js');
  
  // Notify friends
  const friends = await getFriends(userId);
  for (const friend of friends) {
    send(friend.friendId, {
      type: 'friend_connection_status',
      friendId: userId,
      connectionHealth: health
    });
  }
  
  // Notify lobby members
  if (conn.lobbyId) {
    broadcastToLobby(conn.lobbyId, {
      type: 'player_connection_status',
      userId,
      connectionHealth: health
    }, userId);
  }
}

export function getConnectionHealth(userId: number): 'good' | 'unstable' | 'poor' | 'offline' {
  const conn = connections.get(userId);
  return conn ? conn.connectionHealth : 'offline';
}
