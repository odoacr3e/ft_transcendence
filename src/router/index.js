import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import NewUser from '../views/NewUser.vue'
// import User from '../views/User.vue'

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
		component: NewUser,
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router