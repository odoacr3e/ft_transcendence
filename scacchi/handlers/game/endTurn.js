// @ts-check

import {MOVEMENT_MIN, MOVEMENT_BONUS_POINT} from "../../Macro/macro.js";
import {enumNames} from "../../Macro/enums.js";
import {Match} from "../../Classes/Match/match.js";
import {error, Result, checkMateAlert} from "./utils.js";
import {CheckMateCheck} from "../../GameLogic/checkMate.js";
import {globals} from "../../Classes/Match/globals.js";
import {isDangerous} from "../../utils/gameUtils.js";
import {DangerUpdate} from "../../utils/moveUtils.js";
import {clientBoard} from "../../handlers/game/utils.js";
//FIXME - ale: puoi sempre cambiare turno anche se non hai mosso

/**
 * goes to the next turn
 * @param {Match} match
 * @param {boolean} sendBoardBool
 * @returns {Result}
 */
function endTurn(match, sendBoardBool=true)
{
	let	result;
	let timeout;
	let start;
	let time;
	let p = match.currentPlayer;

	result = new Result();
	time = match.currentPlayer.time;
	// @ts-ignore
	if (!updateTurn(match, result))
		return (result);
	// if (match.timer != null)
	// {
	// 	// @ts-ignore
	// 	clearTimeout(match.timer.timeout);
	// 	p.time = match.timer.time - (Date.now() - match.timer.start);
	// }
	// // console.log("time", match.currentPlayer.time);
	// time = match.currentPlayer.time;
	// timeout = setTimeout(() =>
	// {
	// 	let result;
	// 	let match = globals.matches.get("0");
	// 	result = new Result();
	// 	result.status = 200;
	// 	result.youWin = true;
	// 	result.msg = `Player ${match?.currentPlayer.team} has lost!!!`
	// 	return (match.CheckMate(result));
	// }, time);
	// start = Date.now();
	// match.timer = {timeout, start, time};
	console.log(`Now it's ${match.currentPlayer.team} turn.`);
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
	if (CheckMateCheck(match, player.King) == true)
	{
		console.log("hai perso, sfigato, e vuoi pure muovere di nuovo?? Appenditi idiota!!!");
		// @ts-ignore
		match.CheckMate(result);
		return (false);
	}
	else if (isDangerous(match, king.dangerZones, king.piece?.team) == true)
		result.specialMoves.SetKingDanger();
	match.boost = 0;
	match.moves = 0;
	return (true);
}

export {endTurn};