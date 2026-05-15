import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: process.env.USE_SSL ? [basicSsl()] : [],
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: process.env.USE_SSL ? true : false,
    strictPort: false,
    cors: true,
    allowedHosts: 'all'
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Add timestamp to filenames to prevent caching issues
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    }
  }
});
