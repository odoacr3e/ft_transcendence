// @ts-check
const fs = require("fs");

const {Square} = require("./chessBoard.js");
// const {Piece} = require("./pieces.js");
const Macro = require("./macro.js");
const {eEvents} = require("./enums.js");
const {Cursor} = require("./cursor.js");
const {Match} = require("./match.js");
const { Piece } = require("./pieces.js");

/**
 * 
 * @param {Match} match
 * @param {Set<string> | undefined} setZones dangerZone to check
 * @param {string | undefined} team enumTeam to the piece to check
 */
let isDangerous = (match, setZones, team) =>
{
	let	board;

	board = match.board;
	if (setZones == undefined)
		return false;
	for (let x of setZones)
	{
		if (team == undefined)
			return (true);
		if (match.board.get(x)?.piece?.team != team)
			return (true);
	}
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {number} dx 
 * @param {number} dy
 * @param {boolean} clear
 */
let movePiece = (match, dy, dx, clear=false) =>
{
	let newRow = match.cursor.getRow() + dx;
	let newCol = match.cursor.getCol() + dy;

	if (newRow < 1 || newRow > Macro.CHESSBOARD_H)
		return false;
	else if (newCol <= 0 || newCol > Macro.CHESSBOARD_W)
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
 * @param {Match} match 
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

/*										dy/dx	dy/dx	dy/dx
	red/white: SOUTH, dy positivo  -->	1, 0	1,-1	1,1
	yellow/black: NORTH dy negativo		-1, 0	-1,-1	-1,1
	blue: WEST dx positivo				0, 1	-1,1	1,1
	green: EAST dx positivo				0, -1	-1,-1	1,-1
*/
let bastardMove = // aggiornato movimenti
{
	white: new Set(["1|0", "1|1", "1|-1"]),
	red: new Set(["1|0", "1|1", "1|-1"]),
	black: new Set(["-1|0", "-1|-1", "-1|1"]),
	yellow: new Set(["-1|0", "-1|-1", "-1|1"]),
	blue: new Set(["0|1", "-1|1", "1|1"]),
	green: new Set(["0|-1", "-1|-1", "1|-1"])
}

/**
 * 
 * @param {Match} match
 * @param {Number} dy
 * @param {Number} dx
 * @param {Piece} piece
 */
function bastardChecks(match, dy, dx, piece)
{
	let tmp;
	let	target;

	if (piece.type != "Bastards")
		return true;
	//@ts-ignore
	if (!bastardMove[piece.team]) // FIXME errore grave: impossibile
		return false;
	// @ts-ignore
	if (!bastardMove[piece.team].has(`${dy}|${dx}`))
		return false;
	tmp = match.cursor.square;
	match.cursor.moveRow(dy);
	match.cursor.moveCol(dx);
	target = match.board.get(match.cursor.square)?.piece;
	match.cursor.set(tmp);
	if (dx != 0 && dy != 0)//NOTE - bastards moves diagonally
	{
		if (!target || target.team == piece.team)
			return (false);
		return (true);
	}
	else if (target)//NOTE - bastards moves front
		return (false);
	match.cursor.moveRow(dy + dy);
	match.cursor.moveCol(dx + dx);
	if (!piece.isMovedBool && !match.board.get(match.cursor.square).piece)
	{
		match.board.get(tmp).targetZones.add(match.cursor.square);
		match.board.get(match.cursor.square).dangerZones.add(tmp);
	}
	match.cursor.set(tmp);
	return (true);
}

/**
 * 
 * @param {Match} match 
 */
function dangerUpdateAll(match)
{
	let	temp;
	let usedBoard

	console.log("dangerUpdateAll call");
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

module.exports = {isDangerous, movePiece, DangerUpdate, dangerUpdateAll};