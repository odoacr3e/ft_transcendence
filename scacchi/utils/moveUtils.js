// @ts-check
// const { Match } = require("../Classes/Match/match.js");
const Macro = require("../Macro/macro.js");
const {bastardChecks} = require("./gameUtils.js");

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
	startPos = match.cursor.square;
	if (pos != null)
		match.cursor.set(pos);
	piece = usedBoard.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		if (!bastardChecks(match, dx, dy, piece))
		{
			usedBoard.get(match.cursor.square)?.dangerZones.add(startPos);
			continue ;
		}
		while (movePiece(match, dy, dx, false))
		{
			usedBoard.get(match.cursor.square)?.dangerZones.add(startPos);
			usedBoard.get(startPos)?.targetZones.add(match.cursor.square);
			if (piece.moveLongRangeDEBUG == false || usedBoard.get(match.cursor.square)?.piece != null)
				break ;
		}
		match.cursor.square = startPos;
	}
	if (piece.isBoostedBool == true)
		piece.moveFunction(match);
	return (1);
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
		square.boostedTargetZones.clear();
		square.dangerZones.clear();
		square.targetZones.clear();
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

module.exports = {movePiece, DangerUpdate, dangerUpdateAll};