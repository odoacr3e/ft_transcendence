// @ts-check
const { Square, board, eTeam } = require("./chessBoard.js");
const { cursor } = require("./cursor.js");
const lib = require("./lib.js");
const enumNames = lib.Enums.enumNames;

/**
 * @param {Array<String>} selected which positions are selected
 * @param {String} TargetDangerSwitch Valid value: "Target", "Danger", "None"  
 */
function render(selected=[], TargetDangerSwitch="")
{
	let buffer = "";
	let	i;
	let	asciiArt;
	let	startPos;

	startPos = board.get(cursor.square);
	if (!startPos)
		return (console.log("errore cursor"));
	i = 0;
	for (let [pos, data] of lib.Chess.board)
	{
		asciiArt = getAscii(data);
		if (data.piece && data.piece.team)
			buffer += `\x1b[1;${getSquareColor(data.piece.team)}m`;
		if (lib.Chess.cursor.square == pos)
			buffer += `\x1b[32m[${asciiArt}]`;
		else if (pos == selected[0])
			buffer += `\x1b[33m[${asciiArt}]`;
		else if (TargetDangerSwitch == "Target" && startPos.targetZones.has(pos))
			buffer += `\x1b[31m[${asciiArt}]`;
		else if (TargetDangerSwitch == "Danger" && startPos.dangerZones.has(pos))
			buffer += `\x1b[31m[${asciiArt}]`;
		else if (lib.Chess.board.get(pos)?.piece?.isBoostedBool == true)
			buffer += `\x1b[34m[${asciiArt}]`;
		else
			buffer += `[${asciiArt}]`;
		buffer += "\x1b[0m";
		i++;
		if (i == lib.Macro.CHESSBOARD_H)
		{
			buffer += `\n`;
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
			return (" ");
	}
}

/**
 * 
 * @param {eTeam | null} team 
 */
function getSquareColor(team)
{
	switch (team)
	{
		case (null) :
			return ("49");
		case (eTeam.Black) :
			return ("40");
		case (eTeam.Blue) :
			return ("44");
		case (eTeam.Green) :
			return ("42");
		case (eTeam.Red) :
			return ("41");
		case (eTeam.White) :
			return ("47");
		case (eTeam.Yellow) :
			return ("43");
		default :
			return ("49");
	}
}

module.exports = {render};