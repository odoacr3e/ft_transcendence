// @ts-check

const {Piece, board, Square, cursor} = require("../../lib/lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {Match} = require("../../match.js");
const {error, paramCheck, Result} = require("./utils.js");
const endTurn = require("./endTurn.js").endTurn;
const { BOOSTED_MAX, MOVEMENT_MIN } = require("../../macro.js");

/**
 * 
 * @param {Match} match
 * @param {String} from
 * @returns {Result}
 */
function boost(match, from)
{
	let	result;

	result = new Result();
	if (!paramCheck(result, from))
		return (result);
	if (!tryBoost(match, result, from))
		return (result);
	result.status = 200;
	if (match.boost == BOOSTED_MAX)
		endTurn(match);
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

	if (match.boost >= BOOSTED_MAX || match.moves < MOVEMENT_MIN)
		return (error(result, 403, "Mr. Greedy cheata!!!"));
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
	square.piece.isBoostedBool = !square.piece.isBoostedBool;
	console.log("BOOST ZONES BEFORE\n", square.boostedTargetZones);
	dangerUpdateAll(match);
	console.log("BOOST ZONES AFTER\n", square.boostedTargetZones);
	match.history.UpdateBoost(square, from);
	match.boost += 1;
	return (true);
}

module.exports = {boost};