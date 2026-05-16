// DiceSync - Simplified version 2.0 - No animations, only teleportation
import { Game } from './game/Game';
import { MultiplayerUI, setGameInstance } from './ui/MultiplayerUI';
import { wsClient } from './multiplayer/WebSocketClient';
import { initI18n } from '../shared/i18n';
import { BoostsModal } from './ui/BoostsModal';

// Log version immediately
console.log('%c🎲 Dice Game v2.0 - Simplified (No Animations)', 'color: #4CAF50; font-size: 16px; font-weight: bold');
console.log('%cBuild time:', 'color: #2196F3', new Date().toISOString());

// ============ DEBUG OVERLAY ============
// Tap 5 times in bottom-left corner (FPS button) to toggle
const debugLogs: string[] = [];
let debugOverlay: HTMLElement | null = null;

function createDebugOverlay() {
  debugOverlay = document.createElement('div');
  debugOverlay.id = 'debug-overlay';
  debugOverlay.style.cssText = `
    position: fixed;
    bottom: 50px;
    left: 10px;
    right: 10px;
    max-height: 40vh;
    background: rgba(0,0,0,0.9);
    color: #0f0;
    font-family: monospace;
    font-size: 10px;
    padding: 8px;
    border-radius: 8px;
    overflow-y: auto;
    z-index: 9999;
    display: none;
    white-space: pre-wrap;
    word-break: break-all;
  `;
  document.body.appendChild(debugOverlay);
  
  // Toggle button removed - now controlled by FPS button in Game.ts
}

function debugLog(tag: string, ...args: any[]) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const msg = `[${time}][${tag}] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`;
  debugLogs.push(msg);
  if (debugLogs.length > 100) debugLogs.shift();
  if (debugOverlay) {
    debugOverlay.textContent = debugLogs.join('\n');
    debugOverlay.scrollTop = debugOverlay.scrollHeight;
  }
  console.log(msg);
}

// Make debugLog globally available
(window as any).debugLog = debugLog;

// Expose wsClient globally for DiceEditorModal
(window as any).wsClient = wsClient;

// Create overlay immediately
createDebugOverlay();

// Log visibility changes
document.addEventListener('visibilitychange', () => {
  debugLog('VISIBILITY', document.hidden ? 'HIDDEN' : 'VISIBLE');
});

// ============ END DEBUG OVERLAY ============

// Initialize i18n
initI18n();

// Telegram Web App init
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        disableVerticalSwipes?: () => void;
        enableClosingConfirmation?: () => void;
        isVerticalSwipesEnabled?: boolean;
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
      };
    };
  }
}

// Init Telegram
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  
  // Disable vertical swipes to prevent closing on pull-down
  if (window.Telegram.WebApp.disableVerticalSwipes) {
    window.Telegram.WebApp.disableVerticalSwipes();
  }
  
  // Enable closing confirmation
  if (window.Telegram.WebApp.enableClosingConfirmation) {
    window.Telegram.WebApp.enableClosingConfirmation();
  }
}

// Prevent pull-to-refresh and overscroll
document.body.addEventListener('touchmove', (e) => {
  // Allow scrolling only in scrollable containers
  let target = e.target as HTMLElement;
  while (target && target !== document.body) {
    const style = window.getComputedStyle(target);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return; // Allow scroll in this container
    }
    target = target.parentElement as HTMLElement;
  }
  // Prevent default for everything else
  e.preventDefault();
}, { passive: false });

// Prevent bounce/overscroll on iOS
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault(); // Prevent pinch zoom
  }
}, { passive: false });

let lastTouchY = 0;
let lastTouchTarget: HTMLElement | null = null;
document.addEventListener('touchstart', (e) => {
  lastTouchY = e.touches[0].clientY;
  lastTouchTarget = e.target as HTMLElement;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  // Check if we're in a scrollable container
  let target = lastTouchTarget;
  while (target && target !== document.body) {
    const style = window.getComputedStyle(target);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return; // Allow scroll in this container
    }
    target = target.parentElement as HTMLElement;
  }
  
  const touchY = e.touches[0].clientY;
  const touchYDelta = touchY - lastTouchY;
  lastTouchY = touchY;
  
  // Prevent pull-to-refresh when at top and pulling down
  if (window.scrollY === 0 && touchYDelta > 0) {
    e.preventDefault();
  }
}, { passive: false });

// Start game
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const game = new Game(canvas);
game.start();

// Set game instance for UI
setGameInstance(game);

// Init multiplayer UI
export const multiplayerUI = new MultiplayerUI();

// Make multiplayerUI and wsClient globally accessible
(window as any).multiplayerUI = multiplayerUI;
(window as any).wsClient = wsClient;

// Connection indicator removed - status shown in left corner instead
console.log('[Connection] Status monitoring active');

// Initialize Boosts system
BoostsModal.init();

// Initialize Betting system
import('./ui/BettingModal.js').then(({ BettingModal }) => {
  BettingModal.init();
  console.log('[BETTING] Modal initialized');
});

// Update UI visibility on initial load (show boost icon in online mode)
// Use setTimeout to ensure DOM is ready and GameSync is initialized
setTimeout(() => {
  game.updateUIVisibility();
  debugLog('BOOSTS', 'UI visibility updated on load');
}, 100);

// Connect game to UI for menu state checking
game.setMenuOpenCallback(() => multiplayerUI.isMenuPanelOpen());

// Make result text clickable to open reaction wheel (only in game)
const resultEl = document.getElementById('result');
if (resultEl) {
  resultEl.addEventListener('click', () => {
    // Only open wheel if in game
    const reactionWheel = (window as any).reactionWheel;
    if (reactionWheel && game.isInMultiplayerGame()) {
      reactionWheel.openWheelPublic();
    }
  });
}

// Store reactionWheel globally for access from result click
import { ReactionWheel } from './ui/ReactionWheel';
const reactionWheel = new ReactionWheel();
(window as any).reactionWheel = reactionWheel;

// Apply dice appearance on auth and when equipped item changes
wsClient.on('auth_success', () => {
  // Apply dice config
  const diceConfig = wsClient.getEquippedDiceConfig();
  if (diceConfig) {
    game.updateDiceAppearance(diceConfig);
    const diceSync = game.getDiceSync();
    if (diceSync) {
      diceSync.setOriginalDiceConfig(diceConfig);
    }
  }
  
  // Apply table config
  const tableConfig = wsClient.getEquippedTableConfig();
  if (tableConfig) {
    game.updateTableAppearance(tableConfig);
  }
  
  // Sync pips from server (БД - источник истины)
  if (wsClient.user?.pips !== undefined) {
    game.setPips(wsClient.user.pips); // Это обновит и localStorage
  }
});

// Handle pips updates from server (background sync)
wsClient.on('pips_updated', (data: any) => {
  // Server sends updates but client already updated via localStorage
  // This is just for background sync
});

wsClient.on('item_equipped', (data: any) => {
  if (data.slot === 'dice') {
    // Update local user state
    if (wsClient.user) {
      wsClient.user.equippedDiceId = data.itemId;
    }
    // Apply new dice appearance
    const config = wsClient.getEquippedDiceConfig();
    if (config) {
      const diceSync = game.getDiceSync();
      // Always update original config
      if (diceSync) {
        diceSync.setOriginalDiceConfig(config);
      }
      // Only apply visual change if not locked (not during replay)
      if (!diceSync || !diceSync.isColorChangeLocked()) {
        game.updateDiceAppearance(config);
      }
    }
  } else if (data.slot === 'table') {
    // Update local user state
    if (wsClient.user) {
      wsClient.user.equippedTableId = data.itemId;
    }
    // Only apply table appearance if NOT in multiplayer game
    // During game, the voted table is used
    if (!game.isInMultiplayerGame()) {
      const config = wsClient.getEquippedTableConfig();
      if (config) {
        game.updateTableAppearance(config);
      }
    }
  }
});
