// @ts-check

const {MOVEMENT_MAX, MOVEMENT_MIN, MOVEMENT_BONUS_POINT} = require("../../macro");
const {Piece, board, Square, cursor} = require("../../lib/lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {match} = require("../../match.js");
const {error, paramCheck, Result} = require("./utils.js");

//FIXME - ale: puoi sempre cambiare turno anche se non hai mosso

/**
 * goes to the next turn
 * @returns {Result}
 */
function endTurn()
{
	let	result;

	result = new Result();
	if (!updateTurn(result))
		return (result);
	console.log(`Now it's ${match.currentPlayer.team} turn.`);
	result.status = 200;
	return (result);
}

/**
 * 
 * @param {Result} result 
 * @returns {boolean}
 */
function updateTurn(result)
{
	if (match.moves < MOVEMENT_MIN)
		return (error(result, 403, "You need to move first"));
	if (match.currentPlayer.bonusPointCounter == MOVEMENT_BONUS_POINT)
	{
		console.log("⚖️Punti bonus concessi⚖️");
		match.currentPlayer.nPoints += 1;
		match.currentPlayer.bonusPointCounter = 0;
	}
	else
		match.currentPlayer.bonusPointCounter += 1;
	match.endTurn();
	match.boost = 0;
	match.moves = 0;
	return (true);
}

module.exports = {endTurn};