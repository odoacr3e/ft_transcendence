import { initLocalBoard, localMatchState, localBoard,  
			localPlayers, startLocalMatchState, 
			localInfo}					from "./Variables.js";
import { checkEndTurn, hasBoost, DEBUGSetVisible, checkUpgrade }	from "./utils/ArchiUtils.js";

//SECTION - INIT FUNCTIONS

async function loadReceivedMatch() 
{
	// const response = await fetch("/match.json",
	// const response = await fetch("/api/game/",
	// const response = await fetch("/ChampMatch.json",
	// const response = await fetch("/FILE.json",
	// const response = await fetch("/FILE-ONE.json",
	// const response = await fetch("/BastardMatch.json",
	// const response = await fetch("ValkiryaMatch.json",
	// const response = await fetch("/MinoMatch.json",
	// const response = await fetch("/TransformMatch.json",
	const response = await fetch("http://localhost:8080/api/game",
	{
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ type: "init", from: "0", to: "0" }),
	});	
	if (!response.ok)
		throw new Error(`Impossibile caricare /match.json: ${response.status}`);
	const match = await response.json();
	// console.log(`responde: ${JSON.stringify(match)}`)
	return match;
}

function validateReceivedMatch(rawJson)
{
	if (!rawJson || typeof rawJson !== "object" || Array.isArray(rawJson))
		throw new Error("Payload non valido: root deve essere un oggetto.");

	const has_p1 = Object.prototype.hasOwnProperty.call(rawJson, "p1");
	const has_p2 = Object.prototype.hasOwnProperty.call(rawJson, "p2");
	const has_p3 = Object.prototype.hasOwnProperty.call(rawJson, "p3");
	const has_p4 = Object.prototype.hasOwnProperty.call(rawJson, "p4");
	const has_board = Object.prototype.hasOwnProperty.call(rawJson, "board");

	if (!has_p1 || !has_p2 || !has_p3 || !has_p4 || (!has_board && !localInfo.secondTurn))
		throw new Error("[validateReceivedMatch]: Payload non valido: servono players e board.");

	if (has_board && (!rawJson.board || typeof rawJson.board !== "object" || Array.isArray(rawJson.board)))
		throw new Error("[validateReceivedMatch]: Payload non valido: board deve essere un oggetto mappa.");

	if (has_board)
		return {
			p1: rawJson.p1,
			p2: rawJson.p2,
			p3: rawJson.p3,
			p4: rawJson.p4,
			board: rawJson.board,
		};
	else
		return {
			p1: rawJson.p1,
			p2: rawJson.p2,
			p3: rawJson.p3,
			p4: rawJson.p4
		};

}

// boost di pezzi

async function initLocalMatchState() 
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

		if (localMatchState[player] === null) { return; }
		if (!has)		{ throw new Error(`[initLocalPlayers]: Player ${player} object absent!`); }
		if (wrong_type)	{ throw new Error(`[initLocalPlayers]: Player ${player} a wrong type!`); }

		localPlayers.set(player, localMatchState[player]);
	})

	hasBoost(localPlayers.values().find(p => p.isPlaying === true));
}
//!SECTION

//SECTION - UPDATE FUNCTIONS

function updateMatchState(nextRaw)
{
	const validated = validateReceivedMatch(nextRaw);

	// console.log(`currPlayer: ${validated.currentPlayer}`);
	
	checkEndTurn(validated);

	startLocalMatchState(validated);
	try 
	{
		if (validated.board)
			updateLocalBoard(validated);
		DEBUGSetVisible();
		checkUpgrade();
		updateLocalPlayers(validated);
	} 
	catch(err){
		console.error("[updateLocalMatchState]: Errore di update del Match!\n" + err);
  	}
}

function updateLocalBoard(changes)
{
	const board = changes.board;

	if (!board) { throw new Error("[updateLocalBoard]: Board expected but no object received!"); }
	if (typeof board !== "object" || Array.isArray(board))
		throw new Error("[updateLocalBoard]: Board format not valid!");

	Object.entries(board).forEach(([squareKey, newSquare]) => {
		if (localBoard.has(squareKey))
		{
			newSquare.targetZones = new Set(Array.isArray(newSquare.targetZones) ? newSquare.targetZones : []);
			
			newSquare.boostedTargetZones = new Map(
				Object.entries(newSquare.boostedTargetZones || {}).map(
					([key, value]) => [key, new Set(Array.isArray(value) ? value : [])]
				)
			)
			
			const oldSquare = localBoard.get(squareKey);
			oldSquare.piece = newSquare.piece;
			oldSquare.targetZones = newSquare.targetZones;
			oldSquare.boostedTargetZones = newSquare.boostedTargetZones;
		}
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

		localPlayers.set(player, {...localPlayers.get(player), ...changes[player]});
	})

	hasBoost(localPlayers.values().find(p => p.isPlaying === true));
}
//!SECTION

export { initLocalMatchState, updateMatchState };
