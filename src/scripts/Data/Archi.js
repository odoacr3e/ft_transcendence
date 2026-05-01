import { initLocalBoard, localMatchState, localBoard, localPlayers, startLocalMatchState } from "./Variables.js";

export async function loadReceivedMatch() 
{
	const response = await fetch("/match.json");
	if (!response.ok)
		throw new Error(`Impossibile caricare /match.json: ${response.status}`);

	const match = await response.json();
	return match;
}

export function validateReceivedMatch(rawJson) 
{
	if (!rawJson || typeof rawJson !== "object" || Array.isArray(rawJson))
		throw new Error("Payload non valido: root deve essere un oggetto.");

	const has_p1 = Object.prototype.hasOwnProperty.call(rawJson, "p1");
	const has_p2 = Object.prototype.hasOwnProperty.call(rawJson, "p2");
	const has_p3 = Object.prototype.hasOwnProperty.call(rawJson, "p3");
	const has_p4 = Object.prototype.hasOwnProperty.call(rawJson, "p4");
	const has_board = Object.prototype.hasOwnProperty.call(rawJson, "board");

	if (!has_p1 || !has_p2 || !has_p3 || !has_p4 || !has_board)
		throw new Error("[validateReceivedMatch]: Payload non valido: servono players e board.");

	if (!rawJson.board || typeof rawJson.board !== "object" || Array.isArray(rawJson.board))
		throw new Error("[validateReceivedMatch]: Payload non valido: board deve essere un oggetto mappa.");

	return {
		p1: rawJson.p1,
		p2: rawJson.p2,
		p3: rawJson.p3,
		p4: rawJson.p4,
		board: rawJson.board,
	};
}

export async function initLocalMatchState() 
{
	const raw = await loadReceivedMatch();
	const validated = validateReceivedMatch(raw);
	startLocalMatchState(validated);

	initLocalBoard(localMatchState.board);
	initLocalPlayers();
}

function initLocalPlayers()
{
	const players_list = ["p1", "p2", "p3", "p4"];

	players_list.forEach((player) => {
		const has = Object.prototype.hasOwnProperty.call(localMatchState, player);
	    const wrong_type = typeof localMatchState[player] !== "object";

		if (localMatchState[player] === null)
			return;
	    if (!has)
			throw new Error(`[initLocalPlayers]: Player ${player} object absent!`);
	    if (wrong_type) 
			throw new Error(`[initLocalPlayers]: Player ${player} a wrong type!`);

		localPlayers.set(player, localMatchState[player]);
	})	
}

export function replaceMatchState(nextRaw) 
{
	const validated = validateReceivedMatch(nextRaw);
	startLocalMatchState(validated);

	initLocalBoard();
	initLocalPlayers();
}

export async function updateLocalMatchState(nextMatchState) {
	if (!nextMatchState)
		console.error("[UpdateLocalMatchState]: nextMatchState passed is null!");
  
	try 
	{
		updateLocalBoard(nextMatchState);
		updateLocalPlayers(nextMatchState);
	} 
	catch(err){
    console.error("[updateLocalMatchState]: Errore di update del Match!");
  	}
}

export function updateLocalBoard(changes)
{
	const board = changes.board;

	if (!board) { throw new Error("[updateLocalBoard]: Board expected but no object received!"); }
	if (typeof board !== "object" || Array.isArray(board))
		throw new Error("[updateLocalBoard]: Board format not valid!");

	Object.entries(board).forEach(([squareKey, newState]) => {
	    if (localBoard.has(squareKey))
	        localBoard.set(squareKey, { ...localBoard.get(squareKey), ...newState });
	});

}
//nella funzione sopra viene utilizzato lo spread operator ( { ...localBoard.get(squareKey), ...newState } )
//l'operatore '...' su un oggetto ne espande le proprieta', in modo che in caso di conflitto le
//proprieta' del secondo sovrascrivono quelle del primo

function updateLocalPlayers(changes) 
{
	const players_list = ["p1", "p2", "p3", "p4"];

	players_list.forEach((player) => {
		const has = Object.prototype.hasOwnProperty.call(changes, player);
	    const wrong_type = typeof changes[player] !== "object";

		if (!has || changes[player] === null)
			return;
	    if (wrong_type) 
			throw new Error(`[updateLocalPlayers]: Player ${player} wrong type!`);

		localPlayers.set(player, changes[player]);
	})
}
