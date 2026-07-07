import { useAuthStore } from "../../stores/auth.st";

const BASE_URL = 'http://${window.location.hostname}:8080'

async function request(endpoint, options = {}) {
	const res = await fetch(`${BASE_URL}${endpoint}`, {
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		...options
	});

	if (res.status === 401 && res.body.message === "Token expired")
	{
		const refreshed = await tryRefresh();	// token scaduto, tenta il refresh
		if (refreshed)
			return request(endpoint, options);
		const auth = useAuthStore();
 		auth.user = null;
		throw new AuthError('Sessione scaduta');
	}

	if (!res.ok)
	{
		const body = await res.json().catch(() => ({}));
		throw new ApiError(body.message ?? 'Errore sconosciuto', res.status);
	}

	// 204 No Content (es. logout) non ha body
	if (res.status === 204)
		return null;

	return res.json();
}

async function tryRefresh() {
	try
	{
		const res = await fetch(`${BASE_URL}/auth/refresh`, {
			method: 'POST',
			credentials: 'include',
		});
		return res.ok;
	}
	catch { return false; }
}

// Errori tipizzati così nello store puoi distinguerli
export class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	};
}

export class AuthError extends Error {}

export const api = {
		get:	(endpoint)			=> request(endpoint),
		post:	(endpoint, body)	=> request(endpoint, { method: 'POST',	 body: JSON.stringify(body) }),
		put:	(endpoint, body)	=> request(endpoint, { method: 'PUT',	 body: JSON.stringify(body) }),
		patch:  (endpoint, body)	=> request(endpoint, { method: 'PATCH',	 body: JSON.stringify(body) }),
		delete:	(endpoint, body)	=> request(endpoint, { method: 'DELETE', body: JSON.stringify(body) })
}