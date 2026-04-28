//!SECTION FILE CON TUTTE LE VARIABILI GLOBALI
import { reactive } from "vue";
import { boardConverter } from "../Helper/render_utils";

class Square {
	constructor(color, id, piece, targetZones = [], dangerZones = []) {
		this.color = color;
		this.id = id;
		this.piece = piece;
		this.highlight = false;
		this.targetZones = new Set(targetZones);
		this.dangerZones = new Set(dangerZones);
	}
}

function getSquareColor(rowId, colIndex) {
	return (rowId + colIndex) % 2 === 0 ? "white" : "black";
}

//Globale che contiene tutti i dati della partita conservati in locale
let localMatchState = null; 	

//Globale della scacchiera con tutti i dati delle caselle messa reactive
let localBoard = reactive(new Map());			

//Globale array di giocatori che contiene tutti gli oggetti giocatori validi
let localPlayers = new Map();	

//Funzione reattiva che ricalcola ogni volta che localBoard cambia
const DOMBoard = () => boardConverter();

// Funzioni setter per aggiornare le variabili globali
export function setLocalMatchState(newMatchState) {
	localMatchState = newMatchState;
}

export function setLocalBoard(boardData) 
{
	localBoard.clear();
	if (boardData && typeof boardData === 'object') {
		Object.entries(boardData).forEach(([squareId, squareData]) => {
			const row = parseInt(squareId[1]);
			const col = squareId.charCodeAt(0) - 97;
			const color = getSquareColor(row, col);
			
			const square = new Square(
				color,
				squareId,
				squareData.piece || null,
				squareData.targetZones || [],
				squareData.dangerZones || []
			);
			localBoard.set(squareId, square);
		});
	}
}

export function setLocalPlayers(playersData) 
{
    localPlayers.clear();
    if (playersData && typeof playersData === 'object') 
	{
        if (playersData instanceof Map) 
		{
            playersData.forEach((player, key) => {
                localPlayers.set(key, player);
            });
        } 
		else 
		{
            const players_list = ["p1", "p2", "p3", "p4"];
            players_list.forEach((player) => {
                if (Object.prototype.hasOwnProperty.call(playersData, player) && playersData[player] !== null)
                    localPlayers.set(player, playersData[player]);
            });
        }
    }
}

export { localMatchState, localBoard, localPlayers, DOMBoard};