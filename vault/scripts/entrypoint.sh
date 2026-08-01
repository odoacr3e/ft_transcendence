#!/bin/sh

set -e

# setup permissions on data volumes (uid/gid 100 = vault user)
chown -R 100:100 /vault/data /vault/logs 2>/dev/null || true

# start vault server in backgroud 
vault server -config=/vault/config/config.hcl & VAULT_PID=$!

export VAULT_ADDR="http://127.0.0.1:8200"
KEYFILE="/vault/keys/vault-keys.json"

echo "Waiting for Vault response ..."
until vault status >/dev/null 2>&1 || [ $? -eq 2 ]; do
	sleep 1
done

# saving vaule of initialized key from vault status
INITIALIZED=$(vault status -format=json | jq -r '.initialized')

if [ "$INITIALIZED" = "false" ]; then
	echo "Initializing Vault keys (first time) ..."
	vault operator init -key-shares=5 -key-threshold=3 -format=json > "$KEYFILE"
	chmod 600 "$KEYFILE"
	echo "Vault unlocked ..."
fi

# saving vaule of sealed key from vault status
SEALED=$(vault status -format=json | jq -r '.sealed')
if [ "$SEALED" = "true" ] && [ -f "$KEYFILE" ]; then
	echo "Unlocking vault ..."
	for i in 0 1 2; do
		KEY=$(jq -r ".unseal_keys_b64[$i]" "$KEYFILE")
		vault operator unseal "$KEY"
	done
	echo "Vault unlocked ..."
fi

# enabling kv-v2 version for secrets
export TOKEN=$(jq -r '.root_token' '/vault/keys/vault-keys.json')
if ! vault secrets list -format=json | jq -e '.["secret/"]' > /dev/null 2>&1; then
	vault secrets enable -path=secret kv-v2
	echo "kv-v2 version enabled ..."
else
	echo "secret/ already enabled, skipping ..."

# writing policies
vault policy write backend-policy /vault/policies/backend-policy.hcl
echo "backend-policy uploaded and written ..."

# enabling AppRole
if ! vault secrets list -format=json | jq -e '.["approle/"]' > /dev/null 2>&1; then
	vault auth enable approle
	echo "AppRole enabled ..."
else
	echo "approle/ already enabled, skipping ..."

# connecting AppRole to backend policy
vault write auth/approle/role/backend-role token_policies="backend-policy" token_ttl=1h token_max_ttl=4h
echo "AppRole connected to backend-policy ..."

# creating roleID
ROLE_ID_FILE="/vault/shared/role-id"
ROLE_ID=$(vault read -format=json auth/approle/role/backend-role/role-id | jq -r '.data.role_id')
echo "$ROLE_ID" > "$ROLE_ID_FILE"
echo "RoleID generated ..."

# creating secretID only if it's not first time running
SECRET_ID_FILE="/vault/shared/secret-id"
if [ ! -f "$SECRET_ID_FILE" ]; then
	echo "First run: generating new SecretID ..."
	SECRET_ID=$(vault write -format=json -f auth/approle/role/backend-role/secret-id | jq -r '.data.secret_id')
	echo "$SECRET_ID" > "$SECRET_ID_FILE"
	echo "SecretID generated ..."
else
	echo "SecretID already exists, skipping generation ..."
fi

echo "Vault is ready!"
wait $VAULT_PID