import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore }	from '@/stores/auth.st'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import PlayPage from '../views/PlayPage.vue'
import UserMe from '../views/UserMe.vue'
import EditPage from '../views/EditPage.vue'
import UserOther from '../views/UserOther.vue'
import UsersList from '../views/UsersList.vue'
import GameFour from '../views/GameFour.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ChangePwd from '../views/ChangePwd.vue'
import PwdDEBUG from '../views/PwdDEBUG.vue'
import TournamentPage from '../views/TournamentPage.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/game',
		name: 'game',
		meta: { requiresAuth: true },
		component: Game
	},
	{
		path: '/playpage',
		name: 'playpage',
		meta: { requiresAuth: true },
		component: PlayPage
	},
	{
		path: '/4v4_game',
		name: 'GameFour',
		meta: { requiresAuth: true },
		component: GameFour
	},
	{
		path: '/tournaments',
		name: 'Tournaments',
		meta: { requiresAuth: true },
		component: TournamentPage
	},
	{
		path: '/log',
		name: 'log',
		meta: { requiresGuest: true },
		component: LoginPage
	},
	{
		path: '/register',
		name: 'register',
		meta: { requiresGuest: true },
		component: RegisterPage
	},
	{
		path: `/me`,
		name: 'me_page',
		meta: { requiresAuth: true },
		component: UserMe
	},
	{
		path: `/me/edit`,
		name: 'edit',
		meta: { requiresAuth: true },
		component: EditPage
	},
	{
		path: `/me/edit/pwd`,
		name: 'edit_pwd',
		meta: { requiresAuth: true },
		component: ChangePwd
	},
	{
		path: `/DEBUG/pwd`,
		name: 'DEBUG_pwd',
		meta: { requiresGuest: true },
		component: PwdDEBUG
	},
	{
		path: '/users/:query?',
		name: 'users_list',
		component: UsersList,
		meta: { requiresAuth: true },
		props: (route) => ({ query: route.params.query ? String(route.params.query) : '' })
	},
	{
		path: '/:username?',
		name: 'user_page',
		component: UserOther,
		meta: { requiresAuth: true },
		props: (route) => ({ username: String(route.params.username) })
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to) => {
	const auth = useAuthStore();

	if (!auth.user) { await auth.fetchMe(); }

	if (to.meta.requiresAuth && !auth.isAuthenticated)
		return ({ name: 'log' });

	if (to.meta.requiresGuest && auth.isAuthenticated)
		return ({ name: 'home' });
})

export default router
