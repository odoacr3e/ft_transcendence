# Usage: ./script [username] [email] [password] [port]

port=8080
if [ -n "$4" ]; then
	port=$4
fi
curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"$1\", \"email\": \"$2\", \"password\": \"$3\"}" http://localhost:"$port"/api/users/
