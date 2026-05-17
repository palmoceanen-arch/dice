import { query } from '../db/client.js';
import * as connections from '../websocket/connections.js';
import * as game from './game.js';
import { nanoid } from 'nanoid';
const MAX_PLAYERS = 6;
// In-memory lobby state for real-time updates
const activeLobbies = new Map();
// Cache dice configs to avoid DB queries during throws
const diceConfigCache = new Map(); // itemId -> config
// Clear dice config cache for a specific item (call when item config changes)
export function clearDiceConfigCache(itemId) {
    diceConfigCache.delete(itemId);
}
// Clear ALL dice config cache (call after bulk updates like sync-presets-to-db)
export function clearAllDiceConfigCache() {
    diceConfigCache.clear();
}
// Fast check for lobby status without DB query (for performance-critical paths)
export function getLobbyStatusCached(lobbyId) {
    const lobby = activeLobbies.get(lobbyId);
    if (!lobby)
        return null;
    return { status: lobby.status, gameMode: lobby.gameMode };
}
// Get dice config from cache or DB
export async function getDiceConfig(diceId) {
    // Check cache first
    if (diceConfigCache.has(diceId)) {
        return diceConfigCache.get(diceId) || null;
    }
    // Load from DB and cache
    const result = await query('SELECT config FROM item_catalog WHERE id = $1 AND type = \'dice\'', [diceId]);
    let config = null;
    if (result.rows[0]?.config) {
        const rawConfig = result.rows[0].config;
        if (typeof rawConfig === 'object') {
            config = rawConfig;
        }
        else if (typeof rawConfig === 'string') {
            try {
                config = JSON.parse(rawConfig);
            }
            catch {
                // Ignore parse errors
            }
        }
    }
    // Cache it
    diceConfigCache.set(diceId, config);
    return config;
}
export async function createLobby(hostId, gameMode, noBet = false, betAmount = noBet ? 0 : 10) {
    const id = nanoid(8);
    const result = await query(`INSERT INTO lobbies (id, host_id, game_mode, status, max_players, no_bet, bet_amount)
     VALUES ($1, $2, $3, 'voting', $4, $5, $6)
     RETURNING *`, [id, hostId, gameMode, MAX_PLAYERS, noBet, betAmount]);
    // Add host as player
    await query(`INSERT INTO lobby_players (lobby_id, user_id, status)
     VALUES ($1, $2, 'joined')`, [id, hostId]);
    // Update connection
    const conn = connections.getConnection(hostId);
    if (conn) {
        conn.lobbyId = id;
    }
    // Init in-memory state
    activeLobbies.set(id, {
        players: new Set([hostId]),
        votes: new Map(),
        screenSizes: new Map(),
        status: 'voting',
        gameMode,
        hostId,
        noBet,
        betAmount,
    });
    return mapLobby(result.rows[0], betAmount);
}
// Fast accessor for the no-bet flag, used by handleStartGame / endGame in
// hot paths where we want to avoid an extra DB round-trip.
export function isNoBetLobby(lobbyId) {
    const state = activeLobbies.get(lobbyId);
    return !!state?.noBet;
}
export function getLobbyBetAmount(lobbyId) {
    const state = activeLobbies.get(lobbyId);
    return state?.betAmount ?? (state?.noBet ? 0 : 10);
}
export async function getLobby(lobbyId) {
    const lobbyResult = await query('SELECT * FROM lobbies WHERE id = $1', [lobbyId]);
    if (lobbyResult.rows.length === 0)
        return null;
    const playersResult = await query(`SELECT lp.*, u.nickname, u.telegram_username, u.avatar_url,
            u.equipped_dice_id, u.equipped_table_id, u.equipped_effect_id,
            ic.name as table_name
     FROM lobby_players lp
     JOIN users u ON u.id = lp.user_id
     LEFT JOIN item_catalog ic ON ic.id = u.equipped_table_id AND ic.type = 'table'
     WHERE lp.lobby_id = $1 AND lp.status = 'joined'`, [lobbyId]);
    const lobbyState = activeLobbies.get(lobbyId);
    const lobby = mapLobby(lobbyResult.rows[0], lobbyState?.betAmount);
    return {
        ...lobby,
        players: playersResult.rows.map(row => ({
            lobbyId: row.lobby_id,
            oderId: row.user_id,
            status: row.status,
            tableVote: row.table_vote,
            joinedAt: new Date(row.joined_at),
            user: {
                id: row.user_id,
                telegramId: 0,
                yandexId: null,
                platform: 'telegram',
                nickname: row.nickname,
                telegramUsername: row.telegram_username,
                firstName: null,
                avatarUrl: row.avatar_url,
                equippedDiceId: row.equipped_dice_id,
                equippedTableId: row.equipped_table_id,
                equippedTableName: row.table_name || null,
                equippedEffectId: row.equipped_effect_id,
                lastOnline: new Date(),
                createdAt: new Date(),
            },
        })),
    };
}
export async function joinLobby(lobbyId, userId) {
    const lobby = await getLobby(lobbyId);
    if (!lobby)
        return false;
    if (lobby.status !== 'voting' && lobby.status !== 'waiting')
        return false;
    if (lobby.players.length >= lobby.maxPlayers)
        return false;
    // Check if already in lobby
    const existing = await query(`SELECT 1 FROM lobby_players WHERE lobby_id = $1 AND user_id = $2 AND status = 'joined'`, [lobbyId, userId]);
    if (existing.rows.length > 0)
        return false;
    // Join or update status
    await query(`INSERT INTO lobby_players (lobby_id, user_id, status)
     VALUES ($1, $2, 'joined')
     ON CONFLICT (lobby_id, user_id) DO UPDATE SET status = 'joined', joined_at = NOW()`, [lobbyId, userId]);
    // Update connection
    const conn = connections.getConnection(userId);
    if (conn) {
        conn.lobbyId = lobbyId;
    }
    // Update in-memory state
    const state = activeLobbies.get(lobbyId);
    if (state) {
        state.players.add(userId);
    }
    return true;
}
export async function leaveLobby(lobbyId, userId) {
    await query(`UPDATE lobby_players SET status = 'left' WHERE lobby_id = $1 AND user_id = $2`, [lobbyId, userId]);
    // Update connection
    const conn = connections.getConnection(userId);
    if (conn) {
        conn.lobbyId = null;
        conn.inGame = false;
    }
    // Update in-memory state
    const state = activeLobbies.get(lobbyId);
    let closed = false;
    let closedReason;
    let remainingPlayers = [];
    if (state) {
        state.players.delete(userId);
        state.votes.delete(userId);
        // Drop this player's rematch vote (if any). Otherwise an opponent
        // pressing "New Game" after we left would trip the "all players
        // agreed" check with our stale vote still counted.
        removeRestartVote(lobbyId, userId);
        remainingPlayers = Array.from(state.players);
        if (state.players.size === 0) {
            // Nobody is left → close the lobby outright.
            await closeLobby(lobbyId);
            closed = true;
            closedReason = 'empty';
        }
        else if (state.status === 'playing' && state.players.size < 2) {
            // Game in progress but the match can no longer continue (fewer
            // than 2 players left). Force-end it instead of letting the
            // remaining player sit alone forever or, worse, restart a "new
            // game" with themselves. Mirrors the timeout branch in
            // `markPlayerDisconnected` further down this file.
            for (const remainingUserId of state.players) {
                const remainingConn = connections.getConnection(remainingUserId);
                if (remainingConn) {
                    remainingConn.lobbyId = null;
                    remainingConn.inGame = false;
                }
            }
            await closeLobby(lobbyId);
            closed = true;
            closedReason = 'insufficient_players';
        }
    }
    return { closed, closedReason, remainingPlayers };
}
export async function closeLobby(lobbyId) {
    // Cancel all pending invitations for this lobby
    await query(`UPDATE invitations SET status = 'cancelled' WHERE lobby_id = $1 AND status = 'pending'`, [lobbyId]);
    await query(`UPDATE lobbies SET status = 'finished', finished_at = NOW() WHERE id = $1`, [lobbyId]);
    // End game state
    game.endGame(lobbyId);
    activeLobbies.delete(lobbyId);
}
// Get users with pending invitations for a lobby (to notify them when lobby closes)
export async function getPendingInvitationUsers(lobbyId) {
    const result = await query(`SELECT to_user_id FROM invitations WHERE lobby_id = $1 AND status = 'pending'`, [lobbyId]);
    return result.rows.map(r => r.to_user_id);
}
export async function voteTable(lobbyId, userId, tableId) {
    await query(`UPDATE lobby_players SET table_vote = $3 WHERE lobby_id = $1 AND user_id = $2`, [lobbyId, userId, tableId]);
    const state = activeLobbies.get(lobbyId);
    if (state) {
        state.votes.set(userId, tableId);
    }
    return true;
}
export function getVotes(lobbyId) {
    const state = activeLobbies.get(lobbyId);
    return state?.votes || null;
}
export function getVoteResults(lobbyId) {
    const state = activeLobbies.get(lobbyId);
    if (!state)
        return [];
    const counts = new Map();
    for (const tableId of state.votes.values()) {
        counts.set(tableId, (counts.get(tableId) || 0) + 1);
    }
    return Array.from(counts.entries())
        .map(([tableId, count]) => ({ tableId, count }))
        .sort((a, b) => b.count - a.count);
}
export async function selectTable(lobbyId, tableId) {
    await query(`UPDATE lobbies SET selected_table_id = $2, status = 'waiting' WHERE id = $1`, [lobbyId, tableId]);
}
// Get selected table config for a lobby
export async function getSelectedTableConfig(lobbyId) {
    const result = await query(`SELECT ic.config FROM lobbies l
     JOIN item_catalog ic ON ic.id = l.selected_table_id
     WHERE l.id = $1`, [lobbyId]);
    if (result.rows.length === 0 || !result.rows[0].config) {
        return null;
    }
    const config = result.rows[0].config;
    return typeof config === 'string' ? JSON.parse(config) : config;
}
export async function startGame(lobbyId) {
    const lobby = await getLobby(lobbyId);
    if (!lobby)
        return false;
    // Allow starting from 'voting' status if only 1 player (skip voting)
    // Or from 'waiting' status (voting completed)
    if (lobby.status !== 'waiting' && !(lobby.status === 'voting' && lobby.players.length === 1)) {
        return false;
    }
    await query(`UPDATE lobbies SET status = 'playing', started_at = NOW() WHERE id = $1`, [lobbyId]);
    // Update cache
    const lobbyCache = activeLobbies.get(lobbyId);
    if (lobbyCache) {
        lobbyCache.status = 'playing';
    }
    // Initialize game state
    await game.initializeGame(lobbyId, lobby.gameMode);
    // Mark all players as in-game
    for (const player of lobby.players) {
        const conn = connections.getConnection(player.oderId);
        if (conn) {
            conn.inGame = true;
        }
    }
    return true;
}
// Invitations
export async function createInvitation(lobbyId, fromUserId, toUserId, gameMode) {
    // Check if already invited
    const existing = await query(`SELECT 1 FROM invitations WHERE lobby_id = $1 AND to_user_id = $2 AND status = 'pending'`, [lobbyId, toUserId]);
    if (existing.rows.length > 0)
        return null;
    const result = await query(`INSERT INTO invitations (lobby_id, from_user_id, to_user_id, game_mode, expires_at)
     VALUES ($1, $2, $3, $4, NOW() + INTERVAL '5 minutes')
     RETURNING *`, [lobbyId, fromUserId, toUserId, gameMode]);
    const row = result.rows[0];
    return {
        id: row.id,
        lobbyId: row.lobby_id,
        fromUserId: row.from_user_id,
        toUserId: row.to_user_id,
        gameMode: row.game_mode,
        status: row.status,
        createdAt: new Date(row.created_at),
        expiresAt: new Date(row.expires_at),
    };
}
export async function getPendingInvitations(userId) {
    const result = await query(`SELECT i.*, u.nickname as from_nickname
     FROM invitations i
     JOIN users u ON u.id = i.from_user_id
     WHERE i.to_user_id = $1 AND i.status = 'pending' AND i.expires_at > NOW()`, [userId]);
    return result.rows.map(row => ({
        id: row.id,
        lobbyId: row.lobby_id,
        fromUserId: row.from_user_id,
        toUserId: row.to_user_id,
        gameMode: row.game_mode,
        status: row.status,
        createdAt: new Date(row.created_at),
        expiresAt: new Date(row.expires_at),
        fromUser: { nickname: row.from_nickname },
    }));
}
export async function respondToInvitation(invitationId, accept) {
    const result = await query(`UPDATE invitations SET status = $2 WHERE id = $1 RETURNING lobby_id, from_user_id, to_user_id`, [invitationId, accept ? 'accepted' : 'declined']);
    if (result.rows.length === 0)
        return { lobbyId: null, fromUserId: null, toUserId: null };
    const row = result.rows[0];
    return {
        lobbyId: accept ? row.lobby_id : null,
        fromUserId: row.from_user_id,
        toUserId: row.to_user_id,
    };
}
export function getLobbyPlayers(lobbyId) {
    const state = activeLobbies.get(lobbyId);
    return state ? Array.from(state.players) : [];
}
// Rematch ("New Game") vote state per lobby. The post-game UI lets every
// player vote on a rematch; the server only restarts when all currently
// joined players have agreed. The vote set is cleared whenever a new
// round actually starts (`clearRestartVotes`), a player leaves the
// lobby, or the lobby itself closes.
const restartVotes = new Map();
export function addRestartVote(lobbyId, userId) {
    let set = restartVotes.get(lobbyId);
    if (!set) {
        set = new Set();
        restartVotes.set(lobbyId, set);
    }
    set.add(userId);
}
export function removeRestartVote(lobbyId, userId) {
    const set = restartVotes.get(lobbyId);
    if (!set)
        return;
    set.delete(userId);
    if (set.size === 0)
        restartVotes.delete(lobbyId);
}
export function getRestartVotes(lobbyId) {
    const set = restartVotes.get(lobbyId);
    return set ? Array.from(set) : [];
}
export function clearRestartVotes(lobbyId) {
    restartVotes.delete(lobbyId);
}
export function setPlayerScreenSize(lobbyId, userId, width, height) {
    const state = activeLobbies.get(lobbyId);
    if (state) {
        state.screenSizes.set(userId, { width, height });
    }
}
export function getMinAspectRatio(lobbyId) {
    const state = activeLobbies.get(lobbyId);
    if (!state || state.screenSizes.size === 0)
        return null;
    let minAspect = Infinity;
    for (const { width, height } of state.screenSizes.values()) {
        const aspect = width / height;
        if (aspect < minAspect) {
            minAspect = aspect;
        }
    }
    return minAspect === Infinity ? null : minAspect;
}
function mapLobby(row, betAmount) {
    const noBet = row.no_bet === true;
    const rowBetAmount = typeof row.bet_amount === 'number' ? row.bet_amount : undefined;
    return {
        id: row.id,
        hostId: row.host_id,
        gameMode: row.game_mode,
        status: row.status,
        selectedTableId: row.selected_table_id,
        maxPlayers: row.max_players,
        noBet,
        betAmount: betAmount ?? rowBetAmount ?? (noBet ? 0 : 10),
        createdAt: new Date(row.created_at),
        startedAt: row.started_at ? new Date(row.started_at) : null,
        finishedAt: row.finished_at ? new Date(row.finished_at) : null,
    };
}
// Disconnect/Reconnect support
// Track disconnected players with timeout for reconnect
const disconnectedPlayers = new Map();
const RECONNECT_TIMEOUT_MS = 30000; // 30 seconds to reconnect
// Mark player as disconnected (don't remove from lobby yet)
export function markPlayerDisconnected(lobbyId, userId) {
    // Clear any existing timeout
    const existing = disconnectedPlayers.get(userId);
    if (existing) {
        clearTimeout(existing.timeoutId);
    }
    // Set timeout to actually remove player after 30 seconds
    const timeoutId = setTimeout(() => {
        console.log(`[Lobby] Reconnect timeout for user ${userId} in lobby ${lobbyId}`);
        disconnectedPlayers.delete(userId);
        // Actually leave the lobby now
        leaveLobby(lobbyId, userId);
        // Notify other players that this player has left for good
        const state = activeLobbies.get(lobbyId);
        if (state) {
            for (const playerId of state.players) {
                if (playerId !== userId) {
                    connections.send(playerId, {
                        type: 'player_left',
                        oderId: userId,
                        reason: 'timeout'
                    });
                }
            }
        }
        // If game is in progress and only 1 player left, end the game
        const gameState = game.getGameState(lobbyId);
        if (gameState) {
            const remainingPlayers = gameState.playerOrder.filter(id => {
                const conn = connections.getConnection(id);
                return conn && conn.lobbyId === lobbyId;
            });
            if (remainingPlayers.length <= 1) {
                console.log(`[Lobby] Only ${remainingPlayers.length} player(s) left, ending game`);
                closeLobby(lobbyId);
                // Notify remaining player
                for (const playerId of remainingPlayers) {
                    connections.send(playerId, {
                        type: 'game_ended_by_disconnect'
                    });
                }
            }
        }
    }, RECONNECT_TIMEOUT_MS);
    disconnectedPlayers.set(userId, {
        lobbyId,
        disconnectedAt: Date.now(),
        timeoutId
    });
    console.log(`[Lobby] Player ${userId} marked as disconnected from lobby ${lobbyId}, has ${RECONNECT_TIMEOUT_MS / 1000}s to reconnect`);
}
// Check if player can reconnect to a lobby
export function canReconnect(userId) {
    const disconnectInfo = disconnectedPlayers.get(userId);
    if (!disconnectInfo)
        return null;
    const timeLeft = RECONNECT_TIMEOUT_MS - (Date.now() - disconnectInfo.disconnectedAt);
    if (timeLeft <= 0)
        return null;
    // Check if lobby still exists and is playing
    const state = activeLobbies.get(disconnectInfo.lobbyId);
    if (!state)
        return null;
    return {
        lobbyId: disconnectInfo.lobbyId,
        timeLeft
    };
}
// Reconnect player to lobby
export async function reconnectPlayer(lobbyId, userId) {
    const disconnectInfo = disconnectedPlayers.get(userId);
    if (!disconnectInfo || disconnectInfo.lobbyId !== lobbyId) {
        return false;
    }
    // Clear the timeout
    clearTimeout(disconnectInfo.timeoutId);
    disconnectedPlayers.delete(userId);
    // Update connection
    const conn = connections.getConnection(userId);
    if (conn) {
        conn.lobbyId = lobbyId;
        conn.inGame = true;
    }
    console.log(`[Lobby] Player ${userId} reconnected to lobby ${lobbyId}`);
    return true;
}
// Check if player is marked as disconnected
export function isPlayerDisconnected(userId) {
    return disconnectedPlayers.has(userId);
}
//# sourceMappingURL=lobby.js.map