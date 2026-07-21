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
	✓ 	aura dei pezzi boostati visibile [LEO] 
	✓ 	end turn, boost e useAbility triggerabili da pulsanti da tastiera [LEO]
	✓ 	bottone di potenziamento clickabile solo durante il second turn 
	▫ 	refactor di archi nel caso la board non esista
	✓ 	non si dovrebbe poter boostare se non hai ancora mosso nessun pezzo
	▫ 	feedback quando il re è sotto scacco, (abbiamo bisogno di una flag oppure 
		usiamo gli enum di errore comuni)
	✓	Far vedere che pezzo hai selezionato [LEO]
	▫ 	quando fai hover sul bottone per boostare il pezzo sarebbe carino poter avere
	  	una preview delle target zones rese visibili sulla scacchiera, si può fare 
	  	una route apposta per chiedere l'update delle target zones di un pezzo specifico
	✓	Si fa fatica a capire di chi è il turno attuale
	✓	orientamento della scacchiera in base al colore dei pezzi del giocatore
	✓	orientamento delle info del giocatore in base al giocatore
	▫	history delle mosse durante la partita
	▫	utilizzo websocket singolo solo per la partita diverso da websocket 
		comunicazione server
	▫	implementare (reload, riaccesso, chiudi e riapri la pagina di gioco) 
		durante la partita
	✓	avviso di quando devi fare end turn più chiaro (?)
	▫	implementare segnali visivi relativi ai turni dei giocatori
	✓		spostamento bottoni
	✓	le mosse dell'avversario sono poco visibili, servirebbero delle animazioni sul
		pezzo mosso oppure un evidenziazione sull'ulitmo pezzo mosso

//FIXME - Bugs
	▫	quando finisci l'esecuzione di una moyour Prisma Client (See: https://pris.ly/d/importing-client)
backend   | ssa boostata di un pedone e clicchi su un'altro pezzo
		dello stesso colore del pedone appena mosso lancia eccezione
	▫	quando finisci l'esecuzione di una mossa boostata di un pedone e al turno dopo vuoi muovere
		lo stesso pedone manda eccezione (ma penso sia dovuto al backend)
	▫	Il pulsante use ability rimane interagibile e cliccabile anche se il pezzo si è appena
		mosso senza voler utilizzare l'abilità

//TODO FRONTEND - 
	✓	websocket per lo stato online
	✓	history dei match
	✓	reazione del frontend agli errori (es. al login)
	✓	redirection alla pagina login se si prova ad accedere a pagine protette
	✓	pagina di modifica delle info utente
	✓	reset della password (sia dal login page che dalla pagina utente loggato)
	✓	dettagli info sui match
	✓	refactor pagina di gioco, pulsanti con tipi di partite, creazione stanze, sfida amici
	✓	websocket per la partita [LEO]
	✓	test login e resgiter con OTP e opzioni di toglierlo nelle impostazioni
	✓	finire l'editing del profilo
	✓	websocket per le notifiche
	▫	re-design della home [MAVI]
	▫	info dei profili per le partitre a 4
	▫	pagina della leaderboard
	▫	update delle preferenze di colore degli utenti
	▫	dettagli info sui match

//NOTE - Testing
	▫	nome utente in grassetto


#test {	  /*hex-code		name					tailwind_code*/
	color: #201e1c;	/*bg_default*/
	color: #181715e8;	/*bord_default*/
	color: #302d2a;	/*bg_second*/
	color: #4e4e4e8c;	/*bord_second*/
	color: #181715;	/*bg_darker*/
	color: #ffffff;	/*text_default*/			/*white*/
	color: #d4d4d8;	/*text_second*/				/*zinc-300*/
	color: #71717b;	/*text_third*/				/*zinc-500*/
	color: #4e4e4e8c;	/*text_last*/
	color: #dcdfe4c0;	/*bg_icons*/

	color: #c41c1c;	/*notif_on*/
	color: #00c950;	/*online*/					/*green-500*/
	color: #00000033;	/*bg_blur*/					/*black/20*/
	color: #882a2a;	/*bg_button*/
	color: #af3d3d;	/*light_button*/
	color: #d1aaaa;	/*active_button*/

	color: #2f1818cc;	/*bg_error*/				/*[#2f1818]/80*/
	color: #ffe2e2;	/*text_error*/				/*red-100*/
	color: #9f07111a;	/*border_error*/			/*red-800/10*/
	color: #fb2c3633;	/*inset_error*/				/*red-500/20*/

	color: #00a63e;	/*win*/						/*green-600*/
	color: #f0fdf4e6;	/*bg_win*/					/*green-50/90*/
	color: #d1d5dc;	/*draw*/					/*gray-300*/
	color: #d1d5dce6;	/*bg_draw*/					/*gray-300/90*/
	color: #fb2c36;	/*lose*/					/*red-500*/
	color: #fef2f2e6;	/*bg_lose*/					/*red-50/90*/

	color: #bedbff;	/*text_tour*/				/*blue-200*/
	color: #51a2ff1a;	/*bg_tour*/					/*blue-400/10*/
	color: #2b80ff33;	/*inset_tour*/				/*blue-500/20*/
	color: #51a2ff33;	/*hover_tour*/				/*blue-400/20*/

	color: #05df721a;	/*bg_accept*/				/*green-400/10*/
	color: #00c95033;	/*inset_accept*/			/*green-500/20*/
	color: #ff64671a;	/*bg_reject*/				/*red-400/10*/
	color: #fb2c3633;	/*inset_reject*/			/*red-500/20*/
	color: #d1d5dc;	/*text_wait*/				/*gray-300*/
	color: #e5e7eb1a;	/*bg_wait*/					/*gray-200/10*/
	color: #d1d5dc33;	/*inset_wait*/				/*gray-300/20*/
	color: #bedbff;	/*text_friend*/				/*blue-200*/
	color: #51a2ff1a;	/*bg_friend*/				/*blue-400/10*/
	color: #2b80ff33;	/*inset_friend*/			/*blue-500/20*/
};