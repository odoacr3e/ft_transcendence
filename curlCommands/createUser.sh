# Usage: ./script [name] [surname] [username] [email] [nationality] [password] [port]
# ./curlCommands/createUser.sh Mimmo Mimmoso mimmino12  pippo@a.com Italiana 'Abc1234%%'
port=8080
if [ -n "$7" ]; then
	port=$7
fi
curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"$1\", \"surname\": \"$2\", \"username\": \"$3\", \"email\": \"$4\", \"nationality\": \"$5\", \"password\": \"$6\"}" http://localhost:"$port"/api/users/
