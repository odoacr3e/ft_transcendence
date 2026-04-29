
# Usage: ./move.sh [type] [from] [to]

port=8080

error ()
{
	echo "error:" $1
	exit 1
}


curl -X POST -H "Content-Type: application/json" -d "\
{\
	\"type\": \"$1\",\
	\"from\": \"$2\",\
	\"to\": \"$3\"\
}\
" http://localhost:"$port"/api/game/
