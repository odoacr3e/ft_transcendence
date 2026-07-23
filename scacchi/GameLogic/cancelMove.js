//@ts-ignore

import { Result } from "../Classes/endPoint/result.js";
import { eEvents, enumSpecialMoves } from "../Macro/enums.js";
import { DangerUpdate, updateBoostedChampions } from "../utils/dangerUpdate.js";

/** @typedef {import("../Classes/Chess/match.js").Match} Match */

/**
 * 
 * @param {Match} match 
 */
function cancelMove(match)
{
	let	lastEvent;
	let	fromSquare;
	let	toSquare;
	let	tmp;

	if (match.history.events.length == 0)
		return (new Result().Error("Cannot cancel: nothing happened yet", 409));
	console.log("behold an unthinkable present...");
	lastEvent = match.history.Last();
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
	for (const coord of lastEvent.updates)
	{
		DangerUpdate(match, coord);
	}
	updateBoostedChampions(match, [lastEvent.from, lastEvent.to]);
}
