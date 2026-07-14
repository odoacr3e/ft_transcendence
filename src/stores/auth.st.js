import { io }				from 'socket.io-client'
import { authApi }			from '../router/api/auth.api';
import { defineStore }		from 'pinia';
import { listenGameSocket } from '@/scripts/Data/SocketLink';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,	// { id_user, name, surname, username, email, image, nationality, points, title, preferences }
		isLoading: false,
		error: null,
		sessionChecked: false,
		usersOnline: new Set(),
		socket: null
	}),

	getters: 
	{
		isAuthenticated: (state) => !!state.user,
		username: (state) => state.user?.username ?? 'Guest',
		isUserOnline: (state) => (userId) => state.usersOnline.has(userId)
	},

	actions: 
	{
		async 	login(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try {
				const resp = await authApi.login(credentials);
				if (resp.data.user)
				{
					this.user = resp.data.user;
					this.connectSocket();
				}
				else if (resp.data.message === "OTP sent by email")
					this.error = resp;
			}
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async	mfa(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try {
				this.user = await authApi.mfa(credentials);
				this.connectSocket();
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
				this.connectSocket();
			}
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async logout() 
		{
			await authApi.logout();
			this.disconnectSocket();
			this.user = null;
			this.usersOnline.clear();
		},

		async update(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try {
				this.user = await authApi.update(credentials);
				// if (this.user && !this.socket) { this.connectSocket(); } 
			}
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async changePwd(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try { await authApi.changePwd(credentials); }
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async fetchMe() 
		{
			if (this.sessionChecked) { return; }
			try {
				this.user = await authApi.me();
				if (this.user) { this.connectSocket(); } 
			}
			catch	{ this.user = null; }
			finally	{ this.sessionChecked = true; }
		},

		connectSocket()
		{
			if (this.socket) { return; }

			console.log("connessione al socket!");			
			this.socket = io({ withCredentials: true });
			
			listenGameSocket(this.socket);

			this.socket.on('connect', () => {
				console.log(`Socket id: ${this.socket.id}`);
			})

			this.socket.on('friend:online', ({ userId }) => { this.usersOnline.add(userId); });

			this.socket.on('friend:offline', ({ userId }) => { this.usersOnline.delete(userId); });
		},

		disconnectSocket() 
		{
			if (this.socket) {
				this.socket.disconnect();
				this.socket = null;
			}
		}
	}
})

// NOTE 
//In Pinia, dentro le actions, 'this' si riferisce sempre allo store.
// this.token = token sta scrivendo direttamente nello state.

