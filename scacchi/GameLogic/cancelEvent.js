//@ts-ignore

import { HistoryEvent } from "../Classes/Chess/history.js";
import { Result } from "../Classes/endPoint/result.js";
import { eEvents, enumSpecialMoves } from "../Macro/enums.js";
import { DangerUpdate, updateBoostedChampions } from "../utils/dangerUpdate.js";
import { includesOneOf } from "../utils/string.js";

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
	if (lastEvent.type == eEvents.EndTurn)
		errorMsg = cancelEndTurn(match, lastEvent);
	else if (includesOneOf(lastEvent.type, eEvents.Move, eEvents.MoveBoost))
		errorMsg = cancelMove(match, lastEvent);
	if (errorMsg)
		return (new Result().Error(`Cannot cancel: "${errorMsg}"`, 500));
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

	console.log(Object.prototype.toString.call(lastEvent.updates));
	if (!lastEvent.updates || lastEvent.updates.size == 0 || Object.prototype.toString.call(lastEvent.updates) != "[object Set]")
		return ("cancelMove: History does not have the updates array");
	fromSquare = match.board.get(lastEvent.from);
	toSquare = match.board.get(lastEvent.to);
	if (lastEvent.specialMoves & enumSpecialMoves.SNIPER)
	{
		toSquare.piece = lastEvent.pieceEaten;
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
	}
	else
	{
		fromSquare.piece = toSquare.piece;
		toSquare.piece = null;
	}
	if (lastEvent.type == eEvents.MoveBoost && fromSquare.piece)
		fromSquare.piece.isBoostedBool = true;
	if (fromSquare.piece)
		fromSquare.piece.moveCount -= 1;
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
function cancelEndTurn(match, lastEvent)
{//@ts-ignore
	match.currentPlayer = match[match.currentPlayer.prev];
}
