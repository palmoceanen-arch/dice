import { wsClient } from '../multiplayer/WebSocketClient';
import { t } from '../../shared/i18n';
import { icon } from './icons';

export interface Boost {
  id: string;
  nameKey: string;
  descKey: string;
  iconName: 'zap' | 'flame' | 'sparkles' | 'crown';
  duration: number; // seconds
  cooldown: number; // seconds
  type: 'double' | 'triple_even' | 'triple_odd' | 'snake_eyes' | 'golden';
}

export interface BoostState {
  id: string;
  active: boolean;
  activeUntil?: number; // timestamp
  availableAt: number; // timestamp when cooldown ends
  selectedParity?: 'even' | 'odd'; // for triple boost
}

const BOOSTS: Boost[] = [
  {
    id: 'double',
    nameKey: 'boosts.double.name',
    descKey: 'boosts.double.desc',
    iconName: 'zap',
    duration: 180, // 3 minutes
    cooldown: 14400, // 4 hours
    type: 'double'
  },
  {
    id: 'triple',
    nameKey: 'boosts.triple.name',
    descKey: 'boosts.triple.desc',
    iconName: 'flame',
    duration: 180, // 3 minutes
    cooldown: 14400, // 4 hours
    type: 'triple_even' // will be set dynamically
  },
  {
    id: 'snake_eyes',
    nameKey: 'boosts.snakeEyes.name',
    descKey: 'boosts.snakeEyes.desc',
    iconName: 'sparkles',
    duration: 180, // 3 minutes
    cooldown: 14400, // 4 hours
    type: 'snake_eyes'
  },
  {
    id: 'golden',
    nameKey: 'boosts.golden.name',
    descKey: 'boosts.golden.desc',
    iconName: 'crown',
    duration: 60, // 1 minute
    cooldown: 43200, // 12 hours
    type: 'golden'
  }
];

export class BoostsModal {
  private static overlay: HTMLElement | null = null;
  private static boostStates: Map<string, BoostState> = new Map();
  private static updateInterval: number | null = null;

  static init() {
    console.log('[BoostsModal] Initializing...');
    
    // Load boost states from localStorage
    const saved = localStorage.getItem('boostStates');
    if (saved) {
      try {
        const states = JSON.parse(saved);
        this.boostStates = new Map(Object.entries(states));
        console.log('[BoostsModal] Loaded states from localStorage:', this.boostStates.size);
      } catch (e) {
        console.error('[Boosts] Failed to load states:', e);
      }
    }

    // Initialize default states for all boosts
    BOOSTS.forEach(boost => {
      if (!this.boostStates.has(boost.id)) {
        this.boostStates.set(boost.id, {
          id: boost.id,
          active: false,
          availableAt: Date.now() - 1000 // Set to past so it's available
        });
      }
    });
    
    console.log('[BoostsModal] Total boosts initialized:', this.boostStates.size);

    // Start update interval to check active boosts and update timers
    if (!this.updateInterval) {
      this.updateInterval = window.setInterval(() => {
        this.checkActiveBoosts();
        this.updateTimers();
      }, 1000);
      console.log('[BoostsModal] Update interval started');
    }

    // Listen for boost updates from server
    wsClient.on('boost_activated', (data: any) => {
      console.log('[BoostsModal] Boost activated from server:', data);
      this.handleBoostActivated(data);
    });

    wsClient.on('boost_expired', (data: any) => {
      console.log('[BoostsModal] Boost expired from server:', data);
      this.handleBoostExpired(data);
    });
    
    // Load active boosts from server on auth (only once)
    let boostStatesRequested = false;
    wsClient.on('auth_success', (data: any) => {
      console.log('[BoostsModal] Auth success, active boosts:', data.activeBoosts);
      if (data.activeBoosts && Array.isArray(data.activeBoosts)) {
        data.activeBoosts.forEach((boost: any) => {
          const state = this.boostStates.get(boost.boostId);
          if (state) {
            state.active = true;
            state.activeUntil = new Date(boost.expiresAt).getTime();
            state.availableAt = new Date(boost.availableAt).getTime();
            if (boost.selectedParity) {
              state.selectedParity = boost.selectedParity;
            }
          }
        });
        this.saveStates();
        this.updateBoostIcon();
      }
      
      // Request all boost states only once
      if (!boostStatesRequested) {
        boostStatesRequested = true;
        wsClient.send({ type: 'get_boost_states' });
      }
    });
    
    // Handle boost states response
    wsClient.on('boost_states', (data: any) => {
      console.log('[BoostsModal] Received boost states:', data.boosts);
      if (data.boosts && Array.isArray(data.boosts)) {
        data.boosts.forEach((boost: any) => {
          const state = this.boostStates.get(boost.boostId);
          if (state) {
            const serverAvailableAt = new Date(boost.availableAt).getTime();
            const now = Date.now();
            
            state.active = boost.active;
            if (boost.activeUntil) {
              state.activeUntil = new Date(boost.activeUntil).getTime();
            } else {
              state.activeUntil = undefined;
            }
            
            // Always trust server's availableAt
            state.availableAt = serverAvailableAt;
            
            if (boost.selectedParity) {
              state.selectedParity = boost.selectedParity;
            }
          }
        });
        this.saveStates();
        this.updateBoostIcon();
        
        // Refresh modal if open
        if (this.overlay) {
          this.renderBoosts();
        }
      }
    });
    
    console.log('[BoostsModal] Initialization complete');
  }

  private static updateTimers() {
    // Only update if modal is open
    if (!this.overlay) return;

    const now = Date.now();
    const activeBoosts = this.getActiveBoosts();
    const hasActiveBoost = activeBoosts.length > 0;

    BOOSTS.forEach(boost => {
      const state = this.boostStates.get(boost.id);
      if (!state) return;

      const statusEl = document.getElementById(`boost-status-${boost.id}`);
      const buttonEl = document.getElementById(`boost-button-${boost.id}`) as HTMLButtonElement;
      if (!statusEl || !buttonEl) {
        return;
      }

      const isThisBoostActive = state.active && state.activeUntil && now < state.activeUntil;
      const cooldownRemaining = Math.max(0, Math.ceil((state.availableAt - now) / 1000));
      const activeRemaining = state.activeUntil ? Math.max(0, Math.ceil((state.activeUntil - now) / 1000)) : 0;
      const isAvailable = cooldownRemaining === 0 && !state.active && !hasActiveBoost;

      // Update status text and color
      if (isThisBoostActive) {
        statusEl.textContent = this.formatTime(activeRemaining);
        statusEl.style.color = '#4CAF50';
      } else if (cooldownRemaining > 0) {
        statusEl.textContent = this.formatTime(cooldownRemaining);
        statusEl.style.color = '#FF9800';
      } else if (hasActiveBoost) {
        statusEl.textContent = t('boosts.anotherActive');
        statusEl.style.color = '#888';
      } else {
        statusEl.textContent = t('boosts.ready');
        statusEl.style.color = '#4CAF50';
      }

      // Update button state
      if (isAvailable) {
        buttonEl.disabled = false;
        buttonEl.style.background = '#4CAF50';
        buttonEl.style.cursor = 'pointer';
      } else {
        buttonEl.disabled = true;
        buttonEl.style.background = '#555';
        buttonEl.style.cursor = 'not-allowed';
      }
    });
  }

  private static checkActiveBoosts() {
    const now = Date.now();
    let changed = false;

    this.boostStates.forEach((state, id) => {
      if (state.active && state.activeUntil && now >= state.activeUntil) {
        // Boost expired locally (server message might have been missed)
        console.log('[BoostsModal] Boost expired locally', { id, activeUntil: state.activeUntil, now });
        state.active = false;
        state.activeUntil = undefined;
        // Note: availableAt should be set by server via boost_expired message
        // If not received, it will remain at old value which might cause issues
        changed = true;
        
        // Animate boost icon when boost expires
        this.animateBoostIconExpire();
      }
    });

    if (changed) {
      this.saveStates();
      this.updateBoostIcon();
      // Refresh modal if open
      if (this.overlay) {
        this.renderBoosts();
      }
    }
  }

  private static animateBoostIconExpire() {
    const iconEl = document.getElementById('boost-icon');
    if (!iconEl) return;

    // Fade to gray, then to transparent, then back
    iconEl.style.transition = 'all 0.5s ease';
    iconEl.style.color = '#888';
    iconEl.style.opacity = '0.5';
    
    setTimeout(() => {
      iconEl.style.opacity = '0';
    }, 500);
    
    setTimeout(() => {
      iconEl.style.color = '#FFD700';
      iconEl.style.opacity = '1';
    }, 1000);
  }

  private static handleBoostActivated(data: { boostId: string; activeUntil: number; selectedParity?: 'even' | 'odd' }) {
    const state = this.boostStates.get(data.boostId);
    if (state) {
      state.active = true;
      state.activeUntil = data.activeUntil;
      if (data.selectedParity) {
        state.selectedParity = data.selectedParity;
      }
      this.saveStates();
      this.updateBoostIcon();
      
      // Refresh modal if open
      if (this.overlay) {
        this.renderBoosts();
      }
    }
  }

  private static handleBoostExpired(data: { boostId: string; availableAt: number }) {
    console.log('[BoostsModal] handleBoostExpired called', { boostId: data.boostId, availableAt: data.availableAt, availableAtDate: new Date(data.availableAt) });
    const state = this.boostStates.get(data.boostId);
    if (state) {
      state.active = false;
      state.activeUntil = undefined;
      state.availableAt = data.availableAt;
      console.log('[BoostsModal] State updated', { state });
      this.saveStates();
      this.updateBoostIcon();
      
      // Animate boost icon when boost expires
      this.animateBoostIconExpire();
      
      // Refresh modal if open
      if (this.overlay) {
        this.renderBoosts();
      }
    }
  }

  private static saveStates() {
    const obj: any = {};
    this.boostStates.forEach((state, id) => {
      obj[id] = state;
    });
    localStorage.setItem('boostStates', JSON.stringify(obj));
  }

  static toggle() {
    if (this.overlay) {
      this.close();
    } else {
      this.open();
    }
  }

  static open() {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-y: auto;
      padding: 20px;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      background: rgba(30, 30, 30, 0.95);
      border-radius: 16px;
      padding: 24px;
      max-width: 500px;
      width: 100%;
      margin: auto;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;

    const title = document.createElement('h2');
    title.textContent = t('boosts.title');
    title.style.cssText = `
      color: white;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeBtn);
    container.appendChild(header);

    // Boosts list container
    const boostsContainer = document.createElement('div');
    boostsContainer.id = 'boosts-list';
    container.appendChild(boostsContainer);

    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    // Render boosts
    this.renderBoosts();

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  private static renderBoosts() {
    const container = document.getElementById('boosts-list');
    if (!container) return;

    container.innerHTML = '';
    
    // Check if any boost is active
    const activeBoosts = this.getActiveBoosts();
    const hasActiveBoost = activeBoosts.length > 0;

    BOOSTS.forEach(boost => {
      const state = this.boostStates.get(boost.id);
      if (!state) return;

      const now = Date.now();
      const isThisBoostActive = state.active && state.activeUntil && now < state.activeUntil;
      const cooldownRemaining = Math.max(0, Math.ceil((state.availableAt - now) / 1000));
      const isAvailable = cooldownRemaining === 0 && !state.active && !hasActiveBoost;
      const activeRemaining = state.activeUntil ? Math.max(0, Math.ceil((state.activeUntil - now) / 1000)) : 0;

      const boostCard = document.createElement('div');
      boostCard.style.cssText = `
        background: ${isThisBoostActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
        border: 2px solid ${isThisBoostActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: ${isAvailable ? 'pointer' : 'default'};
        transition: all 0.2s;
        opacity: ${isAvailable || isThisBoostActive ? '1' : '0.6'};
      `;

      if (isAvailable) {
        boostCard.onmouseenter = () => {
          boostCard.style.transform = 'scale(1.02)';
          boostCard.style.borderColor = '#4CAF50';
        };
        boostCard.onmouseleave = () => {
          boostCard.style.transform = 'scale(1)';
          boostCard.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        };
      }

      // Icon and name
      const topRow = document.createElement('div');
      topRow.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      `;

      const iconEl = document.createElement('div');
      iconEl.innerHTML = icon(boost.iconName, 32);
      iconEl.style.cssText = `
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const nameContainer = document.createElement('div');
      nameContainer.style.flex = '1';

      const name = document.createElement('div');
      name.textContent = t(boost.nameKey);
      name.style.cssText = `
        color: white;
        font-size: 18px;
        font-weight: 600;
      `;

      const description = document.createElement('div');
      description.textContent = t(boost.descKey);
      description.style.cssText = `
        color: #aaa;
        font-size: 13px;
        margin-top: 2px;
      `;

      nameContainer.appendChild(name);
      nameContainer.appendChild(description);
      topRow.appendChild(iconEl);
      topRow.appendChild(nameContainer);
      boostCard.appendChild(topRow);

      // Status and button
      const bottomRow = document.createElement('div');
      bottomRow.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
      `;

      const status = document.createElement('div');
      status.id = `boost-status-${boost.id}`;
      status.style.cssText = `
        color: ${isThisBoostActive ? '#4CAF50' : cooldownRemaining > 0 ? '#FF9800' : hasActiveBoost ? '#888' : '#4CAF50'};
        font-size: 13px;
        font-weight: 500;
      `;

      if (isThisBoostActive) {
        status.textContent = this.formatTime(activeRemaining);
      } else if (cooldownRemaining > 0) {
        status.textContent = this.formatTime(cooldownRemaining);
      } else if (hasActiveBoost) {
        status.textContent = t('boosts.anotherActive');
      } else {
        status.textContent = t('boosts.ready');
      }

      const button = document.createElement('button');
      button.id = `boost-button-${boost.id}`;
      button.textContent = t('boosts.activate');
      button.style.cssText = `
        background: ${isAvailable ? '#4CAF50' : '#555'};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: ${isAvailable ? 'pointer' : 'not-allowed'};
        transition: all 0.2s;
      `;

      if (isAvailable) {
        button.onmouseenter = () => {
          button.style.background = '#45a049';
        };
        button.onmouseleave = () => {
          button.style.background = '#4CAF50';
        };
        button.onclick = (e) => {
          e.stopPropagation();
          this.activateBoost(boost);
        };
      } else {
        button.disabled = true;
      }

      bottomRow.appendChild(status);
      bottomRow.appendChild(button);
      boostCard.appendChild(bottomRow);

      container.appendChild(boostCard);
    });
  }

  private static activateBoost(boost: Boost) {
    // Check if any boost is already active
    const activeBoosts = this.getActiveBoosts();
    if (activeBoosts.length > 0) {
      this.showNotification(t('boosts.alreadyActive'));
      return;
    }
    
    // For triple boost, ask user to choose even or odd
    if (boost.id === 'triple') {
      this.showParitySelector(boost);
      return;
    }

    // Send activation request to server
    wsClient.send({
      type: 'activate_boost',
      boostId: boost.id
    });
    
    // Close modal after activation
    this.close();
  }

  private static showParitySelector(boost: Boost) {
    const selector = document.createElement('div');
    selector.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: rgba(30, 30, 30, 0.95);
      border-radius: 16px;
      padding: 24px;
      max-width: 300px;
      text-align: center;
    `;

    const title = document.createElement('div');
    title.textContent = t('boosts.chooseParity');
    title.style.cssText = `
      color: white;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: center;
    `;

    const evenBtn = document.createElement('button');
    evenBtn.textContent = t('boosts.even');
    evenBtn.style.cssText = `
      flex: 1;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    `;
    evenBtn.onclick = () => {
      selector.remove();
      wsClient.send({
        type: 'activate_boost',
        boostId: boost.id,
        parity: 'even'
      });
      // Close modal after activation
      this.close();
    };

    const oddBtn = document.createElement('button');
    oddBtn.textContent = t('boosts.odd');
    oddBtn.style.cssText = `
      flex: 1;
      background: #FF9800;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    `;
    oddBtn.onclick = () => {
      selector.remove();
      wsClient.send({
        type: 'activate_boost',
        boostId: boost.id,
        parity: 'odd'
      });
      // Close modal after activation
      this.close();
    };

    buttonsContainer.appendChild(evenBtn);
    buttonsContainer.appendChild(oddBtn);
    dialog.appendChild(title);
    dialog.appendChild(buttonsContainer);
    selector.appendChild(dialog);
    document.body.appendChild(selector);

    selector.addEventListener('click', (e) => {
      if (e.target === selector) selector.remove();
    });
  }

  private static formatTime(seconds: number): string {
    const lang = localStorage.getItem('language') || 'en';
    
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      if (lang === 'ru') {
        return `${hours}ч ${mins}мин`;
      }
      return `${hours}h ${mins}m`;
    } else if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (lang === 'ru') {
        return `${mins}мин ${secs}с`;
      }
      return `${mins}m ${secs}s`;
    } else {
      if (lang === 'ru') {
        return `${seconds}с`;
      }
      return `${seconds}s`;
    }
  }

  static close() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  static getActiveBoosts(): BoostState[] {
    const active: BoostState[] = [];
    this.boostStates.forEach(state => {
      if (state.active && state.activeUntil && Date.now() < state.activeUntil) {
        active.push(state);
      }
    });
    return active;
  }

  static calculatePipsMultiplier(dice1: number, dice2: number): { multiplier: number; bonus: number; reason?: string } {
    const activeBoosts = this.getActiveBoosts();
    let multiplier = 1;
    let bonus = 0;
    let reason = '';

    activeBoosts.forEach(state => {
      const boost = BOOSTS.find(b => b.id === state.id);
      if (!boost) return;

      switch (boost.type) {
        case 'double':
          multiplier = Math.max(multiplier, 2);
          reason = 'Double Pips';
          break;
        case 'golden':
          multiplier = Math.max(multiplier, 5);
          reason = 'Golden Hour';
          break;
        case 'triple_even':
        case 'triple_odd':
          const total = dice1 + dice2;
          const isEven = total % 2 === 0;
          const matchesParity = (state.selectedParity === 'even' && isEven) || 
                               (state.selectedParity === 'odd' && !isEven);
          if (matchesParity) {
            multiplier = Math.max(multiplier, 3);
            reason = `Triple Pips (${state.selectedParity})`;
          }
          break;
        case 'snake_eyes':
          if (dice1 === 1 && dice2 === 1) {
            bonus += 1111;
            reason = reason ? `${reason} + Lucky Snakes` : 'Lucky Snakes';
          }
          break;
      }
    });

    return { multiplier, bonus, reason };
  }

  private static showNotification(message: string) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(76, 175, 80, 0.95);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 2000;
      animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  static updateBoostIcon() {
    const iconEl = document.getElementById('boost-icon');
    if (!iconEl) return;

    const activeBoosts = this.getActiveBoosts();
    
    if (activeBoosts.length > 0) {
      // Show active boost icon with animation
      iconEl.style.animation = 'pulse 1s infinite';
    } else {
      // Remove animation
      iconEl.style.animation = 'none';
    }
  }
}
