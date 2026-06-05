import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore }	from '@/stores/auth.st'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/game',
		name: 'game',
		component: Game,
	},
	{
		path: '/log',
		name: 'log',
		component: LoginPage,
	},
	{
		path: '/register',
		name: 'register',
		component: RegisterPage,
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.user) await auth.fetchMe()

  // Route protetta — non loggato
  if (to.meta.requiresAuth && !auth.isAuthenticated)
    return ({ name: 'login' });

  // Utente loggato
  if (to.meta.requiresGuest && auth.isAuthenticated)
    return ({ name: 'home' });
})

export default router