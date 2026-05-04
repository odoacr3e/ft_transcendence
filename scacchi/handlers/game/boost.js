// @ts-check

const {Piece, board, Square, cursor} = require("../../lib/lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {match} = require("../../match.js");
const {error, paramCheck, Result} = require("./utils.js");
const { BOOSTED_MAX, MOVEMENT_MIN } = require("../../macro.js");

/**
 * 
 * @param {String} from
 * @returns {Result}
 */
function boost(from)
{
	let	result;

	result = new Result();
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

	if (match.boost >= BOOSTED_MAX || match.moves < MOVEMENT_MIN)
		return (error(result, 403, "Mr. Greedy cheata!!!"));
	square = board.get(from);
	if (!square?.piece)
		return (error(result, 403, "Nothing to be boosted in there man"));
	else if (square.piece.isBoostedBool == true)
		return (error(result, 403, "That piece is already boosted"));
	else if (square.piece.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	square.piece.isBoostedBool = !square.piece.isBoostedBool;
	match.boost += 1;
	dangerUpdateAll();
	return (true);
}

module.exports = {boost};