const {board, Square, eTeam} = require("./chessBoard.js");
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
			// if (!bastardChecks(dx, dy, piece))
			// 	continue ;
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
let bastardMove = 
{
	white: [[0, 1], [1, 1], [-1, 1]],
	red: [[0, 1], [1, 1], [-1, 1]],
	black: [[0, -1], [1, -1], [-1, -1]],
	yellow: [[0, -1], [1, -1], [-1, -1]],
	blue: [[1, 0], [1, -1], [1, 1]],
	green: [[-1, 0], [-1, -1], [-1, 1]]
}

/**
 * @param {Piece} piece
 */
function bastardChecks(dx, dy, piece)
{
	let tmp = cursor.square;
	let	target;

	if (piece.type != "Bastards")
		return true;
	console.log(bastardMove[piece.team], dx);
	console.log(bastardMove[piece.team][0] == dx);
	console.log("----");
	console.assert(bastardMove[piece.team], "errore bastardChecks");
	if (!bastardMove[piece.team]) // FIXME errore grave: impossibile
		return false;
	if (!bastardMove[piece.team].includes([dx, dy]))
		return false;
	if (dx != 0 && dy != 0)
	{
		cursor.setCursor(dx, dy);
		target = board.get(cursor.square).piece; 
		if (!target || target.team != piece.team)
			return (cursor.set(tmp), false);
	}
	return true;
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