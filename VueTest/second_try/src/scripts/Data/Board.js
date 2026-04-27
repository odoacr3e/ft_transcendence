import { FILES } from "../Helper/constants";

let localMatchState = null;
let localBoard = null;
let localPlayers = new Map();

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
	localMatchState = validated;

	initLocalBoard();
	initLocalPlayers();
}

export function initLocalBoard()
{
	if (!localMatchState)
		throw new Error("[initLocalBoard]: Match non inizializzato: chiama prima initLocalMatchState().");
	localBoard = new Map(Object.entries(localMatchState.board));
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
	localMatchState = validated;

	initLocalBoard();
	initLocalPlayers();

}

export async function updateLocalMatchState()
{
	const nextMatchState = await loadReceivedMatch();

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
	const has_not_board = !changes.board;
	const board_not_valid = typeof changes.board !== "object" || Array.isArray(changes.board);

	if (has_not_board)
		throw new Error("[updateLocalBoard]: Board expected but no object received!");
	if (board_not_valid)
		throw new Error("[updateLocalBoard]: Board format not valid!");

	Object.entries(changes.board).forEach(([square, newState]) => {
		localBoard.set(square, newState);
	});
}

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

async function prova()
{
	try
	{		
		await initLocalMatchState();
	}
	catch (err){
		console.error("[Prova]: Errore");   
	}
}

prova();

// export function boardConverter(boardMap = assignLocalBoard())
// {
// 	const rows = [];

// 	for (let rank = 8; rank >= 1; rank -= 1)
// 	{
// 		const row = [];
// 		for (const file of FILES)
// 			row.push(boardMap.get(`${file}${rank}`));
// 		rows.push(row);
// 	}
// 	return rows;
// }

export { localBoard, localPlayers, localMatchState }