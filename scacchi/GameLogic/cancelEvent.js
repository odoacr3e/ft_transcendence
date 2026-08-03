//@ts-ignore

import { HistoryEvent } from "../Classes/Chess/history.js";
import { Piece } from "../Classes/Chess/Pieces/pieces.js";
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
	if (match.aiSimulation == false)
		console.log("behold an unthinkable present...");
	lastEvent = match.history.Last();
	if (includesOneOf(lastEvent.type, eEvents.Move, eEvents.MoveBoost))
		errorMsg = cancelMove(match, lastEvent);
	else if (lastEvent.type == eEvents.Boost)
		errorMsg = cancelBoost(match, lastEvent);
	else if (lastEvent.type == eEvents.EndTurn)
		errorMsg = cancelEndTurn(match);
	else if (lastEvent.type == eEvents.GiveUp)
		errorMsg = "giveUp cannot be canceled";
	else if (lastEvent.type == eEvents.Transform)
		errorMsg = cancelTransform(match, lastEvent);
	if (errorMsg)
		return (new Result().Error(`Cannot cancel: "${errorMsg}"`, 500));
	while (match.history.events[-1]?.error == true)
		match.history.events.pop();
	match.history.events.pop();
	clearTimeout(match.timer?.timeout? match.timer.timeout : undefined);
	if (match.history.events.length != 0)
		setTimerGame(match);
	else
		match.timer = null;
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
		match.currentPlayer.nPoints -= lastEvent.pieceEaten.price;//@ts-ignore
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
		match[lastEvent.pieceEaten?.team].nPieces += 1;
	}
	else
	{
		fromSquare.piece = toSquare.piece;
		toSquare.piece = null;
	}
	if (lastEvent.type == eEvents.MoveBoost && fromSquare.piece)
	{
		fromSquare.piece.isBoostedBool = true;
		match.currentPlayer.boostedPiece = lastEvent.prevBoost;
	}
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
	match.moves--;
	if (match.board.get(lastEvent.to).piece?.type == enumNames.BASTARDS || lastEvent.pieceEaten != null)
		match.spareCountDown = 0;
	else
		++match.spareCountDown;
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
	match.currentPlayer.boostedPiece = lastEvent.prevBoost;
	if (lastEvent.prevBoost)
	{
		match.board.get(lastEvent.prevBoost).piece.isBoostedBool == true;
		DangerUpdate(match, lastEvent.prevBoost);
	}
	DangerUpdate(match, lastEvent.from);
}

/**
 * 
 * @param {Match} match 
 */
function cancelEndTurn(match)
{
	// let nTurn;

	// nTurn = match.history.TurnCount(match.currentPlayer.team);
	// if (nTurn % MOVEMENT_BONUS_POINT == 0)
	// 	match.currentPlayer.nPoints -= 1;
	//@ts-ignore
	match.currentPlayer = match[match.currentPlayer.prev];
	match.currentPlayer.bonusPointCounter--;
	if (match.currentPlayer.bonusPointCounter == -1)
	{
		match.currentPlayer.bonusPointCounter = MOVEMENT_BONUS_POINT - 1;
		match.currentPlayer.nPoints -= 1;
	}
	for (let i = 0; i != match.history.events.length; i++)
	{
		if (match.history.events[match.history.events.length - 2 - i].type == eEvents.EndTurn)
			break ;
		if (match.history.events[match.history.events.length - 2 - i].type == eEvents.Move || match.history.events[match.history.events.length - 2 - i].type == eEvents.MoveBoost)
			match.moves++;
	}
}

/**
 * 
 * @param {Match} match 
 * @param {HistoryEvent} lastEvent 
 */
function cancelTransform(match, lastEvent)
{
	let	square;
	let	isBoostedBool;
	let	moveCount;

	square = match.board.get(lastEvent.from);
	if (!square.piece)
		return ("cancelBoost: missing coord from");
	isBoostedBool = square.piece.isBoostedBool;
	moveCount = square.piece.moveCount;
	square.piece = new Piece(enumNames.BASTARDS, lastEvent.from, lastEvent.team);
	square.piece.isBoostedBool = isBoostedBool;
	square.piece.moveCount = moveCount;
	DangerUpdate(match, lastEvent.from);
}
