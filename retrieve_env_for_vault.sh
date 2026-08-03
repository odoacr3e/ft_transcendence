#!/bin/sh
# generate-vault-args.sh — legge .env e stampa gli argomenti per vault kv put

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "File $ENV_FILE non trovato" >&2
  exit 1
fi

VAULT_TOKEN=$(jq -r '.root_token' './vault/keys/vault-keys.json')
 
if [ -z "$VAULT_TOKEN" ] || [ "$VAULT_TOKEN" = "null" ]; then
  echo "Impossibile estrarre root_token da $VAULT_KEYS_FILE (chiave assente o file malformato)" >&2
  exit 1
fi

ARGS=""
while IFS='=' read -r key value; do
  case "$key" in
    ""|\#*) continue ;;
  esac
  # Rimuove eventuali virgolette attorno al valore originale
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
  # Se il valore contiene apici singoli, li "chiude" e riapre (escape POSIX)
  value=$(echo "$value" | sed "s/'/'\\\\''/g")
  ARGS="$ARGS $key='$value'"
done < "$ENV_FILE"

VAULT_CMD=$(echo "vault login $VAULT_TOKEN && vault kv put secret/backend$ARGS")

docker exec -e VAULT_TOKEN="$VAULT_TOKEN" vault sh -c "$VAULT_CMD"

# echo $VAULT_CMD