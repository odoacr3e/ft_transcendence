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

Game.vue (src/views/Game.vue)
	->	CHIAMA (initMatchstate()) NEL (noMountedHook()) 

initLocalMatchState() (src/scripts/Data/Game.js)
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
			✓ valkiaria
			✓ campione
			✓ re
	✓ aura dei pezzi boostati visibile [LEO] 
	▫ end turn, boost e useAbility triggerabili da pulsanti da tastiera [LEO]
	▫ bottone di potenziamento clickabile solo durante il second turn 
	▫ refactor di archi nel caso la board non esista
	▫ non si dovrebbe poter boostare se non hai ancora mosso nessun pezzo
	▫ feedback quando il re è sotto scacco, (abbiamo bisogno di una flag oppure usiamo gli enum di 
	  errore comuni)
	▫ quando fai hover sul bottone per boostare il pezzo sarebbe carino poter avere
	  una preview delle target zones rese visibili sulla scacchiera, si può fare una route apposta per chiedere 
	  l'update delle target zones di un pezzo specifico
	▫ Si fa fatica a capire di chi è il turno attuale
	? orientamento della scacchiera in base al colore dei pezzi del giocatore

//FIXME - Bugs
	▫	quando finisci l'esecuzione di una mossa boostata di un pedone e clicchi su un'altro pezzo
		dello stesso colore del pedone appena mosso lancia eccezione
	▫	quando finisci l'esecuzione di una mossa boostata di un pedone e al turno dopo vuoi muovere
		lo stesso pedone manda eccezione (ma penso sia dovuto al backend)
	▫	Il pulsante use ability rimane interagibile e cliccabile anche se il pezzo si è appena
		mosso senza voler utilizzare l'abilità

//TODO FRONTEND - 
	✓	websocket per lo stato online
	✓	history dei match
	▫	refactor pagina di gioco, pulsanti con tipi di partite, creazione stanze, sfida amici [LEO]
	▫	reazione del frontend agli errori (es. al login) [MAVI]
	▫	redirection alla pagina login se si prova ad accedere a pagine protette
	▫	dettagli info sui match
	▫	pagina di modifica delle info utente
	▫	reset della password (sia dal login page che dalla pagina utente loggato)
	▫	websocket per le notifiche
	▫	pagina della leaderboard
	▫	history delle mosse durante la partita (?)
	▫	info dei profili per le partitre a 4
	▫	re-design della home
	▫	websocket per la partita --> in attesa di sviluppo backend