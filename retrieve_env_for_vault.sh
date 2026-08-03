#!/bin/sh
# generate-vault-args.sh — legge .env e stampa gli argomenti per vault kv put

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "File $ENV_FILE non trovato" >&2
  exit 1
fi

VAULT_TOKEN=$(jq -r '.root_token' './vault/keys/vault-keys.json')
 
if [ -z "$VAULT_TOKEN" ] || [ "$VAULT_TOKEN" = "null" ]; then
  printf "${RED}! Impossibile estrarre root_token da $VAULT_KEYS_FILE (chiave assente o file malformato)${NC}" >&2
  exit 1
fi

ARGS=""
ENV_JSON="{}"

while IFS='=' read -r key value; do
  case "$key" in
    ""|\#*) continue ;;
  esac
  # Rimuove eventuali virgolette attorno al valore originale
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
  jsonValue="$value"
  # Se il valore contiene apici singoli, li "chiude" e riapre (escape POSIX)
  value=$(echo "$value" | sed "s/'/'\\\\''/g")
  ARGS="$ARGS $key='$value'"
  ENV_JSON=$(echo "$ENV_JSON" | jq --arg k "$key" --arg v "$jsonValue" '. + {($k): $v}')
done < "$ENV_FILE"

# Legge i secret attuali
CURRENT_JSON=$(
docker exec -e VAULT_TOKEN="$VAULT_TOKEN" vault \
    sh -c "vault login -no-print \$VAULT_TOKEN >/dev/null && vault kv get -format=json secret/backend" \
    2>/dev/null | jq -c '.data.data'
)

# Se esistono già, confronta
if [ -n "$CURRENT_JSON" ] && [ "$CURRENT_JSON" != "null" ]; then
    if [ "$(echo "$CURRENT_JSON" | jq -S .)" = "$(echo "$ENV_JSON" | jq -S .)" ]; then
        printf "\n${BLUE}- Secrets invariati. Nessun aggiornamento necessario ...${NC}\n"
        exit 0
    fi
fi

echo "${YELLOW}+ Secrets modificati, aggiorno Vault ...${NC}"

VAULT_CMD=$(echo "vault login $VAULT_TOKEN && vault kv put secret/backend$ARGS")

docker exec -e VAULT_TOKEN="$VAULT_TOKEN" vault sh -c "$VAULT_CMD"