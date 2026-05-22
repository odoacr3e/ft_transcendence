import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import User from '../views/User.vue'

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
		component: User,
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router