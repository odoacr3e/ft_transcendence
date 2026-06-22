import { defineStore }	from 'pinia';
import { authApi }		from '../router/api/auth.api';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,	// { id_user, name, surname, username, email, image, nationality, points, title, preferences }
		isLoading: false,
		error: null,
		sessionChecked: false
	}),

	getters: {
		isAuthenticated: (state) => !!state.user,
		username: (state) => state.user?.username ?? 'Guest'
	},

	actions: {
		async login(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try			{ this.user = await authApi.login(credentials); }
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async register(credentials)
		{
			this.isLoading = true;
			this.error = null;
			try			{ this.user = await authApi.register(credentials); }
			catch (err) { this.error = err.message; }
			finally		{ this.isLoading = false; }
			return (this.error);
		},

		async logout() {
			await authApi.logout();
			this.user = null;
		},

		async fetchMe() {
			if (this.sessionChecked) { return; }
			try		{ this.user = await authApi.me(); }
			catch	{ this.user = null; }
			finally	{ this.sessionChecked = true; }
		}
	}
})

// NOTE 
//In Pinia, dentro le actions, 'this' si riferisce sempre allo store.
// this.token = token sta scrivendo direttamente nello state.

