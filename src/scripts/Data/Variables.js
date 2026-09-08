// SECTION - LE VARIABILI GLOBALI
import { boardConverter, getLocalPlayers }	from "../Helper/RenderUtils.js";
import { reactive, ref }					from "vue";
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
 * @property {boolean} boosted		Se il pezzo draggato è boostato
 * @property {boolean} armed		Se il pezzo draggato sta usanto abilità
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

export const codexPiece = ref(null);

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

export const isMyTurn = () => myPlayer()?.isPlaying === true;

//Il giocatore di turno, che sui client avversari NON coincide con myPlayer().
export const currentPlayer = () => [...localPlayers.values()].find(p => p.isPlaying === true) ?? null;

//Il giocatore di questo client ha i punti per potenziare questo pezzo.
export const canAfford = (piece) => {
	const points = myPlayer()?.nPoints;
	return (typeof points === "number" && typeof piece?.price === "number" && points >= piece.price);
};

export const isAbilityArmed = (square) => localInfo.usingAbility !== "" && square?.useAbilityBool === true && square?.piece?.isBoostedBool === true;

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
	//"LOL" | "CLASSIC" | "JOJO"
	"AUDIOSET"		: "CLASSIC",
	//"CLASSIC" | "FANCY" | "GOLD" | "HERALD" | "ROYAL" | "BOOSTED"
	"PIECESET"		: "FANCY",
	"BOOSTMORPH"	: true,
	"MAX_MESSAGES" 	: 100,
	"SERVER_AUTHOR" : "server",
	"MAX_MSG_LEN"	: 200,
});

//Elenco finto di modelli AI: con USE_STUB attivo fetchAiModels lo restituisce
//senza interpellare il back, per lavorare sulla PlayPage a server spento.
export const AI_MODELS_STUB = ["giorgio", "giovanna", "giorno giovanna"];
export const USE_STUB = false;

//roba da non suonare sull'ack, o lo suona soketListen
//sull'update della board, o non hanno un suono associato.
export const BOARD_AUDIO = new Set(["move", "armability", "trans", "giveup",
									"moveboost", "history", "simulate_boost"]);

//NOTE - Vite risolve gli asset solo staticamente: si importa tutta la cartella
//audios/ e si sceglie il set a runtime in base a MACRO.AUDIOSET.
const AUDIO_FILES = import.meta.glob("../../assets/audios/*/*.mp3", { eager: true, query: "?url", import: "default" });

const AUDIOSET_DIRS = Object.freeze({ "LOL": "LolSet", "CLASSIC": "ClassicSet" });

//Chiave logica del suono -> nome del file, uguale in ogni set.
const AUDIO_FILENAMES = Object.freeze({
	"move":			"moving",
	"boost":		"boost2",
	"armability":	"useability",
	"check":		"check",
	"lost":			"lost",
	"victory":		"victory",
	"draw":			"draw",
	"trans":		"transform",
	"endturn":		"endturn",
	"giveup":		"giveup",
	"recdraw":		"recdraw",
	"askdraw":		"askdraw",
	"checkboost":	"checkboost",
	"clicked":		"clicked",
	"badmove":		"badmove",
	"capture":		"capture",
	"begin":		"begin",
	"tap":			"buttontap",
});

const AUDIO_VOLUMES = Object.freeze({
	"LolSet": {
		"move":			0.84,
		"boost":		1,
		"armability":	0.77,
		"check":		0.76,
		"lost":			1.0,
		"victory":		0.9,
		"draw":			0.89,
		"trans":		0.8,
		"endturn":		0.89,
		"giveup":		1.0,
		"recdraw":		0.9,
		"askdraw":		0.89,
		"checkboost":	0.79,
		"clicked":		0.79,
		"badmove":		0.95,
		"capture":		0.92,
	},

	"ClassicSet": {
		"begin":		0.51,
		"boost":		0.35,
		"capture":		1.0,
		"draw":			0.57,
		"endturn":		0.57,
		"lost":			1.0,
		"move":			0.59,
		"recdraw":		0.66,
		"tap":			0.5,
		"victory":		1.0,
	},
});

function audioFile(dir, name)
{
	return (AUDIO_FILES[`../../assets/audios/${dir}/${name}.mp3`]);
}

/**
 * Mappa "<chiave>" -> { path, playing, volume } per il set richiesto.
 * I suoni che il set non ha ancora restano fuori dalla mappa: playAudio
 * li segnala in console e tira dritto, come faceva con i path vuoti.
 * @param {string} set
 */
function buildAudioPaths(set)
{
	const dir = AUDIOSET_DIRS[set], volumes = AUDIO_VOLUMES[dir] ?? {}, paths = {};

	if (!dir)
		return (Object.freeze(paths));
	for (const [key, name] of Object.entries(AUDIO_FILENAMES))
	{
		const path = audioFile(dir, name);

		if (path)
			paths[key] = { path, playing: true, volume: volumes[key] ?? 1 };
	}
	return (Object.freeze(paths));
}

export const AUDIO_PATHS = buildAudioPaths(MACRO.AUDIOSET);

export function debug(...args)
{
	if (MACRO.DEBUG)
		console.log(...args);
}

export const ePlaying = Object.freeze({ YES: "yes", NO: "no", UNKNOWN: "unknown" });

//NOTE - ex Common/ENUMS.js: di quel file solo questi tre enum erano usati,
//il resto era una copia morta degli enum del back.
export const eSpecialMoves = Object.freeze({
	NONE: 0,
	CASTLING: 1 << 0,
	TRANSFIGURATION: 1 << 1,
	ENDGAME: 1 << 2,
	CHECK: 1 << 3,
	CHECKMATE: 1 << 4
});

export const eRoomType = Object.freeze({
	PRIVATE: 'private',
	FRIENDLY: 'friendly',
	RANKED: 'ranked',
	ARENA: 'arena',
});

export const eSide = Object.freeze({
	WHITE: 'white',
	BLACK: 'black',
	RANDOM: 'random',
});

//NOTE - Vite risolve gli asset solo staticamente: si importa tutta la cartella
//pieces/ e si sceglie il set a runtime in base a MACRO.PIECESET.
const PIECE_IMAGES = import.meta.glob("../../assets/pieces/*/*/*.png",
									  { eager: true, query: "?url", import: "default" });

const PIECE_FILES = Object.freeze({
	"King"			: "king",
	"Champion"		: "queen",
	"Jester"		: "knight",
	"Valkirya"		: "bishop",
	"Minotaurus"	: "rook",
	"Bastards"		: "pawn",
});

const PIECE_TEAMS = Object.freeze(["white", "black", "yellow", "blue", "red", "green"]);
const PIECESET_FALLBACK = "classic";
const BOOSTED_SET = "boosted";
const BOOSTED_IMG_PATH = buildImgPaths(BOOSTED_SET, null);

function pieceImg(set, team, type)
{
	return (PIECE_IMAGES[`../../assets/pieces/${set}/${team}/${PIECE_FILES[type]}.png`]);
}

/**
 * Mappa "<team><Tipo>" -> url del png, per il set richiesto.
 * Solo classic ha tutti e sei i team: per gli altri set i team mancanti
 * ricadono sul set di fallback invece di restare senza immagine.
 * Con fallback null le caselle mancanti restano "": serve al set boosted,
 * che deve ricadere sul set scelto dall'utente e non su classic.
 * @param {string} set
 * @param {string|null} [fallback]
 */
function buildImgPaths(set, fallback = PIECESET_FALLBACK)
{
	const paths = {}, dir = String(set).toLowerCase();

	for (const team of PIECE_TEAMS)
		for (const type of Object.keys(PIECE_FILES))
			paths[team + type] = pieceImg(dir, team, type)
							  ?? (fallback ? pieceImg(fallback, team, type) : null)
							  ?? "";
	return (Object.freeze(paths));
}

export const IMG_PATHS = buildImgPaths(MACRO.PIECESET);

/**
 * Url dello skin di un pezzo. Con boosted a true e MACRO.BOOSTMORPH attivo
 * usa il set potenziato, ricadendo sul set corrente dove quello manca.
 * Prende team e type sciolti perche' il codex mostra la skin boosted in base
 * al tab selezionato, non allo stato reale del pezzo in board.
 * @param {string} team
 * @param {string} type
 * @param {boolean} boosted
 */
export const skinSrc = (team, type, boosted) => {
	const key = team + type;

	if (MACRO.BOOSTMORPH && boosted)
		return (BOOSTED_IMG_PATH[key] || IMG_PATHS[key] || "");
	return (IMG_PATHS[key] || "");
}

export const pieceSrc = (piece) => piece ? skinSrc(piece.team, piece.type, piece.isBoostedBool) : "";

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