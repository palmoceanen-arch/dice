// Stub of ../multiplayer/WebSocketClient used in the Yandex Games build.
// Vite aliases the original module to this file when VITE_PLATFORM=yandex.
//
// The Yandex build is solo-only, so there is no real WebSocket. This module
// exposes the same surface that game/Game.ts reads, but routes pips updates
// through the Yandex cloud save layer instead of a server.

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

type Listener = (data: any) => void;

class StubWebSocketClient {
  public isConnected = true;
  public isAuthenticated = true;
  public connectionHealth: 'good' | 'unstable' | 'poor' = 'good';
  public user: User | null = null;

  private listeners = new Map<string, Set<Listener>>();

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

  // Game.ts calls this when a solo roll completes. Forward to the cloud
  // save layer so pips persist across devices.
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
