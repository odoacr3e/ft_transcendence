// @ts-check
const {movePiece} = require("../../utils/moveUtils.js");
const {bastardChecks} = require("../../utils/gameUtils.js");
/**
 * 
 * @param {*} match 
 * @returns 
 */
let movementBastards = function (match)
{
	let	usedBoard;
	let	piece;
	let	startPos;

	usedBoard = match.board;
	startPos = match.cursor.square;
	piece = usedBoard.get(match.cursor.square)?.piece;
	if (piece == null)
		return (false);
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
	return (true);
}

module.exports = {movementBastards};