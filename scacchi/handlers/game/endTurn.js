// @ts-check

//SECTION - boost function
/*
	list of exports:
	-	endTurn:		Ends the turn. Handles the player timer.
*/

import {MOVEMENT_MIN, MOVEMENT_BONUS_POINT} from "../../Macro/macro.js";
import {enumNames} from "../../Macro/enums.js";
import {Match} from "../../Classes/Chess/match.js";
import {error, Result, checkMateAlert} from "./utils.js";
import {DangerUpdate} from "../../utils/dangerUpdate.js";
import {clientBoard} from "../../handlers/game/utils.js";
import { checkKingDanger } from "../../utils/checkDanger.js";
import { checkInsuficientResources } from "../../GameLogic/checkSpare.js";
import { boardStringify } from "../../test/render.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Timer }	from "../../Classes/Chess/match.js";
import { setTimerGame } from "../../GameLogic/timer.js";

/**
 * goes to the next turn
 * @param {Match} match
 * @param {boolean} sendBoardBool
 * @returns {Result}
 */
function endTurn(match, sendBoardBool=true)
{
	let	result;
	let time;
	let nPieces;
	let p = match.currentPlayer;
	let boardState;

	result = new Result();
	time = match.currentPlayer.time;
	nPieces = match.getPieceNumber();
	boardState = boardStringify(match, true);
	if (!updateTurn(match, result))
		return (result);//@ts-ignore
	match[match.currentPlayer.prev].allieGuardianCoord = "";
	if (match.playerNum == 2 && nPieces <= 4)
	{
		if (checkInsuficientResources(match, nPieces))
			return (match.DrawMatch(result));
	}
	if (match.spareCountDown == 50 * match.playerNum)
		return (match.DrawMatch(result));
	if (!match.boardStateMap.has(boardState))
		match.boardStateMap.set(boardState, 1);//@ts-ignore
	else if (match.boardStateMap.get(boardState) >= 2)
		return (match.DrawMatch(result));//@ts-ignore
	else if (match.boardStateMap.get(boardState) < 2)
		match.boardStateMap.set(boardState, 2);
	if (match.timer != null)
	{
		// @ts-ignore
		clearTimeout(match.timer.timeout);
		p.time = match.timer.time - (Date.now() - match.timer.start);
	}
	setTimerGame(match);
	console.log(`Now it's ${match.currentPlayer.team} turn.`);
	if (checkKingDanger(match, match.currentPlayer.team))
		result.specialMoves.SetKingDanger();
	result.status = 200;
	if (sendBoardBool)//@ts-ignore
		result.board = clientBoard(match);
	return (result);
}

/**
 * 
 * @param {Match} match
 * @param {Result} result 
 * @returns {boolean}
 */
function updateTurn(match, result)
{
	let	player;
	let	king;

	if (match.playerNum <= 1)
		return (false);
	if (checkKingDanger(match) == true)
		return (error(result, 403, "Your king is in danger"));
	player = match.currentPlayer;
	if (match.moves < MOVEMENT_MIN)
		return (error(result, 403, "You need to move first"));
	if (player.bonusPointCounter == MOVEMENT_BONUS_POINT - 1)
	{
		console.log("⚖️Punti bonus concessi⚖️");
		player.nPoints += 1;
		player.bonusPointCounter = 0;
	}
	else
		player.bonusPointCounter += 1;
	if (match.currentPlayer.boostedPiece != "" && match.board.get(match.currentPlayer.boostedPiece).piece?.type == enumNames.BASTARDS)
	{
		console.log();
		DangerUpdate(match, match.currentPlayer.boostedPiece);
		match.board.updates.add(match.currentPlayer.boostedPiece);
	}
	match.history.UpdateEndTurn(match);
	match.endTurn();
	king = match.board.get(player.King);
	match.boost = 0;
	match.moves = 0;
	return (true);
}

export {endTurn};