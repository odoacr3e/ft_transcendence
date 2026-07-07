# Flusso: due client che avviano una partita via websocket

Traccia end-to-end di cosa succede tra frontend e backend quando due utenti si
mettono in coda e finiscono nella stessa partita.

## 1. Login → connessione del socket

`LoginPage.vue` chiama `auth.login(credentials)` (`frontend/src/stores/auth.st.js:26-37`).
Al successo, lo store chiama `this.connectSocket()` (`auth.st.js:71-81`):

- crea `this.socket = io('http://localhost:8080', { withCredentials: true })`
  (handshake autenticato via cookie JWT, validato lato server dal middleware in
  `backend/scacchi/websocket/websocket.js:31-52`);
- registra `assignGameSocket(this.socket)` (`frontend/src/scripts/Data/SocketLink.js`)
  — da qui in poi il listener sull'evento `"game"` resta attivo per tutta la sessione;
- registra anche `friend:online` / `friend:offline`.

La guardia `if (this.socket) return;` in `connectSocket()` garantisce che il
listener `"game"` venga agganciato una volta sola per sessione; `disconnectSocket()`
(logout) lo smaltisce insieme al resto.

## 2. `PlayPage.vue` — richiesta di matchmaking

Al click su PLAY, `sendPlayRequest()` (`frontend/src/views/PlayPage.vue:25-37`):

```js
const options = new matchMakingOpt({ matchType, roomType, matchSettings: null });
if (!auth.socket) return;
auth.socket.emit('find_match', options);
waiting.value = true;
```

Nessun callback/`.then` qui: la UI resta sullo spinner "Looking for opponent...",
è il listener globale del punto 5 a decidere quando e dove spostare l'utente.

## 3. Backend — smistamento in coda

## 4. Backend — creazione del match

## 5. Frontend — il listener perenne intercetta l'evento

Su **entrambi** i browser, `assignGameSocket` (`SocketLink.js`) riceve `"game"`:

```js
socket.on("game", (raw) => {
	if (raw.log?.status !== 200) { console.log("[socket]: errore -", raw.log?.msg); return; }
	if (raw.id !== undefined) {
		initLocalMatchState(raw);
		router.push({ name: raw.p3 ? "GameFour" : "game" });
		return;
	}
	updateMatchState(raw);
	clearHighlight();
	if (MACRO.AUDIO) new Audio("/src/assets/audios/moving.mp3").play();
});
```

- `raw.id !== undefined` è il segnale "questo è il payload di un match appena
  creato" (solo `createMatch` aggiunge `.id` al risultato — le mosse normali no);
- `initLocalMatchState(raw)` (`frontend/src/scripts/Data/Archi.js:60-70`) valida
  il payload, popola `localMatchState`/`localBoard`/`localPlayers`, salva
  `localInfo.matchId`/`localInfo.myTeam`;
- `router.push(...)` sposta l'utente fuori da `/playpage` verso `/game` (2
  giocatori) o `/4v4_game` (4 giocatori) — `PlayPage.vue` si smonta da solo per
  effetto della navigazione, non ha bisogno di gestire nulla lui stesso.

## 6. Montaggio della pagina di gioco

`ClassicGame.vue` (`frontend/src/views/ClassicGame.vue:12-23`): l'`onMounted`
trova `localMatchState` già popolato (avvenuto **prima** della navigazione, al
punto 5) e imposta `ready.value = true` — nessuna fetch/init qui. Il
`v-if="ready"` fa comparire `ChessBoard.vue`, il cui `onMounted` chiama
`globalEvents()` (`frontend/src/scripts/Events/Global.js`) per agganciare i
listener DOM (click/drag/keydown) sulla board ormai renderizzata.

## 7. Una mossa, e la board si aggiorna per entrambi

Click sulla board → `globalEvents` → `sendToBackend`/`requestToBack`
(`frontend/src/scripts/Events/BackLink.js`) → `socket.emit("game", {type, from, to})`.

Lato server, `socket.on("game", ...)` (`websocket.js:89-93`) chiama
`gameWebSocketHandler` (`backend/scacchi/handlers/game/Game.js:87-114`): recupera
il match da `socketData.matchData.matchId`, valida il turno, esegue la mossa, e
fa **due emit**:

- `socketData.socket.emit("game", result)` → al mittente (conferma);
- `socketData.socket.to('match_' + match.id).emit("game", result)` → a tutti gli
  altri nella stanza (l'avversario).

Di nuovo `assignGameSocket` intercetta `"game"`: stavolta `raw.id` è `undefined`
→ ramo `updateMatchState(raw)` → board reattiva aggiornata, `clearHighlight()`,
eventuale audio. Identico per entrambi i giocatori, con lo stesso evento — è il
motivo per cui l'avversario vede la mossa in tempo reale, senza dover ripollare.

## Problemi noti

- **`GameFour.vue` non ancora allineato**: `onMounted` (righe 12-19) chiama
  ancora `await initLocalMatchState(style.value)`, passando una stringa
  (`"14x14x4"`) dove ora si aspetta il payload `raw` — va allineato allo stesso
  pattern-guardia di `ClassicGame.vue` (controllo `localMatchState` +
  `router.push` di fallback verso `/playpage`).
- **`roomType: 'PRIVATE'`** non è gestito in `websocket.js:76-87` (solo
  `FRIENDLY`/`RANKED`/`ARENA`): finisce in un `throw` dentro una callback
  `async`, quindi diventa una promise rejection non gestita — il client non
  riceve alcun errore e resta bloccato in attesa.
- **Nessun listener frontend su `'error'`**: se il backend fa
  `socket.emit('error', ...)` (es. opzioni di matchmaking malformate, o il caso
  `PRIVATE` sopra), oggi nessuno lo ascolta lato client — utile aggiungere
  `auth.socket.on('error', ...)` in `connectSocket()`.
