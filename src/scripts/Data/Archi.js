import { initLocalBoard, localMatchState, localBoard,  
		 localPlayers, startLocalMatchState, 
		 localInfo}										from "./Variables.js";
import { checkEndTurn, hasBoost, DEBUGSetVisible, 
		 checkUpgrade, assignLastMoveSquares }			from "./utils/ArchiUtils.js";
import "./SocketLink.js"

//SECTION - INIT FUNCTIONS

// export async function loadReceivedMatch(style) 
// {
// 	const response = await fetch("http://localhost:8080/api/game",
// 	{
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify({ type: "init", from: style, to: "0" })
// 	});

// 	if (!response.ok)
// 		throw new Error(`Impossibile caricare /match.json: ${response.status}`);
// 	const match = await response.json();
// 	// const match = await JSON.parse(response.body, _jsonReviver);
// 	// console.log(`responde: ${JSON.stringify(match)}`)
// 	return match;
// }

export function  validateReceivedMatch(rawJson)
{
	if (!rawJson || typeof rawJson !== "object" || Array.isArray(rawJson))
		throw new Error("Payload non valido: root deve essere un oggetto.");

	const	has_p1 = Object.prototype.hasOwnProperty.call(rawJson, "p1"),
			has_p2 = Object.prototype.hasOwnProperty.call(rawJson, "p2"),
			has_p3 = Object.prototype.hasOwnProperty.call(rawJson, "p3"),
			has_p4 = Object.prototype.hasOwnProperty.call(rawJson, "p4"),
			has_board = Object.prototype.hasOwnProperty.call(rawJson, "board");

	if (has_board && (!rawJson.board || typeof rawJson.board !== "object" || Array.isArray(rawJson.board)))
		throw new Error("[validateReceivedMatch]: Payload non valido: board deve essere un oggetto mappa.");

	if (!has_p3 && !has_p4)
	{
		if ((!has_p1 || !has_p2 || (!has_board && !localInfo.secondTurn)))
			throw new Error("[validateReceivedMatch]: 2 Players: Payload non valido: servono players e board.");
		if (has_board)
			return { p1: rawJson.p1, p2: rawJson.p2, p3: null, p4: null, board: rawJson.board };
		else
			return { p1: rawJson.p1, p2: rawJson.p2, p3: null, p4: null };
	}
	else
	{
		if (!has_p1 || !has_p2 || !has_p3 || !has_p4 || (!has_board && !localInfo.secondTurn))
			throw new Error("[validateReceivedMatch]: Payload non valido: servono players e board.");
		if (has_board)
			return { p1: rawJson.p1, p2: rawJson.p2, p3: rawJson.p3, p4: rawJson.p4, board: rawJson.board };
		else
			return { p1: rawJson.p1, p2: rawJson.p2, p3: rawJson.p3, p4: rawJson.p4	};
	}
}

export function initLocalMatchState(raw)
{
	const validated = validateReceivedMatch(raw);
	startLocalMatchState(validated);

	initLocalBoard(localMatchState.board);
	initLocalPlayers();

	localInfo.matchId = raw.id;
	localInfo.myTeam = raw.team;
	localInfo.victory = raw.victory;

	sessionStorage.setItem("match:myTeam", raw.team);
	sessionStorage.setItem("match:id", raw.id);
}

export function initLocalPlayers()
{
	const players_list = ["p1", "p2", "p3", "p4"];

	localPlayers.clear();
	players_list.forEach((player) => {
		const has = Object.prototype.hasOwnProperty.call(localMatchState, player);
		const wrong_type = typeof localMatchState[player] !== "object";

		if (localMatchState[player] === null) { return; }
		if (!has)		{ throw new Error(`[initLocalPlayers]: Player ${player} object absent!`); }
		if (wrong_type)	{ throw new Error(`[initLocalPlayers]: Player ${player} a wrong type!`); }

		localPlayers.set(player, localMatchState[player]);
	});

	hasBoost(localPlayers.values().find(p => p.isPlaying === true));
}
//!SECTION

//SECTION - UPDATE FUNCTIONS

export function updateMatchState(nextRaw)
{
	const validated = validateReceivedMatch(nextRaw);

	localInfo.victory = nextRaw.victory ?? null;
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

export function updateLocalBoard(changes)
{
	const board = changes.board;

	if (!board) { throw new Error("[updateLocalBoard]: Board expected but no object received!"); }
	if (typeof board !== "object" || Array.isArray(board))
		throw new Error("[updateLocalBoard]: Board format not valid!");

	const movedSquares = new Set();

	Object.entries(board).forEach(([squareKey, newSquare]) => {
		if (localBoard.has(squareKey))
		{
			newSquare.targetZones = new Set(Array.isArray(newSquare.targetZones) ? newSquare.targetZones : []);
			
			newSquare.boostedTargetZones = new Map(
				Object.entries(newSquare.boostedTargetZones || {}).map(
					([key, value]) => [key, new Set(Array.isArray(value) ? value : [])]
				)
			);
			const oldSquare = localBoard.get(squareKey);
			assignLastMoveSquares(oldSquare, newSquare, movedSquares);
			if (oldSquare.piece && newSquare.piece && oldSquare.piece.team !== newSquare.piece.team)
				localInfo.capturedP[newSquare.piece.team][oldSquare.piece.type] += 1;
			oldSquare.piece = newSquare.piece;
			oldSquare.targetZones = newSquare.targetZones;
			oldSquare.boostedTargetZones = newSquare.boostedTargetZones;
		}
	});
	if (movedSquares.size > 0)
		localInfo.lastMovesSquares = movedSquares;
}

export function updateLocalPlayers(changes) 
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
	});

	hasBoost(localPlayers.values().find(p => p.isPlaying === true));
}
//!SECTION

export function reloadMatchState(raw)
{
	const validated = validateReceivedMatch(raw);
	startLocalMatchState(validated);

	initLocalBoard(localMatchState.board);
	initLocalPlayers();

	localInfo.myTeam = raw.team ?? sessionStorage.getItem("match:myTeam");
	localInfo.matchId = sessionStorage.getItem("match:id");
	localInfo.victory = raw.victory;

	if (raw.team)
		sessionStorage.setItem("match:myTeam", raw.team);
}

export function clearMatchStorage()
{
	sessionStorage.removeItem("match:id");
	sessionStorage.removeItem("match:myTeam");
}