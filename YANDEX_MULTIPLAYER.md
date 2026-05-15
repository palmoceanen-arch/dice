# Yandex Games — Multiplayer integration

This document explains how the Yandex Games build connects to the
multiplayer WebSocket server (`street-dice.online`), what changes were
made on the server to accept Yandex authentication, and what still needs
to be configured outside the codebase (CSP, secrets, etc.) before the
multiplayer build can be submitted to the Yandex Games portal.

## TL;DR — what's wired up

| Layer                            | File                                           | What it does                                                                                       |
|----------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Client auth snapshot             | `src/yandex/yandexAuth.ts`                     | Calls `ysdk.getPlayer({signed:true})` once at boot, caches signature + player info                 |
| Client WS — live mode            | `src/yandex/stubs/WebSocketClient.ts`          | `YandexLiveWSClient` extends the canonical Telegram WS client; pluggable auth payload              |
| Client lobby UI                  | `src/yandex/MultiplayerLobbyUI.ts`             | Create / join by 8-character code; player list; copy / leave / host-start                          |
| Server auth                      | `server/src/services/auth.ts`                  | `validateYandexSignature` (HMAC-SHA256) + `parseYandexPlayerUnsafe` dev fallback                   |
| Server AUTH dispatch             | `server/src/websocket/handlers.ts`             | `message.platform === 'yandex'` routes to `findOrCreateYandexUser`                                 |
| Server users                     | `server/src/services/users.ts`                 | `findOrCreateYandexUser` upserts by `yandex_id`, sets `platform='yandex'`                          |
| Server lobby — no-bet flag       | `server/src/services/lobby.ts`                 | `Lobby.noBet` boolean + `isNoBetLobby()` accessor                                                  |
| Server game-end — fixed payout   | `server/src/services/game.ts`                  | `endGame()` awards fixed pips to winners when lobby is no-bet                                      |
| DB migration                     | `server/src/db/migrate-yandex.ts`              | Adds `users.yandex_id`, `users.platform`, `lobbies.no_bet`                                         |

## Architecture overview

```
┌────────────────────────┐         signed auth + lobby ops          ┌───────────────────────┐
│  Yandex Games iframe   │  ─────────────────────────────────────▶  │  street-dice.online   │
│   index.yandex.html    │           wss://street-dice.online/ws   │  (Node WS server)     │
│                        │                                          │                       │
│  YandexLiveWSClient    │  ◀──────────────────────────────────────  │  AUTH dispatch       │
│  MultiplayerLobbyUI    │      lobby_created / lobby_state / etc.  │  validateYandex      │
│  cloudSave (solo pips) │                                          │  findOrCreateYandex  │
└────────────────────────┘                                          │  lobby + game state  │
                                                                    └───────────────────────┘
```

Two parallel persistence stories run side by side in the Yandex build:

1. **Solo / cosmetic state — Yandex Cloud Save**
   Free Roll pips, equipped dice / table, custom dice designs. Never
   round-trips the server. Lives in `src/yandex/cloudSave.ts`.

2. **Multiplayer state — WebSocket server (`street-dice.online`)**
   Lobby creation, join-by-code, dice throws, game progression,
   game-end payouts. Same backend as the Telegram build.

## Authentication flow

1. `initYandexPlatform()` runs `YaGames.init()`.
2. `loadYandexAuth()` (in `src/yandex/yandexAuth.ts`) calls
   `ysdk.getPlayer({signed:true})` and caches:
   - `signedData` — the `payload.sig` returned by the SDK
     (`null` for unauthorized / offline players)
   - `playerInfo` — uuid, public name, avatar URLs, language
3. The cached snapshot is exposed synchronously via `getYandexAuth()`.
4. `YandexLiveWSClient.authenticate()` reads the snapshot every time it
   (re)connects and sends:
   ```json
   {
     "type": "auth",
     "platform": "yandex",
     "signedData": "<base64>.<base64>",
     "playerInfo": { "uuid": "...", "publicName": "...", "lang": "ru" }
   }
   ```
5. Server-side, `handleAuth` (in
   `server/src/websocket/handlers.ts`) sees `message.platform === 'yandex'`
   and runs `validateYandexSignature(signedData)` against
   `YANDEX_APP_SECRET`. On success the verified uuid is passed to
   `findOrCreateYandexUser`. On failure in production the connection is
   dropped; in dev (no `YANDEX_APP_SECRET`) we fall back to
   `parseYandexPlayerUnsafe` so local `npm run dev` keeps working.

## No-bet game modes

The Yandex Games portal disallows pip-stake / real-money betting flows.
The server therefore tracks a per-lobby `noBet` flag (default `false`,
backwards-compatible with Telegram):

- `YandexLiveWSClient.createLobby()` always sets `noBet: true`.
- `handleCreateLobby` persists the flag (`lobbies.no_bet`) and mirrors
  it into the in-memory `activeLobbies` cache.
- `handleStartGame` checks `isNoBetLobby()` and skips the betting UI
  (it never broadcasts `show_betting_ui`; goes straight into
  `startGameAfterBetting`, which sets up `activeGames` but no
  `BettingManager`).
- `endGame()` has a `else if (isNoBetLobby)` branch: it queries the
  active mode handler's `getWinners(state)` and credits each winner
  with `NO_BET_WINNER_PIPS = 100` (constant in `server/src/services/game.ts`).
  The payout is surfaced through the same `payouts` map the betting
  path uses, so the existing client-side game-over UX works unchanged.

`street_craps`'s `getWinners` returns `[]`, so a no-bet street_craps
lobby is effectively a play-for-fun mode — no payouts, no errors. The
Yandex lobby UI surfaces it last in the mode picker for that reason.

## Deployment checklist

### 1. Server (`street-dice.online`)

1. Pull the latest code (`devin/1778859295-yandex-multiplayer` branch).
2. Run the Yandex migration:
   ```
   cd server && npm run db:migrate-yandex
   ```
   (or `tsx src/db/migrate-yandex.ts` directly — both are idempotent).
3. Set `YANDEX_APP_SECRET` in the server environment.
   - Grab it from the Yandex Games developer console:
     https://yandex.com/dev/games/doc/en/console/integration
   - Paste either the raw text or its base64-encoded form. The server
     auto-detects which form it is (`server/src/services/auth.ts`).
4. Restart the WS server. Live multiplayer is now available to both
   Telegram and Yandex clients.

> **Port 443 must be free for nginx.** The Yandex client connects to
> `wss://street-dice.online/ws` (the default WSS port, 443). The bundled
> nginx site (`/etc/nginx/sites-enabled/street-dice-wss`) proxies
> `/ws` → `127.0.0.1:3002` and must own port 443 on this host. If you
> co-host a VLESS / REALITY proxy (e.g. `xray-core` via `x-ui`) on the
> same VPS, point it at a different port — REALITY works on any port,
> and CSP-style `connect-src wss://street-dice.online` matches port 443
> only. A mismatch is silent: REALITY's default behaviour without a
> `fallbacks` block is to TLS-front non-VLESS traffic to its REALITY
> target (e.g. `www.apple.com`), so the Yandex iframe sees an unrelated
> certificate and the WS upgrade fails with no useful log line.

### 2. Yandex Games developer console

Add the WebSocket server's domain to the **CSP** allowlist. The default
CSP blocks every external origin, so without this step the Yandex iframe
cannot connect:

```
connect-src wss://street-dice.online
```

Path: Yandex Games console → your game → **CSP** tab → add
`wss://street-dice.online` to the allowlist.

> Reminder: the `fonts.googleapis.com` host is already in Yandex's
> default whitelist, so external fonts keep working without further
> CSP changes.

### 3. Client build

For local testing against a tunnel:

```
echo "VITE_WS_URL=wss://your-tunnel.trycloudflare.com" > .env.local
npm run build:yandex
```

For the production Yandex submission:

```
echo "VITE_WS_URL=wss://street-dice.online/ws" > .env.production.local
npm run build:yandex
```

When `VITE_WS_URL` is empty the build falls back to the offline solo
stub — the **Multiplayer** menu item is hidden and no signed-data
network calls are made. This is the safest default for any build that
needs to pass moderation as a solo-only entry first.

## Operational notes

- Players who deny the Yandex auth prompt are issued a stable guest
  uuid (cached in `localStorage`). They can still play solo, but their
  WS auth payload has `signedData: null`, so the server treats them as
  unverified — production should reject these connections (the dev
  fallback accepts them).
- Reconnects re-read the cached snapshot via `getYandexAuth()`, so a
  network blip doesn't force the player to re-grant the SDK prompt.
- The 8-character lobby code is the canonical `nanoid(8)` id used by
  the Telegram build; nothing about it is Yandex-specific. Hosts share
  it via the in-game **Copy code** button or the OS share sheet.

## Open follow-ups (not in this PR)

- Wire up a Yandex Leaderboards integration for the cumulative pip
  count (the SDK supports it; we just don't call it yet).
- Replace the offline guest uuid scheme with an explicit "Sign in"
  call (`ysdk.auth.openAuthDialog()`) when the player tries to open
  the Multiplayer menu while unauthorized.
- Add automated tests for the no-bet payout path (`endGame` branch).
