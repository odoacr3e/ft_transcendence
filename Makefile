DIRS := backend_dir frontend_dir
FRONTEND_BRANCH = frontend
#ma perchè tutte ste menate per cancellare dei file?
CLEAN_IMG  = alpine
AS_ROOT    = docker run --rm -v "$$PWD:/w" -w /w $(CLEAN_IMG)

up:
	docker compose up --build

down:
	docker compose down --remove-orphans

delete:
	docker system prune -a -f

re: down delete up

setup:
	@printf '\033[1;31mATTENZIONE\033[0m: $(DIRS) verranno cancellate e ricreate.\n'
	@printf '\033[1;31mTUTTE\033[0m le modifiche non pushate andranno perse.\n'
	@printf 'Magari volevi fare make_pull?\n'
	@printf 'Continuare? [Y/n/Enter]\n'
	@read -r a; case "$$a" in ""|[yY]*) ;; *) echo "Annullato."; exit 0 ;; esac; \
	set -ex; \
	$(AS_ROOT) rm -rf $(DIRS); \
	git worktree prune; \
	git fetch origin backend frontend; \
	git worktree add backend_dir backend; \
	git worktree add frontend_dir $(FRONTEND_BRANCH)

setup_leo: FRONTEND_BRANCH = frontGame
setup_leo: setup

#menate su menate
own:
	$(AS_ROOT) chown -R $$(id -u):$$(id -g) .

setupnrun: setup up

pull:
	@for d in $(DIRS); do git -C $$d pull; done

restore:
	@for d in $(DIRS); do git -C $$d restore .; done

.PHONY: up down delete re setup setup_leo own pull restore
