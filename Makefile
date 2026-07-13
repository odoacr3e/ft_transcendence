up:
	docker compose up --build

down:
	docker compose down

delete:
	docker system prune -a

re: delete up

pull_be:
	git subtree pull --prefix=backend_dir origin backend --squash

push_fe:
	git subtree push --prefix=frontend_dir origin frontend

# Se vuoi fare un pull da un branch specifico da backend o frontend usa questo comando
# git subtree pull --prefix=<backend_dir/frontend_dir> origin <branch che vuoi> --squash
# Se vuoi fare un npm install per fare update dei modules in back o front fai così
# cd <frontend_dir/backend_dir> && <npm update/npm install>

.PHONY: pull push