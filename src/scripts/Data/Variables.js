// SECTION - LE VARIABILI GLOBALI
import { boardConverter, getLocalPlayers }	from "../Helper/RenderUtils.js";
import { reactive }							from "vue";
import { clearMatchStorage } 				from "./Archi.js";

/**
 * @typedef {Object} Piece
 * @property {string}  type           Tipo del pezzo (es. "King", "Bastards", ...)
 * @property {string}  team           Squadra del pezzo (es. "white" | "black")
 * @property {boolean} isBoostedBool  Se il pezzo è potenziato
 * @property {number}  price          Costo del potenziamento
 * @property {boolean} dragging       Se il pezzo è in trascinamento
 */

export class Square {
	/**
	 * @param {string}              id
	 * @param {Piece|null}          piece
	 * @param {Iterable<string>}    [targetZones]
	 * @param {Iterable<any>}       [boostedTargetZones]
	 */
	constructor(id, piece, targetZones = [], boostedTargetZones = {}) {
		this.id 				= id;
		this.piece 				= piece;
		this.highlight			= false;
		this.boostedHighlight	= false;
		this.useAbilityBool		= false;	
		this.selected			= false;
		this.inCheck			= false;
		this.clicked			= false;
		this.targetZones		= new Set(targetZones);
		this.boostedTargetZones	= new Map(boostedTargetZones);
	}
}

/**
 * @typedef {Object} DragInfo
 * @property {string}  src         Path dell'immagine del pezzo trascinato
 * @property {number}  size        Lato in px del pezzo trascinato
 * @property {number}  x           Coordinata X del cursore
 * @property {number}  y           Coordinata Y del cursore
 * @property {string}  from        Id della casella di partenza
 * @property {boolean} [hideSource] Se nascondere il pezzo nella casella di partenza
 */

/**
 * @typedef {Object} CapturedCount
 * @property {number} Bastards
 * @property {number} Minotaurus
 * @property {number} Valkirya
 * @property {number} Jester
 * @property {number} Champion
 */

/**
 * @property {string|null}						clickedId			Id della casella cliccata adesso
 * @property {string|null}						lastClickedId		Id della casella cliccata in precedenza
 * @property {boolean}							secondTurn			Se il giocatore ha ancora la seconda parte del turno
 * @property {boolean}							secondMove			Se la mossa in corso è la seconda del turno
 * @property {string}							usingAbility		Tipo del pezzo che sta usando l'abilità ("" = nessuna)
 * @property {boolean}							hasBoost			Se c'è almeno un pezzo potenziabile in board
 * @property {Map<string, Set<string>>|null}	savedBoostedMap		Zone di movimento potenziato salvate per la seconda mossa
 * @property {string|null}						state				Stato della partita lato client (es. "classic" | "reload")
 * @property {DragInfo|null}					drag				Info del pezzo attualmente trascinato
 * @property {string|null}						goatId				Id della casella del Bastards da promuovere
 * @property {string|null}						matchId				Id della partita in corso
 * @property {string|null}						myTeam				Squadra del giocatore locale (es. "white" | "black")
 * @property {string|null}						victory				Squadra vincitrice, null se la partita è in corso
 * @property {string|null}						pending				Variabile utilizzata nel template di actionbuttons per richiesta di giveup o pareggio
 * @property {"sent"|"received"|null}			drawOffer			Trattativa sul pareggio: 'sent' l'ho offerto io, 'received' me l'ha offerto l'avversario
 * @property {boolean}							matchStarted 		Se la partita è iniziata (il timer parte alla prima mossa del bianco)
 * @property {Set<string>}						lastMovesSquares	Id delle caselle coinvolte nell'ultima mossa
 * @property {Function|null}					blinking 			Callback per fermare il lampeggio delle caselle sotto scacco
 * @property {boolean}							aiGame				Flag utilizzata durante il redirect su playpage per sapere se si vuole fare una partita con l'ai
 * @property {Object<string, CapturedCount>} 	capturedP			Pezzi catturati, contati per squadra e per tipo
 */
class metaInfo {
	constructor() {
		this.clickedId			= null;
		this.lastClickedId		= null;
		this.secondTurn			= false;
		this.secondMove			= false;
		this.usingAbility		= "";
		this.hasBoost			= false;
		this.savedBoostedMap	= null;
		this.drag				= null;
		this.goatId				= null;
		this.matchId			= null;
		this.myTeam				= null;
		this.victory			= null;
		this.pending			= null;
		this.drawOffer			= null;
		this.matchStarted		= false;
		this.lastMovesSquares	= new Set();
		this.blinking			= null;
		this.aiGame				= false;
		this.capturedP			= {	white: { Bastards: 0, Minotaurus: 0, Valkirya: 0, Jester: 0, Champion: 0},
									black: { Bastards: 0, Minotaurus: 0, Valkirya: 0, Jester: 0, Champion: 0} };
	}
}

//globale contiene info. riguardante le interazione dello user con la board, utile per il rendering
export let localInfo = reactive(new metaInfo());

//Globale che contiene tutti i dati della partita conservati in locale
export let localMatchState = null;

//Globale della scacchiera con tutti i dati delle caselle messa reactive
/** @type {Map<string, Square>} */
export let localBoard = reactive(new Map());

//Globale array di giocatori che contiene tutti gli oggetti giocatori validi
export let localPlayers = reactive(new Map());

//Funzione reattiva che ricalcola ogni volta che localBoard cambia
export const DOMBoard = () => boardConverter();

export const DOMPlayer = (p) => getLocalPlayers(p);

export const emptyCapturedPieces = () => ({Bastards: 0, Minotaurus: 0, Valkirya: 0, Jester: 0, Champion: 0}); 

//Il giocatore seduto a questo client: quello della squadra che il browser controlla.
export const myPlayer = () => [...localPlayers.values()].find(p => p.team === localInfo.myTeam) ?? null;

//Il giocatore di turno, che sui client avversari NON coincide con myPlayer().
export const currentPlayer = () => [...localPlayers.values()].find(p => p.isPlaying === true) ?? null;

//Il giocatore di questo client ha i punti per potenziare questo pezzo.
export const canAfford = (piece) => {
	const points = myPlayer()?.nPoints;
	return (typeof points === "number" && typeof piece?.price === "number" && points >= piece.price);
};

// Funzioni setter per aggiornare le variabili globali
export function startLocalMatchState(newMatchState) {
	localMatchState = newMatchState;
}


//inizializzazione della variabile localBoard utilizzando la variabile board presente in LocalMatchState
export function initLocalBoard(boardData)
{
	if (!localMatchState)
		throw new Error("[initLocalBoard]: Match non inizializzato: chiama prima initLocalMatchState().");
	localBoard.clear();
	clearMatchStorage();
	localInfo.lastMovesSquares = new Set();
	if (boardData && typeof boardData === 'object') {
		Object.entries(boardData).forEach(([squareId, squareData]) => {

				const targetZones = new Set(Array.isArray(squareData.targetZones)
					? squareData.targetZones
					: [])
				
				const boostedTargetZones = new Map(
				  Object.entries(squareData.boostedTargetZones || {}).map(([key, value]) => {
					// console.log(`key: ${key}, value: ${value}`);
					return [key, new Set(Array.isArray(value) ? value : [])];
				  })
				);

				const square = new Square(
				squareId,
				squareData.piece || null,
				targetZones,
				boostedTargetZones
			);
			localBoard.set(squareId, square);
		});
	}
}

export function getRootDiv() {
	return document.getElementById("board");
}

export const FILES_TWO = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const FILES_FOUR = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
export const HIDDEN = new Set( [ "a14", "b14", "c14", "a13", "b13", "c13", "a12", "b12", "c12",
				 				 "l14", "m14", "n14", "l13", "m13", "n13", "l12", "m12", "n12",
								 "a3", "b3", "c3", "a2", "b2", "c2", "a1", "b1", "c1",
								 "l3", "m3", "n3", "l2", "m2", "n2", "l1", "m1", "n1"] );

export let MACRO = Object ({
	"AUDIO"			: true,
	"DEBUG"			: import.meta.env.DEV,
	//"LOL" | "CLASSIC"
	"AUDIOSET"		: "LOL",
	"MAX_MESSAGES" 	: 100,
	"SERVER_AUTHOR" : "server",
	"MAX_MSG_LEN"	: 200,
});

export const LOLAUDIOPATH = Object.freeze({
	"move":			{ path: new URL("../../assets/audios/moving.mp3",		import.meta.url).href, playing: false },
	"boost":		{ path: new URL("../../assets/audios/boost.mp3",		import.meta.url).href, playing: false },
	"moveboost":	{ path: new URL("../../assets/audios/useAbility.mp3",	import.meta.url).href, playing: false },
	"check":		{ path: new URL("../../assets/audios/tette.mp3",		import.meta.url).href, playing: false },
	"checkmate":	{ path: "",																		playing: false },
	"trans":		{ path: "",																	 	playing: false },
	"endturn":		{ path: new URL("../../assets/audios/endTurn.mp3",		import.meta.url).href, playing: false },
	"giveup":		{ path: "",																	 playing: false },
	"recdraw":		{ path: "",																	 playing: false },
	"askdraw":		{ path: "",																	 playing: false },
});

export const CLASSICAUDIOPATH = Object.freeze({
	"move":			{ path: new URL("", import.meta.url).href, playing: false },
	"boost":		{ path: new URL("", import.meta.url).href, playing: false },
	"moveboost":	{ path: new URL("", import.meta.url).href, playing: false },
	"check":		{ path: new URL("", import.meta.url).href, playing: false },
	"checkmate":	{ path: new URL("", import.meta.url).href, playing: false },
	"trans":		{ path: new URL("", import.meta.url).href, playing: false },
	"endturn":		{ path: new URL("", import.meta.url).href, playing: false },
	"giveup":		{ path: new URL("", import.meta.url).href, playing: false },
	"recdraw":		{ path: new URL("", import.meta.url).href, playing: false },
	"askdraw":		{ path: new URL("", import.meta.url).href, playing: false },
});

export function debug(...args)
{
	if (MACRO.DEBUG)
		console.log(...args);
}

export const ePlaying = Object.freeze({ YES: "yes", NO: "no", UNKNOWN: "unknown" });

export const IMG_PATHS = Object.freeze ({
	"whiteKing" : 		new URL("../../assets/pieces/white/king.png", import.meta.url).href,
	"whiteChampion" : 	new URL("../../assets/pieces/white/queen.png", import.meta.url).href,
	"whiteJester" : 	new URL("../../assets/pieces/white/knight.png", import.meta.url).href,
	"whiteValkirya" : 	new URL("../../assets/pieces/white/bishop.png", import.meta.url).href,
	"whiteMinotaurus" : new URL("../../assets/pieces/white/rook.png", import.meta.url).href,
	"whiteBastards" : 	new URL("../../assets/pieces/white/pawn.png", import.meta.url).href,
	"blackKing" : 		new URL("../../assets/pieces/black/king.png", import.meta.url).href,
	"blackChampion" : 	new URL("../../assets/pieces/black/queen.png", import.meta.url).href,
	"blackJester" : 	new URL("../../assets/pieces/black/knight.png", import.meta.url).href,
	"blackValkirya" : 	new URL("../../assets/pieces/black/bishop.png", import.meta.url).href,
	"blackMinotaurus" : new URL("../../assets/pieces/black/rook.png", import.meta.url).href,
	"blackBastards" : 	new URL("../../assets/pieces/black/pawn.png", import.meta.url).href,
	"yellowKing" : 		new URL("../../assets/pieces/yellow/king.png", import.meta.url).href,
	"yellowChampion" : 	new URL("../../assets/pieces/yellow/queen.png", import.meta.url).href,
	"yellowJester" : 	new URL("../../assets/pieces/yellow/knight.png", import.meta.url).href,
	"yellowValkirya" : 	new URL("../../assets/pieces/yellow/bishop.png", import.meta.url).href,
	"yellowMinotaurus" : new URL("../../assets/pieces/yellow/rook.png", import.meta.url).href,
	"yellowBastards" : 	new URL("../../assets/pieces/yellow/pawn.png", import.meta.url).href,
	"blueKing" : 		new URL("../../assets/pieces/blue/king.png", import.meta.url).href,
	"blueChampion" : 	new URL("../../assets/pieces/blue/queen.png", import.meta.url).href,
	"blueJester" : 		new URL("../../assets/pieces/blue/knight.png", import.meta.url).href,
	"blueValkirya" : 	new URL("../../assets/pieces/blue/bishop.png", import.meta.url).href,
	"blueMinotaurus" : 	new URL("../../assets/pieces/blue/rook.png", import.meta.url).href,
	"blueBastards" : 	new URL("../../assets/pieces/blue/pawn.png", import.meta.url).href,
	"redKing" : 		new URL("../../assets/pieces/red/king.png", import.meta.url).href,
	"redChampion" : 	new URL("../../assets/pieces/red/queen.png", import.meta.url).href,
	"redJester" : 		new URL("../../assets/pieces/red/knight.png", import.meta.url).href,
	"redValkirya" : 	new URL("../../assets/pieces/red/bishop.png", import.meta.url).href,
	"redMinotaurus" : 	new URL("../../assets/pieces/red/rook.png", import.meta.url).href,
	"redBastards" : 	new URL("../../assets/pieces/red/pawn.png", import.meta.url).href,
	"greenKing" : 		new URL("../../assets/pieces/green/king.png", import.meta.url).href,
	"greenChampion" : 	new URL("../../assets/pieces/green/queen.png", import.meta.url).href,
	"greenJester" : 	new URL("../../assets/pieces/green/knight.png", import.meta.url).href,
	"greenValkirya" : 	new URL("../../assets/pieces/green/bishop.png", import.meta.url).href,
	"greenMinotaurus" : new URL("../../assets/pieces/green/rook.png", import.meta.url).href,
	"greenBastards" : 	new URL("../../assets/pieces/green/pawn.png", import.meta.url).href
});

export class matchMakingOpt
{
	/**
	* //FIXME - controllare parametri di cosa ci viene dato
	* @param {matchMakingOpt} options
	*/
	constructor(options)
	{
		/** @type {string} */				this.matchType = "1v1";
		/** @type {string} */				this.roomType = "friendly";
		/** @type {MatchSettings | null} */	this.matchSettings = null;
		if (!options)
			return ;
		this.matchType = options.matchType;
		this.roomType = options.roomType;
		this.matchSettings = options.matchSettings;
	}
}