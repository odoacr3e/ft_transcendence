// @ts-check
const {movePiece} = require("../../utils.js");
/**
 * 
 * @param {string} pos 
 * @param {*} match 
 */
function berserkMode(pos, match)
{
	let startPos;
	let piece;
	let	targetSquare;

	startPos = match.cursor.square;
	piece = match.board.get(pos)?.piece;
	if (piece?.moveArray == null)
		throw ("entering in function berserkMode with a null piece :-(") ;//FIXME - errore grave, dare 500
	match.board.get(pos)?.boostedTargetZones.set(startPos, new Set());
	for (let {dx, dy} of piece?.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			targetSquare = match.board.get(match.cursor.square);
			if (!targetSquare)
				throw ("movePiece critical error");
			if (piece.type == "Champion" /* == enumNames.CHAMPION */) //FIXME - da mettere l'enum appena verra' spostato
			{
				targetSquare.dangerZones.add(pos);
				match.board.get(pos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
			}
			if (targetSquare.piece != null)
			{
				targetSquare.dangerZones.add(pos);
				match.board.get(pos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
				break ;
			}
		}
		match.cursor.square = startPos;
	}
	if (match.board.get(pos)?.boostedTargetZones.get(startPos)?.size == 0)
		match.board.get(pos)?.boostedTargetZones.delete(startPos);
}

module.exports = {berserkMode};