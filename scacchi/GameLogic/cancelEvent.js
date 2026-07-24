//@ts-ignore

import { HistoryEvent } from "../Classes/Chess/history.js";
import { Result } from "../Classes/endPoint/result.js";
import { eEvents, enumNames, enumSpecialMoves } from "../Macro/enums.js";
import { MOVEMENT_BONUS_POINT } from "../Macro/macro.js";
import { DangerUpdate, updateBoostedChampions } from "../utils/dangerUpdate.js";
import { includesOneOf } from "../utils/string.js";
import { setTimerGame } from "./timer.js";

/** @typedef {import("../Classes/Chess/match.js").Match} Match */

/**
 * 
 * @param {Match} match 
 */
export function cancelEvent(match)
{
	let	lastEvent;
	let	errorMsg;

	if (match.history.events.length == 0)
		return (new Result().Error("Cannot cancel: nothing happened yet", 409));
	console.log("behold an unthinkable present...");
	lastEvent = match.history.Last();
	if (includesOneOf(lastEvent.type, eEvents.Move, eEvents.MoveBoost))
		errorMsg = cancelMove(match, lastEvent);
	else if (lastEvent.type == eEvents.Boost)
		errorMsg = cancelBoost(match, lastEvent);
	else if (lastEvent.type == eEvents.EndTurn)
		errorMsg = cancelEndTurn(match);
	if (errorMsg)
		return (new Result().Error(`Cannot cancel: "${errorMsg}"`, 500));
	setTimerGame(match);
	while (match.history.events[-1]?.error == true)
		match.history.events.pop();
	match.history.events.pop();
	return (new Result().Success());
}

/**
 * 
 * @param {Match} match 
 * @param {HistoryEvent} lastEvent 
 */
function cancelMove(match, lastEvent)
{
	let	fromSquare;
	let	toSquare;
	let	tmp;

	// console.log(Object.prototype.toString.call(lastEvent.updates));
	if (!lastEvent.updates || lastEvent.updates.size == 0 || Object.prototype.toString.call(lastEvent.updates) != "[object Set]")
		return ("cancelMove: History does not have the updates array");
	fromSquare = match.board.get(lastEvent.from);
	toSquare = match.board.get(lastEvent.to);
	if (!lastEvent.pieceEaten && toSquare.piece && fromSquare.piece)
		console.warn("cancelMove, warning: info on pieceEaten undefined.");
	if (lastEvent.specialMoves & enumSpecialMoves.SNIPER && lastEvent.pieceEaten)
	{
		toSquare.piece = lastEvent.pieceEaten;
		match.currentPlayer.nPoints += lastEvent.pieceEaten.price;//@ts-ignore
		match[lastEvent.pieceEaten?.team].nPieces -= 1;
	}
	else if (lastEvent.specialMoves & enumSpecialMoves.CASTLING)
	{
		tmp = fromSquare.piece;
		fromSquare.piece = toSquare.piece;
		toSquare.piece = tmp;
	}
	else if (lastEvent.pieceEaten)
	{
		fromSquare.piece = toSquare.piece;
		toSquare.piece = lastEvent.pieceEaten;
		match.currentPlayer.nPoints -= lastEvent.pieceEaten.price;//@ts-ignore
		match[lastEvent.pieceEaten?.team].nPieces -= 1;
	}
	else
	{
		fromSquare.piece = toSquare.piece;
		toSquare.piece = null;
	}
	if (lastEvent.type == eEvents.MoveBoost && fromSquare.piece)
		fromSquare.piece.isBoostedBool = true;
	if (fromSquare.piece)
	{
		fromSquare.piece.moveCount -= 1;
		if (fromSquare.piece.type == enumNames.KING)
			match.currentPlayer.King = lastEvent.from;
	}
	for (const coord of lastEvent.updates)
	{
		DangerUpdate(match, coord);
	}
	updateBoostedChampions(match, [lastEvent.from, lastEvent.to]);
}

/**
 * 
 * @param {Match} match 
 * @param {HistoryEvent} lastEvent 
 */
function cancelBoost(match, lastEvent)
{
	let	square;

	square = match.board.get(lastEvent.from);
	if (!square.piece)
		return ("cancelBoost: missing coord from");
	match.currentPlayer.nPoints += square.piece.price;
	square.piece.isBoostedBool = false;
	DangerUpdate(match, lastEvent.from);
}

/**
 * 
 * @param {Match} match 
 */
function cancelEndTurn(match)
{
	if (match.history.TurnCount(match.currentPlayer.team) % MOVEMENT_BONUS_POINT == 0)
		match.currentPlayer.nPoints -= 1;//@ts-ignore
	match.currentPlayer = match[match.currentPlayer.prev];
}
