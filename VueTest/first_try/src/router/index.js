import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
// import Game from '../views/Game.vue'

const routes = [
  { path: '/',        component: Home },
  { path: '/game', component: () => import('../views/Game.vue') }, // lazy load
  // { path: '/game',   component: Game },
]

const router = createRouter({
  history: createWebHistory(), // usa l'API History del browser (URL "puliti")
  routes,
})

export default router