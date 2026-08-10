#!/bin/sh

set -e

ROLE_ID=$(cat /vault/shared/role-id)
SECRET_ID=$(cat /vault/shared/secret-id)

# token per il login a vault per recuperare segreti
TOKEN=$(curl -s --request POST --data "{\"role_id\":\"$ROLE_ID\",\"secret_id\":\"$SECRET_ID\"}" \
		"$VAULT_ADDR/v1/auth/approle/login" | jq -r '.auth.client_token')

# recupero dei segreti dentro vault tramite il token di autenticazione
SECRET=$(curl -s --header "X-Vault-Token: $TOKEN" "$VAULT_ADDR/v1/secret/data/backend")

# variabili di ambiente che utilizza postgres per il db
export POSTGRES_USER=$(echo "$SECRET" | jq -r '.data.data.DB_USER')
export POSTGRES_PASSWORD=$(echo "$SECRET" | jq -r '.data.data.DB_PWD')
export POSTGRES_DB=$(echo "$SECRET" | jq -r '.data.data.DB_NAME')

#avvio postgres tramite entrypoint immagine di docker
exec docker-entrypoint.sh postgres