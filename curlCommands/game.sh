
# Usage: ./game.sh [type] [from] [to]

port=8080

error ()
{
	echo "error:" $1
	exit 1
}

usage ()
{
	echo "Usage: ./game.sh [type] [from] [to] [init]"
	echo "types allowed [move] [boost] [endTurn]"
	echo "examples: ./game.sh move a1 b1"
	echo "./game.sh move a1 b1"
	echo "./game.sh boost a1"
	echo "./game.sh endTurn"
	echo './game.sh init $seed'
}

if [[ $1 == "--help" ||  $1 == "" ]];then
	usage; exit 0
fi

curl -X POST -H "Content-Type: application/json" -d "\
{\
	\"type\": \"$1\",\
	\"from\": \"$2\",\
	\"to\": \"$3\"\
}\
" http://localhost:"$port"/api/game/
