// @ts-check
const lib = require("../../lib.js");
const {Piece, board, Square, cursor} = require("../../lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {render} = require("../../render.js");
const {match} = require("../../match.js");

/** @typedef {{msg: String | null, status: Number | null}} Result */

/**
 * 
 * @param {String} from the piece to move's coords
 * @param {String} to the new piece location's coords
 * @returns {Result} Result:
 * ```js
 * {
 * 		msg: String | null,
 * 		status: Number | null
 * }
 * ```
 */
const move = (from, to) => 
{
	/**@type {Result}*/let	result;

	result = {msg: null, status: null};
	console.clear();
	if (!checkMove([from, to], result))
		return (result);
	if (!moveFunctionDEBUG([from, to], result))
		return (result);
	result.status = 200;
	return (result);
}

/**
 * 
 * @param {Array<String>} arr
 * @param {Result} result
 */
function checkMove (arr=[], result)
{
	let	from;
	let	to;
	let	king;

	from = board.get(arr[0]);
	to = board.get(arr[1]);
	// king = board.get(match.currentPlayer.King);
	// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	king = board.get(match.black.King);//FIXME - usare currentPlayer.King
	if (from == null || to == null || king == null)
		return (error(result, 500, "invalid positions"));//FIXME - 500 server error
	if (!from.targetZones.has(arr[1]))
		return (error(result, 403, "destination not in piece targetZone"));
	if (to.piece)
	{
		if (to.piece.team == from.piece.team)
			return (error(result, 403, "you can't eat your team mates"));
	}
	if (from.piece?.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	if (isDangerous(king.dangerZones, king.piece.team) && !simulation(arr, king))
		return (error(result, 403, "Your king is in danger"));
	if (!simulation(arr, king))
		return (error(result, 403, "this would put your king in danger"));
	if (to.piece)
		match.currentPlayer.nPoints += to.piece.price;
	to.piece = from.piece;
	from.piece = null;
	return (true);
}

/**
 * 
 * @param {Array<String>} selected 
 * @param {Result} result
 */
function moveFunctionDEBUG (selected=[], result)
{
	let	from;
	let	to;
	let	fromType;
	let	toType;

	from = board.get(selected[0]);
	to = board.get(selected[1]);
	if (!from || !to)
	{
		return (error(result, 500, "from | to bug in moveFunction"));
	}
	fromType = from.piece?.type;
	toType = to.piece?.type;
	if (fromType == null)
		fromType = "Square";
	else
		fromType = `\x1b[33m${fromType}\x1b[0m`;
	if (toType == null)
		toType = "Square";
	else
		toType = `\x1b[33m${toType}\x1b[0m`;
	to.piece = from.piece;
	from.piece = null;
	dangerUpdateAll();
	console.log(`SWAP ${fromType} with ${toType}`);
	console.log(`from ${selected[0]} to ${selected[1]}`);
	//render();
	return (true);
}

//SECTION - move utils

/**
 * 
 * @param {Array<String>} arr
 * @param {Square} king
 */
function simulation(arr, king)
{
	let tmp = new Map();

	for (const [key, val] of board)
	{
		let	squareCopy;

		squareCopy = new Square(val);
		tmp.set(key, squareCopy);
	}
	board.get(arr[1]).piece = board.get(arr[0])?.piece;
	board.get(arr[0]).piece = null;
	dangerUpdateAll();
	if (isDangerous(king.dangerZones, king.piece.team))
	{
		copyBoard(tmp);
		return (false);
	}
	copyBoard(tmp);
	return (true);
}

/**
 * 
 * @param {Map<string, Square>} tmp 
 */
function copyBoard(tmp)
{
	board.clear();
	for (let [key, val] of tmp)
		board.set(key, val);
	tmp.clear();
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

module.exports = { move };