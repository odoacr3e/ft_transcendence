import { initLocalBoard, localMatchState, localBoard, localPlayers, 
			localInfo, startLocalMatchState } from "./Variables.js";

// ANCHOR UTILS FUNCTIONS

function hasBoost (curP)
{
	localInfo.hasBoost = false;
	localBoard.forEach(square => {
		if (square.piece && square.piece.isBoostedBool)
			if (square.piece.team === curP.team)
				localInfo.hasBoost = true;
	});
}

function checkEndTurn(validated)
{
	let		newCurP;
	const	players_list = ["p1", "p2", "p3", "p4"];
	const	curP = localPlayers.values().find(p => p.isPlaying === true);

	players_list.forEach((player) => {
		if (validated[player].isPlaying) { newCurP = validated[player]; };
	})

	if (curP.name === newCurP.name) { localInfo.secondTurn = true; }
	else
	{
		localInfo.secondTurn = false;
		localInfo.savedBoostedMap = null;
	}
}

function DEBUGSetVisible()
{
	localBoard.forEach((square , key) => {
		if (square.piece)
		{
			const DOMPiece = document.getElementById(key).getElementsByClassName("piece")[0];
			if (DOMPiece && DOMPiece.style.visibility === "hidden")
				DOMPiece.style.visibility = "visible";
		}
	});
}

// ANCHOR INIT FUNCTIONS

async function loadReceivedMatch() 
{
	// const response = await fetch("/match.json",
	// const response = await fetch("/api/game/",
	// const response = await fetch("/Mino.json",
	// const response = await fetch("/Champ.json",
	// const response = await fetch("/FILE-ONE.json",
	// const response = await fetch("/Ba stardMatch.json",
	const response = await fetch("/FILE.json",
	{
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ type: "init", from: "0", to: null }),
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

// ANCHOR UPDATE FUNCTIONS

function updateMatchState(nextRaw)
{
	const validated = validateReceivedMatch(nextRaw);

	checkEndTurn(validated);

	startLocalMatchState(validated);
	try 
	{
		updateLocalBoard(validated);
		DEBUGSetVisible();
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

export { initLocalMatchState, updateMatchState };