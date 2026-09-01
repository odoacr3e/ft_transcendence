import { initLocalBoard, localMatchState, 
		 localBoard, localPlayers,
		 startLocalMatchState, localInfo,
		 currentPlayer, emptyCapturedPieces, debug }	from "./Variables.js";
import { checkEndTurn, hasBoost, 
		 checkUpgrade, assignLastMoveSquares, 
		 setVictory}	from "./utils/ArchiUtils.js";
import { beginPendingAbility } 					from "../Helper/abilityMovement.js";
import { clearHistory } 						from "./History.js";
import { clearMessages } 						from "./ChatBox.js";
import "./SocketListen.js"

//SECTION - INIT FUNCTIONS

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

	initLocalBoard(localMatchState?.board);
	initLocalPlayers();

	localInfo.matchId = raw.id;
	localInfo.myTeam = raw.team;
	debug("il mio team :", localInfo.myTeam);
	setVictory(raw.victory, false);
	localInfo.matchStarted = false;	//il timer non parte finché il bianco non ha mosso

	if (localInfo.myTeam)
		sessionStorage.setItem("match:myTeam", localInfo.myTeam);
	if (raw.id !== undefined && raw.id !== null)
		sessionStorage.setItem("match:id", raw.id);
}

function initLocalPlayers()
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

	hasBoost(currentPlayer());
}
//!SECTION

//SECTION - UPDATE FUNCTIONS

export function updateMatchState(nextRaw)
{
	const outcome = { moved: false, captured: false, transformed: false };
	const validated = validateReceivedMatch(nextRaw);
	
	localInfo.drag = null;
	
	setVictory(nextRaw.victory);
	checkEndTurn(validated);
	startLocalMatchState(validated);
	try 
	{
		if (validated.board)
			updateLocalBoard(validated);
		checkUpgrade();
		updateLocalPlayers(validated);
	} 
	catch(err){
		console.error("[updateLocalMatchState]: Errore di update del Match!\n" + err);
  	}
	return (outcome);
}

function updateLocalBoard(changes, outcome)
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
			const oldPiece	= oldSquare?.piece;
			const newPiece	= newSquare.piece;

			assignLastMoveSquares(oldSquare, newSquare, movedSquares);

			if (oldPiece && newPiece && oldPiece.team !== newPiece.team)
			{
				localInfo.capturedP[newPiece.team][oldPiece.type] += 1;
				outcome.captured = true;
			}
			else if (oldPiece && newPiece && oldPiece.type !== newPiece.type)
				outcome.transformed = true;
		}
	});
	if (movedSquares.size > 0)
	{
		localInfo.lastMovesSquares = movedSquares;
		localInfo.matchStarted = true;
		outcome.moved = true;
	}
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
	});

	hasBoost(currentPlayer());
}
//!SECTION

export function reloadMatchState(raw)
{
	const validated = validateReceivedMatch(raw);
	startLocalMatchState(validated);


	initLocalBoard(localMatchState?.board);
	initLocalPlayers();
	setVictory(raw.victory, false);

	localInfo.myTeam			= raw.team ?? sessionStorage.getItem("match:myTeam");	
	localInfo.matchId			= sessionStorage.getItem("match:id");
	localInfo.matchStarted		= false;
	localInfo.secondTurn		= raw.secondMove ?? false;
	localInfo.drawOffer 		= raw.pending === true ? true : false;

	restorePendingAbility(raw);

	if (localInfo.myTeam)
		sessionStorage.setItem("match:myTeam", localInfo.myTeam);
}

function restorePendingAbility(raw)
{
	const anchorId	= raw.usedBoost || null;
	const zones		= Object.values(raw.oldBoosted || {})[0];
	const pieceType	= anchorId ? localBoard.get(anchorId)?.piece?.type : null;

	if (!anchorId || !pieceType || !Array.isArray(zones) || zones.length === 0)
	{
		localInfo.usingAbility		= "";
		localInfo.secondMove		= false;
		localInfo.savedBoostedMap 	= null;
		return;
	}

	beginPendingAbility({
		pieceType,
		zones:		new Set(zones),
		anchorId:	pieceType === "Bastards" ? null : anchorId,
		focusId:	anchorId,
	})
}

export function clearMatchStorage()
{
	sessionStorage.removeItem("match:id");
	sessionStorage.removeItem("match:myTeam");
	localInfo.capturedP = { 
		white: emptyCapturedPieces(), 
		black: emptyCapturedPieces() 
	};

	clearHistory();
	clearMessages();
}
