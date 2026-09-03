#!/bin/sh

set -e

# VAULT_ENABLED arriva dal .env via env_file. Solo la stringa "true" accende Vault:
# qualsiasi altro valore (o assenza) fa leggere le credenziali direttamente dal .env.
if [ "$VAULT_ENABLED" = "true" ]; then

	# vault scrive role-id e secret-id nel volume condiviso quando ha finito di
	# inizializzarsi: si aspetta che compaiano, ma non all'infinito
	i=0
	while [ ! -f /vault/shared/role-id ] || [ ! -f /vault/shared/secret-id ]; do
		i=$((i + 1))
		if [ "$i" -gt 60 ]; then
			echo "postgres: Vault non ha fornito le credenziali entro 60s" >&2
			exit 1
		fi
		sleep 1
	done

	ROLE_ID=$(cat /vault/shared/role-id)
	SECRET_ID=$(cat /vault/shared/secret-id)

	# token per il login a vault per recuperare segreti
	TOKEN=$(curl -s --request POST --data "{\"role_id\":\"$ROLE_ID\",\"secret_id\":\"$SECRET_ID\"}" \
			"$VAULT_ADDR/v1/auth/approle/login" | jq -r '.auth.client_token')

	# recupero dei segreti dentro vault tramite il token di autenticazione
	SECRET=$(curl -s --header "X-Vault-Token: $TOKEN" "$VAULT_ADDR/v1/secret/data/backend")

	# variabili di ambiente che utilizza postgres per il db
	export POSTGRES_USER=$(echo "$SECRET" | jq -r '.data.data.POSTGRES_USER')
	export POSTGRES_PASSWORD=$(echo "$SECRET" | jq -r '.data.data.POSTGRES_PASSWORD')
	export POSTGRES_DB=$(echo "$SECRET" | jq -r '.data.data.POSTGRES_DB')

	echo "postgres: credenziali prese da Vault"
else

	# stessi tre valori, presi dal .env con i nomi che usa gia' il backend
	export POSTGRES_USER="$DB_USER"
	export POSTGRES_PASSWORD="$DB_PWD"
	export POSTGRES_DB="$DB_NAME"

	echo "postgres: Vault disattivato, credenziali dal .env"
fi

#avvio postgres tramite entrypoint immagine di docker
exec docker-entrypoint.sh postgres
