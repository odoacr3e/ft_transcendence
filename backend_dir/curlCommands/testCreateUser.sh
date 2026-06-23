
# Usage ./testCreateUser [port]

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # reset

port=8080
if [ -n "$1" ]; then
	port=$1
fi

url="http://localhost:$port/auth/register"

toJson() {
	local name="$1"
	local surname="$2"
	local username="$3"
	local email="$4"
	local nationality="$5"
	local password="$6"

	echo "{\"name\": \"$name\", \"surname\": \"$surname\", \"username\": \"$username\", \"email\": \"$email\", \"nationality\": \"$nationality\", \"password\": \"$password\"}"
}

test=(
	'username gia esistente'
	'username troppo corto (< 4 caratteri)'
	'formato email non corretto (senza @)'
	'formato email non corretto (spazi)'
	'formato email non corretto (senza . + dominio finale)'
	'formato email non corretto (senza dominio finale)'
	'formato email non corretto (caratteri speciali)'
	'formato password non corretto (< 8 caratteri)'
	'formato password non corretto (senza minuscola)'
	'formato password non corretto (senza maiuscola)'
	'formato password non corretto (senza numero)'
	'formato password non corretto (senza carattere speciale)'
)

# Array di comandi curl (come stringhe)
requests=(
	"$(toJson 'test' 'test' 'iHaveNoFriends' 'test@gmail.com' 'Italiana' 'Pippo123%%')"
	"$(toJson test test TT test@gmail.com Italiana 'Pippo123%%')"
	"$(toJson test test Gmuuu testgmail.com Italiana 'Pippo123%%')"
	"$(toJson test test Gmuuu 'te st@gmail.com' Italiana 'Pippo123%%')"
	"$(toJson test test Gmuuu 'test@gmail' Italiana 'Pippo123%%')"
	"$(toJson test test Gmuuu 'test@gmail.' Italiana 'Pippo123%%')"
	"$(toJson test test Gmuuu 'te[st@gmail.com' Italiana 'Pippo123%%')"
	"$(toJson test test Gmuuu 'test@gmail.com' Italiana 'pp12')"
	"$(toJson test test Gmuuu 'test@gmail.com' Italiana 'PPPPPP12%%')"
	"$(toJson test test Gmuuu 'test@gmail.com' Italiana 'pppppp12%%')"
	"$(toJson test test Gmuuu 'test@gmail.com' Italiana 'pppppppp%%')"
	"$(toJson test test Gmuuu 'test@gmail.com' Italiana 'ppppppp12')"
)

i=0
for req in "${requests[@]}"; do
	echo ""
	echo -e "${CYAN}─────────────────────────────────────"
	echo -e "${GREEN} Test $i: ${test[i]}"
	echo -e "${CYAN}─────────────────────────────────────${NC}"

	curl -X POST \
		-H "Content-Type: application/json" \
		-d "$req" \
		"$url"

	echo ""
	((i++))
done