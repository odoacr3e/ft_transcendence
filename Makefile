DIRS := backend_dir frontend_dir
FRONTEND_BRANCH = frontend
# ma perchè tutte ste menate per cancellare dei file?
CLEAN_IMG  = alpine
AS_ROOT    = docker run --rm -v "$$PWD:/w" -w /w $(CLEAN_IMG)

# Vault e' opzionale. Il valore di VAULT_ENABLED nel .env decide se il suo container
# viene creato: solo "true" attiva il profilo, qualsiasi altro valore lo lascia spento,
# e senza container non c'e' nessuna attesa all'avvio.
VAULT_ENABLED := $(shell sed -n 's/^VAULT_ENABLED=//p' .env 2>/dev/null | tr -d "\"' " | tail -1)
VAULT_PROFILE := $(if $(filter true,$(VAULT_ENABLED)),--profile vault,)

up:
	docker compose up --build

firstRun:
	clear
	docker system prune -a -f
	docker volume prune -a -f
	docker compose --profile vault down --remove-orphans
	$(AS_ROOT) rm -rf $(DIRS); \
	git worktree prune; \
	git fetch origin backend frontend; \
	git worktree add backend_dir backend; \
	cp .env ./backend_dir/scacchi
	git worktree add frontend_dir $(FRONTEND_BRANCH)
	@make pull
	docker compose up --build

down:
	docker compose --profile vault down --remove-orphans

delete:
	docker system prune -a -f
	docker volume prune -a -f

re: down delete up

restart:
	docker restart backend
	docker restart frontend

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
	cp .env ./backend_dir/scacchi
	git worktree add frontend_dir $(FRONTEND_BRANCH)
	@make pull

setup_leo: FRONTEND_BRANCH = frontGame
setup_leo: setup

#menate su menate
own:
	$(AS_ROOT) chown -R $$(id -u):$$(id -g) .

setupnrun: setup up

pull:
	@for d in $(DIRS); do git -C $$d pull; done
	@git pull;

restore:
	@for d in $(DIRS); do git -C $$d restore .; done

vault_setup:
	@chmod +x retrieve_env_for_vault.sh
	@./retrieve_env_for_vault.sh
	@printf '\033[1;32m✓ Operazione completata !\033[0m\n\n'

.PHONY: up down delete re setup setup_leo own pull restore
