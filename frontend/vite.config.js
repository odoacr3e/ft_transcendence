import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const URL = 'http://backend:8080';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: URL,
        changeOrigin: true,
      },
      '/auth': {
        target: URL,
        changeOrigin: true,
      },
      '/socket.io': {
        target: URL,
        changeOrigin: true,
        ws: true,
    }
    },
  },
//   server: {
//     host: '10.11.4.4',
//     port: 5173,
//     strictPort: true,
//   },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
