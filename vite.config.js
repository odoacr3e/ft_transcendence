import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['edraccan-transcendence.duckdns.org', 'chessz.duckdns.org'],
    // Il dev server gira in container con ./frontend_dir bind-montato: gli eventi
    // inotify dell'host non arrivano sempre dentro Docker, quindi l'HMR non scatta.
    watch: { usePolling: true, interval: 300 }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
