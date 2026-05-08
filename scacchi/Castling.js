// @ts-check
const {enumNames} = require("./pieces.js");
const {Square, Piece, board, copyBoard, cursor} = require("./lib/lib.js").Chess
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("./utils.js");
const {Match} = require("./match.js");
const {error, paramCheck, Result, clientBoard, checkMateAlert} = require("./handlers/game/utils.js");
const {getDirection} = require("./checkMate.js");

/** @typedef {import('./pieces.js').Piece} Piece */
/** @typedef {import('./chessBoard.js').Square} Square */

/**@typedef {{"king": Piece, "mino": Piece, "dir": [0, 0], "kingDanger": Set<string>}} pieces */
/* 
stesso team - OK
non mossi -  OK
re non sotto scacco - OK
caselle di movimento del re non sotto scacco
non in diagonale - OK

*/

/**
 * 
 * @param {Match} match
 * @param {Square} to
 * @param {Square} from 
 * @returns {boolean} 
 */
function checkCastling(match, to, from)
{
	let	pieces;
	let tmp;
	let dir;
	let	board;

	board = match.board;
	tmp = cursor.square;
	pieces = getPieces(match, from, to);
	if (!pieces)
		return false;
	dir = getDirection(match, pieces.mino.pos, pieces.king.pos);
	if (isDangerous(match, pieces.kingDanger, pieces.king.team))
		return false;
	if (dir.diffRow != 0 && dir.diffCol != 0)
		return false;
	else if (dir.diffRow == 0 && dir.diffCol == 0)
		return false;
	cursor.set(pieces.king.pos);
	for (let i = 0; movePiece(match, pieces.dir[0], pieces.dir[1]); ++i)
	{
		if (isDangerous(match, board.get(cursor.square)?.dangerZones, pieces.king.team))
			return false;
		if (cursor.square == pieces.mino.pos || i == 1)
			break;
	}
	cursor.set(tmp);
	return true;
}

/**
 * 
 * @param {Match} match
 * @param {Square} from 
 * @param {Square} to 
 * @returns 
 */
function getPieces(match, from, to)
{
	let toType;
	let fromType;
	let	board;
	/** @type {pieces}*/let	pieces;

	board = match.board;
	// @ts-ignore
	pieces = {};
	toType = to.piece?.type;
	fromType = from.piece?.type;
	if (!toType || !fromType)
		return (null);
	if (!from.piece || !to.piece)
		return (null);
	if ((to.piece?.team != from.piece?.team) && !to.piece?.isMovedBool && !to.piece?.isMovedBool)
		return null;
	if (fromType == enumNames.MINOTAURUS && toType == enumNames.KING)
	{
		pieces.king = to.piece;
		pieces.mino = from.piece;
	}
	else if (fromType == enumNames.KING || toType == enumNames.MINOTAURUS)
	{
		pieces.king = from.piece;
		pieces.mino = to.piece;
	}
	else
		return (null);
	// @ts-ignore
	pieces.kingDanger = board.get(pieces.king.pos)?.dangerZones;
	return (pieces);
}

module.exports = {checkCastling};