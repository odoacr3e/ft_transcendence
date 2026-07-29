//NOTE - Regole per i case
	-> Nomi dei file = UpperCamelCase (es. RenderUtils.js)
	-> Nomi delle funzioni = UpperCamelCase (es. RenderUtils.js)
	-> Nomi dei components = multi-word UpperCamelCase (es. ChessBoard.vue)

//REVIEW - SCHEMA ARCHITETTURA

main.js (src/main.js)
	->	CREAZIONE APP.VUE 

App.vue (src/App.vue)
	->	MONTA ROUTER 

index.js (src/router/index.js)
	->	DECIDE LA ROTTA 

ClassicGame.vue (src/views/ClassicGame.vue)
	->	CHIAMA (initMatchstate()) NEL (noMountedHook()) 

initLocalMatchState() (src/scripts/Data/ClassicGame.js)
	->	INIZIALIZZA LE VARS GLOBALI IN Variables.js DA match.json 

boardConverter() 
	-> TRASFORMA LA MAP IN ARRAY 2D 8x8

//REVIEW - INTERAZIONE GIOCATORE 

	//SECTION - HIGHLIGHTS CASELLE
	
	Utente clicca sul pezzo (src/sripts/Events/Global.js)
		-> ChessBoard.vue onMounted() + globalEvents()
	
	Global.js addEventistener("click") (src/sripts/Events/Global.js)
		-> rileva click su immagine pezzo
	
	getSquareColor() + localBoard.get(clickedId) 
		-> recupera le target zones
	
	targetZones forEach --> localBoard forEach
		-> highlight = true;
			-> Caselle con valid move e pezzi da catturare visibili dinamicamente
	
	clearHighlight() ripulisce UI
		modifica il css dinamicamente 
		//NOTE - Casi di rimozione degli highlight/selection
		Highl. =
			✓ click sinistro casella vuota 
			✓ click sinistro casella piena
			✓ click sinistro stessa casella del pezzo
			✓ click destro
			✓ movimento
		Selected =
			✓ click destro stessa casella selezionata 
			✓ click sinistro casella piena & vuota
			✓ drag
			✓ movimento
	
	//SECTION - DRAG & DROP
	
	Utente dragga il pezzo (src/scripts/Events/Movements.js)
		-> Movements.js onDragStart()
	
	dataTransfer.setData()
		-> salva fromSquareId, pieceId
	
	Utente droppa sullo square
		-> ChessBoard.vue @drop="OnDop()"
	
	OnDrop()
		-> legge dataTransfer.getdata()
	
	requestToBack(fromSquareId, toSquareId)
		-> POST /move.json con richiesta
	
	BackendValida la mossa
		-> risponde con Response : YAS || NO
	
	IF json === OK
		-> updateLocalBoard(MatchState)
				-> localBoard.get(fromSquareId).piece = null
				-> localBoard.get(toSquareId).piece = pezzo_mosso
			-> VUE RECTIVITY SI TRIGGERA AAAAAAAAAAAAAAAAAAAA
			-> DOMBoard computed si ricalcola
			-> boardConverter() esegue
			-> ChessBoard.vue re-renderizza

//TODO SCACCHIERA - (▫ = da fare, ✓ = completato)
	✓	movimento al click
	✓	highlight e selected corretti al 100%
	✓	refactoring funzione che gestisce gli events
	✓	pagina user per test con back
	✓	rendering delle informazioni dei player
	✓	bottone per utilizzare l'abilità
	✓	highlitghs per i pezzi boostati
	✓	gestione dei turni tra players (in locale)
	✓	bottone per fine turno
	✓	richieste del boosting
	✓	Coordinate delle caselle della scacchiera
	✓	drag non fastasma
	✓	movimento per i pezzi boostati
	↳		✓ implementazione del drag
			✓ bastardo
			✓ minotauro
			✓ giullare
			✓ valkirya
			✓ campione
			✓ re
	✓ 	aura dei pezzi boostati visibile 
	✓ 	end turn, boost e useAbility triggerabili da pulsanti da tastiera
	✓ 	bottone di potenziamento clickabile solo durante il second turn 
	✓ 	non si dovrebbe poter boostare se non hai ancora mosso nessun pezzo
	✓	Far vedere che pezzo hai selezionato
	✓	Si fa fatica a capire di chi è il turno attuale
	✓	orientamento della scacchiera in base al colore dei pezzi del giocatore
	✓	orientamento delle info del giocatore in base al giocatore
	✓	le mosse dell'avversario sono poco visibili, servirebbero delle animazioni sul
		pezzo mosso oppure un evidenziazione sull'ulitmo pezzo mosso
	✓	avviso di quando devi fare end turn più chiaro
	✓	implementare reload durante la partita
	✓	spostamento bottoni
	✓	display del nome dei giocatori durante la partita
	✓	Aggiungere bottone per arrendersi evento 'giveup'
	✓	Aggiornare la pagina di testing su notion e scriverci i trace del back quando crasho
	✓	schermata di fine partita, e aggiustamenti necessari. c'è una voce victory nella response 	
		con il colore di chi vince o con draw, stringa
	✓	implementare il riaccesso ad una partita in corso dopo chiusura della pagina: richiesta su 
		evento websocket 'amiplaying', se risponde true lancio reload, sennò pace.
	✓	implementare (reload, riaccesso, chiudi e riapri la pagina di gioco)
		durante la partita
	✓	implementare segnali visivi relativi ai turni dei giocatori
	✓ 	quando fai hover sul bottone per boostare il pezzo sarebbe carino poter avere
	  	una preview delle target zones rese visibili sulla scacchiera, si può fare 
	  	una route apposta per chiedere l'update delle target zones di un pezzo specifico
	✓ 	feedback quando il re è sotto scacco
		✓	blinking e effetto audio quando fai una mossa che metterebbe il re sotto scacco
		✓	effetto sonoro ed evidenziazione del re quando viene messo sotto scacco
	✓	Bottone ed evento per chiedere pareggio
	▫	history delle mosse durante la partita
	▫	re-design dei pezzi
	▫	history delle partite
	▫ 	refactor di archi nel caso la board non esista

//FIXME - Bugs
	✓	Delle volte quando finisci una mossa l'immagine del pezzo mosso si sdoppia e rimane lì 
		per tutta la partita
	✓	EndTurn pulisce le evidenziazioni delle ultime mosse fatte
	✓	quando finisci l'esecuzione di una mossa boostata di un pedone e clicchi su
		un'altro pezzo	dello stesso colore del pedone appena mosso lancia eccezione
	✓	Quando  hai un pezzo potenziato il prezzo non si aggiorna come si deve
	✓	Pezzi mangiati avversario invisibili
	✓	Bottoni non presenti dopo reload
	✓	Con il reload si bugga anche il timer
	✓	Evidenziamento Give Up buttion da ripensare
	✓	Quandoa fai use ability si creano in contemporanea sia i tondini
	✓	Il pulsante use ability rimane interagibile e cliccabile anche 
		se il pezzo si è appena rossi che gialli sulle stesse caselle
	✓	Quando ho un pezzo potenziato e diventa il mio turno diventa
		disponibile l'utilizza abilità anche se selezioni un pezzo non potenziato
	✓	Timer che continua nella schermata di fine gioco
	✓	Quando uno dei due finisce il tempo il backend crasha
	▫	Quando finisci l'esecuzione di una mossa boostata di un pedone e al turno 
		dopo vuoi muovere lo stesso pedone manda eccezione (ma penso sia dovuto al backend) mosso senza voler utilizzare l'abilità
	▫	Quando fai una mossa boostata di un pedone se vuoi muovere un pezzo dopo aver 
		mosso il pedone, che passa dove prima c’era il pedone mi viene fuoir eccezione
		ma in modi casuali non riesco ancora a capire cosa succede
	▫	Timer che parte da solo prima della prima mossa del bianco
	▫	Quando fai reload non segna correttamente i turni
	▫	Ogni volta che entri in playpage si avvia il reload
	▫	Quando vado a promozione con il pedone si oscura tutta la scacchiera 
		e non va più un cazzo
	▫	Il clicked non dovrebbe stare sotto l'evidenziazione di ultima mossa
	▫	Le flag clickedId e lastclicked non dovrebbero restare popolate
	▫	Andare avanti e indietro nelle pagine non funzione quando sei sulla playpage
	▫	Rimangono i pezzi mangiati il playerinfo anche da una partita all'altra se ne
		fai una di seguito all'altra

//TODO FRONTEND - 
	✓	websocket per lo stato online
	✓	history dei match
	✓	reazione del frontend agli errori (es. al login)
	✓	redirection alla pagina login se si prova ad accedere a pagine protette
	✓	pagina di modifica delle info utente
	✓	reset della password (sia dal login page che dalla pagina utente loggato)
	✓	dettagli info sui match
	✓	refactor pagina di gioco, pulsanti con tipi di partite, creazione stanze, sfida amici
	✓	websocket per la partita
	✓	test login e resgiter con OTP e opzioni di toglierlo nelle impostazioni
	▫	info dei profili per le partitre a 4 [MAVI]
	▫	finire l'editing del profilo
	▫	websocket per le notifiche
	▫	pagina della leaderboard
	▫	re-design della home
	▫	update delle preferenze di colore degli utenti
	▫	dettagli info sui match

//NOTE - Testing
	✓	nome utente in grassetto





// NOTE - RIGUARDO IL SALVATAGGIO DELL'IMMAGINE DELL'AVATR
Capisco cosa intendi, ma qui c'è un problema tecnico da chiarire prima di procedere: il browser (quindi il codice Vue/JS lato client) non può scrivere fisicamente file dentro la cartella public/ o assets/ del progetto frontend. Quella cartella, una volta buildata (es. con Vite), diventa un insieme di file statici serviti da un server web — il JS che gira nel browser dell'utente non ha alcun accesso al filesystem del server che ospita il tuo frontend.
Quindi "salvare negli assets del frontend" da JS lato client non è fattibile, a prescindere dal backend che usi. Le uniche vie sono:
----------------------------------------------------------------------------------
1. Opzione A — Il backend salva il file, ma lo serve come statico (soluzione più comune)
Il file viene comunque inviato al backend (con FormData, come nel messaggio precedente), ma il backend:

Lo salva in una cartella pubblica servita staticamente (es. /public/uploads/avatars/ su Express, o storage/app/public su Laravel con symlink).
Restituisce/salva nel DB solo il path relativo o l'URL (es. /uploads/avatars/uuid.png), non il binario.
Il frontend usa quel path per mostrare l'immagine (esattamente come fai già con asset(user.image)).

Questo probabilmente è quello che intendevate: niente blob nel database, solo un path — e infatti è già quello che ti avevo proposto, semplicemente il "salvataggio fisico" avviene sul server, non nel repo del frontend.
----------------------------------------------------------------------------------
2. Opzione B — Un piccolo servizio "media" separato dal backend principale
Se per qualche motivo non volete che sia il backend principale a occuparsi degli upload, potete avere un microservizio/endpoint dedicato solo a ricevere e servire immagini (tipo un mini file-server), che il frontend chiama a parte. Il backend principale continua a salvare solo l'URL restituito da questo servizio.
----------------------------------------------------------------------------------
3. Opzione C — Storage esterno (S3, Cloudinary, ecc.)
Il frontend carica il file direttamente su uno storage esterno (spesso con un URL pre-firmato generato dal backend), e poi manda solo l'URL risultante al backend per salvarlo nel DB. Niente passa "attraverso" il tuo server per il file in sé.

Nessuna di queste comporta scrivere dentro la cartella del progetto Vue in produzione — sarebbe comunque sbagliato architetturalmente, perché ad ogni nuova build/deploy del frontend quella cartella verrebbe rigenerata e perderesti le immagini caricate dagli utenti.
Che backend state usando? Così ti scrivo il codice concreto per l'opzione A, che è quella più vicina a quello che avevate in mente.
		

//NOTE
La api di reload funziona quando lanciata da connessione socket già stabilita
Quando schiaccio ctrl+r sembra che la riconnessione non funzioni correttamente e magari
distruggiamo il websocket male, magari non ci riconnettiamo bene.