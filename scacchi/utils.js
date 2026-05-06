const {board, Square, eTeam} = require("./chessBoard.js");
const Macro = require("./macro.js");
const {cursor} = require("./cursor.js");
const { start } = require("node:repl");

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
let movePiece = (dy, dx, clear=false) =>
{
	let newRow = cursor.getRow() + dx;
	let newCol = cursor.getCol() + dy;

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
		if (!bastardChecks(dy, dx, piece, startPos)) // scambiato dx e dy
		{
			usedBoard.get(cursor.square)?.dangerZones.add(startPos);
			continue ;
		}
		while (movePiece(dy, dx, false)) // scambiato dx e dy
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

/*										dy/dx	dy/dx	dy/dx
	red/white: SOUTH, dx positivo  -->	1, 0	1,-1	1,1
	yellow/black: NORTH dx negativo		-1, 0	-1,-1	-1,1
	blue: WEST dy negativo				0, 1	-1,1	1,1
	green: EAST dy positivo				0, -1	-1,-1	1,-1
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
 * @param {Piece} piece
 */
function bastardChecks(dy, dx, piece)
{
	let tmp;
	let	target;

	if (piece.type != "Bastards")
		return true;
	if (!bastardMove[piece.team]) // FIXME errore grave: impossibile
		return false;
	if (!bastardMove[piece.team].has(`${dx}|${dy}`))
		return false;
	tmp = cursor.square;
	cursor.moveRow(dy);
	cursor.moveCol(dx);
	target = board.get(cursor.square)?.piece;
	cursor.set(tmp);
	if (dx != 0 && dy != 0)//NOTE - bastards moves diagonally
	{
		if (!target || target.team == piece.team)
			return (false);
		return (true);
	}
	else if (target)//NOTE - bastards moves front
		return (false);
	cursor.moveCol(dx + dx);
	cursor.moveRow(dy + dy);
	if (!piece.isMovedBool && !board.get(cursor.square).piece)
	{
		board.get(tmp).targetZones.add(cursor.square);
		board.get(cursor.square).dangerZones.add(tmp);
	}
	cursor.set(tmp);
	return (true);
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