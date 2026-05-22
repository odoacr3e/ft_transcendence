// @ts-check
const {enumNames} = require("../Macro/enums.js");
const {Square, Piece} = require("../lib/lib.js").Chess
const {Match} = require("../Classes/Match/match.js");
const {getDirection} = require("./checkMate.js");
const {isDangerous} = require("../utils/gameUtils.js");
const {movePiece} = require("../utils/moveUtils.js");
const { Result } = require("../Classes/endPoint/result.js");

/* 

Classi/ -> Fatto
		Piecese/ un file per pezzo (con dentro la funzione moveBoost), e uno per i preset
		ChessBoard/ ChessBoard, cursor 
		Match/ match, match, history
Utility/
		match/ 
		move/
Macro/ -> Fatto
	macro, enum
GameLogic/ 
	checkMate, Castling e roba dentro move
test/ -> Fatto
	render
*/

/** @typedef {import('../Classes/Pieces/pieces.js').Piece} Piece */
/** @typedef {import('../Classes/ChessBoard/chessBoard.js').Square} Square */

/**@typedef {{"king": Piece, "mino": Piece, "dir": { diffRow: number; diffCol: number; }, "kingDanger": Set<string>}} pieces */
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
 * @param {Result} result
 * @param {Square} to
 * @param {Square} from 
 * @returns {boolean} 
 */
function checkCastling(match, result, to, from)
{
	let	pieces;
	let	board;

	board = match.board;
	match.cursor.Save();
	pieces = getPieces(match, from, to);
	if (!pieces)
		return false;
	if (isDangerous(match, pieces.kingDanger, pieces.king.team))
		return false;
	if (pieces.king.isMovedBool || pieces.mino.isMovedBool)
		return false;
	if (pieces.dir.diffRow != 0 && pieces.dir.diffCol != 0)
		return false;
	else if (pieces.dir.diffRow == 0 && pieces.dir.diffCol == 0)
		return false;
	match.cursor.set(pieces.king.pos);
	for (let i = 0; movePiece(match, pieces.dir.diffCol, pieces.dir.diffRow); ++i)
	{
		if (isDangerous(match, board.get(match.cursor.square)?.dangerZones, pieces.king.team))
		{
			match.cursor.Restore();
			return false;
		}
		if (match.cursor.square == pieces.mino.pos || i == 1)
			break;
	}
	match.cursor.Restore();
	result.specialMoves.SetCastling();
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
	pieces.dir = getDirection(match, pieces.mino.pos, pieces.king.pos);
	// @ts-ignore
	pieces.kingDanger = board.get(pieces.king.pos)?.dangerZones;
	return (pieces);
}

module.exports = {checkCastling, getPieces};