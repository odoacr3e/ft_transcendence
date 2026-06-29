import router from '@/router/index.js';
import { api } from '@/router/api/client';

export function asset(path) {
	return new URL('../' + path, import.meta.url).href;
}

export async function acceptRequest(id_user)
{
	await api.patch("/api/friends", { id_friend: id_user });
	router.go(0);
}

export async function rejectRequest(id_user)
{
	await api.delete("/api/friends", { id_friend: id_user });
	router.go(0);
}