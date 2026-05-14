// @ts-check
const {enumNames} = require("../Macro/enums.js");
const {Square, Piece, board, copyBoard, cursor} = require("../lib/lib.js").Chess
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../utils.js");
const {Match} = require("../Classes/Vault/match.js");
const {error, paramCheck, Result, clientBoard, checkMateAlert} = require("../handlers/game/utils.js");
const {getDirection} = require("./checkMate.js");

/* 

Classi/ -> Fatto
		Piecese/ un file per pezzo (con dentro la funzione moveBoost), e uno per i preset
		ChessBoard/ ChessBoard, cursor 
		Vault/ Vault, match, history
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