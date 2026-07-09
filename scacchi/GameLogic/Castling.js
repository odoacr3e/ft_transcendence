// @ts-check

//SECTION - castling functions
/*
	list of exports:
	-	checkCastling:	checks if a castling move is possible or not.	
*/

import {enumNames} from "../Macro/enums.js";
import { Chess } from "../lib/lib.js";
const {Square, Piece} = Chess;
import {Match} from "../Classes/Chess/match.js";
import {getDirection} from "./checkMate.js";
import {isDangerous} from "../utils/checkDanger.js";
import {movePiece} from "../utils/dangerUpdate.js";
import { Result } from "../Classes/endPoint/result.js";
import { DangerUpdate } from "../utils/dangerUpdate.js";

/** @typedef {import('../Classes/Chess/Pieces/pieces.js').Piece} Piece */
/** @typedef {import('../Classes/Chess/chessBoard.js').Square} Square */

/**@typedef {{"king": Piece, "mino": Piece, "dir": { diffRow: number; diffCol: number; }, "kingDanger": Set<string>}} pieces */
/* 
stesso team - OK
non mossi -  OK
re non sotto scacco - OK
caselle di movimento del re non sotto scacco
non in diagonale - OK

*/

/**
 * checks if a castling move is possible or not.
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
	let	currSquare;

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
		currSquare = board.get(match.cursor.square);
		if (isDangerous(match, currSquare.dangerZones, pieces.king.team))
		{
			match.cursor.Restore();
			return false;
		}
		if (match.cursor.square == pieces.mino.pos || i == 1)
			break;
		if (currSquare.piece)
		{
			match.cursor.Restore();
			return false;
		}
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
 */
function moveCastling(match, from, to)
{
	let pieces = getPieces(match, from, to);
	let kpos;
	let mpos;

	kpos = pieces?.king.pos;
	mpos = pieces?.mino.pos;
	match.cursor.Save();
	if (pieces == null)
		throw ("moveCastling: we have lost our pieces coords, sorry");
	match.board.updates.add(kpos);
	match.board.updates.add(mpos);
	match.cursor.set(pieces.king.pos);
	for (let i = 0; movePiece(match, pieces.dir.diffCol, pieces.dir.diffRow); ++i)
	{
		if (match.cursor.square == pieces.mino.pos || i == 1)
			break;
	}
	let square1 = match.board.get(match.cursor.square);
	if (square1)
	{
		pieces.king.pos = match.cursor.square;
		square1.piece = pieces.king;
	}
	// @ts-ignore
	let square2 = match.board.get(kpos);
	if (square2)
		square2.piece = null;
	movePiece(match, -pieces.dir.diffCol, -pieces.dir.diffRow);
	let square3 = match.board.get(match.cursor.square);
	if (square3)
	{
		pieces.mino.pos = match.cursor.square;
		square3.piece = pieces.mino;
	}
	// @ts-ignore
	let square4 = match.board.get(mpos);
	if (square4)
		square4.piece = null;
	if (square1.piece)
		match.currentPlayer.King = square1.piece.pos;
	else
		throw ("moveCastling: backend has lost the king");
	match.currentPlayer.castlingArray.clear();
	pieces.king.isMovedBool = true;
	pieces.mino.isMovedBool = true;
	DangerUpdate(match, pieces.mino.pos, true, true);
	DangerUpdate(match, pieces.king.pos, true, true);
	match.cursor.Restore();
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
	if (fromType == enumNames.KING && toType == enumNames.MINOTAURUS)
	{
		pieces.king = from.piece;
		pieces.mino = to.piece;
	}
	else
		return (null);
	pieces.dir = getDirection(match, pieces.mino.pos, pieces.king.pos);
	pieces.kingDanger = board.get(pieces.king.pos).dangerZones;
	return (pieces);
}

export {checkCastling, moveCastling, getPieces};