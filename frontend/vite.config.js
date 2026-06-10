import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  server: {
    host: true, 
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://backend:8080',
        changeOrigin: true,
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
      '@': path.resolve(__dirname, './src'),
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
