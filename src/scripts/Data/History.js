import { reactive } from "vue";

// Questo deve essere l'oggetto che viene restituito come risposta a chiammata su evento history
// rappresenta l'ultimo turno che è stato completato.
// In caso di reload vorrei che il payload di history rappresentasse tutta la partita suddivisa
// in turni così. 
// {
//   "turn": 12, //numero del turno
//   "team": "white", //colore
//   "time": 284, //tempo che è durato il turno
//   "actions": [ //azioni presenti durante il turno in ordine di esecuzione. mossa, (seconda mossa), potenziamento oppure solo giveup, draw, lost.
// 	{
// 		"type": "move",
// 		"counter": 23, 
// 		"piece": "Bastards",
// 		"from": "a4", "to": "c4",
// 		"transformed_into": "Valkirya",
// 		"captured_piece": "Bastards",
// 	},
// 	// { seconda mossa se esiste },
//     { 
// 		"type": "boost",
// 		"counter": 25,
// 		"piece": "Champion",
//     	"from": "f4", "to": "",
// 	}
//   ]
// }

/** @typedef {import("../Helper/Historyutils.js").TurnVM}	TurnVM */
/** @typedef {import("../Helper/Historyutils.js").ActionVM}	ActionVM */

/** @type {Array<TurnVM>} */
export const localHistory = reactive([]);

export function pushTurn(raw)
{
	const turn = normalizeTurn(raw);

	if (!turn)
		return (false);
	const i					= localHistory.findIndex(t => t.turn === turn.turn);
	const empty				= !localHistory.length;
	const newTurnIsToPush	= turn.turn > localHistory[localHistory.length - 1]?.turn;
	if (i !== -1)
		localHistory[i] = turn;
	else if ( empty || newTurnIsToPush )
		localHistory.push(turn);
	else
		localHistory.splice(localHistory.findIndex(t => t.turn > turn.turn), 0, turn);

	return (true);
}

/**
 * @param {Array<*>} list
 */
export function reloadHistory(list)
{
	localHistory.splice(0);
	if (Array.isArray(list))
		list.forEach(pushTurn);
	// console.log(`[History]: caricati ${localHistory.length} turni`);
}

export function clearHistory()
{
	localHistory.splice(0);
}

//SECTION - NORMALIZZAZIONE
//	L'evento non esiste ancora lato back: finché non è testato non mi fido del payload.

/**
 * @param {*} raw
 * @returns {TurnVM|null}
 */
function normalizeTurn(raw)
{
	if (!raw || typeof raw !== "object" || !Number.isInteger(raw.turn) || !Array.isArray(raw.actions))
		return (console.warn("[History]: turno scartato, payload non valido", raw), null);

	return ({
		turn:		raw.turn,
		team:		raw.team ?? "???",
		time:		Number(raw.time) || 0,
		actions:	raw.actions.filter(a => a && a.type).map(normalizeAction),
	});
}

/**
 * @param {*} a
 * @returns {ActionVM}
 */
function normalizeAction(a)
{
	return ({
		type:				a.type,
		counter:			Number.isInteger(a.counter) ? a.counter : null,
		piece:				a.piece ?? "",
		from:				a.from ?? "",
		to:					a.to ?? "",
		transformed_into:	a.transformed_into ?? null,
		captured_piece:		a.captured_piece ?? null,
	});
}