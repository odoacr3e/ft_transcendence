// @ts-check

//SECTION - boost function
/*
	list of exports:
	-	boost:		boost a piece.
					It can lead to checkMate. Ends the turn.
*/

import {dangerUpdateAll, DangerUpdate} from "../../utils/dangerUpdate.js";
import {Match} from "../../Classes/Chess/match.js";
import {error, paramCheck, Result, clientBoard} from "./utils.js";
import { endTurn } from "./endTurn.js";
import {checkMateCheckAll} from "../../GameLogic/checkMate.js";
import { BOOSTED_MAX, MOVEMENT_MIN } from "../../Macro/macro.js";
import { checkKingDanger } from "../../utils/checkDanger.js";
import { enumNames } from "../../Macro/enums.js";
import { jsonParser } from "../../utils/response.js";

/** @typedef {import ('../../Classes/Chess/chessBoard.js').Square} Square  */

/**
 * 
 * @param {Match} match
 * @param {String} from
 * @returns {Result}
 */
function boost(match, from, realBoost=true)
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
		if (endTurn(match, false).specialMoves.CheckKingDanger())
			result.specialMoves.SetKingDanger();
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
	match.currentPlayer.boostedPiece = from;
	match.history.UpdateBoost(match, square, from);
	DangerUpdate(match, from, false);
	checkInluenceOfBoost(match, square);
	match.boost += 1;
	return (true);
}

/**
 * @param {Match} match
 * @param {string} from
 */
function fakeBoost(match, from)
{
	let	result = new Result;
	let	square;

	if (!from)
		return (result.Error(`boost: coord from ${from} does not exist`));
	if (!match.board.has(from))
		return (result.Error(`boost: coord from ${from} does not exist`));
	square = match.board.get(from);
	if (!square.piece)
		return (result.Error(`boost: there is no piece is ${from}...`));
	square.piece.isBoostedBool = true;
	DangerUpdate(match, from);
	result.Success();
	// @ts-ignore
	result.zones = jsonParser(structuredClone(square.boostedTargetZones));
	square.piece.isBoostedBool = false;
	DangerUpdate(match, from);
	return (result);
}

/**
 * 
 * @param {Match} match 
 * @param {Square} square 
 */
function checkInluenceOfBoost(match, square)
{
	let influenceZones;
	let influenced;
	let infPiece;

	influenceZones = structuredClone(square.influenceZones);
	for (let x of influenceZones)
	{
		influenced = structuredClone(match.board.influenceMap.get(x));
		if (!influenced)
			continue ;
		for (let y of influenced)
		{
			infPiece = match.board.get(y).piece;

			if (!infPiece)
				continue ;
			else if (infPiece.type == enumNames.KING)
				DangerUpdate(match, infPiece.pos);
		}
	}
}

export {boost, fakeBoost}; 