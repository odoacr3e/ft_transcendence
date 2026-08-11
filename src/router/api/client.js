import { useAuthStore } from "../../stores/auth.st";
import { useRouter }	from 'vue-router';

const	BASE_URL = '',
		router = useRouter();

async function checkResp(res)
{
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

async function request_m(endpoint, options = {}) {
	const isFormData = options.body instanceof FormData;

	const res = await fetch(`${BASE_URL}${endpoint}`, {
		credentials: 'include',
		...options,
		headers: {
			...(!isFormData && { 'Content-Type': 'application/json' }),
			...options.headers
		}
	});

	if (res.status === 401)
	{
		const refreshed = await tryRefresh();
		//console.log(refreshed);
		if (refreshed.ok)
			return request_m(endpoint, options);
		const auth = useAuthStore();
 		auth.user = null;
		// router.push('/log');
		console.log('Sessione scaduta');
	}

	return(checkResp(res));
}

async function request(endpoint, options = {}) {
	const res = await fetch(`${BASE_URL}${endpoint}`, {
		headers: { 'Content-Type': 'application/json' },
		cache: 'no-store',
		credentials: 'include',
		...options
	});

	if (res.status === 401)
	{
		const refreshed = await tryRefresh();	// token scaduto, tenta il refresh
		//console.log(refreshed);
		if (refreshed.ok)
			return request(endpoint, options);
		const auth = useAuthStore();
 		auth.user = null;
		// router.push('/log');
		console.log('Sessione scaduta');
	}

	return (checkResp(res));
}

async function tryRefresh() {
	try
	{
		const auth = useAuthStore();
		const res = await fetch(`${BASE_URL}/auth/refresh`, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ user: auth.user })
		});
		return res;
	}
	catch(err) { return err; }
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
		get:	(endpoint)			=> request  (endpoint),
		post:	(endpoint, body)	=> request  (endpoint, { method: 'POST',   body: JSON.stringify(body) }),
		put:	(endpoint, body)	=> request  (endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
		patch:  (endpoint, body)	=> request  (endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
		delete:	(endpoint, body)	=> request  (endpoint, { method: 'DELETE', body: JSON.stringify(body) }),
		patch_m:(endpoint, body)	=> request_m(endpoint, { method: 'PATCH',  body: body })
}