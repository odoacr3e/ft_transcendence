import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore }	from '@/stores/auth.st'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import UserMe from '../views/UserMe.vue'
import UserOther from '../views/UserOther.vue'
import UsersList from '../views/UsersList.vue'
import GameFour from '../views/GameFour.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/game',
		name: 'game',
		component: Game
	},
	{
		path: '/4v4_game',
		name: 'GameFour',
		component: GameFour
	},
	{
		path: '/log',
		name: 'log',
		component: LoginPage
	},
	{
		path: '/register',
		name: 'register',
		component: RegisterPage
	},
	{
		path: `/me`,
		name: 'me_page',
		component: UserMe
	},
	{
		path: '/users/:query?',
		name: 'users_list',
		component: UsersList,
		props: (route) => ({ query: route.params.query ? String(route.params.query) : '' })
	},
	{
		path: '/:username?',
		name: 'user_page',
		component: UserOther,
		props: (route) => ({ username: String(route.params.username) })
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to) => {
	const auth = useAuthStore();

	if (!auth.user)
		await auth.fetchMe();

	// Route protetta — non loggato
	if (to.meta.requiresAuth && !auth.isAuthenticated)
		return ({ name: 'login' });

	// Utente loggato
	if (to.meta.requiresGuest && auth.isAuthenticated)
		return ({ name: 'home' });
})

export default router
