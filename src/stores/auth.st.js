import { io }				from 'socket.io-client'
import { api }				from '../router/api/client';
import { authApi }			from '../router/api/auth.api';
import { defineStore }		from 'pinia';
import { listenGameSocket } from '../scripts/Data/SocketLink';
import router from "../router/index.js"

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,	// { id_user, name, surname, username, email, image, nationality, points, title, preferences, mfa }
		isLoading: false,
		error: null,
		sessionChecked: false,
		usersOnline: new Set(),
		msgRecevied: new Set(),
		preference: null,
		socket: null,
		tourInfo: {
			pwd: null,
			status: null,
			error: null
		}
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
					this.getAllMsg();
					this.connectSocket();
					this.sessionChecked = true;
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
				this.getAllMsg();
				this.connectSocket();
				this.sessionChecked = true;
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
				this.sessionChecked = true;
			}
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async logout(force = false) 
		{
			try {
				if (force)
					await api.post('/auth/forceLogout', { id_user: this.user.id_user })
				else
					await authApi.logout({ id_user: this.user.id_user });
				await router.push('/log');
				this.disconnectSocket();
				this.user = null;
				this.usersOnline.clear();
				this.msgRecevied.clear();
			}
			catch(err) { console.log(err); }
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
			try { this.user = await authApi.changePwd(credentials); }
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async fetchMe(force = false) 
		{
			if (this.sessionChecked && !force) { return; }
			try {
				this.user = await authApi.me();
				if (this.user) { this.connectSocket(); this.getAllMsg(); }
			}
			catch	{ this.user = null; }
			finally	{ this.sessionChecked = true; }
		},

		async getAllMsg()
		{
			try {
				const resp = await authApi.msglist();
				Array.from(resp).slice().reverse().forEach((m, index) => {
					if (index < 10)
						this.msgRecevied.add(m);
				})
			}
			catch (err) { this.error = err.message; }
		},

		createTour(tourName)
		{
			this.socket.emit("create_tournament", {name: tourName}, ({resp}) => {
				if (resp.log.status == "OK")
				{
					this.tourInfo.pwd = resp.tournament_pwd;
					this.socket.off('update_tournament'); //meglio metterla in una funziona a fine torneo
					this.socket.on('update_tournament', ({resp}) => { if (!resp.log) { this.error = resp.log.error; } this.tourInfo.status = resp.round });
					return (resp);
				}
			});
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

			this.socket.on('friend:online',		({ userId }) =>	{ this.usersOnline.add(userId); });
			this.socket.on('friend:offline',	({ userId }) =>	{ this.usersOnline.delete(userId); });
			this.socket.on('notification',		({ msg }) =>	{
				msg.status = "not read";
				if (this.msgRecevied.size === 10)
				{
					const firstReadMessage = Array.from(this.msgRecevied).find(m => m.status === "read");
					if (firstReadMessage)
						this.msgRecevied.delete(firstReadMessage);
				}
				this.msgRecevied.add(msg);
			});
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
