// SECTION - LE VARIABILI GLOBALI
// import { boardConverter, getLocalPlayers }	from "src/scripts/Helper/RenderUtils";
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

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

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
	"blackBastards" : new URL("../../assets/pieces/black/pawn.png", import.meta.url).href
});
