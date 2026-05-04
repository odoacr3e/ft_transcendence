# 1. Scarica e aggiungi il repository NodeSource per Node 22 (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# 2. Installa Node.js
sudo apt install -y nodejs

# 3. Verifica la versione
node --version
npm --version