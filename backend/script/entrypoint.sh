#!/bin/sh

set -e

redis-server --daemonize yes

npx prisma generate

i=1
until npx prisma migrate deploy; do
	if [ "$i" -ge 30 ]; then
		echo "backend: migrate deploy fallito dopo $i tentativi" >&2
		exit 1
	fi
	echo "backend: database non pronto, ritento ($i/30) ..."
	i=$((i + 1))
	sleep 2
done

exec node main.js
