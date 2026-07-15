up:
	docker compose up --build

down:
	docker compose down --remove-orphans

delete:
	docker system prune -a

re: delete up

setup:
	git fetch origin backend frontend
	test -d backend_dir  || git worktree add backend_dir backend
	test -d frontend_dir || git worktree add frontend_dir frontend

pull_be:
	cd backend_dir && git pull

pull_fe:
	cd frontend_dir && git pull

pull: pull_be pull_fe

restore_be:
	cd backend_dir && gti restore .

restore_fe:
	cd frontend_dir && gti restore .

restore: restore_be restore_fe

push_fe:
	cd frontend_dir && commit

.PHONY: up down delete re setup pull pull_be pull_fe
