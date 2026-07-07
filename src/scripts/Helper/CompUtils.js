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

export function rework_date(old_date)
{
    if (!old_date) { return ''; }

    const date = String(old_date).slice(0, 10);
    const [year, month, day] = date.split('-');

	if (!year || !month || !day) { return String(old_date); }

    return `${day}/${month}/${year}`;
}