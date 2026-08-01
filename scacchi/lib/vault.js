
import * as lib from "./lib";
const { fs } = lib.include;

const VAULT_ADDR = process.env.VAULT_ADDR || 'http://vault:8200'
const PATH_ROLE_ID = '/vault/shared/role-id';
const PATH_SECRET_ID = '/vault/shared/secret-id';

function retrieveCredentials() {
	const roleId = fs.readFileSync(PATH_ROLE_ID, 'utf-8').trim();
	const secretId = fs.readFileSync(PATH_SECRET_ID, 'utf-8').trim();
	return { roleId, secretId };
}

async function appRoleLogin(roleId, secretId) {
	const res = await fetch(`${VAULT_ADDR}/v1/auth/approle/login`, {
		method: 'POST',
		body: JSON.stringify({ roleId: roleId, secretId: secretId })
	});
	if (!res.ok)
		throw new Error(`Vault login failed: ${res.status} ${await res.text()}`);
	const val = await res.json();
	return val.auth.client_token;
}


