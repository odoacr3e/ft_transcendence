// @ts-check

const {Piece, board, Square, cursor} = require("../../lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {match} = require("../../match.js");

/** @typedef {{msg: String | null, status: Number | null}} Result */

/**
 * 
 */
function endTurn()
{
	/**@type {Result}*/let	result;

	result = {msg: "OK", status: null};
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
	match.endTurn();
	return (true);
}

//SECTION - endTurn utils

/**
 * 
 * @param {Result} result 
 * @param {Number} status 
 * @param {String} msg 
 * @returns 
 */
function error(result, status, msg)
{
	result.msg = msg;
	result.status = status;
	return (false);
}

module.exports = {endTurn};