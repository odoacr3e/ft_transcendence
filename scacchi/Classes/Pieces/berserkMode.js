// @ts-check
import {movePiece, setBoostedInfluence} from "../../utils/moveUtils.js";
import {enumNames} from "../../Macro/enums.js";

/**@typedef {import("../Match/match.js").Match} Match*/

/**
 * 
 * @param {string} pos 
 * @param {Match} match 
 */
function berserkMode(pos, match)
{
	let startPos;
	let piece;
	let	targetSquare;

	startPos = match.cursor.square;
	piece = match.board.get(pos)?.piece;
	if (piece?.moveArray == null)
		throw ("entering in function berserkMode with a null piece :-(");
	match.board.get(pos)?.boostedTargetZones.set(startPos, new Set());
	for (let {dx, dy} of piece?.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			targetSquare = match.board.get(match.cursor.square);
			if (!targetSquare)
				throw ("movePiece critical error");
			if (piece.type  == enumNames.CHAMPION)
			{
				targetSquare.dangerZones.add(pos);
				match.board.get(pos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
			}
			match.board.AddInfluence(pos, match.cursor.square);
			if (targetSquare.piece != null)
			{
				targetSquare.dangerZones.add(pos);
				match.board.get(pos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
				setBoostedInfluence(match, piece, match.cursor.square, dx, dy);
				break ;
			}
		}
		match.cursor.square = startPos;
	}
	if (match.board.get(pos)?.boostedTargetZones.get(startPos)?.size == 0)
		match.board.get(pos)?.boostedTargetZones.delete(startPos);
}

/*
	square => e2: e3, e4, d3, f3
	board: key: e3, value: e2
	board: key: e4, value: e2
	board: key: d3, value: e2
	board: key: f3, value: e2

	board.influenceMap(from)
	board.get(minotauroCoord) => square.influenceMap.forEach
*/

export {berserkMode};