up:
	docker compose up --build

down:
	docker compose down

delete:
	docker system prune -a

re: delete up

# --- Worktree setup (sostituisce il vecchio subtree) ---
# backend_dir  -> branch 'backend'
# frontend_dir -> branch 'frontend'
# Dopo un clone pulito lancia `make setup` per popolare le due cartelle.
setup:
	git fetch origin backend frontend
	test -d backend_dir  || git worktree add backend_dir backend
	test -d frontend_dir || git worktree add frontend_dir frontend

# Aggiorna il codice: entra nel worktree e fa pull (niente subtree)
pull_be:
	cd backend_dir && git pull

pull_fe:
	cd frontend_dir && git pull

pull: pull_be pull_fe

# Per pushare le modifiche committi e pushi dentro al worktree:
#   cd backend_dir  && git add -A && git commit -m "..." && git push
#   cd frontend_dir && git add -A && git commit -m "..." && git push
# Per aggiornare gli npm modules:
#   cd <backend_dir/frontend_dir> && <npm update / npm install>

.PHONY: up down delete re setup pull pull_be pull_fe
