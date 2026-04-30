//!SECTION FILE CON TUTTE LE VARIABILI GLOBALI
import { boardConverter }	from "../Helper/render_utils";
import { reactive }			from "vue";

class Square {
	constructor(id, piece, targetZones = []) {
		this.id = id;
		this.piece = piece;
		this.highlight = false;
		this.targetZones = new Set(targetZones);
	}
}

//Globale che contiene tutti i dati della partita conservati in locale
let localMatchState = null;

//Globale della scacchiera con tutti i dati delle caselle messa reactive
let localBoard = reactive(new Map());

//Globale array di giocatori che contiene tutti gli oggetti giocatori validi
let localPlayers = reactive(new Map());

//Funzione reattiva che ricalcola ogni volta che localBoard cambia
const DOMBoard = () => boardConverter();

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
				const square = new Square(
				squareId,
				squareData.piece || null,
				squareData.targetZones || []
			);
			localBoard.set(squareId, square);
		});
	}
}

// export function startLocalPlayers(playersData) 
// {
//     localPlayers.clear();
//     if (playersData && typeof playersData === 'object') 
// 	{
//         if (playersData instanceof Map) 
// 		{
//             playersData.forEach((player, key) => {
//                 localPlayers.set(key, player);
//             });
//         } 
// 		else 
// 		{
//             const players_list = ["p1", "p2", "p3", "p4"];
//             players_list.forEach((player) => {
//                 if (Object.prototype.hasOwnProperty.call(playersData, player) && playersData[player] !== null)
//                     localPlayers.set(player, playersData[player]);
//             });
//         }
//     }
// }

export { localMatchState, localBoard, localPlayers, DOMBoard};