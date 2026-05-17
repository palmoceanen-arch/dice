// `wsClient` shim for the Yandex Games build.
//
// Vite aliases `../multiplayer/WebSocketClient` to this file (see
// vite.config.ts) when VITE_PLATFORM=yandex, so anything in Game.ts /
// MultiplayerUI / etc. that imports the canonical Telegram client lands here.
//
// We expose two implementations behind the same `wsClient` symbol:
//
//   - **Offline solo stub**  — when `VITE_WS_URL` is empty. No network
//     activity; pips, design keys and custom dice are persisted through
//     Yandex Cloud Save.
//
//   - **Live multiplayer client** — when `VITE_WS_URL` is set (e.g.
//     `wss://street-dice.online/ws`). Reuses the canonical
//     `multiplayer/WebSocketClient.ts` class with a pluggable auth payload
//     that ships the Yandex Games signature; Cloud Save still backs the
//     solo Free Roll pips so the offline path keeps working.
//
// IMPORTANT: the relative path to the real client is `../../multiplayer/...`
// (note the **two** `..` segments). The vite alias regex is anchored at
// `^../multiplayer/...` so `../../multiplayer/...` skips the alias and
// resolves to the real implementation. Do not "simplify" the path.

import { cloudSave } from '../cloudSave';
import { WebSocketClient } from '../../multiplayer/WebSocketClient';
import { getYandexAuth } from '../yandexAuth';
import { showRewardedVideo } from '../platform';
import presets from '../../../shared/presets.json';

// Yandex-tuned boost cooldowns. Players unlock a boost by watching a
// rewarded video ad; cooldowns are short enough that an engaged player
// keeps watching ads (good ARPU) but long enough that boosts stay scarce
// and feel valuable. `duration` mirrors the BoostsModal preset.
//
// Cooldown is measured **from the moment the boost expires**, so the
// post-cooldown `availableAt` we ship to the client is
// `activeUntil + cooldown`.
interface YandexBoostConfig {
  duration: number; // seconds the boost is active
  cooldown: number; // seconds between boost-expire and next activation
}
const YANDEX_BOOSTS: Record<string, YandexBoostConfig> = {
  double:     { duration: 180, cooldown: 600 },  // x2, 3min active, 10min cooldown
  triple:     { duration: 180, cooldown: 900 },  // x3, 3min active, 15min cooldown
  snake_eyes: { duration: 180, cooldown: 900 },  // +1111, 3min, 15min cooldown
  golden:     { duration: 60,  cooldown: 1800 }, // x5, 1min active, 30min cooldown
};

// Map a generic activate_boost request (boostId + optional parity) to the
// concrete `boost_activated` payload that BoostsModal expects, ship it
// over the local emitter, and schedule the follow-up `boost_expired` so
// the post-cooldown timer kicks in even while the page stays open.
function scheduleBoostLifecycle(
  emit: (event: string, data: unknown) => void,
  boostId: string,
  parity: 'even' | 'odd' | undefined,
): void {
  const cfg = YANDEX_BOOSTS[boostId];
  if (!cfg) {
    console.warn('[yandex-boost] unknown boostId', boostId);
    return;
  }
  const now = Date.now();
  const activeUntil = now + cfg.duration * 1000;
  const availableAt = activeUntil + cfg.cooldown * 1000;

  emit('boost_activated', {
    boostId,
    activeUntil,
    availableAt,
    ...(parity ? { selectedParity: parity } : {}),
  });

  // Fire-and-forget timer — BoostsModal also runs its own checkActiveBoosts
  // tick once a second that falls back to the saved availableAt when this
  // event never lands (page in background, etc.).
  setTimeout(() => {
    emit('boost_expired', { boostId, availableAt });
  }, cfg.duration * 1000);
}

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

const WS_URL: string = (import.meta as any).env?.VITE_WS_URL ?? '';

// === Offline solo stub ===
class StubWebSocketClient {
  public isConnected = true;
  public isAuthenticated = true;
  public connectionHealth: 'good' | 'unstable' | 'poor' = 'good';
  public user: User | null = null;

  private listeners = new Map<string, Set<Listener>>();

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
    if (payload.type === 'activate_boost') {
      const boostId = String(payload.boostId ?? '');
      const parity =
        payload.parity === 'even' || payload.parity === 'odd'
          ? (payload.parity as 'even' | 'odd')
          : undefined;
      // Gate every activation behind a rewarded ad — this is the whole
      // point of the Yandex boost flow.
      showRewardedVideo()
        .then((rewarded) => {
          if (!rewarded) {
            this.emit('boost_activation_failed', { boostId, reason: 'ad_not_completed' });
            return;
          }
          scheduleBoostLifecycle((e, d) => this.emit(e, d), boostId, parity);
        })
        .catch((e) => {
          console.warn('[stub-ws] rewarded video flow threw', e);
          this.emit('boost_activation_failed', { boostId, reason: 'ad_error' });
        });
      return;
    }
    if (payload.type === 'get_boost_states') {
      // BoostsModal.init() already seeds defaults from localStorage; the
      // stub only needs to acknowledge the request so the modal doesn't
      // sit waiting. Echo an empty boosts array — the modal will fall
      // back to its locally persisted state.
      setTimeout(() => this.emit('boost_states', { boosts: [] }), 0);
      return;
    }
  }

  getEquippedDiceConfig(): any | null {
    return cloudSave.getEquippedDiceConfig();
  }

  getEquippedTableConfig(): any | null {
    return cloudSave.getEquippedTableConfig();
  }

  // Stubbed lobby/friends/etc methods that MultiplayerUI may call.
  // The offline build never opens the multiplayer UI but these keep the
  // type surface compatible with the live client below.
  connect(): Promise<void> { return Promise.resolve(); }
  disconnect(): void { /* no-op */ }
  getFriends(): void { /* no-op */ }
  getInvitations(): void { /* no-op */ }
  getFriendRequests(): void { /* no-op */ }
  leaveLobby(): void { /* no-op */ }
}

// === Live multiplayer client (Yandex auth) ===
// Subclass the canonical Telegram client and override the bits that need
// Yandex semantics: auth payload, Free Roll cloud-save bookkeeping, and the
// equipped dice/table config readers (which Game.ts polls for the local
// preview). Everything else (reconnect, event emitter, lobby/friends/etc.
// method surface) is inherited verbatim.
class YandexLiveWSClient extends WebSocketClient {
  constructor(serverUrl: string) {
    super(serverUrl, {
      getAuthPayload: () => {
        const snap = getYandexAuth();
        if (!snap) {
          // Auth snapshot not loaded yet — send a stub guest payload so the
          // server can decide what to do (in dev it accepts unsigned data).
          return {
            platform: 'yandex',
            signedData: null,
            playerInfo: { uuid: 'yandex-bootstrap' },
          };
        }
        return {
          platform: 'yandex',
          signedData: snap.signedData,
          playerInfo: snap.playerInfo,
        };
      },
    });

    // The server's DB stores `users.equipped_dice_id` etc., but on Yandex
    // every user is permanently equipped with `classic_white` in the DB
    // because Cloud Save is the source of truth for the inventory. Push
    // the actual local equip state to the server with `set_player_items`
    // so opponents see the right skin in multiplayer broadcasts.
    //
    // We send (a) after every successful auth — important because reconnects
    // wipe the server-side `Connection.clientItems` — and (b) any time the
    // local inventory or custom dice changes while connected, so equipping
    // a new dice in the middle of a session takes effect on the next throw.
    this.on('auth_success', () => {
      this.sendPlayerItemsFromCloudSave();
    });
    // Live for the lifetime of the page — no need to unsubscribe.
    cloudSave.onInventoryChange(() => {
      if (this.isAuthenticated) this.sendPlayerItemsFromCloudSave();
    });
  }

  // Synthesize a `set_player_items` payload from the current Cloud Save
  // state and ship it to the server. `code` is just telemetry — the
  // server treats `config` as authoritative.
  private sendPlayerItemsFromCloudSave(): void {
    const inv = cloudSave.getInventory();
    const dicePresets = (presets as any).dice as Record<string, { name: string; config: unknown }> | undefined;
    const tablePresets = (presets as any).tables as Record<string, { name: string; config: unknown }> | undefined;

    // Dice: a saved custom config (design-key flow) overrides the equipped
    // preset, mirroring `cloudSave.getEquippedDiceConfig`.
    const customDice = cloudSave.getCustomDiceConfig();
    let diceSlot: { code: string; name: string; config: Record<string, unknown> | null } | null = null;
    if (customDice) {
      diceSlot = { code: 'yandex_custom', name: 'Custom dice', config: customDice as Record<string, unknown> };
    } else {
      const id = inv.equippedDiceId;
      const entry = id ? dicePresets?.[id] : undefined;
      if (entry) {
        diceSlot = { code: id, name: entry.name, config: entry.config as Record<string, unknown> };
      }
    }

    // Table.
    let tableSlot: { code: string; name: string; config: Record<string, unknown> | null } | null = null;
    {
      const id = inv.equippedTableId;
      const entry = id ? tablePresets?.[id] : undefined;
      if (entry) {
        tableSlot = { code: id, name: entry.name, config: entry.config as Record<string, unknown> };
      }
    }

    // Effects aren't surfaced in the Yandex UI yet — leave the slot
    // unset so the server keeps its existing (DB or previous override)
    // value.
    super.send({
      type: 'set_player_items',
      dice: diceSlot,
      table: tableSlot,
    });
  }

  // Free Roll pips still live in Cloud Save in the Yandex build (we don't
  // want every solo roll to round-trip the server, and the server side has
  // no concept of solo rolls anyway). Intercept and short-circuit.
  override send(message: object) {
    const msg = message as any;
    if (msg?.type === 'activate_boost') {
      // Boost activation is rewarded-ad-gated and runs entirely client
      // side on Yandex, whether or not multiplayer is connected. The
      // server's own boost cooldowns are tuned for Telegram (4h-12h) —
      // we don't want them gating ad-rewarded plays.
      const boostId = String(msg.boostId ?? '');
      const parity =
        msg.parity === 'even' || msg.parity === 'odd'
          ? (msg.parity as 'even' | 'odd')
          : undefined;
      showRewardedVideo()
        .then((rewarded) => {
          if (!rewarded) {
            (this as any).emit?.('boost_activation_failed', { boostId, reason: 'ad_not_completed' });
            return;
          }
          scheduleBoostLifecycle((e, d) => (this as any).emit?.(e, d), boostId, parity);
        })
        .catch((e) => {
          console.warn('[yandex-ws] rewarded video flow threw', e);
          (this as any).emit?.('boost_activation_failed', { boostId, reason: 'ad_error' });
        });
      return;
    }
    if (msg?.type === 'get_boost_states') {
      // Locally persisted states are authoritative on Yandex — ack only.
      setTimeout(() => (this as any).emit?.('boost_states', { boosts: [] }), 0);
      return;
    }
    if (msg?.type === 'solo_roll_complete') {
      const delta = Number(msg.earnedPips ?? msg.pips ?? 0);
      if (Number.isFinite(delta) && delta > 0) {
        cloudSave.incrementPips(delta).catch((e) => {
          console.warn('[yandex-ws] failed to increment pips in cloud', e);
        });
      }
      cloudSave.bumpRollCount().catch(() => undefined);
      return;
    }
    if (msg?.type === 'save_custom_dice') {
      // Custom dice are a single-player cosmetic in the Yandex build —
      // they don't need to round-trip the server. Mirror the stub semantics.
      const ok = cloudSave.consumeDesignKey();
      if (!ok) {
        (this as any).emit?.('custom_dice_save_failed', { reason: 'no_key' });
        return;
      }
      cloudSave.saveCustomDice(msg.config).catch((e) => {
        console.warn('[yandex-ws] failed to persist custom dice', e);
      });
      (this as any).emit?.('custom_dice_saved', { config: msg.config });
      return;
    }
    super.send(message);
  }

  // Game.ts asks the WS client for the player's currently-equipped dice /
  // table config (for the local preview before a roll). In the Telegram
  // build that's a server round-trip; in Yandex we read from Cloud Save.
  getEquippedDiceConfig(): any | null {
    return cloudSave.getEquippedDiceConfig();
  }

  getEquippedTableConfig(): any | null {
    return cloudSave.getEquippedTableConfig();
  }

  // `createLobby(gameMode, bet)`, `joinQueue(mode, betAmount, gameMode?)`,
  // `leaveQueue()` and `getPlayerStats()` are inherited verbatim from the
  // canonical `multiplayer/WebSocketClient`. The Yandex Games build uses the
  // same protocol — `bet === 0` opts into a no-bet lobby, anything else is a
  // regular betting lobby. The lobby UI is responsible for the bet picker.
}

function makeClient(): StubWebSocketClient | YandexLiveWSClient {
  if (!WS_URL) {
    console.log('[yandex-ws] VITE_WS_URL not set — offline solo stub mode');
    return new StubWebSocketClient();
  }
  console.log('[yandex-ws] live multiplayer mode → ' + WS_URL);
  return new YandexLiveWSClient(WS_URL);
}

export const wsClient = makeClient();
