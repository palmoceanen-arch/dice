import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IS_YANDEX = process.env.VITE_PLATFORM === 'yandex';

// When building for Yandex Games we alias the canonical `WebSocketClient`
// singleton to the Yandex stub, which transparently subclasses the real
// client and ships a Yandex-flavoured auth payload (see
// src/yandex/stubs/WebSocketClient.ts). The Telegram-style `multiplayer/UI`
// modules (lobby browser, BoostsModal, BettingModal, ReactionWheel,
// ConnectionIndicator) are not imported by main.yandex.ts, so they are
// already tree-shaken out of the Yandex bundle.
//
// We deliberately use the *real* `GameSync` and `DiceSync` here — they
// are the modules that drive the in-game multiplayer state (turn order,
// opponent throws, dice replay, game-over UI), and the Yandex build is
// expected to support live multiplayer end-to-end. The matching `./...`
// alias below makes sure that when `GameSync` / `DiceSync` import their
// sibling `./WebSocketClient`, they pick up the same Yandex singleton
// `wsClient` instance everyone else is using — otherwise they'd silently
// instantiate a second, never-connected client and miss every event.
const yandexAliases = [
  {
    find: /^\.\.\/multiplayer\/WebSocketClient(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/WebSocketClient.ts'),
  },
  {
    // Used by `src/multiplayer/GameSync.ts` and `src/multiplayer/DiceSync.ts`
    // when they do `import { wsClient } from './WebSocketClient'`. Without
    // this they'd resolve to the canonical singleton and never receive any
    // events. The Yandex stub itself uses `../../multiplayer/WebSocketClient`
    // (two `..` segments) to fetch the class for subclassing, which doesn't
    // match this regex, so there's no recursion.
    find: /^\.\/WebSocketClient(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/WebSocketClient.ts'),
  },
  {
    find: /^\.\/haptic(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/haptic.ts'),
  },
  {
    find: /^\.\/platformLang(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/platformLang.ts'),
  },
];

export default defineConfig({
  // Yandex Games serves the game from a versioned subpath
  // (e.g. /games/_crpd/<hash>/<token>/<token>/), so absolute /assets/*
  // paths 404. Use relative paths for the Yandex bundle. The Telegram
  // bundle keeps absolute paths because it's served from the root of
  // its own static host.
  base: IS_YANDEX ? './' : '/',
  plugins: process.env.USE_SSL ? [basicSsl()] : [],
  resolve: IS_YANDEX ? { alias: yandexAliases } : undefined,
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: process.env.USE_SSL ? true : false,
    strictPort: false,
    cors: true,
    allowedHosts: 'all',
  },
  build: {
    target: 'es2020',
    outDir: IS_YANDEX ? 'dist-yandex' : 'dist',
    rollupOptions: {
      input: IS_YANDEX
        ? path.resolve(__dirname, 'index.yandex.html')
        : undefined,
      output: {
        // Add timestamp to filenames to prevent caching issues
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
      },
    },
  },
});
