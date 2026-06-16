.PHONY: pull push

up:
	docker compose up --build

down:
	docker compose down

delete:
	docker system prune -a

pull:
	git subtree pull --prefix=backend origin backend --squash
	git subtree pull --prefix=frontend origin frontend --squash

push:
	git subtree push --prefix=backend origin backend
	git subtree push --prefix=frontend origin frontend

push_be:
	git subtree push --prefix=backend origin backend

push_fe:
	git subtree push --prefix=frontend origin frontend

restore:
	git restore backend
	git restore frontend