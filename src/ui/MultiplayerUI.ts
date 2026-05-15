import { wsClient, Friend, Lobby, Invitation } from '../multiplayer/WebSocketClient';
import { icons, icon } from './icons';
import type { Game } from '../game/Game';
import { t, onLanguageChange, getCurrentLanguage, setLanguage } from '../../shared/i18n';
import { DiceEditorModal } from './DiceEditorModal';

// Game instance will be set from main.ts
let gameInstance: Game | null = null;

export function setGameInstance(g: Game) {
  gameInstance = g;
}

export class MultiplayerUI {
  private container: HTMLElement;
  private statusEl: HTMLElement;
  private menuBtn: HTMLElement;
  private menuPanel: HTMLElement | null = null;
  private lobbyPanel: HTMLElement | null = null;
  private isMenuOpen = false;
  
  // State
  private friends: Friend[] = [];
  private currentLobby: Lobby | null = null;
  private invitations: Invitation[] = [];
  private friendRequests: { id: number; fromUserId: number; fromNickname: string; fromAvatarUrl: string | null }[] = [];
  private isInGame = false;
  private sentInvites: Set<number> = new Set(); // Track sent invites by friendId
  private isLobbyMinimized = false; // Track if lobby panel is minimized
  private shopItems: any[] = []; // All available shop items
  private unsubscribeLanguageChange: (() => void) | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'multiplayer-ui';
    this.container.innerHTML = `
      <style>
        #multiplayer-ui {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          pointer-events: none;
          z-index: 100;
        }
        #mp-status {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(0,0,0,0.6);
          border-radius: 12px;
          font-size: 12px;
          color: #888;
          cursor: pointer;
          pointer-events: auto;
        }
        #mp-status.connected { color: #4CAF50; }
        #mp-status.lobby { color: #FF9800; }
        #mp-status.in-game { color: #2196F3; }
        #mp-status.error { color: #f44336; }
        .mp-confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          pointer-events: auto;
        }
        .mp-confirm-dialog {
          background: rgba(30,30,30,0.95);
          border-radius: 12px;
          padding: 20px;
          max-width: 280px;
          text-align: center;
        }
        .mp-confirm-title {
          color: white;
          font-size: 16px;
          margin-bottom: 16px;
        }
        .mp-confirm-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        #mp-user-info {
          float: right;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #mp-menu-btn {
          width: 36px;
          height: 36px;
          background: rgba(0,0,0,0.6);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 18px;
          cursor: pointer;
          pointer-events: auto;
        }
        #mp-menu-btn:hover { background: rgba(0,0,0,0.8); }
        #mp-invites-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #f44336;
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mp-panel {
          position: fixed;
          top: 60px;
          left: 10px;
          right: 10px;
          max-height: 68vh;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          background: rgba(0,0,0,0.6);
          border-radius: 12px 12px 16px 16px;
          padding: 16px;
          pointer-events: auto;
          box-sizing: border-box;
        }
        .mp-panel::-webkit-scrollbar {
          display: none;
        }
        .mp-title { color: white; font-size: 16px; margin-bottom: 12px; font-weight: 600; }
        .mp-section { margin-bottom: 16px; }
        .mp-section:last-child { margin-bottom: 0; }
        .mp-section-title { color: #888; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
        .mp-item {
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 8px;
          color: white;
        }
        .mp-item:last-child {
          margin-bottom: 0;
        }
          font-size: 14px;
        }
        .mp-item label { display: block; margin-bottom: 4px; color: #888; font-size: 12px; }
        .mp-input {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 14px;
          box-sizing: border-box;
        }
        .mp-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #4CAF50;
          color: white;
          font-size: 14px;
          cursor: pointer;
          margin-top: 8px;
        }
        .mp-btn:hover { background: #45a049; }
        .mp-btn.secondary { background: rgba(255,255,255,0.2); }
        .mp-btn.danger { background: #f44336; }
        .mp-btn.small { padding: 6px 12px; width: auto; margin: 0; font-size: 12px; }
        .mp-friend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 6px;
        }
        .mp-friend:last-child { margin-bottom: 0; }
        .mp-friend-info { display: flex; align-items: center; gap: 8px; }
        .mp-friend-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #888;
        }
        .mp-friend-status.online { background: #4CAF50; }
        .mp-friend-status.in_lobby { background: #FF9800; }
        .mp-friend-status.in_game { background: #2196F3; }
        .mp-friend-name { color: white; font-size: 14px; }
        .mp-friend-actions { display: flex; gap: 4px; align-items: center; min-height: 32px; }
        .mp-tabs { display: flex; gap: 8px; margin-bottom: 12px; }
        .mp-tab {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }
        .mp-tab.active { background: #4CAF50; color: white; }
        .mp-invite {
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .mp-invite-text { color: white; font-size: 14px; margin-bottom: 8px; }
        .mp-invite-actions { display: flex; gap: 8px; }
        .mp-lobby-player {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          margin-bottom: 6px;
          color: white;
        }
        .mp-lobby-player.host::after {
          content: '👑';
          margin-left: auto;
        }
        .mp-vote-btn {
          padding: 8px 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: transparent;
          color: white;
          cursor: pointer;
          margin-right: 8px;
        }
        .mp-vote-btn.voted { border-color: #4CAF50; background: rgba(76,175,80,0.3); }
        .mp-vote-count { font-size: 12px; color: #888; }
      </style>
      <div id="mp-status">${t('status.connecting')}</div>
      <div id="mp-user-info">
        <button id="mp-dice-editor-btn" style="position: relative; width: 36px; height: 36px; background: transparent; border: none; color: white; cursor: pointer; pointer-events: auto; margin-right: 4px; display: flex; align-items: center; justify-content: center;" title="Редактор кубика">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <circle cx="15.5" cy="8.5" r="1.5"></circle>
            <circle cx="8.5" cy="15.5" r="1.5"></circle>
            <circle cx="15.5" cy="15.5" r="1.5"></circle>
          </svg>
        </button>
        <button id="mp-notif-btn" style="position: relative; width: 36px; height: 36px; background: transparent; border: none; color: white; cursor: pointer; pointer-events: auto; margin-right: 4px; display: flex; align-items: center; justify-content: center;">${icons.bell}</button>
        <button id="mp-menu-btn" style="position: relative; width: 36px; height: 36px; background: transparent; border: none; color: white; cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center;">${icons.menu}</button>
      </div>
    `;
    
    document.body.appendChild(this.container);
    
    this.statusEl = document.getElementById('mp-status')!;
    this.menuBtn = document.getElementById('mp-menu-btn')!;
    
    this.menuBtn.addEventListener('click', () => this.toggleMenu());
    this.statusEl.addEventListener('click', () => this.onStatusClick());
    
    // Dice editor button
    const diceEditorBtn = document.getElementById('mp-dice-editor-btn')!;
    diceEditorBtn.addEventListener('click', () => {
      // Only allow editor in online mode (not in lobby or game)
      if (this.currentLobby || this.isInGame) {
        return;
      }
      if (gameInstance) {
        DiceEditorModal.toggle(gameInstance);
      }
    });
    
    // Notifications button
    const notifBtn = document.getElementById('mp-notif-btn')!;
    notifBtn.addEventListener('click', () => this.showNotificationsPanel());
    
    // Subscribe to language changes
    this.unsubscribeLanguageChange = onLanguageChange(() => {
      this.updateStatus();
      // Refresh menu if open
      if (this.menuPanel && this.isMenuOpen) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab) {
          this.renderTab(activeTab.getAttribute('data-tab')!);
        }
      }
      // Refresh lobby if open
      if (this.lobbyPanel) {
        this.renderLobby();
      }
    });
    
    // Listen for game rules requests from GameSync
    window.addEventListener('showGameRules', ((e: CustomEvent) => {
      this.showGameRulesModal(e.detail.mode);
    }) as EventListener);
    
    this.setupEventListeners();
    this.connect();
  }
  
  private onStatusClick() {
    // If in lobby or game, show leave confirmation
    if (this.currentLobby || this.isInGame) {
      this.showLeaveConfirmation();
    }
  }
  
  private showLeaveConfirmation() {
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.style.zIndex = '1100'; // Higher than Mexico result popup (1000)
    overlay.innerHTML = `
      <div class="mp-confirm-dialog">
        <div class="mp-confirm-title">${t(this.isInGame ? 'dialogs.leaveGame' : 'dialogs.leaveLobby')}</div>
        <div class="mp-confirm-buttons">
          <button class="mp-btn secondary" id="mp-confirm-cancel">${t('buttons.cancel')}</button>
          <button class="mp-btn danger" id="mp-confirm-leave">${t('buttons.leave')}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('mp-confirm-cancel')!.addEventListener('click', () => {
      overlay.remove();
    });
    
    document.getElementById('mp-confirm-leave')!.addEventListener('click', () => {
      overlay.remove();
      wsClient.leaveLobby();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private updateStatus() {
    const notifBtn = document.getElementById('mp-notif-btn');
    const diceEditorBtn = document.getElementById('mp-dice-editor-btn');
    
    if (this.isInGame) {
      if (this.isMenuOpen) {
        // Menu open - show full status
        this.statusEl.textContent = t('status.inGame');
        this.statusEl.className = 'in-game';
        this.statusEl.style.padding = '6px 12px';
        if (notifBtn) notifBtn.style.display = 'block';
        if (diceEditorBtn) diceEditorBtn.style.display = 'none'; // Hide editor in game
      } else {
        // Menu closed - collapse to dot only
        this.statusEl.textContent = '●';
        this.statusEl.className = 'in-game';
        this.statusEl.style.padding = '6px 10px';
        if (notifBtn) notifBtn.style.display = 'none';
        if (diceEditorBtn) diceEditorBtn.style.display = 'none'; // Hide editor in game
      }
    } else if (this.currentLobby) {
      this.statusEl.textContent = t('status.lobby');
      this.statusEl.className = 'lobby';
      this.statusEl.style.padding = '6px 12px';
      if (notifBtn) notifBtn.style.display = 'block';
      if (diceEditorBtn) diceEditorBtn.style.display = 'none'; // Hide editor in lobby
    } else if (!wsClient.isConnected) {
      // Offline - show appropriate status
      if (wsClient.reconnectAttempts > 0 && navigator.onLine) {
        // Network is available but WebSocket disconnected - reconnecting
        this.statusEl.textContent = 'Reconnecting...';
        this.statusEl.className = 'error';
      } else {
        // No network or not trying to reconnect yet
        this.statusEl.textContent = t('status.offline');
        this.statusEl.className = 'error';
      }
      this.statusEl.style.padding = '6px 12px';
      if (notifBtn) notifBtn.style.display = 'block';
      if (diceEditorBtn) diceEditorBtn.style.display = 'flex';
    } else if (wsClient.connectionHealth === 'unstable' || wsClient.connectionHealth === 'poor') {
      this.statusEl.textContent = 'Unstable';
      this.statusEl.className = 'error';
      this.statusEl.style.padding = '6px 12px';
      if (notifBtn) notifBtn.style.display = 'block';
      if (diceEditorBtn) diceEditorBtn.style.display = 'flex';
    } else {
      this.statusEl.textContent = t('status.online');
      this.statusEl.className = 'connected';
      this.statusEl.style.padding = '6px 12px';
      if (notifBtn) notifBtn.style.display = 'block';
      if (diceEditorBtn) diceEditorBtn.style.display = 'flex'; // Show editor when online
    }
  }

  private setupEventListeners() {
    wsClient.on('auth_success', (data: any) => {
      this.updateStatus();
      // Request friends, invitations, and friend requests after auth is confirmed
      setTimeout(() => {
        wsClient.getFriends();
        wsClient.getInvitations();
        wsClient.getFriendRequests();
      }, 100);
      
      // Refresh current menu tab if menu is open
      if (this.menuPanel && this.isMenuOpen) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab) {
          this.renderTab(activeTab.getAttribute('data-tab')!);
        }
      }
      
      // Check if we can reconnect to a game
      if (data.canReconnect) {
        this.showReconnectDialog(data.canReconnect.lobbyId, data.canReconnect.timeLeft);
      }
    });
    
    // Connection health changed - update status
    wsClient.on('connection_health_changed', (data: any) => {
      console.log('[MultiplayerUI] Connection health changed:', data.health);
      this.updateStatus();
    });
    
    wsClient.on('auth_error', (data: any) => {
      this.statusEl.textContent = t('status.authFailed');
      this.statusEl.className = 'error';
      console.error('Auth error:', data.message);
    });
    
    wsClient.on('nickname_changed', (data: any) => {
      if (wsClient.user) {
        wsClient.user.nickname = data.nickname;
      }
    });
    
    // Item equipped
    wsClient.on('item_equipped', (data: any) => {
      if (wsClient.user) {
        if (data.slot === 'dice') wsClient.user.equippedDiceId = data.itemId;
        if (data.slot === 'table') wsClient.user.equippedTableId = data.itemId;
        if (data.slot === 'effect') wsClient.user.equippedEffectId = data.itemId;
      }
    });
    
    // Item received (gift from admin)
    wsClient.on('item_received', (data: any) => {
      // Update inventory
      if (data.inventory) {
        wsClient.inventory = data.inventory;
      }
      
      // Show notification
      const items = data.item as { name: string; rarity: string }[];
      if (items.length === 1) {
        this.showNotification(t('notifications.itemReceived', { item: items[0].name }));
      } else {
        this.showNotification(t('notifications.itemsReceived', { count: items.length }));
      }
      
      // Refresh inventory tab if open
      if (this.menuPanel) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab?.getAttribute('data-tab') === 'inventory') {
          const content = document.getElementById('mp-tab-content');
          if (content) this.renderInventoryTab(content);
        }
      }
    });
    
    // Shop items
    wsClient.on('shop_items', (data: any) => {
      this.shopItems = data.items;
      // Refresh shop tab if open
      if (this.menuPanel) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab?.getAttribute('data-tab') === 'shop') {
          const content = document.getElementById('mp-tab-content');
          if (content) this.renderShopTab(content);
        }
      }
    });
    
    // Purchase handlers
    wsClient.on('purchase_invoice', (data: any) => {
      // Open Telegram payment dialog
      if (window.Telegram?.WebApp?.openInvoice) {
        window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status) => {
          console.log('[Purchase] Invoice status:', status);
          if (status === 'paid') {
            // Payment successful - server will send purchase_success via webhook
            this.showNotification(t('notifications.paymentProcessing'));
          } else if (status === 'cancelled') {
            this.showNotification(t('notifications.purchaseCancelled'));
          } else if (status === 'failed') {
            this.showNotification(t('notifications.paymentFailed'), true);
          }
        });
      } else {
        // Fallback for non-Telegram environment
        this.showNotification(t('notifications.paymentNotAvailable'), true);
      }
    });
    
    wsClient.on('purchase_success', (data: any) => {
      // Update inventory
      if (data.inventory) {
        wsClient.inventory = data.inventory;
      }
      
      // Find item name
      const item = this.shopItems.find(i => i.id === data.itemId);
      const itemName = item?.name || 'Item';
      
      this.showNotification(t('notifications.purchaseSuccess', { item: itemName }));
      
      // Refresh shop tab if open
      if (this.menuPanel) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab?.getAttribute('data-tab') === 'shop') {
          const content = document.getElementById('mp-tab-content');
          if (content) this.renderShopTab(content);
        }
      }
    });
    
    wsClient.on('purchase_success_pips', (data: any) => {
      console.log('[SHOP] Purchased with pips:', data);
      // Update inventory
      if (data.inventory) {
        wsClient.inventory = data.inventory;
      }
      this.showNotification(`Purchased ${data.itemName} for ${data.pipsSpent} pips!`);
      // Refresh shop tab if open
      if (this.menuPanel) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab?.getAttribute('data-tab') === 'shop') {
          const content = document.getElementById('mp-tab-content');
          if (content) this.renderShopTab(content);
        }
      }
    });
    
    wsClient.on('purchase_error', (data: any) => {
      this.showNotification(data.message || t('notifications.purchaseFailed'), true);
    });
    
    // Custom dice saved
    wsClient.on('custom_dice_saved', (data: any) => {
      console.log('[KEYS] Custom dice saved:', data);
      // Update inventory
      if (data.inventory) {
        wsClient.inventory = data.inventory;
      }
      this.showNotification(`✨ Custom dice "${data.diceName}" saved!`);
      // Refresh inventory tab if open
      if (this.menuPanel) {
        const activeTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeTab?.getAttribute('data-tab') === 'inventory') {
          const content = document.getElementById('mp-tab-content');
          if (content) this.renderInventoryTab(content);
        }
      }
    });
    
    // Friends
    wsClient.on('friends_list', (data: any) => {
      this.friends = data.friends;
      this.renderFriends();
    });
    
    wsClient.on('user_found', (data: any) => {
      this.showSearchResult(data.user);
    });
    
    wsClient.on('user_not_found', () => {
      this.showSearchResult(null);
    });
    
    wsClient.on('friend_online', (data: any) => {
      const friend = this.friends.find(f => f.friendId === data.friendId);
      if (friend) {
        friend.onlineStatus = 'online';
        this.renderFriends();
        // Also refresh invite modal if open
        const inviteModal = document.getElementById('mp-invite-modal');
        if (inviteModal) {
          this.refreshInviteFriendsModal();
        }
      }
    });
    
    wsClient.on('friend_offline', (data: any) => {
      const friend = this.friends.find(f => f.friendId === data.friendId);
      if (friend) {
        friend.onlineStatus = 'offline';
        this.renderFriends();
        // Also refresh invite modal if open
        const inviteModal = document.getElementById('mp-invite-modal');
        if (inviteModal) {
          this.refreshInviteFriendsModal();
        }
      }
    });
    
    // Friend status changed (joined lobby, started game, etc.)
    wsClient.on('friend_status_changed', (data: any) => {
      const friend = this.friends.find(f => f.friendId === data.friendId);
      if (friend) {
        friend.onlineStatus = data.status;
        this.renderFriends();
        // Also refresh invite modal if open
        const inviteModal = document.getElementById('mp-invite-modal');
        if (inviteModal) {
          this.refreshInviteFriendsModal();
        }
      }
    });
    
    wsClient.on('friend_added_you', () => {
      // Refresh friends list when someone adds us
      wsClient.getFriends();
    });
    
    // Friend requests
    wsClient.on('friend_requests_list', (data: any) => {
      this.friendRequests = data.requests;
      this.updateInvitesBadge();
    });
    
    wsClient.on('friend_request_received', (data: any) => {
      this.friendRequests.push(data.request);
      this.updateInvitesBadge();
      this.showNotification(t('notifications.friendRequest', { nickname: data.request.fromNickname }));
      
      // Refresh notifications panel Friends tab if open
      const notifPanel = document.getElementById('mp-notifications-panel');
      if (notifPanel) {
        const friendsTab = notifPanel.querySelector('[data-notif-tab="friends"]') as HTMLElement;
        // Check if friends tab is active (has green background)
        if (friendsTab && friendsTab.style.background === 'rgb(76, 175, 80)') {
          this.renderNotifTab('friends');
        }
        // Also update the tab label to show new count
        if (friendsTab) {
          friendsTab.textContent = `${t('notifPanel.friends')}${this.friendRequests.length ? ` (${this.friendRequests.length})` : ''}`;
        }
      }
      
      // Refresh friends tab in main menu if open
      if (this.menuPanel) {
        const activeMenuTab = this.menuPanel.querySelector('.mp-tab.active');
        if (activeMenuTab?.getAttribute('data-tab') === 'friends') {
          this.renderTab('friends');
        }
      }
    });
    
    wsClient.on('friend_request_sent', () => {
      this.showNotification(t('notifications.friendRequestSent'));
    });
    
    wsClient.on('friend_request_accepted', (data: any) => {
      this.friendRequests = this.friendRequests.filter(r => r.id !== data.requestId);
      this.updateInvitesBadge();
      wsClient.getFriends();
      
      // Update Friends tab label to reflect new count
      const notifPanel = document.getElementById('mp-notifications-panel');
      if (notifPanel) {
        const friendsTab = notifPanel.querySelector('[data-notif-tab="friends"]') as HTMLElement;
        if (friendsTab) {
          friendsTab.textContent = `${t('notifPanel.friends')}${this.friendRequests.length ? ` (${this.friendRequests.length})` : ''}`;
        }
        // Also refresh the tab content if it's active
        if (friendsTab && friendsTab.style.background === 'rgb(76, 175, 80)') {
          this.renderNotifTab('friends');
        }
      }
    });
    
    wsClient.on('friend_request_was_accepted', (data: any) => {
      this.showNotification(t('notifications.friendRequestAccepted', { nickname: data.byNickname }));
      wsClient.getFriends();
    });
    
    wsClient.on('friend_request_declined', (data: any) => {
      this.friendRequests = this.friendRequests.filter(r => r.id !== data.requestId);
      this.updateInvitesBadge();
      
      // Update Friends tab label to reflect new count
      const notifPanel = document.getElementById('mp-notifications-panel');
      if (notifPanel) {
        const friendsTab = notifPanel.querySelector('[data-notif-tab="friends"]') as HTMLElement;
        if (friendsTab) {
          friendsTab.textContent = `${t('notifPanel.friends')}${this.friendRequests.length ? ` (${this.friendRequests.length})` : ''}`;
        }
        // Also refresh the tab content if it's active
        if (friendsTab && friendsTab.style.background === 'rgb(76, 175, 80)') {
          this.renderNotifTab('friends');
        }
      }
    });
    
    wsClient.on('friend_removed_you', () => {
      // Refresh friends list when someone removes us
      wsClient.getFriends();
    });
    
    // Invitations
    wsClient.on('invitations_list', (data: any) => {
      this.invitations = data.invitations;
      this.updateInvitesBadge();
    });
    
    wsClient.on('invitation_received', (data: any) => {
      this.invitations.push(data.invitation);
      this.updateInvitesBadge();
      this.showNotification(t('notifications.invitationReceived', { nickname: data.invitation.fromUser.nickname }));
      
      // Auto-refresh invites tab if menu is open on that tab
      const activeTab = this.menuPanel?.querySelector('.mp-tab.active');
      if (activeTab?.getAttribute('data-tab') === 'invites') {
        this.renderInvitations();
      }
      
      // Auto-refresh notifications panel if open on invites tab
      const notifPanel = document.getElementById('mp-notifications-panel');
      if (notifPanel) {
        const invitesTab = notifPanel.querySelector('[data-notif-tab="invites"]') as HTMLElement;
        // Check if invites tab is active (has green background)
        if (invitesTab && invitesTab.style.background === 'rgb(76, 175, 80)') {
          this.renderNotifTab('invites');
        }
        // Update tab label with new count
        if (invitesTab) {
          invitesTab.textContent = `${t('notifPanel.invites')}${this.invitations.length ? ` (${this.invitations.length})` : ''}`;
        }
      }
      
      // Also update tab label in menu
      this.updateInvitesTabLabel();
    });
    
    // Invitation was cancelled (lobby closed)
    wsClient.on('invitation_cancelled', (data: any) => {
      this.invitations = this.invitations.filter(i => i.lobbyId !== data.lobbyId);
      this.updateInvitesBadge();
      
      // Refresh notifications panel if open
      const notifPanel = document.getElementById('mp-notifications-panel');
      if (notifPanel) {
        const invitesTab = notifPanel.querySelector('[data-notif-tab="invites"]') as HTMLElement;
        // Check if invites tab is active
        if (invitesTab && invitesTab.style.background === 'rgb(76, 175, 80)') {
          this.renderNotifTab('invites');
        }
        // Update tab label
        if (invitesTab) {
          invitesTab.textContent = `${t('notifPanel.invites')}${this.invitations.length ? ` (${this.invitations.length})` : ''}`;
        }
      }
    });
    
    // Invitation response (declined) - allow re-inviting
    wsClient.on('invitation_response', (data: any) => {
      if (!data.accepted) {
        // Remove from sentInvites so we can invite again
        this.sentInvites.delete(data.toUserId);
        
        // Refresh invite friends modal if open
        const inviteModal = document.getElementById('mp-invite-modal');
        if (inviteModal) {
          this.refreshInviteFriendsModal();
        }
      }
    });
    
    // Lobby
    wsClient.on('lobby_created', (data: any) => {
      this.currentLobby = data.lobby;
      this.closeMenu();
      this.showLobbyPanel();
      this.updateStatus();
    });
    
    wsClient.on('lobby_joined', (data: any) => {
      this.currentLobby = data.lobby;
      this.closeMenu();
      this.showLobbyPanel();
      this.updateStatus();
    });
    
    wsClient.on('lobby_left', (data: any) => {
      this.currentLobby = null;
      this.isInGame = false;
      this.sentInvites.clear(); // Clear sent invites when leaving lobby
      this.closeLobbyPanel();
      this.updateStatus();
      
      // Update pips if provided (pips are managed by Game.ts now)
      if (data?.newPips !== undefined) {
        wsClient.user!.pips = data.newPips;
        // Pips display is handled by WallText in Game.ts
      }
      
      // Close any mexico result popup
      const mexicoPopup = document.querySelector('[data-mexico-result]');
      if (mexicoPopup) mexicoPopup.remove();
    });
    
    wsClient.on('player_joined', (data: any) => {
      if (this.currentLobby) {
        this.currentLobby.players.push(data.player);
        this.renderLobby();
      }
    });
    
    wsClient.on('player_left', (data: any) => {
      if (this.currentLobby) {
        this.currentLobby.players = this.currentLobby.players.filter(p => p.oderId !== data.oderId);
        
        // Allow re-inviting this player
        this.sentInvites.delete(data.oderId);
        
        // If we're in game and other player left, return to solo mode
        if (this.isInGame) {
          this.showNotification(t('notifications.playerLeft'));
          // Tell server we're leaving too
          wsClient.leaveLobby();
          // Emit event for GameSync to handle (lobby_left will also fire)
          wsClient.emit('game_ended_by_disconnect', {});
        } else {
          // In lobby but not in game - just update the lobby view
          this.renderLobby();
          
          // Refresh invite modal if open
          const inviteModal = document.getElementById('mp-invite-modal');
          if (inviteModal) {
            this.refreshInviteFriendsModal();
          }
        }
      }
    });
    
    wsClient.on('vote_update', (data: any) => {
      this.renderVotes(data.votes);
    });
    
    wsClient.on('table_selected', (data: any) => {
      if (this.currentLobby) {
        this.currentLobby.selectedTableId = data.tableId;
        this.currentLobby.status = 'waiting';
        this.renderLobby();
      }
    });
    
    wsClient.on('game_started', (data: any) => {
      this.currentLobby = data.lobby;
      this.isInGame = true;
      this.closeLobbyPanel();
      this.updateStatus();
      this.showNotification(t('notifications.gameStarted'));
      
      // Show who goes first
      const firstPlayerNickname = this.getPlayerNickname(data.currentTurn);
      setTimeout(() => {
        this.showNotification(t('notifications.firstShooter', { nickname: firstPlayerNickname }));
      }, 1000);
    });
    
    // Reconnect events
    wsClient.on('game_reconnected', (data: any) => {
      this.currentLobby = data.lobby;
      this.isInGame = true;
      this.closeLobbyPanel();
      this.updateStatus();
      this.showNotification(t('notifications.reconnected'));
    });
    
    wsClient.on('player_disconnected', (data: any) => {
      const nickname = this.getPlayerNickname(data.oderId);
      this.showNotification(t('notifications.playerDisconnected', { nickname }));
    });
    
    wsClient.on('player_reconnected', (data: any) => {
      this.showNotification(t('notifications.playerReconnected', { nickname: data.nickname }));
    });
    
    wsClient.on('reconnect_failed', (data: any) => {
      this.showNotification(data.message || t('notifications.reconnectFailed'), true);
      wsClient.clearPendingReconnect();
    });
    
    // Betting events
    wsClient.on('show_betting_ui', (data: any) => {
      console.log('[BETTING] Showing betting UI', data);
      import('./BettingModal.js').then(({ BettingModal }) => {
        BettingModal.show(data.minBet, data.balance);
      });
    });
    
    wsClient.on('bet_placed', (data: any) => {
      console.log('[BETTING] Bet placed', data);
      // Update user balance if it's our bet
      if (wsClient.user && data.userId === wsClient.user.id) {
        wsClient.user.pips = data.newBalance;
      }
    });
    
    wsClient.on('pot_updated', (data: any) => {
      console.log('[BETTING] Pot updated', data);
      import('./BettingModal.js').then(({ BettingModal }) => {
        // BettingModal handles pot updates internally
        BettingModal.updatePot(data.pot, data.bets);
      });
    });
    
    wsClient.on('bet_confirmed', (data: any) => {
      console.log('[BETTING] Bet confirmed', data);
      // Update user balance
      if (wsClient.user && data.userId === wsClient.user.id) {
        wsClient.user.pips = data.newBalance;
      }
    });
    
    wsClient.on('betting_complete', (data: any) => {
      console.log('[BETTING] Betting complete', data);
      import('./BettingModal.js').then(({ BettingModal }) => {
        BettingModal.onBettingComplete();
      });
      this.showNotification(`Игра начнется через ${data.startingIn} сек. Банк: ${data.pot} pips`);
    });
    
    wsClient.on('bet_error', (data: any) => {
      console.error('[BETTING] Bet error:', data.message);
      this.showNotification(data.message, true);
    });
    
    wsClient.on('error', (data: any) => {
      console.error('Server error:', data.message);
      this.showNotification(data.message, true);
    });
  }
  
  private async connect() {
    try {
      await wsClient.connect();
    } catch {
      this.statusEl.textContent = t('status.offline');
      this.statusEl.className = 'error';
    }
  }
  
  private toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  private openMenu() {
    // Close dice editor if open
    if ((window as any).__diceEditorModal) {
      const editorModal = (window as any).__diceEditorModal;
      if (editorModal && typeof editorModal.close === 'function') {
        editorModal.close();
      }
    }
    
    if (this.menuPanel) return;
    
    // Close any mexico result popup when opening menu
    const mexicoPopup = document.querySelector('[data-mexico-result]');
    if (mexicoPopup) mexicoPopup.remove();
    
    this.isMenuOpen = true;
    this.updateStatus(); // Update status visibility
    
    // Add backdrop with blur
    const backdrop = document.createElement('div');
    backdrop.id = 'mp-menu-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99;
      pointer-events: auto;
    `;
    document.body.appendChild(backdrop);
    
    this.menuPanel = document.createElement('div');
    this.menuPanel.className = 'mp-panel';
    this.menuPanel.id = 'mp-menu-panel';
    
    this.menuPanel.innerHTML = `
      <div class="mp-tabs">
        <button class="mp-tab active" data-tab="main">${t('menu.main')}</button>
        <button class="mp-tab" data-tab="friends">${t('menu.friends')}</button>
        <button class="mp-tab" data-tab="inventory">${t('menu.inventory')}</button>
        <button class="mp-tab" data-tab="shop">${t('menu.shop')}</button>
      </div>
      <div id="mp-tab-content"></div>
    `;
    
    this.container.appendChild(this.menuPanel);
    
    // Tab switching
    this.menuPanel.querySelectorAll('.mp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.menuPanel!.querySelectorAll('.mp-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderTab(tab.getAttribute('data-tab')!);
      });
    });
    
    // Click outside to close
    setTimeout(() => {
      document.addEventListener('click', this.handleClickOutsideMenu);
    }, 10);
    
    this.renderTab('main');
  }
  
  private handleClickOutsideMenu = (e: MouseEvent) => {
    if (!this.menuPanel) return;
    
    const target = e.target as HTMLElement;
    // Check if click is outside menu panel and not on menu button
    // Also check if target still exists in DOM (button might have been replaced)
    if (!document.body.contains(target)) return;
    if (!this.menuPanel.contains(target) && !this.menuBtn.contains(target)) {
      this.closeMenu();
    }
  };
  
  private renderTab(tab: string) {
    const content = document.getElementById('mp-tab-content');
    if (!content) return;
    
    switch (tab) {
      case 'main':
        const controlMode = gameInstance?.getControlMode() || 'motion';
        const requireReady = gameInstance?.getRequireReadyConfirmation() || false;
        const graphicsQuality = gameInstance?.getGraphicsQuality() || 'high';
        const inLobbyOrGame = this.currentLobby || this.isInGame;
        const currentLang = getCurrentLanguage();
        
        content.innerHTML = `
          ${inLobbyOrGame 
            ? `<div class="mp-section">
                <button class="mp-btn danger" id="mp-disconnect">${t('buttons.leave')}</button>
              </div>`
            : `<div class="mp-section">
                <button class="mp-btn" id="mp-create-lobby" style="background: #FF9800;">${t('lobby.createLobby')}</button>
              </div>`
          }
          <div class="mp-section">
            <div class="mp-section-title">${t('profile.title')}</div>
            <div class="mp-item">
              <input type="text" class="mp-input" id="mp-nickname-input" value="${wsClient.user?.nickname || ''}" maxlength="32" pattern="[a-zA-Z0-9_]+" autocomplete="off">
              <button class="mp-btn" id="mp-save-nickname">${t('buttons.save')}</button>
            </div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${t('settings.language')}</div>
            <div class="mp-item" style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${t('settings.language')}</span>
              <div style="display: flex; gap: 4px;">
                <button class="mp-btn small ${currentLang === 'en' ? '' : 'secondary'}" id="mp-lang-en" style="padding: 6px 12px;">English</button>
                <button class="mp-btn small ${currentLang === 'ru' ? '' : 'secondary'}" id="mp-lang-ru" style="padding: 6px 12px;">Русский</button>
              </div>
            </div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${t('settings.controls')}</div>
            <div class="mp-item" style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${t('settings.controls')}</span>
              <div style="display: flex; gap: 4px;">
                <button class="mp-btn small ${controlMode === 'motion' ? '' : 'secondary'}" id="mp-mode-motion" style="padding: 6px 12px;">${t('settings.controlsMotion')}</button>
                <button class="mp-btn small ${controlMode === 'manual' ? '' : 'secondary'}" id="mp-mode-manual" style="padding: 6px 12px;">${t('settings.controlsManual')}</button>
              </div>
            </div>
            <div class="mp-item" id="mp-ready-toggle-container" style="display: ${controlMode === 'motion' ? 'flex' : 'none'}; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${t('settings.confirmBeforeThrow')}</span>
              <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
                <input type="checkbox" id="mp-ready-toggle" ${requireReady ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${requireReady ? '#4CAF50' : 'rgba(255,255,255,0.2)'}; border-radius: 24px; transition: 0.2s;"></span>
                <span style="position: absolute; top: 2px; left: ${requireReady ? '22px' : '2px'}; width: 20px; height: 20px; background: white; border-radius: 50%; transition: 0.2s;"></span>
              </label>
            </div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${t('settings.graphics')}</div>
            <div class="mp-item" style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: white; font-size: 14px;">${t('settings.graphics')}</span>
              <div style="display: flex; gap: 4px;">
                <button class="mp-btn small ${graphicsQuality === 'low' ? '' : 'secondary'}" id="mp-gfx-low" style="padding: 6px 10px;">${t('settings.graphicsLow')}</button>
                <button class="mp-btn small ${graphicsQuality === 'medium' ? '' : 'secondary'}" id="mp-gfx-medium" style="padding: 6px 10px;">${t('settings.graphicsMedium')}</button>
                <button class="mp-btn small ${graphicsQuality === 'high' ? '' : 'secondary'}" id="mp-gfx-high" style="padding: 6px 10px;">${t('settings.graphicsHigh')}</button>
              </div>
            </div>
          </div>
        `;
        
        document.getElementById('mp-save-nickname')!.addEventListener('click', () => {
          const input = document.getElementById('mp-nickname-input') as HTMLInputElement;
          wsClient.setNickname(input.value);
        });
        
        // Language buttons
        document.getElementById('mp-lang-en')!.addEventListener('click', () => {
          setLanguage('en');
          // UI will auto-refresh via language change listener
        });
        
        document.getElementById('mp-lang-ru')!.addEventListener('click', () => {
          setLanguage('ru');
          // UI will auto-refresh via language change listener
        });
        
        const createLobbyBtn = document.getElementById('mp-create-lobby');
        if (createLobbyBtn) {
          createLobbyBtn.addEventListener('click', () => {
            this.closeMenu();
            this.showGameModeModal();
          });
        }
        
        const disconnectBtn = document.getElementById('mp-disconnect');
        if (disconnectBtn) {
          disconnectBtn.addEventListener('click', () => {
            wsClient.leaveLobby();
            this.closeMenu();
          });
        }
        
        // Control mode buttons
        document.getElementById('mp-mode-motion')!.addEventListener('click', () => {
          gameInstance?.setControlMode('motion');
          this.renderTab('main');
        });
        
        document.getElementById('mp-mode-manual')!.addEventListener('click', () => {
          gameInstance?.setControlMode('manual');
          this.renderTab('main');
        });
        
        // Ready confirmation toggle
        document.getElementById('mp-ready-toggle')!.addEventListener('change', (e) => {
          const checked = (e.target as HTMLInputElement).checked;
          gameInstance?.setRequireReadyConfirmation(checked);
          this.renderTab('main');
        });
        
        // Graphics quality buttons
        document.getElementById('mp-gfx-low')!.addEventListener('click', () => {
          gameInstance?.setGraphicsQuality('low');
          this.renderTab('main');
        });
        document.getElementById('mp-gfx-medium')!.addEventListener('click', () => {
          gameInstance?.setGraphicsQuality('medium');
          this.renderTab('main');
        });
        document.getElementById('mp-gfx-high')!.addEventListener('click', () => {
          gameInstance?.setGraphicsQuality('high');
          this.renderTab('main');
        });
        break;
        
      case 'friends':
        content.innerHTML = `
          <div class="mp-section">
            <button class="mp-btn" id="mp-invite-friend-btn" style="background: #0088cc;">
              ${t('referrals.inviteFriend')}
            </button>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${t('friends.addFriend')}</div>
            <div class="mp-item">
              <input type="text" class="mp-input" id="mp-search-input" placeholder="${t('friends.searchPlaceholder')}">
              <button class="mp-btn" id="mp-search-btn">${t('friends.search')}</button>
            </div>
            <div id="mp-search-result"></div>
          </div>
          <div class="mp-section">
            <div class="mp-section-title">${t('friends.title')} (${this.friends.length})</div>
            <div id="mp-friends-list"></div>
          </div>
        `;
        
        // Invite friend button
        document.getElementById('mp-invite-friend-btn')!.addEventListener('click', () => {
          this.showInviteFriendModal();
        });
        
        document.getElementById('mp-search-btn')!.addEventListener('click', () => {
          const input = document.getElementById('mp-search-input') as HTMLInputElement;
          if (input.value.trim()) {
            wsClient.searchUser(input.value.trim());
          }
        });
        
        this.renderFriends();
        break;
        
      case 'inventory':
        this.renderInventoryTab(content);
        break;
        
      case 'shop':
        this.renderShopTab(content);
        break;
    }
  }
  
  private renderInventoryTab(content: HTMLElement) {
    // Group inventory by type
    const diceItems = wsClient.inventory.filter(i => i.type === 'dice');
    const tableItems = wsClient.inventory.filter(i => i.type === 'table');
    const effectItems = wsClient.inventory.filter(i => i.type === 'effect');
    
    content.innerHTML = `
      <div class="mp-section">
        <div class="mp-section-title">${t('inventory.dice')}</div>
        <div id="mp-inv-dice" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${t('inventory.tables')}</div>
        <div id="mp-inv-tables" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${t('inventory.effects')}</div>
        <div id="mp-inv-effects" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
    `;
    
    // Render dice items
    const diceContainer = document.getElementById('mp-inv-dice')!;
    if (diceItems.length === 0) {
      diceContainer.innerHTML = `<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${t('inventory.noDice')}</div>`;
    } else {
      diceContainer.innerHTML = diceItems.map(item => {
        const config = item.config as { baseColor?: string; dotColor?: string } | null;
        const baseColor = config?.baseColor || '#ffffff';
        const dotColor = config?.dotColor || '#1a1a1a';
        const shortName = item.name.split(' ')[0]; // First word only
        
        return `
          <div class="mp-inv-item" data-equip-dice="${item.id}" style="
            padding: 8px;
            background: ${wsClient.user?.equippedDiceId === item.id ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
            border: 2px solid ${wsClient.user?.equippedDiceId === item.id ? '#4CAF50' : 'transparent'};
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
          ">
            <div style="
              width: 32px;
              height: 32px;
              margin: 0 auto 4px;
              background: ${baseColor};
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);
            ">
              <div style="
                width: 6px;
                height: 6px;
                background: ${dotColor};
                border-radius: 50%;
              "></div>
            </div>
            <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${shortName}</div>
          </div>
        `;
      }).join('');
    }
    
    // Render table items
    const tablesContainer = document.getElementById('mp-inv-tables')!;
    if (tableItems.length === 0) {
      tablesContainer.innerHTML = `<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${t('inventory.noTables')}</div>`;
    } else {
      tablesContainer.innerHTML = tableItems.map(item => {
        const shortName = item.name.split(' ')[0];
        const config = item.config as any;
        // Support both old and new format
        const floorColor = config?.floor?.color || config?.floorColor || '#2d5a3d';
        const wallColor = config?.wall?.color || config?.wallColor || '#1a3d2a';
        
        return `
        <div class="mp-inv-item" data-equip-table="${item.id}" style="
          padding: 8px;
          background: ${wsClient.user?.equippedTableId === item.id ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
          border: 2px solid ${wsClient.user?.equippedTableId === item.id ? '#4CAF50' : 'transparent'};
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
        ">
          <div style="
            width: 32px;
            height: 32px;
            margin: 0 auto 4px;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
          ">
            <div style="height: 50%; background: ${wallColor};"></div>
            <div style="height: 50%; background: ${floorColor}; border-top: 1px solid rgba(255,255,255,0.2);"></div>
          </div>
          <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${shortName}</div>
        </div>
      `}).join('');
    }
    
    // Render effect items
    const effectsContainer = document.getElementById('mp-inv-effects')!;
    if (effectItems.length === 0) {
      effectsContainer.innerHTML = `<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${t('inventory.noEffects')}</div>`;
    } else {
      effectsContainer.innerHTML = effectItems.map(item => {
        const shortName = item.name.split(' ')[0];
        return `
        <div class="mp-inv-item" data-equip-effect="${item.id}" style="
          padding: 8px;
          background: ${wsClient.user?.equippedEffectId === item.id ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'};
          border: 2px solid ${wsClient.user?.equippedEffectId === item.id ? '#4CAF50' : 'transparent'};
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
        ">
          <div style="font-size: 20px; margin-bottom: 4px;">✨</div>
          <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${shortName}</div>
        </div>
      `}).join('');
    }
    
    // Add click handlers for equipping
    content.querySelectorAll('[data-equip-dice]').forEach(el => {
      el.addEventListener('click', () => {
        const itemId = parseInt(el.getAttribute('data-equip-dice')!);
        
        // Update local state immediately for UI feedback
        if (wsClient.user) wsClient.user.equippedDiceId = itemId;
        this.renderInventoryTab(content);
        
        // Emit local event for immediate dice appearance update
        wsClient.emit('item_equipped', { itemId, slot: 'dice' });
        
        // Send to server
        wsClient.equipItem(itemId, 'dice');
      });
    });
    
    content.querySelectorAll('[data-equip-table]').forEach(el => {
      el.addEventListener('click', () => {
        const itemId = parseInt(el.getAttribute('data-equip-table')!);
        if (wsClient.user) wsClient.user.equippedTableId = itemId;
        this.renderInventoryTab(content);
        wsClient.emit('item_equipped', { itemId, slot: 'table' });
        wsClient.equipItem(itemId, 'table');
      });
    });
    
    content.querySelectorAll('[data-equip-effect]').forEach(el => {
      el.addEventListener('click', () => {
        const itemId = parseInt(el.getAttribute('data-equip-effect')!);
        if (wsClient.user) wsClient.user.equippedEffectId = itemId;
        this.renderInventoryTab(content);
        wsClient.emit('item_equipped', { itemId, slot: 'effect' });
        wsClient.equipItem(itemId, 'effect');
      });
    });
    
  }
  
  private renderShopTab(content: HTMLElement) {
    // Request shop items if not loaded
    if (this.shopItems.length === 0) {
      wsClient.getShopItems();
      content.innerHTML = `<div style="color: #888; font-size: 14px; text-align: center; padding: 20px;">${t('shop.loading')}</div>`;
      return;
    }
    
    // Group items by type - KEYS FIRST, HIDE DICE
    const keyItems = this.shopItems
      .filter(i => i.type === 'key')
      .sort((a, b) => {
        // design_key first, then others
        if (a.code === 'design_key') return -1;
        if (b.code === 'design_key') return 1;
        return 0;
      });
    const tableItems = this.shopItems.filter(i => i.type === 'table');
    // const diceItems = this.shopItems.filter(i => i.type === 'dice'); // HIDDEN
    
    // Check which items user already owns
    const ownedIds = new Set(wsClient.inventory.map(i => i.id));
    
    content.innerHTML = `
      <div class="mp-section">
        <div class="mp-section-title">🔑 Design Keys</div>
        <div id="mp-shop-keys" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${t('shop.tables')}</div>
        <div id="mp-shop-tables" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"></div>
      </div>
    `;
    
    // Render keys
    const keysContainer = document.getElementById('mp-shop-keys')!;
    if (keyItems.length === 0) {
      keysContainer.innerHTML = `<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">No keys available</div>`;
    } else {
      keysContainer.innerHTML = keyItems.map(item => {
        const config = item.config as { pipsPrice?: number; priceDisplay?: string; color?: string; locked?: boolean } | null;
        const pipsPrice = config?.pipsPrice || 0;
        const priceDisplay = config?.priceDisplay || `${pipsPrice}P`;
        const bgColor = config?.color || '#4A90E2';
        const locked = config?.locked || false;
        const shortName = item.name.replace(' Key', '');
        const owned = ownedIds.has(item.id);
        const rarityColor = this.getRarityColor(item.rarity);
        
        return `
          <div class="mp-shop-item" data-preview-key="${item.id}" style="
            position: relative;
            padding: 8px;
            background: ${locked ? 'rgba(50,50,50,0.5)' : 'rgba(255,255,255,0.1)'};
            border: 2px solid ${rarityColor};
            border-radius: 8px;
            cursor: ${locked ? 'not-allowed' : 'pointer'};
            text-align: center;
            opacity: ${owned ? '0.5' : locked ? '0.3' : '1'};
            filter: ${locked ? 'grayscale(1)' : 'none'};
          ">
            ${locked ? '<div style="position: absolute; top: 4px; right: 4px; font-size: 16px;">🔒</div>' : ''}
            ${owned && !locked ? '<div style="position: absolute; top: 4px; right: 4px; color: #4CAF50; font-size: 12px;">✓</div>' : ''}
            ${!owned && !locked ? `<div style="position: absolute; top: 4px; right: 4px; color: #FFD700; font-size: 10px;">${priceDisplay}</div>` : ''}
            <div style="
              width: 32px;
              height: 32px;
              margin: 0 auto 4px;
              background: ${bgColor};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">🔑</div>
            <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${shortName}</div>
          </div>
        `;
      }).join('');
    }
    
    // Render table items
    const tablesContainer = document.getElementById('mp-shop-tables')!;
    if (tableItems.length === 0) {
      tablesContainer.innerHTML = `<div style="color: #888; font-size: 12px; grid-column: 1 / -1;">${t('shop.noTablesAvailable')}</div>`;
    } else {
      tablesContainer.innerHTML = tableItems.map(item => {
        const shortName = item.name.split(' ')[0];
        const config = item.config as any;
        const floorColor = config?.floor?.color || config?.floorColor || '#2d5a3d';
        const wallColor = config?.wall?.color || config?.wallColor || '#1a3d2a';
        const owned = ownedIds.has(item.id);
        const rarityColor = this.getRarityColor(item.rarity);
        
        return `
          <div class="mp-shop-item" data-preview-table="${item.id}" style="
            position: relative;
            padding: 8px;
            background: rgba(255,255,255,0.1);
            border: 2px solid ${rarityColor};
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            opacity: ${owned ? '0.5' : '1'};
          ">
            ${owned 
              ? '<div style="position: absolute; top: 4px; right: 4px; color: #4CAF50; font-size: 12px;">✓</div>' 
              : `<div style="position: absolute; top: 4px; right: 4px; color: #FFD700; font-size: 10px; display: flex; align-items: center; gap: 1px;">${item.priceStars}<span style="display: inline-flex;">${icon('star', 9)}</span></div>`
            }
            <div style="
              width: 32px;
              height: 32px;
              margin: 0 auto 4px;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
            ">
              <div style="height: 50%; background: ${wallColor};"></div>
              <div style="height: 50%; background: ${floorColor}; border-top: 1px solid rgba(255,255,255,0.2);"></div>
            </div>
            <div style="color: white; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${shortName}</div>
          </div>
        `;
      }).join('');
    }
    
    // Add click handlers for keys
    content.querySelectorAll('[data-preview-key]').forEach(el => {
      el.addEventListener('click', () => {
        const itemId = parseInt(el.getAttribute('data-preview-key')!);
        const item = this.shopItems.find(i => i.id === itemId);
        if (item) {
          this.showItemModal(item, 'key');
        }
      });
    });
    
    // Add click handlers for tables
    content.querySelectorAll('[data-preview-table]').forEach(el => {
      el.addEventListener('click', () => {
        const itemId = parseInt(el.getAttribute('data-preview-table')!);
        const item = this.shopItems.find(i => i.id === itemId);
        if (item) {
          this.showItemModal(item, 'table');
        }
      });
    });
  }
  
  private showItemModal(item: any, type: 'dice' | 'table' | 'effect' | 'key') {
    const owned = wsClient.inventory.some(i => i.id === item.id);
    const canPreview = !this.currentLobby && !this.isInGame;
    const config = item.config as any;
    
    // Check if key is locked
    if (type === 'key' && config?.locked) {
      const overlay = document.createElement('div');
      overlay.className = 'mp-confirm-overlay';
      overlay.style.zIndex = '1200';
      overlay.innerHTML = `
        <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 280px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
          <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px;">${item.name}</div>
          <div style="color: #888; font-size: 14px; margin-bottom: 16px;">Coming soon!</div>
          <button class="mp-btn secondary" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">Close</button>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.querySelector('button')!.addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });
      return;
    }
    
    // Dice preview render
    let previewHtml = '';
    if (type === 'dice') {
      const baseColor = config?.baseColor || '#ffffff';
      const dotColor = config?.dotColor || '#1a1a1a';
      previewHtml = `
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: ${baseColor};
          border-radius: 8px;
          transform: perspective(200px) rotateX(-15deg) rotateY(25deg);
          box-shadow: 
            4px 4px 8px rgba(0,0,0,0.3),
            inset 0 0 0 2px rgba(255,255,255,0.1);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          padding: 12px;
          gap: 8px;
        ">
          ${[1,2,3,4,5].map(() => `<div style="width: 12px; height: 12px; background: ${dotColor}; border-radius: 50%;"></div>`).join('')}
        </div>
      `;
    } else if (type === 'table') {
      const floorColor = config?.floor?.color || config?.floorColor || '#2d5a3d';
      const wallColor = config?.wall?.color || config?.wallColor || '#1a3d2a';
      previewHtml = `
        <div style="
          width: 100px;
          height: 80px;
          margin: 0 auto 16px;
          border-radius: 8px;
          overflow: hidden;
          transform: perspective(200px) rotateX(10deg);
          box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
        ">
          <div style="height: 40%; background: ${wallColor};"></div>
          <div style="height: 60%; background: ${floorColor}; border-top: 2px solid rgba(255,255,255,0.2);"></div>
        </div>
      `;
    } else if (type === 'key') {
      const bgColor = config?.color || '#4A90E2';
      previewHtml = `
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: ${bgColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        ">🔑</div>
      `;
    } else {
      previewHtml = `<div style="font-size: 48px; margin-bottom: 16px;">✨</div>`;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.id = 'mp-item-modal';
    overlay.style.zIndex = '1200';
    
    const pipsPrice = type === 'key' ? (config?.pipsPrice || 0) : 0;
    const userPips = wsClient.user?.pips || 0;
    const canAfford = userPips >= pipsPrice;
    
    overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center;">
        ${previewHtml}
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px;">${item.name}</div>
        <div style="color: #888; font-size: 12px; margin-bottom: 16px;">${item.description || ''}</div>
        
        ${owned ? `
          <div style="color: #4CAF50; font-size: 14px; margin-bottom: 16px;">✓ ${t('shop.youOwnThis')}</div>
          <button class="mp-btn secondary" id="mp-item-close" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('shop.close')}</button>
        ` : type === 'key' ? `
          ${!canAfford ? `<div style="color: #f44336; font-size: 12px; margin-bottom: 8px;">Need ${pipsPrice - userPips} more pips</div>` : ''}
          <button class="mp-btn" id="mp-item-buy" style="width: 100%; padding: 12px; background: ${canAfford ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(100,100,100,0.5)'}; border: none; border-radius: 8px; color: ${canAfford ? '#000' : '#666'}; font-size: 14px; font-weight: 600; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; ${canAfford ? 'box-shadow: 0 4px 12px rgba(255,215,0,0.4);' : ''}" ${!canAfford ? 'disabled' : ''}>
            Buy for ${pipsPrice} Pips
          </button>
        ` : `
          <div style="display: flex; gap: 8px;">
            ${canPreview ? `<button class="mp-btn secondary" id="mp-item-preview" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('shop.preview')}</button>` : ''}
            <button class="mp-btn" id="mp-item-buy" style="flex: 1; padding: 12px; background: #4CAF50; border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              ${t('shop.buyFor')} ${item.priceStars}<span style="display: inline-flex;">${icon('star', 14)}</span>
            </button>
          </div>
        `}
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Stop propagation to prevent menu from closing
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close only if clicked on overlay background (not dialog)
      if (e.target === overlay) overlay.remove();
    });
    
    // Close button
    const closeBtn = document.getElementById('mp-item-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => overlay.remove());
    }
    
    // Preview button
    const previewBtn = document.getElementById('mp-item-preview');
    if (previewBtn && gameInstance) {
      previewBtn.addEventListener('click', () => {
        if (type === 'dice') {
          gameInstance!.previewDice(item.config);
        } else if (type === 'table') {
          gameInstance!.previewTable(item.config);
        }
        overlay.remove();
        this.closeMenu();
        this.showNotification(t('shop.previewing', { item: item.name }));
      });
    }
    
    // Buy button
    const buyBtn = document.getElementById('mp-item-buy');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        overlay.remove();
        // Request purchase invoice from server directly (Telegram shows its own confirmation)
        wsClient.purchaseItem(item.id);
      });
    }
  }
  
  private getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return 'rgba(255,255,255,0.3)';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return 'rgba(255,255,255,0.3)';
    }
  }
  
  private renderFriends() {
    const list = document.getElementById('mp-friends-list');
    if (!list) return;
    
    if (this.friends.length === 0) {
      list.innerHTML = `<div style="color: #888; font-size: 14px;">${t('friends.noFriends')}</div>`;
      return;
    }
    
    list.innerHTML = this.friends.map(f => `
      <div class="mp-friend">
        <div class="mp-friend-info">
          <div class="mp-friend-status ${f.onlineStatus}"></div>
          <span class="mp-friend-name">${f.user.nickname}</span>
        </div>
        <div class="mp-friend-actions">
          ${f.onlineStatus !== 'offline' && this.currentLobby ? 
            `<button class="mp-btn small" data-invite="${f.friendId}">${t('friends.invite')}</button>` : ''}
          <button class="mp-remove-btn" data-remove="${f.friendId}" data-name="${f.user.nickname}" style="background: transparent; border: none; color: #f44336; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center;">${icon('x', 18)}</button>
        </div>
      </div>
    `).join('');
    
    list.querySelectorAll('[data-invite]').forEach(btn => {
      btn.addEventListener('click', () => {
        wsClient.inviteFriend(parseInt(btn.getAttribute('data-invite')!));
      });
    });
    
    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const friendId = parseInt(btn.getAttribute('data-remove')!);
        const friendName = btn.getAttribute('data-name') || 'this friend';
        this.showRemoveFriendConfirmation(friendId, friendName);
      });
    });
  }
  
  private showRemoveFriendConfirmation(friendId: number, friendName: string) {
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.style.zIndex = '1100';
    overlay.innerHTML = `
      <div class="mp-confirm-dialog">
        <div class="mp-confirm-title">Remove ${friendName}?</div>
        <div class="mp-confirm-buttons">
          <button class="mp-btn secondary" id="mp-confirm-cancel">Cancel</button>
          <button class="mp-btn danger" id="mp-confirm-remove">Remove</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    document.getElementById('mp-confirm-cancel')!.addEventListener('click', () => {
      overlay.remove();
    });
    
    document.getElementById('mp-confirm-remove')!.addEventListener('click', () => {
      overlay.remove();
      wsClient.removeFriend(friendId);
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private showSearchResult(user: { id: number; nickname: string; telegramUsername: string | null } | null) {
    const container = document.getElementById('mp-search-result');
    if (!container) return;
    
    if (!user) {
      container.innerHTML = '<div style="color: #f44336; font-size: 14px; margin-top: 8px;">User not found</div>';
      return;
    }
    
    const isFriend = this.friends.some(f => f.friendId === user.id);
    
    container.innerHTML = `
      <div class="mp-friend" style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
        <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px;">
          <span class="mp-friend-name">${user.nickname}</span>
          ${user.telegramUsername ? `<span style="color: #888; font-size: 12px;">@${user.telegramUsername}</span>` : ''}
        </div>
        <div class="mp-friend-actions">
          ${isFriend ? 
            '<span style="color: #4CAF50; font-size: 12px;">Already friends</span>' :
            `<button class="mp-btn small" id="mp-add-found">Add</button>`
          }
        </div>
      </div>
    `;
    
    if (!isFriend) {
      document.getElementById('mp-add-found')!.addEventListener('click', () => {
        wsClient.addFriend(user.id);
        container.innerHTML = `
          <div class="mp-friend" style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px;">
              <span class="mp-friend-name">${user.nickname}</span>
            </div>
            <div class="mp-friend-actions">
              <span style="color: #4CAF50; font-size: 12px;">Request sent</span>
            </div>
          </div>
        `;
      });
    }
  }
  
  private renderInvitations() {
    const list = document.getElementById('mp-invites-list');
    if (!list) return;
    
    if (this.invitations.length === 0) {
      list.innerHTML = '<div style="color: #888; font-size: 14px;">No invitations</div>';
      return;
    }
    
    const gameModeNames: Record<string, string> = {
      free_roll: 'Free Roll',
      street_craps: 'Street Craps',
      mexico: 'Mexico',
      greedy_pig: 'Greedy Pig',
      poker_dice: 'Poker Dice',
    };
    
    list.innerHTML = this.invitations.map(inv => `
      <div class="mp-invite">
        <div class="mp-invite-text">
          <strong>${inv.fromUser.nickname}</strong> invites you to<br>
          ${gameModeNames[inv.gameMode] || inv.gameMode}
        </div>
        <div class="mp-invite-actions">
          <button class="mp-btn small" data-accept="${inv.id}">Accept</button>
          <button class="mp-btn small secondary" data-decline="${inv.id}">Decline</button>
        </div>
      </div>
    `).join('');
    
    list.querySelectorAll('[data-accept]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-accept')!);
        wsClient.respondInvitation(id, true);
        this.invitations = this.invitations.filter(i => i.id !== id);
        this.renderInvitations();
        this.updateInvitesBadge();
      });
    });
    
    list.querySelectorAll('[data-decline]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-decline')!);
        wsClient.respondInvitation(id, false);
        this.invitations = this.invitations.filter(i => i.id !== id);
        this.renderInvitations();
        this.updateInvitesBadge();
      });
    });
  }
  
  private updateInvitesBadge() {
    // Update badge on notifications button instead of menu button
    const notifBtn = document.getElementById('mp-notif-btn');
    if (!notifBtn) return;
    
    let badge = notifBtn.querySelector('#mp-invites-badge') as HTMLElement | null;
    
    const totalCount = this.invitations.length + this.friendRequests.length;
    
    if (totalCount > 0) {
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'mp-invites-badge';
        badge.style.cssText = `
          position: absolute;
          top: -4px;
          right: -4px;
          background: #f44336;
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        notifBtn.appendChild(badge);
      }
      badge.textContent = String(totalCount);
    } else if (badge) {
      badge.remove();
    }
  }
  
  private showNotificationsPanel() {
    // Close menu if open
    this.closeMenu();
    
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.id = 'mp-notifications-panel';
    
    overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px; max-height: 70vh; overflow-y: auto; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${t('notifications.title')}</div>
        
        <div class="mp-tabs" style="display: flex; gap: 8px; margin-bottom: 12px;">
          <button class="mp-tab" data-notif-tab="invites" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: #4CAF50; color: white; font-size: 12px; cursor: pointer;">${t('notifPanel.invites')}${this.invitations.length ? ` (${this.invitations.length})` : ''}</button>
          <button class="mp-tab" data-notif-tab="friends" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(255,255,255,0.1); color: #888; font-size: 12px; cursor: pointer;">${t('notifPanel.friends')}${this.friendRequests.length ? ` (${this.friendRequests.length})` : ''}</button>
          <button class="mp-tab" data-notif-tab="news" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(255,255,255,0.1); color: #888; font-size: 12px; cursor: pointer;">${t('notifications.news')}</button>
        </div>
        
        <div id="mp-notif-content" style="text-align: left;"></div>
        
        <button class="mp-btn secondary" id="mp-close-notif-panel" style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('buttons.close')}</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Tab switching
    overlay.querySelectorAll('[data-notif-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        overlay.querySelectorAll('[data-notif-tab]').forEach(t => {
          (t as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
          (t as HTMLElement).style.color = '#888';
        });
        (tab as HTMLElement).style.background = '#4CAF50';
        (tab as HTMLElement).style.color = 'white';
        this.renderNotifTab(tab.getAttribute('data-notif-tab')!);
      });
    });
    
    // Render initial tab
    this.renderNotifTab('invites');
    
    document.getElementById('mp-close-notif-panel')!.addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private renderNotifTab(tab: string) {
    const content = document.getElementById('mp-notif-content');
    if (!content) return;
    
    const gameModeNames: Record<string, string> = {
      free_roll: 'Free Roll',
      street_craps: 'Street Craps',
      mexico: 'Mexico',
      greedy_pig: 'Greedy Pig',
    };
    
    switch (tab) {
      case 'invites':
        if (this.invitations.length === 0) {
          content.innerHTML = `<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${t('invitations.noInvitations')}</div>`;
        } else {
          content.innerHTML = this.invitations.map(inv => `
            <div class="mp-invite" style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 8px;">
              <div class="mp-invite-text" style="color: white; font-size: 14px; margin-bottom: 8px;">
                <strong>${inv.fromUser.nickname}</strong> ${t('notifications.invitesYouTo')} <em style="text-transform: uppercase;">${gameModeNames[inv.gameMode] || inv.gameMode}</em>
              </div>
              <div class="mp-invite-actions" style="display: flex; gap: 8px; justify-content: center;">
                <button class="mp-btn small" data-accept-notif="${inv.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: #4CAF50; color: white; border: none; cursor: pointer; min-width: 80px;">${t('buttons.accept')}</button>
                <button class="mp-btn small secondary" data-decline-notif="${inv.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: rgba(255,255,255,0.2); color: white; border: none; cursor: pointer; min-width: 80px;">${t('buttons.decline')}</button>
              </div>
            </div>
          `).join('');
          
          content.querySelectorAll('[data-accept-notif]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = parseInt(btn.getAttribute('data-accept-notif')!);
              wsClient.respondInvitation(id, true);
              this.invitations = this.invitations.filter(i => i.id !== id);
              this.renderNotifTab('invites');
              this.updateInvitesBadge();
              // Close panel after accepting
              document.getElementById('mp-notifications-panel')?.remove();
            });
          });
          
          content.querySelectorAll('[data-decline-notif]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = parseInt(btn.getAttribute('data-decline-notif')!);
              wsClient.respondInvitation(id, false);
              this.invitations = this.invitations.filter(i => i.id !== id);
              this.renderNotifTab('invites');
              this.updateInvitesBadge();
            });
          });
        }
        break;
        
      case 'friends':
        if (this.friendRequests.length === 0) {
          content.innerHTML = `<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${t('friends.noRequests')}</div>`;
        } else {
          content.innerHTML = this.friendRequests.map(req => `
            <div class="mp-invite" style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 8px;">
              <div class="mp-invite-text" style="color: white; font-size: 14px; margin-bottom: 8px;">
                <strong>${req.fromNickname}</strong> ${t('notifications.wantsToBeFriend')}
              </div>
              <div class="mp-invite-actions" style="display: flex; gap: 8px; justify-content: center;">
                <button class="mp-btn small" data-accept-friend="${req.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: #4CAF50; color: white; border: none; cursor: pointer; min-width: 80px;">${t('buttons.accept')}</button>
                <button class="mp-btn small secondary" data-decline-friend="${req.id}" style="padding: 8px 16px; font-size: 12px; border-radius: 6px; background: rgba(255,255,255,0.2); color: white; border: none; cursor: pointer; min-width: 80px;">${t('buttons.decline')}</button>
              </div>
            </div>
          `).join('');
          
          content.querySelectorAll('[data-accept-friend]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = parseInt(btn.getAttribute('data-accept-friend')!);
              wsClient.respondFriendRequest(id, true);
              this.friendRequests = this.friendRequests.filter(r => r.id !== id);
              this.renderNotifTab('friends');
              this.updateInvitesBadge();
            });
          });
          
          content.querySelectorAll('[data-decline-friend]').forEach(btn => {
            btn.addEventListener('click', () => {
              const id = parseInt(btn.getAttribute('data-decline-friend')!);
              wsClient.respondFriendRequest(id, false);
              this.friendRequests = this.friendRequests.filter(r => r.id !== id);
              this.renderNotifTab('friends');
              this.updateInvitesBadge();
            });
          });
        }
        break;
        
      case 'news':
        content.innerHTML = `<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${t('notifications.noNews')}</div>`;
        break;
    }
  }
  
  private updateInvitesTabLabel() {
    // Update notifications panel if open
    const notifInvitesTab = document.querySelector('[data-notif-tab="invites"]');
    if (notifInvitesTab) {
      notifInvitesTab.textContent = `${t('notifPanel.invites')}${this.invitations.length ? ` (${this.invitations.length})` : ''}`;
    }
  }
  
  private showGameModeModal() {
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.id = 'mp-gamemode-modal';
    
    const gameModes = [
      { id: 'free_roll', name: t('gameModes.freeRoll'), icon: '🎲', desc: t('gameModes.freeRollDesc'), available: true },
      { id: 'street_craps', name: t('gameModes.streetCraps'), icon: '🎯', desc: t('gameModes.streetCrapsDesc'), available: true },
      { id: 'mexico', name: t('gameModes.mexico'), icon: '🇲🇽', desc: t('gameModes.mexicoDesc'), available: true },
      { id: 'greedy_pig', name: t('gameModes.greedyPig'), icon: '🐷', desc: t('gameModes.greedyPigDesc'), available: true },
      { id: 'poker_dice', name: t('gameModes.pokerDice'), icon: '🃏', desc: t('gameModes.pokerDiceDesc'), available: true },
    ];
    
    let currentPage = 0;
    const modesPerPage = 4;
    const totalPages = Math.ceil(gameModes.length / modesPerPage);
    
    const renderPage = () => {
      const startIdx = currentPage * modesPerPage;
      const endIdx = startIdx + modesPerPage;
      const currentModes = gameModes.slice(startIdx, endIdx);
      
      const dialogContent = document.querySelector('.mp-gamemode-dialog-content');
      if (!dialogContent) return;
      
      dialogContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${currentModes.map(mode => `
            <div class="mp-gamemode-card" data-mode="${mode.id}" style="
              position: relative;
              padding: 16px;
              background: ${mode.available ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'};
              border-radius: 12px;
              text-align: center;
              cursor: ${mode.available ? 'pointer' : 'not-allowed'};
              opacity: ${mode.available ? '1' : '0.5'};
              transition: background 0.2s, transform 0.2s;
              border: 2px solid transparent;
            ">
              <button class="mp-gamemode-info" data-mode-info="${mode.id}" style="
                position: absolute;
                top: 4px;
                right: 4px;
                width: 36px;
                height: 36px;
                padding: 0;
                background: transparent;
                border: none;
                border-radius: 50%;
                color: rgba(255,255,255,0.7);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
              ">${icon('info', 24)}</button>
              <div style="font-size: 32px; margin-bottom: 8px;">${mode.icon}</div>
              <div style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px;">${mode.name}</div>
              <div style="color: #888; font-size: 11px;">${mode.desc}</div>
            </div>
          `).join('')}
        </div>
        
        ${totalPages > 1 ? `
          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 16px;">
            <button class="mp-page-btn" id="mp-prev-page" ${currentPage === 0 ? 'disabled' : ''} style="
              padding: 8px 16px;
              background: ${currentPage === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'};
              border: none;
              border-radius: 8px;
              color: ${currentPage === 0 ? '#666' : 'white'};
              font-size: 14px;
              cursor: ${currentPage === 0 ? 'not-allowed' : 'pointer'};
              transition: background 0.2s;
            ">←</button>
            <div style="color: #888; font-size: 12px;">${currentPage + 1} / ${totalPages}</div>
            <button class="mp-page-btn" id="mp-next-page" ${currentPage === totalPages - 1 ? 'disabled' : ''} style="
              padding: 8px 16px;
              background: ${currentPage === totalPages - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'};
              border: none;
              border-radius: 8px;
              color: ${currentPage === totalPages - 1 ? '#666' : 'white'};
              font-size: 14px;
              cursor: ${currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'};
              transition: background 0.2s;
            ">→</button>
          </div>
        ` : ''}
      `;
      
      // Re-attach event listeners for cards and info buttons
      dialogContent.querySelectorAll('.mp-gamemode-info').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const mode = btn.getAttribute('data-mode-info');
          if (mode) {
            this.showGameRulesModal(mode as any);
          }
        });
      });
      
      dialogContent.querySelectorAll('.mp-gamemode-card').forEach(card => {
        const mode = card.getAttribute('data-mode');
        const modeData = gameModes.find(m => m.id === mode);
        
        if (modeData?.available) {
          card.addEventListener('mouseenter', () => {
            (card as HTMLElement).style.background = 'rgba(76,175,80,0.3)';
            (card as HTMLElement).style.borderColor = '#4CAF50';
          });
          card.addEventListener('mouseleave', () => {
            (card as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
            (card as HTMLElement).style.borderColor = 'transparent';
          });
          card.addEventListener('click', () => {
            overlay.remove();
            wsClient.createLobby(mode as any);
          });
        }
      });
      
      // Pagination buttons
      const prevBtn = dialogContent.querySelector('#mp-prev-page');
      const nextBtn = dialogContent.querySelector('#mp-next-page');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentPage > 0) {
            currentPage--;
            renderPage();
          }
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentPage < totalPages - 1) {
            currentPage++;
            renderPage();
          }
        });
      }
    };
    
    overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${t('lobby.selectGameMode')}</div>
        
        <div class="mp-gamemode-dialog-content"></div>
        
        <button class="mp-btn secondary" id="mp-close-gamemode" style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('buttons.cancel')}</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Initial render
    renderPage();
    
    document.getElementById('mp-close-gamemode')!.addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private showGameRulesModal(gameMode: 'free_roll' | 'street_craps' | 'mexico' | 'greedy_pig' | 'poker_dice') {
    // Map game mode to rules key
    const rulesKeyMap: Record<string, string> = {
      'free_roll': 'gameModes.freeRollRules',
      'street_craps': 'gameModes.streetCrapsRules',
      'mexico': 'gameModes.mexicoRules',
      'greedy_pig': 'gameModes.greedyPigRules',
      'poker_dice': 'gameModes.pokerDiceRules',
    };
    
    const rulesKey = rulesKeyMap[gameMode];
    const rulesText = t(rulesKey as any);
    
    // Simple markdown renderer inline
    const renderMarkdown = (text: string): string => {
      let html = text;
      html = html.replace(/^### (.+)$/gm, '<h3 style="color: white; font-size: 14px; font-weight: 600; margin: 4px 0 2px 0;">$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2 style="color: white; font-size: 15px; font-weight: 600; margin: 8px 0 4px 0;">$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1 style="color: white; font-size: 18px; font-weight: 700; margin: 0 0 8px 0; text-align: center;">$1</h1>');
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #4CAF50; font-weight: 600;">$1</strong>');
      html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 16px; margin-bottom: 2px; color: #ddd;">$1</li>');
      html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
        return '<ul style="margin: 4px 0; padding-left: 0; list-style-position: inside;">' + match + '</ul>';
      });
      html = html.replace(/\n\n/g, '<br>');
      html = html.replace(/\n/g, ' ');
      return html;
    };
    
    const rulesHtml = renderMarkdown(rulesText);
    
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.style.zIndex = '1300'; // Higher than game mode modal
    
    overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="
        width: calc(100% - 40px); 
        max-width: 400px; 
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: left;
        padding: 20px;
      ">
        <style>.mp-confirm-dialog::-webkit-scrollbar { display: none; }</style>
        <div style="color: #ddd; font-size: 13px; line-height: 1.5;">
          ${rulesHtml}
        </div>
        <button class="mp-btn secondary" id="mp-close-rules" style="
          margin-top: 16px; 
          width: 100%; 
          padding: 12px; 
          background: rgba(255,255,255,0.2); 
          border: none; 
          border-radius: 8px; 
          color: white; 
          font-size: 14px; 
          cursor: pointer;
        ">${t('buttons.close')}</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('mp-close-rules')!.addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private closeMenu() {
    if (this.menuPanel) {
      this.menuPanel.remove();
      this.menuPanel = null;
    }
    // Remove backdrop
    const backdrop = document.getElementById('mp-menu-backdrop');
    if (backdrop) backdrop.remove();
    
    this.isMenuOpen = false;
    this.updateStatus(); // Update status visibility
    document.removeEventListener('click', this.handleClickOutsideMenu);
  }
  
  // Public method to check if menu is open (for blocking dice throws)
  public isMenuPanelOpen(): boolean {
    return this.isMenuOpen === true;
  }
  
  // Lobby Panel
  private showLobbyPanel() {
    if (this.lobbyPanel) return;
    
    this.isLobbyMinimized = false;
    this.lobbyPanel = document.createElement('div');
    this.lobbyPanel.className = 'mp-panel';
    this.lobbyPanel.id = 'mp-lobby-panel';
    // Full width
    this.lobbyPanel.style.left = '10px';
    this.lobbyPanel.style.right = '10px';
    
    this.container.appendChild(this.lobbyPanel);
    this.renderLobby();
  }
  
  private renderLobby() {
    if (!this.lobbyPanel || !this.currentLobby) return;
    
    const lobby = this.currentLobby;
    const isHost = lobby.hostId === wsClient.user?.id;
    
    const gameModeIcons: Record<string, string> = {
      free_roll: '🎲',
      street_craps: '🎯',
      mexico: '🇲🇽',
      greedy_pig: '🐷',
      poker_dice: '🃏',
    };
    
    const gameModeNames: Record<string, string> = {
      free_roll: 'Free Roll',
      street_craps: 'Street Craps',
      mexico: 'Mexico',
      greedy_pig: 'Greedy Pig',
      poker_dice: 'Poker Dice',
    };
    
    // Minimized view
    if (this.isLobbyMinimized) {
      this.lobbyPanel.style.cssText = `
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        right: auto;
        width: fit-content;
        padding: 8px 16px;
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
        pointer-events: auto;
      `;
      this.lobbyPanel.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" id="mp-lobby-expand">
          <span style="font-size: 18px;">${gameModeIcons[lobby.gameMode]}</span>
          <span style="color: white; font-size: 14px;">${gameModeNames[lobby.gameMode]}</span>
          <span style="color: white; font-size: 14px;">${lobby.players.length} / ${lobby.maxPlayers}</span>
          <span style="color: #888; font-size: 12px;">▼</span>
        </div>
      `;
      
      document.getElementById('mp-lobby-expand')?.addEventListener('click', () => {
        this.isLobbyMinimized = false;
        this.renderLobby();
      });
      return;
    }
    
    // Reset styles for expanded view
    this.lobbyPanel.style.cssText = `
      position: absolute;
      top: 50px;
      left: 10px;
      right: 10px;
      max-height: 70vh;
      overflow-y: auto;
      background: rgba(0,0,0,0.9);
      border-radius: 12px;
      padding: 16px;
      pointer-events: auto;
    `;
    
    this.lobbyPanel.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <div class="mp-title" style="margin: 0;">${gameModeNames[lobby.gameMode]}</div>
        <button id="mp-minimize-lobby" style="background: none; border: none; color: #888; font-size: 16px; cursor: pointer; padding: 4px 8px;">▲</button>
      </div>
      <div class="mp-section">
        <div class="mp-section-title">${t('lobby.players')} (${lobby.players.length}/${lobby.maxPlayers})</div>
        <div id="mp-lobby-players">
          ${lobby.players.map(p => `
            <div class="mp-lobby-player ${p.oderId === lobby.hostId ? 'host' : ''}">
              ${(p as any).user?.nickname || p.nickname || 'Player'}
            </div>
          `).join('')}
        </div>
        <button class="mp-btn secondary" id="mp-invite-friends" style="margin-top: 8px;">${t('lobby.inviteFriends')}</button>
      </div>
      ${lobby.status === 'voting' && lobby.players.length > 1 ? `
        <div class="mp-section">
          <div class="mp-section-title">${t('lobby.votingForTable')}</div>
          <div id="mp-table-votes"></div>
        </div>
      ` : ''}
      ${(lobby.status === 'waiting' || (lobby.status === 'voting' && lobby.players.length === 1)) && isHost ? `
        <button class="mp-btn" id="mp-start-game">${t('lobby.startGame')}</button>
      ` : ''}
      ${lobby.status === 'waiting' && !isHost ? `
        <div style="color: #888; font-size: 14px; text-align: center;">${t('lobby.waitingForHost')}</div>
      ` : ''}
      <button class="mp-btn danger" id="mp-leave-lobby">${t('lobby.leaveLobby')}</button>
    `;
    
    // Render table voting only if more than 1 player
    if (lobby.status === 'voting' && lobby.players.length > 1) {
      this.renderTableVoting();
    }
    
    document.getElementById('mp-minimize-lobby')?.addEventListener('click', () => {
      this.isLobbyMinimized = true;
      this.renderLobby();
    });
    
    document.getElementById('mp-invite-friends')?.addEventListener('click', () => {
      this.showInviteFriendsModal();
    });
    
    document.getElementById('mp-leave-lobby')?.addEventListener('click', () => {
      this.showLeaveConfirmation();
    });
    
    document.getElementById('mp-start-game')?.addEventListener('click', () => {
      wsClient.startGame();
    });
  }
  
  private showInviteFriendsModal() {
    const overlay = document.createElement('div');
    overlay.className = 'mp-confirm-overlay';
    overlay.id = 'mp-invite-modal';
    
    // Show all friends, sorted: online first, then offline
    const sortedFriends = [...this.friends].sort((a, b) => {
      const aOnline = a.onlineStatus !== 'offline' ? 0 : 1;
      const bOnline = b.onlineStatus !== 'offline' ? 0 : 1;
      return aOnline - bOnline;
    });
    
    overlay.innerHTML = `
      <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px; max-height: 70vh; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${t('friends.inviteFriends')}</div>
        <div id="mp-invite-friends-list" style="text-align: left;">
          ${sortedFriends.length === 0 ? 
            `<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">${t('friends.noFriends')}</div>` :
            sortedFriends.map(f => {
              const alreadySent = this.sentInvites.has(f.friendId);
              const isOffline = f.onlineStatus === 'offline';
              return `
                <div class="mp-friend" data-friend-row="${f.friendId}" style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; ${isOffline ? 'opacity: 0.7;' : ''}">
                  <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                    <div class="mp-friend-status ${f.onlineStatus}" style="width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;"></div>
                    <span class="mp-friend-name" style="color: white; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${f.user.nickname}</span>
                  </div>
                  <div class="mp-friend-actions" style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; min-height: 32px;">
                    ${alreadySent ? 
                      `<span style="color: #888; font-size: 12px;">${t('friends.invited')}</span>` :
                      `<button class="mp-btn small" data-invite-friend="${f.friendId}" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; background: ${isOffline ? '#666' : '#4CAF50'}; color: white; border: none; cursor: pointer;">${isOffline ? t('friends.notify') : t('friends.invite')}</button>`
                    }
                  </div>
                </div>
              `;
            }).join('')
          }
        </div>
        <button class="mp-btn secondary" id="mp-close-invite-modal" style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; font-size: 14px; cursor: pointer;">${t('buttons.close')}</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Invite buttons
    overlay.querySelectorAll('[data-invite-friend]').forEach(btn => {
      btn.addEventListener('click', () => {
        const friendId = parseInt(btn.getAttribute('data-invite-friend')!);
        const row = overlay.querySelector(`[data-friend-row="${friendId}"]`);
        const actionsDiv = row?.querySelector('.mp-friend-actions');
        
        // Send invite
        wsClient.inviteFriend(friendId);
        this.sentInvites.add(friendId);
        if (actionsDiv) {
          actionsDiv.innerHTML = `<span style="color: #888; font-size: 12px;">Invited</span>`;
        }
      });
    });
    
    document.getElementById('mp-close-invite-modal')!.addEventListener('click', () => {
      overlay.remove();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
  
  private refreshInviteFriendsModal() {
    const list = document.getElementById('mp-invite-friends-list');
    if (!list) return;
    
    const sortedFriends = [...this.friends].sort((a, b) => {
      const aOnline = a.onlineStatus !== 'offline' ? 0 : 1;
      const bOnline = b.onlineStatus !== 'offline' ? 0 : 1;
      return aOnline - bOnline;
    });
    
    list.innerHTML = sortedFriends.length === 0 ? 
      '<div style="color: #888; font-size: 14px; text-align: center; padding: 20px 0;">No friends yet</div>' :
      sortedFriends.map(f => {
        const alreadySent = this.sentInvites.has(f.friendId);
        const isOffline = f.onlineStatus === 'offline';
        return `
          <div class="mp-friend" data-friend-row="${f.friendId}" style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; ${isOffline ? 'opacity: 0.7;' : ''}">
            <div class="mp-friend-info" style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
              <div class="mp-friend-status ${f.onlineStatus}" style="width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;"></div>
              <span class="mp-friend-name" style="color: white; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${f.user.nickname}</span>
            </div>
            <div class="mp-friend-actions" style="display: flex; gap: 6px; flex-shrink: 0; align-items: center; min-height: 32px;">
              ${alreadySent ? 
                `<span style="color: #888; font-size: 12px;">Invited</span>` :
                `<button class="mp-btn small" data-invite-friend="${f.friendId}" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; background: ${isOffline ? '#666' : '#4CAF50'}; color: white; border: none; cursor: pointer;">${isOffline ? 'Notify' : 'Invite'}</button>`
              }
            </div>
          </div>
        `;
      }).join('');
    
    // Re-attach invite button handlers
    list.querySelectorAll('[data-invite-friend]').forEach(btn => {
      btn.addEventListener('click', () => {
        const friendId = parseInt(btn.getAttribute('data-invite-friend')!);
        const row = list.querySelector(`[data-friend-row="${friendId}"]`);
        const actionsDiv = row?.querySelector('.mp-friend-actions');
        
        wsClient.inviteFriend(friendId);
        this.sentInvites.add(friendId);
        if (actionsDiv) {
          actionsDiv.innerHTML = `<span style="color: #888; font-size: 12px;">Invited</span>`;
        }
      });
    });
  }
  
  private renderTableVoting() {
    const container = document.getElementById('mp-table-votes');
    if (!container) return;
    
    // Collect unique tables from all players (id -> name)
    const tables = new Map<number, string>();
    
    this.currentLobby?.players.forEach((p: any) => {
      // Data is in p.user.equippedTableId (from getLobby)
      // or p.equippedTableId (from player_joined)
      const tableId = p.user?.equippedTableId ?? p.equippedTableId;
      const tableName = p.user?.equippedTableName ?? p.equippedTableName;
      
      console.log('[TableVoting] Player:', p.user?.nickname || p.nickname, 'tableId:', tableId, 'tableName:', tableName);
      
      if (tableId) {
        tables.set(tableId, tableName || `Table ${tableId}`);
      }
    });
    
    console.log('[TableVoting] Unique tables:', Array.from(tables.entries()));
    
    // If no tables found or only one table, skip voting
    if (tables.size <= 1) {
      const firstTable = tables.entries().next().value;
      const tableName = firstTable ? firstTable[1] : 'Green Felt';
      const tableId = firstTable ? firstTable[0] : 1;
      container.innerHTML = `<div style="color: #888; font-size: 14px;">${tableName} (default)</div>`;
      // Auto-vote for the only table
      wsClient.voteTable(tableId);
      return;
    }
    
    container.innerHTML = Array.from(tables.entries()).map(([id, name]) => `
      <button class="mp-vote-btn" data-table="${id}">
        ${name}
        <span class="mp-vote-count" data-votes="${id}">0</span>
      </button>
    `).join('');
    
    container.querySelectorAll('.mp-vote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.mp-vote-btn').forEach(b => b.classList.remove('voted'));
        btn.classList.add('voted');
        wsClient.voteTable(parseInt(btn.getAttribute('data-table')!));
      });
    });
  }
  
  private renderVotes(votes: { tableId: number; count: number }[]) {
    votes.forEach(v => {
      const el = document.querySelector(`[data-votes="${v.tableId}"]`);
      if (el) el.textContent = String(v.count);
    });
  }
  
  private closeLobbyPanel() {
    if (this.lobbyPanel) {
      this.lobbyPanel.remove();
      this.lobbyPanel = null;
    }
  }
  
  private showNotification(message: string, isError = false) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      max-width: 70vw;
      padding: 12px 24px;
      background: ${isError ? '#f44336' : '#4CAF50'};
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 1000;
      pointer-events: none;
      text-align: center;
      box-sizing: border-box;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 3000);
  }
  
  private showReconnectDialog(lobbyId: string, timeLeft: number) {
    // Remove any existing reconnect dialog
    const existing = document.getElementById('mp-reconnect-dialog');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'mp-reconnect-dialog';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const secondsLeft = Math.ceil(timeLeft / 1000);
    
    overlay.innerHTML = `
      <div style="
        background: #2a2a2a;
        border-radius: 16px;
        padding: 24px;
        max-width: 300px;
        text-align: center;
        color: white;
      ">
        <h3 style="margin: 0 0 16px 0; font-size: 18px;">Game in Progress</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.8;">
          You were disconnected from an active game.
        </p>
        <p id="reconnect-timer" style="margin: 0 0 20px 0; font-size: 14px; color: #FFD700;">
          Time to reconnect: ${secondsLeft}s
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="reconnect-yes" style="
            padding: 12px 24px;
            background: #4CAF50;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
          ">Reconnect</button>
          <button id="reconnect-no" style="
            padding: 12px 24px;
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            font-family: inherit;
          ">Leave Game</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Update timer
    const timerEl = document.getElementById('reconnect-timer');
    let remaining = secondsLeft;
    const timerInterval = setInterval(() => {
      remaining--;
      if (timerEl) {
        timerEl.textContent = `Time to reconnect: ${remaining}s`;
      }
      if (remaining <= 0) {
        clearInterval(timerInterval);
        overlay.remove();
        wsClient.clearPendingReconnect();
        this.showNotification('Reconnect time expired', true);
      }
    }, 1000);
    
    // Reconnect button
    document.getElementById('reconnect-yes')?.addEventListener('click', () => {
      clearInterval(timerInterval);
      overlay.remove();
      wsClient.reconnectGame(lobbyId);
    });
    
    // Leave button
    document.getElementById('reconnect-no')?.addEventListener('click', () => {
      clearInterval(timerInterval);
      overlay.remove();
      wsClient.clearPendingReconnect();
      this.showNotification('Left the game');
    });
  }
  
  private getPlayerNickname(playerId: number | null): string {
    if (!playerId) return 'Unknown';
    if (playerId === wsClient.user?.id) return 'Вы';
    
    // Try to find in current lobby
    if (this.currentLobby) {
      const player = this.currentLobby.players.find(p => p.oderId === playerId);
      if (player) {
        return (player as any).user?.nickname || player.nickname || `Player${playerId}`;
      }
    }
    
    // Try to find in friends
    const friend = this.friends.find(f => f.friendId === playerId);
    if (friend) {
      return friend.user.nickname;
    }
    
    return `Player${playerId}`;
  }
  
  // Cleanup method (call when destroying the UI)
  public destroy() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
      this.unsubscribeLanguageChange = null;
    }
  }
  
  // Show invite friend modal (referral link)
  private showInviteFriendModal() {
    // Request referral stats from server
    wsClient.getReferralStats();
    
    // Listen for response
    const handleReferralStats = (data: any) => {
      const { referralCode, stats } = data;
      
      // Create Telegram share link for Mini App
      // Format: https://t.me/BOT_USERNAME/APP_SHORT_NAME?startapp=ref_CODE
      // The 'startapp' parameter will be passed as 'start_param' in initData
      const botUsername = 'streetdice_bot'; // TODO: Replace with your actual bot username
      const appShortName = 'app'; // Your Mini App short name (from BotFather)
      const shareUrl = `https://t.me/${botUsername}/${appShortName}?startapp=ref_${referralCode}`;
      
      const overlay = document.createElement('div');
      overlay.className = 'mp-confirm-overlay';
      overlay.innerHTML = `
        <div class="mp-confirm-dialog" style="width: calc(100% - 40px); max-width: 400px;">
          <div class="mp-confirm-title" style="font-size: 18px; margin-bottom: 16px;">${t('referrals.inviteFriend')}</div>
          
          <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="color: #888; font-size: 12px; margin-bottom: 8px;">${t('referrals.yourCode')}</div>
            <div style="color: white; font-size: 16px; font-weight: 600; font-family: monospace; word-break: break-all;">${referralCode}</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="color: #888; font-size: 12px; margin-bottom: 8px;">${t('referrals.stats')}</div>
            <div style="color: white; font-size: 14px;">
              ${t('referrals.totalReferrals')}: ${stats.totalReferrals}<br>
              ${t('referrals.activeReferrals')}: ${stats.referralsWithThreeGames} / ${stats.totalReferrals}<br>
              ${t('referrals.totalRewards')}: ${stats.totalRewards}
            </div>
          </div>
          
          <div style="background: rgba(76,175,80,0.2); border-radius: 8px; padding: 12px; margin-bottom: 16px; border: 1px solid rgba(76,175,80,0.5);">
            <div style="color: #4CAF50; font-size: 12px; font-weight: 600; margin-bottom: 8px;">${t('referrals.rewards')}</div>
            <div style="color: white; font-size: 12px; line-height: 1.6;">
              • 1 ${t('referrals.friend')} → 3 ${t('referrals.games')} = ${t('referrals.rareDice')}<br>
              • 5 ${t('referrals.friends')} → 3 ${t('referrals.games')} = ${t('referrals.rareTable')}<br>
              • 10 ${t('referrals.friends')} → 3 ${t('referrals.games')} = 3x ${t('referrals.rareDice')}<br>
              • ${t('referrals.friendPurchase')} = ${t('referrals.sameItem')}
            </div>
          </div>
          
          <button class="mp-btn" id="mp-copy-link-btn" style="width: 100%; margin-bottom: 8px; background: #4CAF50;">
            ${t('referrals.copyLink')}
          </button>
          <button class="mp-btn" id="mp-share-telegram-btn" style="width: 100%; margin-bottom: 8px; background: #0088cc;">
            ${t('referrals.shareTelegram')}
          </button>
          <button class="mp-btn secondary" id="mp-close-referral-modal" style="width: 100%;">
            ${t('buttons.close')}
          </button>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Copy link button
      document.getElementById('mp-copy-link-btn')!.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          this.showNotification(t('referrals.linkCopied'));
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            this.showNotification(t('referrals.linkCopied'));
          } catch (e) {
            this.showNotification(t('referrals.copyFailed'), true);
          }
          document.body.removeChild(textArea);
        }
      });
      
      // Share via Telegram button
      document.getElementById('mp-share-telegram-btn')!.addEventListener('click', () => {
        const shareText = encodeURIComponent(t('referrals.shareText'));
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;
        window.open(telegramShareUrl, '_blank');
      });
      
      // Close button
      document.getElementById('mp-close-referral-modal')!.addEventListener('click', () => {
        overlay.remove();
      });
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });
      
      // Remove listener
      wsClient.off('referral_stats', handleReferralStats);
    };
    
    wsClient.on('referral_stats', handleReferralStats);
  }
}

