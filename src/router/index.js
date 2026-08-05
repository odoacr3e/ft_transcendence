import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore }	from '@/stores/auth.st'
import TournamentPage from '../views/TournamentPage.vue'
import OpenTournament from '../views/OpenTournament.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ClassicGame from '../views/ClassicGame.vue'
import LeaderBoard from '../views/LeaderBoard.vue'
import UserOther from '../views/UserOther.vue'
import UsersList from '../views/UsersList.vue'
import LoginPage from '../views/LoginPage.vue'
import ChangePwd from '../views/ChangePwd.vue'
import CodexPage from '../views/CodexPage.vue'
import EditPage from '../views/EditPage.vue'
import GameFour from '../views/GameFour.vue'
import PlayPage from '../views/PlayPage.vue'
import PwdDEBUG from '../views/PwdDEBUG.vue'
import UserMe from '../views/UserMe.vue'
import Home from '../views/Home.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/game',
		name: 'game',
		component: ClassicGame
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
		path: '/leaderboard',
		name: 'Leaderboard',
		meta: { requiresAuth: true },
		component: LeaderBoard
	},
	{
		path: '/codex',
		name: 'Codex',
		meta: { requiresAuth: true },
		component: CodexPage
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
	},
	{
		path: '/tournament/:tournament?',
		name: 'open_tournament',
		component: OpenTournament,
		meta: { requiresAuth: true }, //da aggiungere requisito di essere nel torneo
		props: (route) => ({ tournament: Number(route.params.tournament) }) //id, PROVVISSORIO
		// props: (route) => ({ tournament: String(route.params.tournament) })
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
