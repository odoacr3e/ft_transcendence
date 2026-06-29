// @ts-check

import {MOVEMENT_MIN, MOVEMENT_BONUS_POINT} from "../../Macro/macro.js";
import {enumNames} from "../../Macro/enums.js";
import {Match} from "../../Classes/Chess/match.js";
import {error, Result, checkMateAlert} from "./utils.js";
import {DangerUpdate} from "../../utils/moveUtils.js";
import {clientBoard} from "../../handlers/game/utils.js";
import { checkKingDanger } from "../../utils/gameUtils.js";

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
	// // console.log("time", p.time);
	// time = match.currentPlayer.time;
	// /** @param {string} matchId */
	// timeout = setTimeout((matchId) =>
	// {
	// 	let result;
	// 	let match = globals.matches.get(matchId);
	// 	if (!match)
	// 		throw ("Timer reset: bad matchId " + matchId);
	// 	result = new Result();
	// 	// @ts-ignore
	// 	result = match.PlayerLost(result, match?.currentPlayer.team);
	// 	if (match.coordToUpdate)
	// 	{
	// 		DangerUpdate(match, match.coordToUpdate);
	// 		match.coordToUpdate = "";
	// 	}
	// 	return (result);
	// }, time, "0");
	// start = Date.now();
	// match.timer = new Timer(time, start, timeout);
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