// @ts-check
const {CHESSBOARD_H, CHESSBOARD_W} = require("../../Macro/macro.js");
/**
 * 
 * @param {*} match 
 * @returns 
 */
let movementJester = function (match)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	match.board.get(startPos)?.boostedTargetZones.set(startPos, new Set());
	for (let {dx, dy} of piece.moveArray)
	{
		let row = match.cursor.getRow();
		let col = match.cursor.getCol();
		row = row + dx;
		col = col + dy;
		if (row > CHESSBOARD_H || row <= 0 || col > CHESSBOARD_W || col <= 0)
		{
			row = row % CHESSBOARD_H;
			col = col % CHESSBOARD_W;
			if (row < 0) row += CHESSBOARD_H;
			if (row == 0) row = CHESSBOARD_H;
			if (col < 0) col += CHESSBOARD_W;
			if (col == 0) col = CHESSBOARD_W;
			match.cursor.setCursor(row, col);
			match.board.get(startPos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
		}
		else
		{
			match.cursor.setCursor(row, col);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
		}
		match.board.get(match.cursor.square)?.dangerZones.add(startPos);
		match.cursor.square = startPos;
	}
	return (1);
}

module.exports = {movementJester};