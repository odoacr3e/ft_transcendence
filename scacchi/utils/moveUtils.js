// @ts-check
// const { Match } = require("../Classes/Match/match.js");
const { enumInitNames, enumNames, kingMovements} = require("../Macro/enums.js");
const Macro = require("../Macro/macro.js");
const {bastardChecks} = require("./gameUtils.js");

/**@typedef {import("../Classes/Match/match.js").Match} Match*/
/**@typedef {import("../Classes/endPoint/result.js").Result} Result*/

/**
 * 
 * @param {*} match
 * @param {number} dx 
 * @param {number} dy
 * @param {boolean} clear
 */
let movePiece = (match, dy, dx, clear=false) =>
{
	let newRow = match.cursor.getRow() + dx;
	let newCol = match.cursor.getCol() + dy;

	if (newRow < 1 || newRow > match.board.heigth)
		return false;
	else if (newCol <= 0 || newCol > match.board.width)
		return false;

	if (clear == true)
	{
		let currentSquare = match.board.get(match.cursor.square);
		let zones = currentSquare?.targetZones;

		if (zones != null)
		{
			for (let zone of zones)
			{
				match.board.get(zone)?.dangerZones.delete(match.cursor.square);
			}
			zones.clear();
		}
	}
	match.cursor.setCursor(newRow, newCol);
	return true;
}

/**
 * 
 * @param {*} match 
 * @param {string | null} pos
 * @returns 
 */
let DangerUpdate = (match, pos=null) =>
{
	let	usedBoard;
	let	piece;
	let	startPos;

	usedBoard = match.board;
	if (pos != null)
		match.cursor.set(pos);
	startPos = match.cursor.square;
	piece = usedBoard.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		if (!bastardChecks(match, dx, dy, piece))
		{
			usedBoard.get(match.cursor.square).dangerZones.add(startPos);
			continue ;
		}
		while (movePiece(match, dy, dx, false))
		{
			usedBoard.get(match.cursor.square).dangerZones.add(startPos);
			usedBoard.get(startPos).targetZones.add(match.cursor.square);
			if (piece.moveLongRangeDEBUG == false || usedBoard.get(match.cursor.square)?.piece != null)
				break ;
		}
		match.cursor.square = startPos;
	}
	if (piece.isBoostedBool == true)
		piece.moveFunction(match);
	if (pos != null)
		match.board.updates.add(pos);
	else
		match.board.updates.add(match.cursor.square);
	return (1);
}

/**
 * 
 * @param {Match} match
 * @param {string} pos
 * @param {Result | null} result
 */
function dangerDelPiece(match, pos=match.cursor.square, result=null)
{
	let	pieceSquare;

	pieceSquare = match.board.get(pos);
	for (const target of pieceSquare.targetZones)
	{
		match.board.get(target).dangerZones.delete(pos);
		DangerUpdate(match, target);
	}
	if (result && result.specialMoves.CheckBastardMove())
	{
		match.cursor.Save();
		for (const move of kingMovements)
		{
			movePiece(match, move.dy, move.dx);
			match.board.get(match.cursor.square).dangerZones.delete(pos);	
			match.cursor.Restore();
		}
		match.cursor.Restore();
	}
	for (const [key, set] of pieceSquare.boostedTargetZones)
	{
		for (const target of set)
		{
			match.board.get(target).dangerZones.delete(pos);
			// DangerUpdate(match, target);
		}
	}
	for (const target of pieceSquare.dangerZones)
	{
		if (!result || result.specialMoves.CheckSniperMove() == 0)
			DangerUpdate(match, target);
		if (pos == null)
			throw ("DEBUG throw dangerZones");
		match.board.updates.add(target);
	}
	pieceSquare.targetZones.clear();
	pieceSquare.boostedTargetZones.clear();
	// pieceSquare.ClearZones();
	if (pos == null)
		throw ("DEBUG throw REMOVE");
	match.board.updates.add(pos);
}

/**
 * 
 * @param {Match} match
 * @param {string} pos
 * @param {Result | null} result
 */
function dangerUpPiece(match, pos=match.cursor.square, result=null)
{
	let	pieceSquare;
	let tmpSet;

	pieceSquare = match.board.get(pos);
	tmpSet = new Set(pieceSquare.dangerZones);
	for (const target of pieceSquare.targetZones)
	{
		match.board.get(target).dangerZones.delete(pos);
		// DangerUpdate(match, target);
	}
	for (const [key, set] of pieceSquare.boostedTargetZones)
	{
		for (const target of set)
		{
			match.board.get(target).dangerZones.delete(pos);
			// DangerUpdate(match, target);
		}
	}
	for (const target of tmpSet)
	{
		if (!result || result.specialMoves.CheckSniperMove() == 0)
		{
			dangerDelPiece(match, target, result);
			DangerUpdate(match, target);
		}
		if (pos == null)
			throw ("DEBUG throw dangerZones");
		match.board.updates.add(target);
	}
	pieceSquare.targetZones.clear();
	pieceSquare.boostedTargetZones.clear();
	// pieceSquare.ClearZones();
	if (pos == null)
		throw ("DEBUG throw REMOVE");
	match.board.updates.add(pos);
}

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} selected /* 0 = from, 1 = to
 * @param {Result | null} result
 */
function dangerUpdateMoved(match, selected=[], result=null)
{
	if (selected.length != 2)
		throw ("dangerUpdateMoved must be called with two pieces: from, to");
	dangerDelPiece(match, selected[0], result);
	dangerUpPiece(match, selected[1], result);
	DangerUpdate(match, selected[1]);
}

/**
 * 
 * @param {*} match 
 */
function dangerUpdateAll(match)
{
	let	temp;
	let usedBoard

	temp = match.cursor.square;
	usedBoard = match.board;
	for (let [pos, square] of usedBoard)
	{
		square.ClearZones();
	}
	for (let [pos, square] of usedBoard)
	{
		match.cursor.set(pos);
		if (square.piece && square.piece.isBoostedBool)
		{
			square.piece.moveFunction(match);
			continue ;
		}
		DangerUpdate(match);
	}
	match.cursor.set(temp);
}

module.exports = {movePiece, DangerUpdate, dangerUpdateAll, dangerUpdateMoved};