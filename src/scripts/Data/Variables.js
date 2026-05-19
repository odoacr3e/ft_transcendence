//!SECTION FILE CON TUTTE LE VARIABILI GLOBALI
import { boardConverter, getLocalPlayers }	from "@/scripts/Helper/RenderUtils";
import { reactive }							from "vue";

class Square {
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
		this.hasBoost = false;
		this.priceSelected = "...";
		this.savedBoostedMap = null;
		this.dragClone = null;
		this.dropDone = false;
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

//inizializzazione della variabile localBoard utilizzando la variabile localMatchState
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
