// import { io }			from 'socket.io-client'
import { authApi }		from '../router/api/auth.api';
// import { shallowRef }	from 'vue'
import { defineStore }	from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,	// { id_user, name, surname, username, email, image, nationality, points, title, preferences }
		isLoading: false,
		error: null,
		sessionChecked: false,
		// usersOnline: new Set(),
		// socket: shallowRef(null)
	}),

	getters: {
		isAuthenticated: (state) => !!state.user,
		username: (state) => state.user?.username ?? 'Guest',
		// isUserOnline: (state) => (userId) => state.usersOnline.has(userId)
	},

	actions: {
		async login(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try {
				this.user = await authApi.login(credentials);
				// this.connectSocket();
			}
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async register(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try {
				this.user = await authApi.register(credentials);
				// this.connectSocket();
			}
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async logout() {
			await authApi.logout();
			// this.disconnectSocket();
			this.user = null;
			// this.usersOnline.clear();
		},

		async fetchMe() {
			if (this.sessionChecked) { return; }
			try {
				this.user = await authApi.me();
				// if (this.user) { this.connectSocket(); } 
			}
			catch	{ this.user = null; }
			finally	{ this.sessionChecked = true; }
		},

		// connectSocket() {
		// 	if (this.socket) { return; }

		// 	this.socket = io();

		// 	this.socket.on('friend:online', ({ userId }) => {
		// 		this.usersOnline.add(userId);
		// 	});

		// 	this.socket.on('friend:offline', ({ userId }) => {
		// 		this.usersOnline.delete(userId);
		// 	});

		// 	this.socket.on('connect', () => {
		// 		console.log('[socket] connesso, id:', this.socket.id);
		// 	});
		
		// 	this.socket.on('connect_error', (err) => {
		// 		console.error('[socket] errore di connessione:', err.message);
		// 	});
		
		// 	this.socket.on('friend:online', ({ userId }) => {
		// 		console.log('[socket] friend:online ricevuto', userId);
		// 		this.usersOnline.add(userId);
		// 	});
		
		// 	this.socket.on('friend:offline', ({ userId }) => {
		// 		console.log('[socket] friend:offline ricevuto', userId);
		// 		this.usersOnline.delete(userId);
		// 	});
		// },

		// disconnectSocket() {
		// 	if (this.socket) {
		// 		this.socket.disconnect();
		// 		this.socket = null;
		// 	}
		// }
	}
})

// NOTE 
//In Pinia, dentro le actions, 'this' si riferisce sempre allo store.
// this.token = token sta scrivendo direttamente nello state.

