// @ts-check

const {MOVEMENT_MIN, MOVEMENT_BONUS_POINT} = require("../../Macro/macro.js");
const {Match} = require("../../Classes/Match/match.js");
const {error, Result, checkMateAlert} = require("./utils.js");
const {CheckMateCheck} = require("../../GameLogic/checkMate.js");
const {globals} = require("../../Classes/Match/globals.js");
//FIXME - ale: puoi sempre cambiare turno anche se non hai mosso

/**
 * goes to the next turn
 * @param {Match} match
 * @returns {Result}
 */
function endTurn(match)
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

	player = match.currentPlayer;
	if (match.moves < MOVEMENT_MIN)
		return (error(result, 403, "You need to move first"));
	if (player.bonusPointCounter == MOVEMENT_BONUS_POINT)
	{
		console.log("⚖️Punti bonus concessi⚖️");
		player.nPoints += 1;
		player.bonusPointCounter = 0;
	}
	else
		player.bonusPointCounter += 1;
	match.history.UpdateEndTurn(match);
	match.endTurn();
	if (CheckMateCheck(match, player.King) == true)
	{
		console.log("hai perso, sfigato, e vuoi pure muovere di nuovo?? Appenditi idiota!!!");
		// @ts-ignore
		checkMateAlert(result, match[match.currentPlayer.next].team);
		return (false);
	}
	match.boost = 0;
	match.moves = 0;
	return (true);
}

module.exports = {endTurn};