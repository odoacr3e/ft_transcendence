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
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
	'/auth': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
    },
  },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//       },
//     },
//   },
//   server: {
// 	proxy: {
//     	'/api': {
//     	  target: 'http://localhost:8080',
//     	  changeOrigin: true,
//     	}
// 	},
//     host: '10.11.4.3',
//     port: 5173,
//     strictPort: true,
//   },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
