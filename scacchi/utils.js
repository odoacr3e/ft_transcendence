const {board, Square} = require("./chessBoard.js");
const Macro = require("./macro.js");
const {cursor} = require("./cursor.js");

/**
 * 
 * @param {Set<string> | undefined} setZones dangerZone to check
 * @param {string | undefined} team enumTeam to the piece to check
 */
let isDangerous = (setZones, team) =>
{
	if (setZones == undefined)
		return false;
	for (let x of setZones)
	{
		if (team == undefined)
			return (true);
		if (board.get(x)?.piece?.team != team)
			return (true);
	}
	return false;
}

/**
 * 
 * @param {number} dx 
 * @param {number} dy
 * @param {boolean} clear
 */
let movePiece = (dx, dy, clear) =>
{
	let newRow = cursor.getRow() + dy;
	let newCol = cursor.getCol() + dx;

	if (newRow < 1 || newRow > Macro.CHESSBOARD_H)
		return false;
	else if (newCol <= 0 || newCol > Macro.CHESSBOARD_W)
		return false;

	if (clear == true)
	{
		let currentSquare = board.get(cursor.square);
		let zones = currentSquare?.targetZones;

		if (zones != null)
		{
			for (let zone of zones)
			{
				board.get(zone)?.dangerZones.delete(cursor.square);
			}
			zones.clear();
		}
	}
	cursor.setCursor(newRow, newCol);
	return true;
}

let DangerUpdate = () =>
{
	let	usedBoard;
	let	startPos;
	let	piece;

	usedBoard = board;
	startPos = cursor.square;
	piece = usedBoard.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(dx, dy, false))
		{
			usedBoard.get(cursor.square)?.dangerZones.add(startPos);
			usedBoard.get(startPos)?.targetZones.add(cursor.square);
			if (piece.moveLongRangeDEBUG == false || board.get(cursor.square)?.piece != null)
				break ;
		}
		cursor.square = startPos;
	}
	return (1);
}

function dangerUpdateAll()
{
	let	temp;
	let	usedBoard;

	temp = cursor.square;
	usedBoard = board;
	for (let [pos, square] of usedBoard)
	{
		square.boostedTargetZones.clear();
		square.dangerZones.clear();
		square.targetZones.clear();
	}
	for (let [pos, square] of usedBoard)
	{
		cursor.set(pos);
		if (square.piece && square.piece.isBoostedBool)
		{
			square.piece.moveFunction();
			continue ;
		}
		DangerUpdate(usedBoard);
	}
	cursor.set(temp);
}

module.exports = {isDangerous, movePiece, DangerUpdate, dangerUpdateAll};