const {board, Square} = require("./chessBoard.js");

/**
 * potremmo metterla nelle utils volendo
 * @param {Set<string>} setZones
 * @param {string} team
 */
let isDangerous = (setZones, team) =>
{
	for (let x of setZones)
	{
		if (board.get(x)?.piece?.team != team)
			return true;
	}
	return false;
}

module.exports = {isDangerous};