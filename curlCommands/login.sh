
# Usage: ./script [username] [password] [port]

port=8080
if [ -n "$3" ]; then
	port=$3
fi
curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"$1\", \"password\": \"$2\"}" http://localhost:"$port"/auth
