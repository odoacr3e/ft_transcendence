// @ts-check

import {dangerUpdateAll, DangerUpdate} from "../../utils/moveUtils.js";
import {Match} from "../../Classes/Match/match.js";
import {error, paramCheck, Result, clientBoard} from "./utils.js";
import { endTurn } from "./endTurn.js";
import {checkMateCheckAll} from "../../GameLogic/checkMate.js";
import { BOOSTED_MAX, MOVEMENT_MIN } from "../../Macro/macro.js";
import { Square } from "../../Classes/ChessBoard/chessBoard.js";
import { checkKingDanger } from "../../utils/gameUtils.js";

/**
 * 
 * @param {Match} match
 * @param {String} from
 * @returns {Result}
 */
function boost(match, from)
{
	let	result;
	let prevBoost;

	result = new Result();
	if (!paramCheck(result, from))
		return (result);
	prevBoost = match.currentPlayer.boostedPiece;
	if (!tryBoost(match, result, from))
		return (result);
	result.status = 200;
	if (match.boost == BOOSTED_MAX)
	{
		checkMateCheckAll(match, result);
		endTurn(match, false);
	}
	if (prevBoost == "")
		prevBoost = from;
	// @ts-ignore
	result.board = clientBoard(match);
	result.match = match;
	return (result);
}

/**
 * 
 * @param {Match} match
 * @param {Result} result 
 * @param {String} from 
 * @returns {boolean}
 */
function tryBoost(match, result, from)
{
	let	square;
	let	tmp;

	if (match.boost >= BOOSTED_MAX || match.moves < MOVEMENT_MIN)
		return (error(result, 403, "You can't boost now"));
	if (checkKingDanger(match) == true)
		return (error(result, 403, "Your king is in danger"));
	square = match.board.get(from);
	if (!square?.piece)
		return (error(result, 403, "Nothing to be boosted in there man"));
	else if (square.piece.isBoostedBool == true)
		return (error(result, 403, "That piece is already boosted"));
	else if (square.piece.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	else if (square.piece.price > match.currentPlayer.nPoints)
		return (error(result, 403, `You need ${square.piece.price} to boost this`));
	match.currentPlayer.nPoints -= square.piece.price;
	square.piece.isBoostedBool = true;
	if (match.currentPlayer.boostedPiece)
	{
		match.boostPriority.delete(match.currentPlayer.team);
		tmp = match.board.get(match.currentPlayer.boostedPiece);
		if (tmp?.piece)
			tmp.piece.isBoostedBool = false;
		DangerUpdate(match, match.currentPlayer.boostedPiece, false);
	}
	match.board.updates.add(from);
	match.boostPriority.add(match.currentPlayer.team);
	match.currentPlayer.boostedPiece = square.piece.pos;
	match.history.UpdateBoost(match, square, from);
	DangerUpdate(match, from, false);
	match.boost += 1;
	return (true);
}

export {boost};