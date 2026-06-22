
port=8080
seed=0

run()
{
	curl -X POST -H "Content-Type: application/json" -d "\
	{\
		\"type\": \"init\",\
		\"from\": \"$1\",\
		\"to\": \"\"\
	}\
	" http://localhost:"$port"/api/game/
}

while [ "$seed" != 22222 ]; do
	run $seed
	((seed++))
done