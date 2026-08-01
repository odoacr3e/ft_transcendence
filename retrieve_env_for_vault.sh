#!/bin/sh
# generate-vault-args.sh — legge .env e stampa gli argomenti per vault kv put

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "File $ENV_FILE non trovato" >&2
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

echo "vault kv put secret/backend$ARGS"