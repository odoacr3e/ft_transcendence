
# Usage: ./script [username] [password]

curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"$1\", \"password\": \"$2\"}" http://localhost:8080/login