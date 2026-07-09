//@ts-check

/**@typedef {import("../Classes/Chess/match.js").Match} Match*/

/**
 * try to move the cursor to dx, dy. return true/false
 * @param {Match} match
 * @param {number} dx 
 * @param {number} dy
 */
export function movePiece(match, dy, dx)
{
	let newRow = match.cursor.getRow() + dx;
	let newCol = match.cursor.getCol() + dy;
	let	oldCursor = match.cursor.square;

	if (newRow < 1 || newRow > match.board.heigth)
		return false;
	else if (newCol <= 0 || newCol > match.board.width)
		return false;
	match.cursor.setCursor(newRow, newCol);
	if (match.board.get(match.cursor.square).wallBool == true)
	{
		match.cursor.set(oldCursor);
		return false;
	}
	return true;
}
