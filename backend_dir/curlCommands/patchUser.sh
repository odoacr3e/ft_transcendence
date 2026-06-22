
# usage [ID] [NAME] [SURNAME] [USERNAME] [PASSWORD] [NATIONALITY] [EMAIL] [IMAGE] [PREFERENCES]
#!/usr/bin/bash

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Uso: $0 <id> <name> <surname> <username> <password> <nationality> <email> <image> <preferences>"
  echo "     Lascia \"\" per saltare un campo"
  echo "Esempio: $0 42 \"Mario\" \"\" \"\" \"\" \"\" \"mario@example.com\""
  exit 0
fi

ID=$1
NAME=$2
SURNAME=$3
USERNAME=$4
PASSWORD=$5
NATIONALITY=$6
EMAIL=$7
IMAGE=$8
PREFERENCES=$9
 
JSON="{"
[[ -n "$NAME" ]]        && JSON+="\"name\":\"$NAME\","
[[ -n "$SURNAME" ]]     && JSON+="\"surname\":\"$SURNAME\","
[[ -n "$USERNAME" ]]    && JSON+="\"username\":\"$USERNAME\","
[[ -n "$PASSWORD" ]]    && JSON+="\"password\":\"$PASSWORD\","
[[ -n "$NATIONALITY" ]] && JSON+="\"nationality\":\"$NATIONALITY\","
[[ -n "$EMAIL" ]]       && JSON+="\"email\":\"$EMAIL\","
[[ -n "$IMAGE" ]]       && JSON+="\"image\":\"$IMAGE\","
[[ -n "$PREFERENCES" ]] && JSON+="\"preferences\":$PREFERENCES,"
JSON="${JSON%,}}"
 
curl -X PATCH http://localhost:8080/api/users/$ID \
  -H "Content-Type: application/json" \
  -d "$JSON"