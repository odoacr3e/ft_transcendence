// @ts-check
const {berserkMode} = require("./berserkMode.js");
const {movePiece} = require("../../utils.js");
/**
 * 
 * @param {*} match 
 * @returns 
 */
let movementMinotaurus = function (match /* res */)
{
	let	startPos;
	let	piece;
	let	otherPiece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			otherPiece = match.board.get(match.cursor.square)?.piece;
			match.board.get(match.cursor.square)?.dangerZones.add(startPos);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
			if (otherPiece != null)
			{
				// if (otherPiece.team != piece.team)
					berserkMode(startPos, match);
				break ;
			}
		}
		match.cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

module.exports = {movementMinotaurus};