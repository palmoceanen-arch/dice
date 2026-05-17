// Map oderId -> Connection
const connections = new Map();
// Map oderId -> oderId for quick lookup
const userIdByTelegramId = new Map();
export function addConnection(user, ws) {
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
export function removeConnection(userId) {
    const conn = connections.get(userId);
    if (conn) {
        if (conn.user.telegramId !== null && conn.user.telegramId !== undefined) {
            userIdByTelegramId.delete(conn.user.telegramId);
        }
        connections.delete(userId);
    }
}
export function getConnection(userId) {
    return connections.get(userId);
}
export function getUserIdByTelegramId(telegramId) {
    return userIdByTelegramId.get(telegramId);
}
export function isOnline(userId) {
    return connections.has(userId);
}
export function updateUserEquipment(userId, slot, itemId) {
    const conn = connections.get(userId);
    if (conn) {
        if (slot === 'dice') {
            conn.user.equippedDiceId = itemId;
        }
        else if (slot === 'table') {
            conn.user.equippedTableId = itemId;
        }
        else if (slot === 'effect') {
            conn.user.equippedEffectId = itemId;
        }
    }
}
// Set or clear a client-supplied item override on the connection. Passing
// `override === null` clears that slot; passing `undefined` leaves it
// alone. See `Connection.clientItems` for the rationale.
export function setClientItemOverride(userId, slot, override) {
    if (override === undefined)
        return;
    const conn = connections.get(userId);
    if (!conn)
        return;
    if (!conn.clientItems) {
        conn.clientItems = {};
    }
    conn.clientItems[slot] = override;
}
export function getClientItemOverride(userId, slot) {
    return connections.get(userId)?.clientItems?.[slot];
}
export function setLobby(userId, lobbyId) {
    const conn = connections.get(userId);
    if (conn) {
        conn.lobbyId = lobbyId;
    }
}
export function getLobbyId(userId) {
    return connections.get(userId)?.lobbyId || null;
}
export function send(userId, message) {
    const conn = connections.get(userId);
    if (conn && conn.ws.readyState === 1) { // WebSocket.OPEN
        conn.ws.send(JSON.stringify(message));
    }
}
export function broadcast(userIds, message) {
    const json = JSON.stringify(message);
    for (const userId of userIds) {
        const conn = connections.get(userId);
        if (conn && conn.ws.readyState === 1) {
            conn.ws.send(json);
        }
    }
}
export function broadcastToLobby(lobbyId, message, excludeUserId) {
    const json = JSON.stringify(message);
    for (const [userId, conn] of connections) {
        if (conn.lobbyId === lobbyId && userId !== excludeUserId && conn.ws.readyState === 1) {
            conn.ws.send(json);
        }
    }
}
export function getOnlineUserIds() {
    return Array.from(connections.keys());
}
export function getLobbyUserIds(lobbyId) {
    const userIds = [];
    for (const [userId, conn] of connections) {
        if (conn.lobbyId === lobbyId) {
            userIds.push(userId);
        }
    }
    return userIds;
}
// Update connection health based on pong response time
export function updateConnectionHealth(userId) {
    const conn = connections.get(userId);
    if (!conn)
        return;
    const now = Date.now();
    const timeSinceLastPong = now - conn.lastPongTime;
    let newHealth;
    if (timeSinceLastPong < 5000) {
        newHealth = 'good';
    }
    else if (timeSinceLastPong < 10000) {
        newHealth = 'unstable';
    }
    else {
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
export function markPongReceived(userId) {
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
async function notifyConnectionStatusChange(userId, health) {
    const conn = connections.get(userId);
    if (!conn)
        return;
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
export function getConnectionHealth(userId) {
    const conn = connections.get(userId);
    return conn ? conn.connectionHealth : 'offline';
}
//# sourceMappingURL=connections.js.map