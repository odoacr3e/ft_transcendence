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


echo "Vault is ready!"
wait $VAULT_PID