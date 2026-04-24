import { FILES } from "../Helper/constants";

export async function loadMatchLocal() 
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

let matchState = null;
let Board = null;

export async function initMatchStateLocal() 
{
	const raw = await loadMatchLocal();
	const validated = validateReceivedMatch(raw);
	matchState = validated;
	return matchState;
}

export function getBoardState()
{
	if (!matchState)
		throw new Error("Match non inizializzato: chiama prima initMatchStateLocal().");
	Board = matchState.board;
	return matchState.board;
}

export function replaceMatchState(nextRaw) 
{
	const validated = validateReceivedMatch(nextRaw);
	matchState = validated;
	return matchState;
}

async function prova()
{
	try
	{
		await initMatchStateLocal();
		getBoardState();
		console.log(Board["a1"]);
	}
	catch (err){
		console.error("Errore di inizializzazione di Board");
	}
}

prova();

// export function boardConverter(boardMap = getBoardState())
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

export { Board }