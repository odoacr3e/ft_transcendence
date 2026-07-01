import { api } from './client'

export const authApi = {
	login:		async (credentials) => {
		const resp = await api.post('/auth/login', credentials); // { username, password }
		return (resp.data.user);
	},
	register:	async (userData) => {
		const resp = await api.post('/auth/register', userData); // { name, surname, username, email, password, nationality }
		return (resp.data.user);
	},
	me:			async () => {
		const resp = await api.get('/api/users/me'); // ripristino sessione al mount
		return (resp.data.user);
	},
	friendlist:	async () => {
		const resp = await api.get('/api/friends'); // lista di amici
		return (resp.data.friendship);
	},
	matchlist: async () => {
		const resp = await api.get('/api/matchesHistory'); // lista degli incontri
		return (resp.data.matches);
	},
	logout:		() => api.post('/auth/logout')
}