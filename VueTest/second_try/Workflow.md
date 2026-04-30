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
	(sarebbe forse meglio lacorare sulla variabile highlight invece di lavorare direttamente sul DOM? Si potrebbe rendere l'highligth reattivo(Vue) modificando la booleana invece di modifcare il CSS)

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

IF Response === "YAS"
	-> movePiece(from, to)
			-> localBoard.get(fromSquareId).piece = null
			-> localBoard.get(toSquareId).piece = pezzo_mosso
		-> VUE RECTIVITY SI TRIGGERA AAAAAAAAAAAAAAAAAAAA
		-> DOMBoard computed si ricalcola
		-> boardConverter() esegue
		-> ChessBoard.vue re-renderizza

