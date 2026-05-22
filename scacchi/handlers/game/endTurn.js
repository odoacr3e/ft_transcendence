// @ts-check

const {MOVEMENT_MIN, MOVEMENT_BONUS_POINT} = require("../../Macro/macro.js");
const {Match} = require("../../Classes/Match/match.js");
const {error, Result, checkMateAlert} = require("./utils.js");
const {CheckMateCheck} = require("../../GameLogic/checkMate.js");
//FIXME - ale: puoi sempre cambiare turno anche se non hai mosso

/**
 * goes to the next turn
 * @param {Match} match
 * @returns {Result}
 */
function endTurn(match)
{
	let	
	result;

	result = new Result();
	if (!updateTurn(match, result))
		return (result);
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