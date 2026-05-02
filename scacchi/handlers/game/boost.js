// @ts-check

const {Piece, board, Square, cursor} = require("../../lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {match} = require("../../match.js");

/** @typedef {{msg: String | null, status: Number | null}} Result */

/**
 * 
 * @param {String} from 
 */
function boost(from)
{
	/**@type {Result}*/let	result;

	result = {msg: "OK", status: null};
	if (!paramCheck(result, from))
		return (result);
	if (!tryBoost(result, from))
		return (result);
	result.status = 200;
	return (result);
}

/**
 * 
 * @param {Result} result 
 * @param {String} from 
 * @returns {boolean}
 */
function tryBoost(result, from)
{
	let	square;

	square = board.get(from);
	if (!square?.piece)
		return (error(result, 403, "Nothing to be boosted in there man"));
	else if (square.piece.isBoostedBool == true)
		return (error(result, 403, "That piece is already boosted"));
	else if (square.piece.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	square.piece.isBoostedBool = !square.piece.isBoostedBool;
	dangerUpdateAll();
	return (true);
}

//SECTION - boost utils

/**
 * check the validity of the input received by the move function.
 * @param {Result} result 
 * @param {String | undefined} from 
 * @returns {boolean} true if success, false if failure
 */
function paramCheck(result, from)
{
	if (!from)
		return (error(result, 400, `invalid param from ${from}`));
	return (true);
}

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

module.exports = {boost};