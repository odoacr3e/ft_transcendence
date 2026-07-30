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
		se il pezzo si è appena mosso
	✓	Quando ho un pezzo potenziato e diventa il mio turno diventa
		disponibile l'utilizza abilità anche se selezioni un pezzo non potenziato
	✓	Timer che continua nella schermata di fine gioco
	✓	Quando uno dei due finisce il tempo il backend crasha
	✓	Il clicked non dovrebbe stare sotto l'evidenziazione di ultima mossa
	✓	Le flag clickedId e lastclicked non dovrebbero restare popolate
	✓	Timer che parte da solo prima della prima mossa del bianco
	▫	Quando finisci l'esecuzione di una mossa boostata di un pedone e al turno 
		dopo vuoi muovere lo stesso pedone manda eccezione (ma penso sia dovuto al backend) mosso senza voler utilizzare l'abilità
	▫	Quando fai una mossa boostata di un pedone se vuoi muovere un pezzo dopo aver 
		mosso il pedone, che passa dove prima c’era il pedone mi viene fuoir eccezione
		ma in modi casuali non riesco ancora a capire cosa succede
	▫	Quando fai reload non segna correttamente i turni
	▫	Ogni volta che entri in playpage si avvia il reload
	▫	Quando vado a promozione con il pedone si oscura tutta la scacchiera 
		e non va più un cazzo
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



//SECTION - Dark-Themes

//ANCHOR - Dark-Red
#Dark-Red {/*hex-code		name				tailwind_code*/
	color: #201e1c;		/*bg_default*/
	color: #181715e8;	/*bord_default*/
	color: #302d2a;		/*bg_second*/
	color: #4e4e4e8c;	/*bord_second*/
	color: #181715;		/*bg_darker*/
	color: #ffffff;		/*text_default*/		/*white*/
	color: #d4d4d8;		/*text_second*/			/*zinc-300*/
	color: #71717b;		/*text_third*/			/*zinc-500*/
	color: #4e4e4e8c;	/*text_last*/
	color: #dcdfe4c0;	/*bg_icons*/

	color: #c41c1c;		/*notif_on*/
	color: #00c950;		/*online*/				/*green-500*/
	color: #00000033;	/*bg_blur*/				/*black/20*/
	color: #882a2a;		/*main-color*/
	color: #af3d3d;		/*light_button*/
	color: #d1aaaa;		/*active_button*/

	color: #2f1818cc;	/*bg_error*/			/*[#2f1818]/80*/
	color: #ffe2e2;		/*text_error*/			/*red-100*/
	color: #9f07111a;	/*border_error*/		/*red-800/10*/
	color: #fb2c3633;	/*inset_error*/			/*red-500/20*/

	color: #00a63e;		/*win*/					/*green-600*/
	color: #f0fdf4e6;	/*bg_win*/				/*green-50/90*/
	color: #d1d5dc;		/*draw*/				/*gray-300*/
	color: #d1d5dce6;	/*bg_draw*/				/*gray-300/90*/
	color: #fb2c36;		/*lose*/				/*red-500*/
	color: #fef2f2e6;	/*bg_lose*/				/*red-50/90*/

	color: #51a2ff1a;	/*bg_tour*/				/*blue-400/10*/
	color: #bedbff;		/*text_tour*/			/*blue-200*/
	color: #2b80ff33;	/*inset_tour*/			/*blue-500/20*/
	color: #51a2ff33;	/*hover_tour*/			/*blue-400/20*/

	color: #05df721a;	/*bg_accept*/			/*green-400/10*/
	color: #00c95033;	/*inset_accept*/		/*green-500/20*/
	color: #ff64671a;	/*bg_reject*/			/*red-400/10*/
	color: #fb2c3633;	/*inset_reject*/		/*red-500/20*/

	color: #e5e7eb1a;	/*bg_wait*/				/*gray-200/10*/
	color: #d1d5dc;		/*text_wait*/			/*gray-300*/
	color: #d1d5dc33;	/*inset_wait*/			/*gray-300/20*/
	color: #bedbff;		/*text_friend*/			/*blue-200*/
	color: #51a2ff1a;	/*bg_friend*/			/*blue-400/10*/
	color: #2b80ff33;	/*inset_friend*/		/*blue-500/20*/
};

//ANCHOR - Dark-Blue
#Dark-Blue {/*hex-code		name				tailwind_code*/
	color: #1d1d21;		/*bg_default*/
	color: #16161ae8;	/*bord_default*/
	color: #2a2b30;		/*bg_second*/
	color: #4e4e4e8c;	/*bord_second*/
	color: #16161a;		/*bg_darker*/
	color: #ffffff;		/*text_default*/			/*white*/
	color: #d4d4d8;		/*text_second*/				/*zinc-300*/
	color: #71717b;		/*text_third*/				/*zinc-500*/
	color: #4e4e4e8c;	/*text_last*/
	color: #dcdfe4c0;	/*bg_icons*/

	color: #c41c1c;		/*notif_on*/
	color: #00c950;		/*online*/					/*green-500*/
	color: #00000033;	/*bg_blur*/					/*black/20*/
	color: #2a6287;		/*main-color*/
	color: #3e82b0;		/*light_button*/
	color: #a9c9de;		/*active_button*/

	color: #17252ecc;	/*bg_error*/				/*[#17252e]/80*/
	color: #dbeafe;		/*text_error*/				/*blue-100*/
	color: #193cb81a;	/*border_error*/			/*blue-800/10*/
	color: #2b80ff33;	/*inset_error*/				/*blue-500/20*/

	color: #00a63e;		/*win*/						/*green-600*/
	color: #f0fdf4e6;	/*bg_win*/					/*green-50/90*/
	color: #d1d5dc;		/*draw*/					/*gray-300*/
	color: #d1d5dce6;	/*bg_draw*/					/*gray-300/90*/
	color: #fb2c36;		/*lose*/					/*red-500*/
	color: #fef2f2e6;	/*bg_lose*/					/*red-50/90*/

	color: #bedbff;		/*text_tour*/         		/*blue-200*/
	color: #51a2ff1a;	/*bg_tour*/			 		/*blue-400/10*/
	color: #2b80ff33;	/*inset_tour*/        		/*blue-500/20*/
	color: #51a2ff33;	/*hover_tour*/        		/*blue-400/20*/

	color: #05df721a;	/*bg_accept*/         		/*green-400/10*/
	color: #00c95033;	/*inset_accept*/      		/*green-500/20*/
	color: #ff64671a;	/*bg_reject*/         		/*red-400/10*/
	color: #fb2c3633;	/*inset_reject*/      		/*red-500/20*/
	color: #d1d5dc;		/*text_wait*/         		/*gray-300*/
	color: #e5e7eb1a;	/*bg_wait*/			 		/*gray-200/10*/
	color: #d1d5dc33;	/*inset_wait*/        		/*gray-300/20*/
	color: #bedbff;		/*text_friend*/       		/*blue-200*/
	color: #51a2ff1a;	/*bg_friend*/         		/*blue-400/10*/
	color: #2b80ff33;	/*inset_friend*/      		/*blue-500/20*/
};

//ANCHOR - Dark-Green
#Dark-Green {/*hex-code		name				tailwind_code*/
    color: #1d211f;     /*bg_default*/
    color: #161917e8;   /*bord_default*/
    color: #2a302d;     /*bg_second*/
    color: #4e4e4e8c;   /*bord_second*/
    color: #161917;     /*bg_darker*/
    color: #ffffff;     /*text_default*/			/*white*/
    color: #d4d4d8;     /*text_second*/				/*zinc-300*/
    color: #71717b;     /*text_third*/				/*zinc-500*/
    color: #4e4e4e8c;   /*text_last*/
    color: #dcdfe4c0;   /*bg_icons*/

    color: #c41c1c;     /*notif_on*/
    color: #00c950;     /*online*/					/*green-500*/
    color: #00000033;   /*bg_blur*/					/*black/20*/
    color: #2d872a;     /*main-color*/
    color: #41b03e;     /*light_button*/
    color: #aadba8;     /*active_button*/

    color: #182e17cc;   /*bg_error*/				/*[#182e17]/80*/
    color: #dcfce7;     /*text_error*/				/*green-100*/
    color: #0166301a;   /*border_error*/			/*green-800/10*/
    color: #00c95033;   /*inset_error*/				/*green-500/20*/

    color: #00a63e;     /*win*/						/*green-600*/
    color: #f0fdf4e6;   /*bg_win*/					/*green-50/90*/
    color: #d1d5dc;     /*draw*/					/*gray-300*/
    color: #d1d5dce6;   /*bg_draw*/					/*gray-300/90*/
    color: #fb2c36;     /*lose*/					/*red-500*/
    color: #fef2f2e6;   /*bg_lose*/					/*red-50/90*/

    color: #bedbff;     /*text_tour*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_tour*/					/*blue-400/10*/
    color: #2b80ff33;   /*inset_tour*/				/*blue-500/20*/
    color: #51a2ff33;   /*hover_tour*/				/*blue-400/20*/

    color: #05df721a;   /*bg_accept*/				/*green-400/10*/
    color: #00c95033;   /*inset_accept*/			/*green-500/20*/
    color: #ff64671a;   /*bg_reject*/				/*red-400/10*/
    color: #fb2c3633;   /*inset_reject*/			/*red-500/20*/
    color: #d1d5dc;     /*text_wait*/				/*gray-300*/
    color: #e5e7eb1a;   /*bg_wait*/					/*gray-200/10*/
    color: #d1d5dc33;   /*inset_wait*/				/*gray-300/20*/
    color: #bedbff;     /*text_friend*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_friend*/				/*blue-400/10*/
    color: #2b80ff33;   /*inset_friend*/			/*blue-500/20*/
};

//ANCHOR - Dark-Yellow
#Dark-Yellow {/*hex-code	name					tailwind_code*/
    color: #20211d;     /*bg_default*/
    color: #181916e8;   /*bord_default*/
    color: #2f302a;     /*bg_second*/
    color: #4e4e4e8c;   /*bord_second*/
    color: #181916;     /*bg_darker*/
    color: #ffffff;     /*text_default*/			/*white*/
    color: #d4d4d8;     /*text_second*/				/*zinc-300*/
    color: #71717b;     /*text_third*/				/*zinc-500*/
    color: #4e4e4e8c;   /*text_last*/
    color: #dcdfe4c0;   /*bg_icons*/

    color: #c41c1c;     /*notif_on*/
    color: #00c950;     /*online*/					/*green-500*/
    color: #00000033;   /*bg_blur*/					/*black/20*/
    color: #87712a;     /*main-color*/
    color: #b0953e;     /*light_button*/
    color: #dbcfa8;     /*active_button*/

    color: #2e2917cc;   /*bg_error*/				/*[#2e2917]/80*/
    color: #fef9c2;     /*text_error*/				/*yellow-100*/
    color: #894b001a;   /*border_error*/			/*yellow-800/10*/
    color: #f0b00033;   /*inset_error*/				/*yellow-500/20*/

    color: #00a63e;     /*win*/						/*green-600*/
    color: #f0fdf4e6;   /*bg_win*/					/*green-50/90*/
    color: #d1d5dc;     /*draw*/					/*gray-300*/
    color: #d1d5dce6;   /*bg_draw*/					/*gray-300/90*/
    color: #fb2c36;     /*lose*/					/*red-500*/
    color: #fef2f2e6;   /*bg_lose*/					/*red-50/90*/

    color: #bedbff;     /*text_tour*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_tour*/					/*blue-400/10*/
    color: #2b80ff33;   /*inset_tour*/				/*blue-500/20*/
    color: #51a2ff33;   /*hover_tour*/				/*blue-400/20*/

    color: #05df721a;   /*bg_accept*/				/*green-400/10*/
    color: #00c95033;   /*inset_accept*/			/*green-500/20*/
    color: #ff64671a;   /*bg_reject*/				/*red-400/10*/
    color: #fb2c3633;   /*inset_reject*/			/*red-500/20*/
    color: #d1d5dc;     /*text_wait*/				/*gray-300*/
    color: #e5e7eb1a;   /*bg_wait*/					/*gray-200/10*/
    color: #d1d5dc33;   /*inset_wait*/				/*gray-300/20*/
    color: #bedbff;     /*text_friend*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_friend*/				/*blue-400/10*/
    color: #2b80ff33;   /*inset_friend*/			/*blue-500/20*/
};

//!SECTION

//SECTION - Light-Themes

//ANCHOR - Light-Red
#Light-Red {/*hex-code		name					tailwind_code*/
    color: #beb9b5;     /*bg_default*/
    color: #8f8b88e8;   /*bord_default*/
    color: #d9d6d3;     /*bg_second*/
    color: #4e4e4e8c;   /*bord_second*/
    color: #8f8b88;     /*bg_darker*/
    color: #201e1c;     /*text_default*/			/*carbon-black (?)*/
    color: #3f3f46;     /*text_second*/				/*zinc-700 (?)*/
    color: #52525b;     /*text_third*/				/*zinc-600 (?)*/
    color: #4e4e4e8c;   /*text_last*/
    color: #3f3f46c0;   /*bg_icons*/				/*zinc-700/75 (?)*/

    color: #c41c1c;     /*notif_on*/
    color: #00c950;     /*online*/					/*green-500*/
    color: #00000033;   /*bg_blur*/					/*black/20*/
    color: #c54444;     /*main-color*/
    color: #c55959;     /*light_button*/
    color: #e2acac;     /*active_button*/

    color: #6b3838cc;   /*bg_error*/				/*[#6b3838]/80*/
    color: #ffe2e2;     /*text_error*/				/*red-100*/
    color: #9f07111a;   /*border_error*/			/*red-800/10*/
    color: #fb2c3633;   /*inset_error*/				/*red-500/20*/

    color: #00a63e;     /*win*/						/*green-600*/
    color: #f0fdf4e6;   /*bg_win*/					/*green-50/90*/
    color: #d1d5dc;     /*draw*/					/*gray-300*/
    color: #d1d5dce6;   /*bg_draw*/					/*gray-300/90*/
    color: #fb2c36;     /*lose*/					/*red-500*/
    color: #fef2f2e6;   /*bg_lose*/					/*red-50/90*/

    color: #bedbff;     /*text_tour*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_tour*/					/*blue-400/10*/
    color: #2b80ff33;   /*inset_tour*/				/*blue-500/20*/
    color: #51a2ff33;   /*hover_tour*/				/*blue-400/20*/

    color: #05df721a;   /*bg_accept*/				/*green-400/10*/
    color: #00c95033;   /*inset_accept*/			/*green-500/20*/
    color: #ff64671a;   /*bg_reject*/				/*red-400/10*/
    color: #fb2c3633;   /*inset_reject*/			/*red-500/20*/
    color: #d1d5dc;     /*text_wait*/				/*gray-300*/
    color: #e5e7eb1a;   /*bg_wait*/					/*gray-200/10*/
    color: #d1d5dc33;   /*inset_wait*/				/*gray-300/20*/
    color: #bedbff;     /*text_friend				/*blue-200*/
    color: #51a2ff1a;   /*bg_friend*/				/*blue-400/10*/
    color: #2b80ff33;   /*inset_friend*/			/*blue-500/20*/
};

//ANCHOR - Light-Blue
#Light-Blue {/*hex-code		name					tailwind_code*/
    color: #bebec5;     /*bg_default*/
    color: #8f8f94e8;   /*bord_default*/
    color: #d3d5d9;     /*bg_second*/
    color: #4e4e4e8c;   /*bord_second*/
    color: #8f8f94;     /*bg_darker*/
    color: #201e1c;     /*text_default*/			/*carbon-black — invertito per contrasto*/
    color: #3f3f46;     /*text_second*/				/*zinc-700*/
    color: #52525b;     /*text_third*/				/*zinc-600*/
    color: #4e4e4e8c;   /*text_last*/
    color: #3f3f46c0;   /*bg_icons*/				/*invertito per contrasto*/

    color: #c41c1c;     /*notif_on*/
    color: #00c950;     /*online*/					/*green-500*/
    color: #00000033;   /*bg_blur*/					/*black/20*/
    color: #4494c5;     /*main-color*/
    color: #5a9bc4;     /*light_button*/
    color: #adcde2;     /*active_button*/

    color: #37586dcc;   /*bg_error*/				/*[#37586d]/80*/
    color: #dbeafe;		/*text_error*/				/*blue-100*/
	color: #193cb81a;	/*border_error*/			/*blue-800/10*/
	color: #2b80ff33;	/*inset_error*/				/*blue-500/20*/

    color: #00a63e;     /*win*/						/*green-600*/
    color: #f0fdf4e6;   /*bg_win*/					/*green-50/90*/
    color: #d1d5dc;     /*draw*/					/*gray-300*/
    color: #d1d5dce6;   /*bg_draw*/					/*gray-300/90*/
    color: #fb2c36;     /*lose*/					/*red-500*/
    color: #fef2f2e6;   /*bg_lose*/					/*red-50/90*/

    color: #bedbff;     /*text_tour*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_tour*/					/*blue-400/10*/
    color: #2b80ff33;   /*inset_tour*/				/*blue-500/20*/
    color: #51a2ff33;   /*hover_tour*/				/*blue-400/20*/

    color: #05df721a;   /*bg_accept*/				/*green-400/10*/
    color: #00c95033;   /*inset_accept*/			/*green-500/20*/
    color: #ff64671a;   /*bg_reject*/				/*red-400/10*/
    color: #fb2c3633;   /*inset_reject*/			/*red-500/20*/
    color: #d1d5dc;     /*text_wait*/				/*gray-300*/
    color: #e5e7eb1a;   /*bg_wait*/					/*gray-200/10*/
    color: #d1d5dc33;   /*inset_wait*/				/*gray-300/20*/
    color: #bedbff;     /*text_friend*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_friend*/				/*blue-400/10*/
    color: #2b80ff33;   /*inset_friend*/			/*blue-500/20*/
};

//ANCHOR - Light-Green
#Light-Green {/*hex-code	name					tailwind_code*/
    color: #bfc6c2;     /*bg_default*/
    color: #90968fe8;   /*bord_default*/
    color: #d4d9d7;     /*bg_second*/
    color: #4e4e4e8c;   /*bord_second*/
    color: #90968f;     /*bg_darker*/
    color: #201e1c;     /*text_default*/			/*carbon-black — invertito per contrasto*/
    color: #3f3f46;     /*text_second*/				/*zinc-700*/
    color: #52525b;     /*text_third*/				/*zinc-600*/
    color: #4e4e4e8c;   /*text_last*/
    color: #3f3f46c0;   /*bg_icons*/				/*invertito per contrasto*/

    color: #c41c1c;     /*notif_on*/
    color: #00c950;     /*online*/					/*green-500*/
    color: #00000033;   /*bg_blur*/					/*black/20*/
    color: #46c544;     /*main-color*/
    color: #5dc559;     /*light_button*/
    color: #b6e6b4;     /*active_button*/

    color: #396d37cc;   /*bg_error*/				/*[#396d37]/80*/
    color: #dcfce7;     /*text_error*/				/*green-100*/
    color: #0166301a;   /*border_error*/			/*green-800/10*/
    color: #00c95033;   /*inset_error*/				/*green-500/20*/

    color: #00a63e;     /*win*/						/*green-600*/
    color: #f0fdf4e6;   /*bg_win*/					/*green-50/90*/
    color: #d1d5dc;     /*draw*/					/*gray-300*/
    color: #d1d5dce6;   /*bg_draw*/					/*gray-300/90*/
    color: #fb2c36;     /*lose*/					/*red-500*/
    color: #fef2f2e6;   /*bg_lose*/					/*red-50/90*/

    color: #bedbff;     /*text_tour*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_tour*/					/*blue-400/10*/
    color: #2b80ff33;   /*inset_tour*/				/*blue-500/20*/
    color: #51a2ff33;   /*hover_tour*/				/*blue-400/20*/

    color: #05df721a;   /*bg_accept*/				/*green-400/10*/
    color: #00c95033;   /*inset_accept*/			/*green-500/20*/
    color: #ff64671a;   /*bg_reject*/				/*red-400/10*/
    color: #fb2c3633;   /*inset_reject*/			/*red-500/20*/
    color: #d1d5dc;     /*text_wait*/				/*gray-300*/
    color: #e5e7eb1a;   /*bg_wait*/					/*gray-200/10*/
    color: #d1d5dc33;   /*inset_wait*/				/*gray-300/20*/
    color: #bedbff;     /*text_friend*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_friend*/				/*blue-400/10*/
    color: #2b80ff33;   /*inset_friend*/			/*blue-500/20*/
};

//ANCHOR - Light-Yellow
#Light-Yellow {/*hex-code	name                    tailwind_code*/
    color: #bec0b8;     /*bg_default*/
    color: #8f918be8;   /*bord_default*/
    color: #d8d9d3;     /*bg_second*/
    color: #4e4e4e8c;   /*bord_second*/
    color: #8f918b;     /*bg_darker*/
    color: #201e1c;     /*text_default*/			/*carbon-black — invertito per contrasto*/
    color: #3f3f46;     /*text_second*/            	/*zinc-700*/
    color: #52525b;     /*text_third*/             	/*zinc-600*/
    color: #4e4e4e8c;   /*text_last*/
    color: #3f3f46c0;   /*bg_icons*/				/*invertito per contrasto*/

    color: #c41c1c;     /*notif_on*/
    color: #00c950;     /*online*/					/*green-500*/
    color: #00000033;   /*bg_blur*/					/*black/20*/
    color: #c7a643;     /*main-color*/
    color: #c5ac59;     /*light_button*/
    color: #e6d6ac;     /*active_button*/

    color: #6d6237cc;   /*bg_error*/                /*[#6d6237]/80*/
    color: #fef9c2;     /*text_error*/				/*yellow-100*/
    color: #894b001a;   /*border_error*/			/*yellow-800/10*/
    color: #f0b00033;   /*inset_error*/				/*yellow-500/20*/

    color: #00a63e;     /*win*/						/*green-600*/
    color: #f0fdf4e6;   /*bg_win*/					/*green-50/90*/
    color: #d1d5dc;     /*draw*/					/*gray-300*/
    color: #d1d5dce6;   /*bg_draw*/					/*gray-300/90*/
    color: #fb2c36;     /*lose*/					/*red-500*/
    color: #fef2f2e6;   /*bg_lose*/					/*red-50/90*/

    color: #bedbff;     /*text_tour*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_tour*/					/*blue-400/10*/
    color: #2b80ff33;   /*inset_tour*/				/*blue-500/20*/
    color: #51a2ff33;   /*hover_tour*/				/*blue-400/20*/

    color: #05df721a;   /*bg_accept*/				/*green-400/10*/
    color: #00c95033;   /*inset_accept*/			/*green-500/20*/
    color: #ff64671a;   /*bg_reject*/				/*red-400/10*/
    color: #fb2c3633;   /*inset_reject*/			/*red-500/20*/
    color: #d1d5dc;     /*text_wait*/				/*gray-300*/
    color: #e5e7eb1a;   /*bg_wait*/					/*gray-200/10*/
    color: #d1d5dc33;   /*inset_wait*/				/*gray-300/20*/
    color: #bedbff;     /*text_friend*/				/*blue-200*/
    color: #51a2ff1a;   /*bg_friend*/				/*blue-400/10*/
    color: #2b80ff33;   /*inset_friend*/			/*blue-500/20*/
};

//!SECTION