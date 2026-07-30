# Modifiche per accesso da LAN

Riepilogo dei cambiamenti fatti per permettere ad altri computer sulla stessa
rete locale di connettersi al backend/frontend.

## 1. CORS Express — `backend/scacchi/main.js`

```diff
 app.use(cors({
-	origin: ALLOWED_URLS,
+	origin: true,
 	credentials: true,
 }));
```

`origin: '*'` combinato con `credentials: true` è invalido per spec CORS: il
browser lo rifiuta sempre quando la richiesta include cookie/credenziali.
`origin: true` fa riflettere l'header `Origin` della richiesta, quindi
funziona con le credenziali da qualsiasi host/IP.

## 2. CORS Socket.IO — `backend/scacchi/websocket/websocket.js`

```diff
 cors: {
-	origin: ALLOWED_URLS,
+	origin: true,
 	methods: ["GET", "POST"],
 	credentials: true
 },
```

Stessa motivazione del punto 1, applicata alla configurazione CORS del
websocket.

## 3. Base URL API hardcoded — `frontend/src/router/api/client.js`

```diff
-const BASE_URL = 'http://localhost:8080'
+const BASE_URL = `http://${window.location.hostname}:8080`
```

Era il problema principale: da un altro computer, `localhost` punta alla
macchina del client stesso, non al server. Usando `window.location.hostname`
il frontend punta automaticamente all'host da cui è stato caricato (es.
`10.11.4.3`), sia in locale che da altri PC in LAN.

## 4. Connessione Socket.IO hardcoded — `frontend/src/stores/auth.st.js`

```diff
-this.socket = io('http://localhost:8080', { withCredentials: true });
+this.socket = io(`http://${window.location.hostname}:8080`, { withCredentials: true });
```

Stesso problema del punto 3, applicato alla connessione websocket lato
frontend.
