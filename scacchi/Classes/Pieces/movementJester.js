// @ts-check

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
		if (row > match.board.heigth || row <= 0 || col > match.board.width || col <= 0)
		{
			row = row % match.board.heigth;
			col = col % match.board.width;
			if (row < 0) row += match.board.heigth;
			if (row == 0) row = match.board.heigth;
			if (col < 0) col += match.board.width;
			if (col == 0) col = match.board.width;
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

export {movementJester};