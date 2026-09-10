
up:
	docker compose up --build

down:
	docker compose down --remove-orphans

delete:
	docker system prune -a -f
	docker volume prune -a -f

re: down delete up

restart:
	docker restart backend
	docker restart frontend

pull:
	@for d in $(DIRS); do git -C $$d pull; done
	@git pull;

restore:
	@for d in $(DIRS); do git -C $$d restore .; done

.PHONY: up down delete re restart pull restore