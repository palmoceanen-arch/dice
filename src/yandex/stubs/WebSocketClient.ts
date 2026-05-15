// Stub of ../multiplayer/WebSocketClient used in the Yandex Games build.
// Vite aliases the original module to this file when VITE_PLATFORM=yandex.
//
// The Yandex build is solo-only, so there is no real WebSocket. This module
// exposes the same surface that game/Game.ts and ui/DiceEditorModal.ts read,
// but routes pips, design keys and custom dice through the Yandex cloud
// save layer instead of a server.

import { cloudSave } from '../cloudSave';

export interface Friend {
  id: number;
  nickname: string;
  status: 'online' | 'offline' | 'in_lobby' | 'in_game';
}

export interface Lobby {
  id: string;
  hostId: number;
  players: any[];
}

export interface Invitation {
  id: string;
  fromUserId: number;
  lobbyId: string;
}

export interface User {
  id: number;
  nickname: string;
  pips: number;
  equippedDiceId: number | null;
  equippedTableId: number | null;
}

// Loose shape so we can match what MultiplayerUI/DiceEditorModal read.
export interface InventoryItem {
  id: number;
  type: 'dice' | 'table' | 'effect' | 'key';
  code: string;
  name: string;
  config?: any;
  rarity?: string;
}

type Listener = (data: any) => void;

class StubWebSocketClient {
  public isConnected = true;
  public isAuthenticated = true;
  public connectionHealth: 'good' | 'unstable' | 'poor' = 'good';
  public user: User | null = null;

  private listeners = new Map<string, Set<Listener>>();

  // DiceEditorModal reads wsClient.inventory.filter(...) to count design
  // keys. Expose it as a getter that materialises virtual inventory entries
  // from the cloud-save layer.
  get inventory(): InventoryItem[] {
    const keys = cloudSave.getDesignKeys();
    const out: InventoryItem[] = [];
    for (let i = 0; i < keys; i++) {
      out.push({
        id: 1000 + i,
        type: 'key',
        code: 'design_key',
        name: 'Design Key',
      });
    }
    return out;
  }

  on(event: string, cb: Listener): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
  }

  off(event: string, cb: Listener): void {
    this.listeners.get(event)?.delete(cb);
  }

  emit(event: string, data?: any): void {
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error('[stub-ws] listener threw', e);
      }
    });
  }

  // Game.ts calls this when a solo roll completes. DiceEditorModal calls
  // this with { type: 'save_custom_dice', config }. Both flow through the
  // cloud-save layer in the Yandex build.
  send(payload: any): void {
    if (!payload || typeof payload !== 'object') return;
    if (payload.type === 'solo_roll_complete') {
      const delta = Number(payload.earnedPips ?? payload.pips ?? 0);
      if (Number.isFinite(delta) && delta > 0) {
        cloudSave.incrementPips(delta).catch((e) => {
          console.warn('[stub-ws] failed to increment pips in cloud', e);
        });
      }
      cloudSave.bumpRollCount().catch(() => undefined);
      return;
    }
    if (payload.type === 'save_custom_dice') {
      const ok = cloudSave.consumeDesignKey();
      if (!ok) {
        console.warn('[stub-ws] save_custom_dice without an available key');
        this.emit('custom_dice_save_failed', { reason: 'no_key' });
        return;
      }
      cloudSave.saveCustomDice(payload.config).catch((e) => {
        console.warn('[stub-ws] failed to persist custom dice', e);
      });
      this.emit('custom_dice_saved', { config: payload.config });
      return;
    }
  }

  getEquippedDiceConfig(): any | null {
    return cloudSave.getEquippedDiceConfig();
  }

  getEquippedTableConfig(): any | null {
    return cloudSave.getEquippedTableConfig();
  }
}

export const wsClient = new StubWebSocketClient();
