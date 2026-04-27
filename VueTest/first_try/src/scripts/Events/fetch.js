async function FetchJson() 
{
	const response = await fetch("/match.json");
	if (!response.ok) { throw new Error(`Impossibile caricare /match.json: ${response.status}`); }

	const match = await response.json();
	return match;
}

function ValidateJson(rawJson) 
{
	if (!rawJson || typeof rawJson !== "object" || Array.isArray(rawJson))
		throw new Error("Payload non valido: root deve essere un oggetto.");

	const	hasP1 = Object.prototype.hasOwnProperty.call(rawJson, "p1"),
			hasP2 = Object.prototype.hasOwnProperty.call(rawJson, "p2"),
			hasBoard = Object.prototype.hasOwnProperty.call(rawJson, "board");

	if (!hasP1 || !hasP2 || !hasBoard)
		throw new Error("Payload non valido: servono p1, p2, board.");

	if (!rawJson.board || typeof rawJson.board !== "object" || Array.isArray(rawJson.board))
		throw new Error("Payload non valido: board deve essere un oggetto mappa.");

	return {
		p1: rawJson.p1,
		p2: rawJson.p2,
		board: new Map(Object.entries(rawJson.board))
	};
}

async function GetJson() 
{
	const raw = await FetchJson();
	const validated = ValidateJson(raw);
	return validated;
}

function getBoardState(state)
{
	if (!state)
		throw new Error("Match non inizializzato: chiama prima initMatchStateLocal().");
}

// export function replaceMatchState(nextRaw) 
// {
// 	const validated = validateReceivedMatch(nextRaw);
// 	matchState = validated;
// 	return matchState;
// }

async function init()
{
	try
	{
		const state = await GetJson();
		getBoardState(state);
		return (state);
	}
	catch (err){
		console.error("Errore di inizializzazione di Board");
	}
}

export { init }