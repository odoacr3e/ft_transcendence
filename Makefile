
up:
	@chmod +x script/check_env.sh
	@./script/check_env.sh
	docker compose up --build

down:
	docker compose down --remove-orphans

delete:
	docker system prune -a -f
	docker volume prune -a -f

re: down delete up

restore:
	@for d in $(DIRS); do git -C $$d restore .; done

.PHONY: up down delete re restart pull restore