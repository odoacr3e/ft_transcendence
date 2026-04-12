// @ts-check
const { Square } = require("../data/chessBoard.js");
const lib = require("../data/lib.js");
const enumNames = lib.Enums.enumNames;

/**
 * prints on terminal the chessboard
 * cursor is green
 * danger is red
 */
function render()
{
	let buffer = "";
	let	i;
	let	asciiArt;

	i = 0;
	for (let [pos, data] of lib.Chess.board)
	{
		asciiArt = getAscii(data);
		if (lib.Chess.cursor.position == pos)
			buffer += `\x1b[32m[${asciiArt}]\x1b[0m`;
		else if (data.dangerZones.length != 0)
			buffer += `\x1b[31m[${asciiArt}]\x1b[0m`;
		else
			buffer += `[${asciiArt}]`;
		i++;
		if (i == lib.Macro.CHESSBOARD_H)
		{
			buffer += "\n";
			i = 0;
		}
	}
	console.log(buffer);
}

/**
 * 
 * @param {Square} data 
 */
function getAscii(data)
{
	switch (data.piece?.type)
	{
		case (null) :
			return (" ");
		case (enumNames.BASTARDS) :
			return ("B");
		case (enumNames.CHAMPION) :
			return ("C");
		case (enumNames.JESTER) :
			return ("J");
		case (enumNames.KING) :
			return ("K");
		case (enumNames.MINOTAURUS) :
			return ("M");
		case (enumNames.VALKIRYA) :
			return ("V");
		default :
			return ("");
	}
}

module.exports = {render};