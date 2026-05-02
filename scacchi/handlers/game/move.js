// @ts-check
const lib = require("../../lib/lib.js");
const {Piece, board, Square, cursor} = require("../../lib/lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {render} = require("../../render.js");
const {match} = require("../../match.js");
const {error, paramCheck, Result} = require("./utils.js");

/** @typedef {import('../../chessBoard.js').Square} Square */

/**
 * 
 * @param {String} from the piece to move's coords
 * @param {String} to the new piece location's coords
 * @returns {Result}
 */
function move(from, to)
{
	let	result;

	result = new Result();
	if (!paramCheck(result, from, to))
		return (result);
	if (!checkMove([from, to], result))
		return (result);
	if (!updateChessboard([from, to], result))
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
	king = board.get(match.black.King);//FIXME - usare currentPlayer.King
	if (king == null || king.piece == null)
		return (error(result, 500, "backend has lost track of the king, lol"));
	if (from == null || to == null)
		return (error(result, 403, "invalid positions"));
	if (from.piece == null)
		return (error(result, 403, "Square is empty"));
	if (!from.targetZones.has(arr[1]))
		return (error(result, 403, "destination not in piece targetZone"));
	if (to.piece)
	{
		if (to.piece.team == from.piece.team)
			return (error(result, 403, "you can't eat your team mates"));
	}
	if (from.piece?.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	if (isDangerous(king.dangerZones, king.piece.team) && !simulation(from, to, king))
		return (error(result, 403, "Your king is in danger"));
	if (!simulation(from, to, king))
		return (error(result, 403, "this would put your king in danger"));
	if (to.piece)
		match.currentPlayer.nPoints += to.piece.price;
	return (true);
}

/**
 * 
 * @param {Array<String>} selected 
 * @param {Result} result
 */
function updateChessboard (selected=[], result)
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
	return (true);
}

//SECTION - move utils

/**
 * 
 * @param {Square} from 
 * @param {Square} to 
 * @param {Square} king 
 * @returns 
 */
function simulation(from, to, king)
{
	let tmp = new Map();

	for (const [key, val] of board)
	{
		let	squareCopy;

		squareCopy = new Square(val);
		tmp.set(key, squareCopy);
	}
	to.piece = from.piece;
	from.piece = null;
	dangerUpdateAll();
	if (isDangerous(king.dangerZones, king.piece?.team))
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

module.exports = { move };