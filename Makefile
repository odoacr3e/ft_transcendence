.PHONY: pull push

up:
	docker compose up --build

down:
	docker compose down

delete:
	docker system prune -a

pull:
	git subtree pull --prefix=backend_dir origin backend --squash
	git subtree pull --prefix=frontend_dir origin frontend --squash

push:
	git subtree push --prefix=backend_dir origin backend
	git subtree push --prefix=frontend_dir origin frontend

push_be:
	git subtree push --prefix=backend_dir origin backend

push_fe:
	git subtree push --prefix=frontend_dir origin frontend

restore:
	git restore backend_dir
	git restore frontend_dir