import { FILES } from "../Helper/constants";

let localMatchState = null;
let localBoard = null;
let localPlayer1 = null;
let localPlayer2 = null;

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

	const hasP1 = Object.prototype.hasOwnProperty.call(rawJson, "p1");
	const hasP2 = Object.prototype.hasOwnProperty.call(rawJson, "p2");
	const hasBoard = Object.prototype.hasOwnProperty.call(rawJson, "board");

	if (!hasP1 || !hasP2 || !hasBoard)
		throw new Error("Payload non valido: servono p1, p2, board.");

	if (!rawJson.board || typeof rawJson.board !== "object" || Array.isArray(rawJson.board))
		throw new Error("Payload non valido: board deve essere un oggetto mappa.");

	return {
		p1: rawJson.p1,
		p2: rawJson.p2,
		board: rawJson.board,
	};
}

export async function initLocalMatchState() 
{
	const raw = await loadReceivedMatch();
	const validated = validateReceivedMatch(raw);
	localMatchState = validated;

	initLocalBoard();
	initLocalPlayer1();
	initLocalPlayer2();
}

export function initLocalBoard()
{
	if (!localMatchState)
		throw new Error("[initLocalBoard]: Match non inizializzato: chiama prima initLocalMatchState().");
	localBoard = new Map(Object.entries(localMatchState.board));
}

export function initLocalPlayer1(){
	if (!localMatchState)
		throw new Error("[initLocalPlayer1]: Match non inizializzato: chiama prima initLocalMatchState().");
	localPlayer1 = localMatchState.p1;
}

export function initLocalPlayer2(){
	if (!localMatchState)
		throw new Error("[initLocalPlayer2]: Match non inizializzato: chiama prima initLocalMatchState().");
	localPlayer2 = localMatchState.p2;
}

export function replaceMatchState(nextRaw) 
{
	const validated = validateReceivedMatch(nextRaw);
	localMatchState = validated;
	localMatchState.board = new Map(Object.entries(validated.board));
	return localMatchState;
}

export async function updateLocalMatchState()
{
	const nextMatchState = await loadReceivedMatch();

	updateLocalBoardFromRawceived(nextMatchState);
	updateLocalPlayer1FromRawceived(nextMatchState);
	updateLocalPlayer2FromRawceived(nextMatchState);
}

export function updateLocalBoardFromRawceived(changes)
{
	const noObj = !changes.board && !changes.p1 && !changes.p2;
	const boardNotValid = typeof changes.board !== "object" || Array.isArray(changes.board);

	if (noObj)
		throw new Error("[updateLocalBoardFromRawceived]: Board expected but no object received!");
	if (boardNotValid)
		throw new Error("[updateLocalBoardFromRawceived]: Board format not valid!");

	Object.entries(changes).forEach(([square, newState]) => {
		localBoard.set(square, newState);
	});
}

export function updateLocalPlayer1FromRawceived(changes)
{
	const hasP1 = Object.prototype.hasOwnProperty.call(changes, "p1");
	
	if (hasP1 == true)
		localPlayer1 = changes.p1;
}

export function updateLocalPlayer2FromRawceived(changes)
{
	const hasP2 = Object.prototype.hasOwnProperty.call(changes, "p2");
	
	if (hasP2 == true)
		localPlayer2 = changes.p2;
}

async function prova()
{
	try
	{		
		initLocalMatchState();
		assignLocalBoard();
		// console.log(localBoard.get("a1")
		await initMatchStateLocal();
		assignLocalBoard();
		// console.log(Board["a1"]);
	}
	catch (err){
		console.error("Errore di inizializzazione di Board");
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

export { localBoard, localPlayer1, localPlayer2, localMatchState }