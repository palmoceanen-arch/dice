// Extend Window for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        openInvoice: (url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void;
      };
    };
  }
}

type MessageHandler = (data: unknown) => void;

interface User {
  id: number;
  // Telegram users only. For Yandex Games users this is null.
  telegramId: number | null;
  // Yandex Games users only. For Telegram users this is null.
  yandexId?: string | null;
  // Platform discriminator from the server. Optional so any preexisting
  // server response (Telegram-only) still typechecks at the consumer side.
  platform?: 'telegram' | 'yandex';
  nickname: string;
  telegramUsername: string | null;
  firstName: string | null;
  avatarUrl: string | null;
  equippedDiceId: number | null;
  equippedTableId: number | null;
  equippedEffectId: number | null;
  referralCode?: string | null;
  pips?: number;
}

export interface WebSocketClientOptions {
  // When provided, `authenticate()` sends `{type:'auth', ...getAuthPayload()}`
  // instead of the default Telegram initData payload. The Yandex Games build
  // uses this to ship `{platform:'yandex', signedData, playerInfo}` so the
  // server can verify the Yandex HMAC signature.
  getAuthPayload?: () => Record<string, unknown>;
}

interface Item {
  id: number;
  type: 'dice' | 'table' | 'effect';
  code: string;
  name: string;
  description: string | null;
  priceStars: number;
  rarity: string;
  textureUrl: string | null;
  config: Record<string, unknown> | null;
}

interface Friend {
  id: number;
  friendId: number;
  user: {
    id: number;
    nickname: string;
    telegramUsername: string | null;
    avatarUrl: string | null;
  };
  onlineStatus: 'online' | 'in_lobby' | 'in_game' | 'offline';
}

interface LobbyPlayer {
  oderId: number;
  nickname?: string;
  avatarUrl?: string | null;
  equippedDiceId?: number | null;
  equippedTableId?: number | null;
  equippedTableName?: string | null;
  equippedEffectId?: number | null;
  tableVote?: number | null;
  user?: {
    nickname: string;
    avatarUrl: string | null;
    equippedDiceId?: number | null;
    equippedTableId?: number | null;
    equippedTableName?: string | null;
    equippedEffectId?: number | null;
  };
}

interface Lobby {
  id: string;
  hostId: number;
  gameMode: 'free_roll' | 'street_craps' | 'mexico' | 'greedy_pig';
  status: 'voting' | 'waiting' | 'playing' | 'finished';
  selectedTableId: number | null;
  maxPlayers: number;
  players: LobbyPlayer[];
}

interface Invitation {
  id: number;
  lobbyId: string;
  fromUserId: number;
  gameMode: string;
  fromUser: { nickname: string };
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  public reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseReconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  
  public user: User | null = null;
  public inventory: Item[] = [];
  public isConnected = false;
  public isAuthenticated = false;
  private currentLobbyHostId: number | null = null;
  
  // Connection health tracking
  public connectionHealth: 'good' | 'unstable' | 'poor' | 'offline' = 'offline';
  
  // Reconnect support
  public pendingReconnect: { lobbyId: string; timeLeft: number } | null = null;

  constructor(
    private serverUrl: string,
    private options?: WebSocketClientOptions,
  ) {
    // Start periodic connection check
    setInterval(() => {
      this.checkConnectionStatus();
    }, 1000); // Check every second
    
    // Listen to browser online/offline events
    window.addEventListener('online', () => {
      console.log('[WS] Browser detected online', { 
        navigatorOnline: navigator.onLine,
        isConnected: this.isConnected 
      });
      if (!this.isConnected) {
        this.connect().catch(() => {});
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('[WS] Browser detected offline', { 
        navigatorOnline: navigator.onLine,
        isConnected: this.isConnected 
      });
      this.isConnected = false;
      this.isAuthenticated = false;
      this.connectionHealth = 'offline';
      this.emit('connection_health_changed', { 
        health: 'offline',
        message: 'No internet connection' 
      });
    });
  }
  
  // Check if current user is the host of the lobby
  get isHost(): boolean {
    return this.user?.id === this.currentLobbyHostId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.serverUrl);
        
        this.ws.onopen = () => {
          console.log('[WS] Connected');
          this.isConnected = true;
          this.connectionHealth = 'good';
          this.reconnectAttempts = 0;
          this.authenticate();
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };
        
        this.ws.onclose = (event) => {
          console.log('[WS] Disconnected', event.code, event.reason);
          this.isConnected = false;
          this.isAuthenticated = false;
          this.connectionHealth = 'offline';
          
          // Don't reconnect if server is shutting down
          if (event.code === 1001 && event.reason === 'Server shutdown') {
            console.log('[WS] Server is restarting, will reconnect shortly');
          }
          
          this.tryReconnect();
        };
        
        this.ws.onerror = (error) => {
          console.error('[WS] Error:', error);
          
          // Immediately mark as disconnected
          this.isConnected = false;
          this.isAuthenticated = false;
          this.connectionHealth = 'offline';
          this.emit('connection_health_changed', { 
            health: 'offline',
            message: 'Connection error' 
          });
          
          reject(error);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private authenticate() {
    // Pluggable auth (used by the Yandex Games build to ship the player
    // signature instead of Telegram initData).
    if (this.options?.getAuthPayload) {
      const payload = this.options.getAuthPayload();
      this.send({
        type: 'auth',
        ...payload,
      });
      return;
    }

    // Default: Telegram initData (or a dev fallback when running outside
    // the Telegram WebApp).
    const initData = window.Telegram?.WebApp?.initData || this.createDevInitData();

    this.send({
      type: 'auth',
      initData
    });
  }
  
  private createDevInitData(): string {
    // For development without Telegram
    // Use deterministic dev users based on session
    
    // Check if this session already has a dev user ID
    let devUserId = sessionStorage.getItem('devUserId');
    
    if (!devUserId) {
      // Count existing dev users in other tabs/windows
      const existingDevUsers: number[] = [];
      
      // Try to read from localStorage (shared across tabs)
      const devUsersStr = localStorage.getItem('activeDevUsers');
      if (devUsersStr) {
        try {
          const parsed = JSON.parse(devUsersStr);
          if (Array.isArray(parsed)) {
            existingDevUsers.push(...parsed);
          }
        } catch {
          // Ignore parse errors
        }
      }
      
      // Find next available dev user ID (11, 22, 33, 44, 55, 66)
      const availableIds = [11, 22, 33, 44, 55, 66];
      const nextId = availableIds.find(id => !existingDevUsers.includes(id)) || availableIds[0];
      
      devUserId = String(nextId);
      sessionStorage.setItem('devUserId', devUserId);
      
      // Add to active users list
      existingDevUsers.push(nextId);
      localStorage.setItem('activeDevUsers', JSON.stringify(existingDevUsers));
      
      // Clean up on window close
      window.addEventListener('beforeunload', () => {
        const currentDevUsers = JSON.parse(localStorage.getItem('activeDevUsers') || '[]');
        const filtered = currentDevUsers.filter((id: number) => id !== nextId);
        localStorage.setItem('activeDevUsers', JSON.stringify(filtered));
      });
    }
    
    const userId = parseInt(devUserId);
    const user = {
      id: userId,
      first_name: 'Dev',
      last_name: 'User',
      username: `dev${devUserId}`
    };
    
    console.log('[WS] Using dev user:', user);
    return 'user=' + encodeURIComponent(JSON.stringify(user)) + '&hash=dev';
  }
  
  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);
      
      // Skip logging for high-frequency messages
      if (message.type !== 'throw_frame' && message.type !== 'throw_sound') {
      }
      
      // Handle server shutdown notification
      if (message.type === 'server_shutdown') {
        console.log('[WS] Server shutdown notification:', message.message);
        // Will auto-reconnect via onclose handler
      }
      
      // Handle connection warning
      if (message.type === 'connection_warning') {
        console.warn('[WS] Connection warning:', message.message);
        // Emit event for UI to show warning
        this.emit('connection_unstable', message);
      }
      
      // Handle connection health updates
      if (message.type === 'connection_health') {
        this.connectionHealth = message.health;
        this.emit('connection_health_changed', { 
          health: message.health,
          message: message.message 
        });
      }
      
      // Handle friend connection status
      if (message.type === 'friend_connection_status') {
      }
      
      // Handle player connection status in lobby
      if (message.type === 'player_connection_status') {
      }
      
      // Debug dice_throw_sync
      if (message.type === 'dice_throw_sync') {
      }
      
      // Handle auth success
      if (message.type === 'auth_success') {
        this.user = message.user;
        this.inventory = message.inventory;
        this.isAuthenticated = true;
        console.log('[WS] Authenticated as:', this.user?.nickname);
        
        // Check if we can reconnect to a game
        if (message.canReconnect) {
          this.pendingReconnect = message.canReconnect;
        }
      }
      
      // Track lobby host
      if (message.type === 'lobby_created' || message.type === 'lobby_joined') {
        this.currentLobbyHostId = message.lobby?.hostId || null;
      }
      if (message.type === 'game_started' || message.type === 'game_reconnected') {
        this.currentLobbyHostId = message.lobby?.hostId || null;
      }
      if (message.type === 'lobby_left') {
        this.currentLobbyHostId = null;
        this.pendingReconnect = null;
      }
      
      // Call registered handlers
      const handlers = this.handlers.get(message.type) || [];
      handlers.forEach(handler => handler(message));
      
      // Call wildcard handlers
      const wildcardHandlers = this.handlers.get('*') || [];
      wildcardHandlers.forEach(handler => handler(message));
    } catch (err) {
      console.error('[WS] Failed to parse message:', err);
    }
  }
  
  private tryReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] Max reconnect attempts reached');
      // Emit event for UI to show reconnect button
      this.emit('max_reconnect_attempts', {});
      return;
    }
    
    this.reconnectAttempts++;
    
    // Exponential backoff with jitter
    const exponentialDelay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );
    // Add random jitter (0-25% of delay)
    const jitter = Math.random() * exponentialDelay * 0.25;
    const delay = Math.floor(exponentialDelay + jitter);
    
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(() => {});
    }, delay);
  }
  
  // Check connection status and update UI
  private checkConnectionStatus() {
    // First check if browser thinks we're offline
    if (!navigator.onLine) {
      if (this.isConnected) {
        console.warn('[WS] Browser reports offline');
        this.isConnected = false;
        this.isAuthenticated = false;
        this.connectionHealth = 'offline';
        this.emit('connection_health_changed', { 
          health: 'offline',
          message: 'No internet connection' 
        });
      }
      return;
    }
    
    // Check WebSocket readyState
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.isConnected) {
        console.warn('[WS] Connection lost detected (readyState check)');
        this.isConnected = false;
        this.isAuthenticated = false;
        this.connectionHealth = 'offline';
        this.emit('connection_health_changed', { 
          health: 'offline',
          message: 'Connection lost' 
        });
      }
      return;
    }
    
    // WebSocket says it's open, but we should verify by trying to send
    // This catches cases where network is gone but WebSocket doesn't know yet
    try {
      // Try to send a tiny message to check if connection is really alive
      // If network is gone, this will fail or timeout
      if (this.isConnected && this.isAuthenticated) {
        // Send a heartbeat ping (server will ignore unknown message types)
        // This is just to trigger an error if connection is dead
        this.ws.send(JSON.stringify({ type: '_client_ping', t: Date.now() }));
      }
    } catch (err) {
      console.warn('[WS] Failed to send ping, connection likely dead', err);
      this.isConnected = false;
      this.isAuthenticated = false;
      this.connectionHealth = 'offline';
      this.emit('connection_health_changed', { 
        health: 'offline',
        message: 'Connection lost' 
      });
    }
  }
  
  send(message: object) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WS] Cannot send - not connected', { readyState: this.ws?.readyState });
      
      // Immediately update connection status
      if (!this.isConnected) {
        this.connectionHealth = 'offline';
        this.emit('connection_health_changed', { 
          health: 'offline',
          message: 'Offline' 
        });
      }
    }
  }
  
  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }
  
  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  // Emit a local event (not sent to server)
  emit(type: string, data: unknown) {
    const handlers = this.handlers.get(type) || [];
    handlers.forEach(handler => handler(data));
  }
  
  // API methods - Profile
  setNickname(nickname: string) {
    this.send({ type: 'set_nickname', nickname });
  }
  
  equipItem(itemId: number, slot: 'dice' | 'table' | 'effect') {
    this.send({ type: 'equip_item', itemId, slot });
  }
  
  getShopItems() {
    this.send({ type: 'get_shop_items' });
  }
  
  purchaseItem(itemId: number) {
    this.send({ type: 'purchase_item', itemId });
  }
  
  // API methods - Friends
  searchUser(username: string) {
    this.send({ type: 'search_user', username });
  }
  
  getFriends() {
    this.send({ type: 'get_friends' });
  }
  
  addFriend(friendId: number) {
    this.send({ type: 'add_friend', friendId });
  }
  
  removeFriend(friendId: number) {
    this.send({ type: 'remove_friend', friendId });
  }
  
  // Friend requests
  getFriendRequests() {
    this.send({ type: 'get_friend_requests' });
  }
  
  respondFriendRequest(requestId: number, accept: boolean) {
    this.send({ type: 'respond_friend_request', requestId, accept });
  }
  
  // API methods - Referrals
  getReferralStats() {
    this.send({ type: 'get_referral_stats' });
  }
  
  getReferralList() {
    this.send({ type: 'get_referral_list' });
  }
  
  // API methods - Lobby
  //
  // `bet` is the per-player stake in pips. `0` means a no-bet lobby (Yandex
  // Games and any other case where the host wants to skip the betting flow).
  // Telegram callsites that don't pass it keep the legacy behaviour (the
  // server defaults to a regular betting lobby) so this is backwards
  // compatible.
  createLobby(
    gameMode: 'free_roll' | 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice',
    bet?: number,
  ) {
    this.send({
      type: 'create_lobby',
      gameMode,
      bet,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  }

  // API methods - Matchmaking (Yandex quick-play)
  //
  // The matchmaking queue is server-side: the client just announces its
  // preferred mode/bet and listens for `mm_queued` / `mm_match_found` /
  // `mm_match_failed`.
  joinQueue(
    mode: 'duel' | 'any',
    betAmount: number,
    gameMode?: 'free_roll' | 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice',
  ) {
    this.send({ type: 'mm_join_queue', mode, betAmount, gameMode });
  }

  leaveQueue() {
    this.send({ type: 'mm_leave_queue' });
  }

  // Confirm "I'm ready" for a match the server already broadcast as
  // `mm_match_found`. The server requires every matched player to send
  // this before it will start the game; players who don't confirm
  // before the deadline cause the match to be cancelled and bets
  // refunded.
  confirmReady() {
    this.send({ type: 'mm_ready' });
  }

  getPlayerStats() {
    this.send({ type: 'get_player_stats' });
  }
  
  joinLobby(lobbyId: string) {
    this.send({ 
      type: 'join_lobby', 
      lobbyId,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    });
  }
  
  leaveLobby() {
    this.send({ type: 'leave_lobby' });
    this.pendingReconnect = null;
  }
  
  reconnectGame(lobbyId: string) {
    this.send({ type: 'reconnect_game', lobbyId });
  }
  
  // Check if there's a pending reconnect
  hasPendingReconnect(): boolean {
    return this.pendingReconnect !== null;
  }
  
  // Clear pending reconnect (user declined)
  clearPendingReconnect() {
    this.pendingReconnect = null;
  }
  
  voteTable(tableId: number) {
    this.send({ type: 'vote_table', tableId });
  }
  
  startGame() {
    this.send({ type: 'start_game' });
  }
  
  restartGame() {
    this.send({ type: 'restart_game' });
  }
  
  // API methods - Invitations
  inviteFriend(friendId: number) {
    this.send({ type: 'invite_friend', friendId });
  }
  
  getInvitations() {
    this.send({ type: 'get_invitations' });
  }
  
  respondInvitation(invitationId: number, accept: boolean) {
    this.send({ type: 'respond_invitation', invitationId, accept });
  }
  
  // API methods - Game
  rollDice(dice1: number, dice2: number) {
    this.send({ type: 'roll_dice', dice1, dice2 });
  }
  
  // Get equipped dice config
  getEquippedDiceConfig(): { 
    baseColor: string; 
    dotColor: string; 
    borderColor: string;
    roughness?: number;
    metalness?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    opacity?: number;
    dotSize?: number;
    dotShape?: string;
    dotDepth?: number;
    bevelRadius?: number;
  } | null {
    if (!this.user?.equippedDiceId) return null;
    
    const diceItem = this.inventory.find(
      item => item.type === 'dice' && item.id === this.user?.equippedDiceId
    );
    
    if (!diceItem?.config) return null;
    
    // Return full config with defaults for missing values
    return {
      baseColor: (diceItem.config.baseColor as string) || '#e5e5d7',
      dotColor: (diceItem.config.dotColor as string) || '#383838',
      borderColor: (diceItem.config.borderColor as string) || '#e5e5d7',
      roughness: (diceItem.config.roughness as number) ?? 0.3,
      metalness: (diceItem.config.metalness as number) ?? 0,
      clearcoat: (diceItem.config.clearcoat as number) ?? 0,
      clearcoatRoughness: (diceItem.config.clearcoatRoughness as number) ?? 0,
      opacity: (diceItem.config.opacity as number) ?? 1,
      dotSize: (diceItem.config.dotSize as number) ?? 29,
      dotShape: (diceItem.config.dotShape as string) ?? 'circle',
      dotDepth: (diceItem.config.dotDepth as number) ?? 1.3,
      bevelRadius: (diceItem.config.bevelRadius as number) ?? 0.08,
    };
  }
  
  // Get equipped table config
  getEquippedTableConfig(): any | null {
    if (!this.user?.equippedTableId) return null;
    
    const tableItem = this.inventory.find(
      item => item.type === 'table' && item.id === this.user?.equippedTableId
    );
    
    if (!tableItem?.config) return null;
    
    // Return config as-is (Game.ts handles both old and new formats)
    return tableItem.config;
  }
  
  throwDiceSync(throwData: any) {
    this.send({ type: 'throw_dice_sync', throwData });
  }
  
  // Streaming throw API
  throwStart(throwPower: number, effectId: number | null, selectedDice?: number[]) {
    this.send({ type: 'throw_start', throwPower, effectId, selectedDice });
  }
  
  throwFrame(frame: { diceFrames: any[]; time: number }) {
    this.send({ type: 'throw_frame', frame });
  }
  
  throwSound(soundType: 'dice_hit' | 'table_hit', velocity: number, time: number) {
    this.send({ type: 'throw_sound', soundType, velocity, time });
  }
  
  throwEnd(finalResult: { 
    dice1: number; 
    dice2: number; 
    total: number;
    diceValues?: number[];
  }) {
    this.send({ type: 'throw_end', finalResult });
  }
  
  passTurn() {
    this.send({ type: 'pass_turn' });
  }
  
  greedyPigStop() {
    this.send({ type: 'greedy_pig_stop' });
  }
  
  // Palmo's Dice actions
  palmosTake() {
    this.send({ type: 'palmos_take' });
  }
  
  palmosReroll(selectedDice: number[]) {
    this.send({ type: 'palmos_reroll', selectedDice });
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Export types for UI
export type { User, Item, Friend, Lobby, LobbyPlayer, Invitation };

// Determine WebSocket URL based on environment
function getWebSocketUrl(): string {
  // Check for environment variable (set in .env or .env.local)
  const envUrl = import.meta.env.VITE_WS_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // In production/tunnel mode, use same host with wss
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // If we're on a tunnel URL, assume server is on a different tunnel
    // You can set VITE_WS_URL in .env.local for this case
    return `wss://${window.location.hostname.replace('-5173', '-3002')}`;
  }
  
  // Default: local development
  return 'ws://localhost:3002';
}

// Singleton instance
export const wsClient = new WebSocketClient(getWebSocketUrl());
