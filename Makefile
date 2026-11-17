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

up: setup check-docker
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
	@test -f .env || { cp env.example .env; echo 'Creato .env con le impostazioni locali predefinite; personalizza i segreti se necessario.'; }
	@git show-ref --verify --quiet refs/remotes/origin/backend || { echo 'Branch origin/backend non trovata. Clona il repository senza --single-branch e riprova.'; exit 1; }
	@git show-ref --verify --quiet refs/remotes/origin/$(FRONTEND_BRANCH) || { echo 'Branch origin/$(FRONTEND_BRANCH) non trovata. Clona il repository senza --single-branch e riprova.'; exit 1; }
	@test -d backend_dir/scacchi || { mkdir -p backend_dir; git archive origin/backend | tar -x -C backend_dir; }
	@test -f frontend_dir/package.json || { mkdir -p frontend_dir; git archive origin/$(FRONTEND_BRANCH) | tar -x -C frontend_dir; }

check-docker:
	@docker info >/dev/null 2>&1 || { echo 'Docker non e’ accessibile. Avvia Docker e abilita l’accesso del tuo utente al daemon (vedi README); poi usa make senza sudo.'; exit 1; }

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

.PHONY: up firstRun down delete re setup setup_leo check-docker own pull restore
