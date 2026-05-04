// @ts-check
const lib = require("../../lib/lib.js");
const {MOVEMENT_MAX, MOVEMENT_MIN} = require("../../macro");
const {abort} = require("node:process");
const {Piece, board, Square, copyBoard, cursor} = require("../../lib/lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {render} = require("../../render.js");
const {match} = require("../../match.js");
const {error, paramCheck, Result, clientBoard} = require("./utils.js");

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
	// @ts-ignore
	result.board = clientBoard(board, [from, to]);
	return (result);
}

/**
 * 
 * @param {Array<String>} arr
 * @param {Result} result
 */
function checkMove(arr=[], result)
{
	let	from;
	let	to;
	let	king;

	from = board.get(arr[0]);
	to = board.get(arr[1]);
	king = board.get(match.currentPlayer.King);//FIXME - usare currentPlayer.King
	if (king == null || king.piece == null)
		return (error(result, 500, "backend has lost track of the king, lol"));
	if (match.moves >= MOVEMENT_MIN)
		return (error(result, 403, "Mr. Greedy cheater"));
	//FIXME - gestire controlli su piu mosse, per ora diamo OK
	// if (match.moves == MOVEMENT_MIN && uri != secondMove)
	// 	return (error(result, 403, "Mr. Greedy cheater"));
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
	if (isDangerous(king.dangerZones, king.piece.team) && !simulation(arr))
		return (error(result, 403, "Your king is in danger"));
	if (!simulation(arr))
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
function updateChessboard(selected=[], result)
{
	let	from;
	let	to;

	from = board.get(selected[0]);
	to = board.get(selected[1]);
	if (!from || !to)
	{
		return (error(result, 500, "from | to bug in moveFunction"));
	}
	if (selected[0] == match.currentPlayer.King)
		match.currentPlayer.King = selected[1];
	printSwap(selected, from, to);
	to.piece = from.piece;
	from.piece = null;
	match.moves++;
	dangerUpdateAll();
	return (true);
}

//SECTION - move utils

/**
 * 
 * @param {Array<String>} selected
 * @returns 
 */
function simulation(selected)
{
	let tmp;
	let	from;
	let	to;
	let	king;

	tmp = copyBoard(board);
	from = board.get(selected[0]);
	to = board.get(selected[1]);
	king = board.get(match.currentPlayer.King);
	if (!from || !to || !king)
		return (false); // FIXME error 500 : impossibile
	to.piece = from.piece;
	from.piece = null;
	if (selected[0] == match.currentPlayer.King)
		king = to;
	dangerUpdateAll();
	if (isDangerous(king.dangerZones, king.piece?.team))
	{
		console.log()
		copyBoard(tmp, board);
		dangerUpdateAll();
		return (false);
	}
	copyBoard(tmp, board);
	dangerUpdateAll();
	return (true);
}

/**
 * 
 * @param {Array<string>} selected 
 * @param {Square} from 
 * @param {Square} to 
 */
function printSwap(selected, from, to)
{
	let	fromType;
	let	toType;

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
	console.log(`SWAP ${fromType} with ${toType}`);
	console.log(`from ${selected[0]} to ${selected[1]}`);
}

module.exports = { move };