// @ts-check
const {berserkMode} = require("./berserkMode.js");
const {movePiece} = require("../../utils/moveUtils.js");
const {isDangerous} = require("../../utils/gameUtils.js");
/**
 * 
 * @param {*} match 
 * @returns 
 */
let movementChampion = function (match /* res */)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == undefined)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			match.board.get(match.cursor.square)?.dangerZones.add(startPos);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
			if (!isDangerous(match, match.board.get(match.cursor.square)?.dangerZones, piece.team) && 
			(match.board.get(match.cursor.square)?.piece == null || 
			match.board.get(match.cursor.square)?.piece?.team != piece.team))
				berserkMode(startPos, match);
			if (match.board.get(match.cursor.square)?.piece != null)
				break ;
		}
		match.cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

module.exports = {movementChampion};