import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IS_YANDEX = process.env.VITE_PLATFORM === 'yandex';

// When building for Yandex Games we alias the three multiplayer modules
// used inside game/Game.ts to local stubs in src/yandex/stubs/. The result
// is that the Yandex bundle contains no networking code, no Telegram
// dependencies, and the multiplayer paths inside Game.ts become dead
// branches that tree-shake away.
const yandexAliases = [
  {
    find: /^\.\.\/multiplayer\/WebSocketClient(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/WebSocketClient.ts'),
  },
  {
    find: /^\.\.\/multiplayer\/GameSync(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/GameSync.ts'),
  },
  {
    find: /^\.\.\/multiplayer\/DiceSync(\.ts)?$/,
    replacement: path.resolve(__dirname, 'src/yandex/stubs/DiceSync.ts'),
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
