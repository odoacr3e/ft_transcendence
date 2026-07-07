// SECTION - LE VARIABILI GLOBALI
import { boardConverter, getLocalPlayers }	from "../Helper/RenderUtils.js";
import { reactive }							from "vue";

export class Square {
	constructor(id, piece, targetZones = [], boostedTargetZones = {}) {
		this.id = id;
		this.piece = piece;
		this.highlight = false;
		this.boostedHighlight = false;
		this.useAbilityBool = false;
		this.selected = false;
		this.targetZones = new Set(targetZones);
		this.boostedTargetZones = new Map(boostedTargetZones);
	}
}

class metaInfo {
	constructor() {
		this.clickedId = null;
		this.lastClickedId = null;
		this.secondTurn = false;
		this.secondMove = false;
		this.usingAbility = "";
		this.hasBoost = false;
		this.priceSelected = "...";
		this.savedBoostedMap = null;
		this.dragClone = null;
		this.dropDone = false;
		this.goatId = null;
		this.matchId = null;
		this.myTeam = null;
		this.capturedP = {	white: { Bastards: 0, Minotaurus: 0, Valkirya: 0, Jester: 0, Champion: 0},
							black: { Bastards: 0, Minotaurus: 0, Valkirya: 0, Jester: 0, Champion: 0} };
	}
}

//globale contiene info. riguardante le interazione dello user con la board, utile per il rendering
export let localInfo = reactive(new metaInfo());

//Globale che contiene tutti i dati della partita conservati in locale
export let localMatchState = null;

//Globale della scacchiera con tutti i dati delle caselle messa reactive
export let localBoard = reactive(new Map());

//Globale array di giocatori che contiene tutti gli oggetti giocatori validi
export let localPlayers = reactive(new Map());

//Funzione reattiva che ricalcola ogni volta che localBoard cambia
export const DOMBoard = () => boardConverter();

export const DOMPlayer = (p) => getLocalPlayers(p);

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

export let MACRO = Object ({
	"AUDIO" : false,
});

export const IMG_PATHS = Object.freeze ({
	"whiteKing" : new URL("../../assets/pieces/white/king.png", import.meta.url).href,
	"whiteChampion" : new URL("../../assets/pieces/white/queen.png", import.meta.url).href,
	"whiteJester" : new URL("../../assets/pieces/white/knight.png", import.meta.url).href,
	"whiteValkirya" : new URL("../../assets/pieces/white/bishop.png", import.meta.url).href,
	"whiteMinotaurus" : new URL("../../assets/pieces/white/rook.png", import.meta.url).href,
	"whiteBastards" : new URL("../../assets/pieces/white/pawn.png", import.meta.url).href,
	"blackKing" : new URL("../../assets/pieces/black/king.png", import.meta.url).href,
	"blackChampion" : new URL("../../assets/pieces/black/queen.png", import.meta.url).href,
	"blackJester" : new URL("../../assets/pieces/black/knight.png", import.meta.url).href,
	"blackValkirya" : new URL("../../assets/pieces/black/bishop.png", import.meta.url).href,
	"blackMinotaurus" : new URL("../../assets/pieces/black/rook.png", import.meta.url).href,
	"blackBastards" : new URL("../../assets/pieces/black/pawn.png", import.meta.url).href,
	"yellowKing" : new URL("../../assets/pieces/yellow/king.png", import.meta.url).href,
	"yellowChampion" : new URL("../../assets/pieces/yellow/queen.png", import.meta.url).href,
	"yellowJester" : new URL("../../assets/pieces/yellow/knight.png", import.meta.url).href,
	"yellowValkirya" : new URL("../../assets/pieces/yellow/bishop.png", import.meta.url).href,
	"yellowMinotaurus" : new URL("../../assets/pieces/yellow/rook.png", import.meta.url).href,
	"yellowBastards" : new URL("../../assets/pieces/yellow/pawn.png", import.meta.url).href,
	"blueKing" : new URL("../../assets/pieces/blue/king.png", import.meta.url).href,
	"blueChampion" : new URL("../../assets/pieces/blue/queen.png", import.meta.url).href,
	"blueJester" : new URL("../../assets/pieces/blue/knight.png", import.meta.url).href,
	"blueValkirya" : new URL("../../assets/pieces/blue/bishop.png", import.meta.url).href,
	"blueMinotaurus" : new URL("../../assets/pieces/blue/rook.png", import.meta.url).href,
	"blueBastards" : new URL("../../assets/pieces/blue/pawn.png", import.meta.url).href,
	"redKing" : new URL("../../assets/pieces/red/king.png", import.meta.url).href,
	"redChampion" : new URL("../../assets/pieces/red/queen.png", import.meta.url).href,
	"redJester" : new URL("../../assets/pieces/red/knight.png", import.meta.url).href,
	"redValkirya" : new URL("../../assets/pieces/red/bishop.png", import.meta.url).href,
	"redMinotaurus" : new URL("../../assets/pieces/red/rook.png", import.meta.url).href,
	"redBastards" : new URL("../../assets/pieces/red/pawn.png", import.meta.url).href,
	"greenKing" : new URL("../../assets/pieces/green/king.png", import.meta.url).href,
	"greenChampion" : new URL("../../assets/pieces/green/queen.png", import.meta.url).href,
	"greenJester" : new URL("../../assets/pieces/green/knight.png", import.meta.url).href,
	"greenValkirya" : new URL("../../assets/pieces/green/bishop.png", import.meta.url).href,
	"greenMinotaurus" : new URL("../../assets/pieces/green/rook.png", import.meta.url).href,
	"greenBastards" : new URL("../../assets/pieces/green/pawn.png", import.meta.url).href
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