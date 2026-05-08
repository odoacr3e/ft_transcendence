// @ts-check
const { Square} = require("./chessBoard.js");
const {eTeam} = require("./enums.js");
const { Cursor } = require("./cursor.js");
const lib = require("./lib/lib.js");
const {Match} = require("./match.js");
const enumNames = lib.Enums.enumNames;

const RESET = "\x1b[0m";

/**
 * @param {Array<String>} selected which positions are selected
 * @param {String} TargetDangerSwitch Valid value: "Target", "Danger", "None" 
 * @param {Match | null} match 
 */
function render(selected=[], TargetDangerSwitch="", match=null)
{
	let buffer;
	let	i;
	let	asciiArt;
	let	startPos;
	let	usedBoard;

	// console.log(match?.board);
	if (match)
		usedBoard = match.board;
	else
		return ;
	buffer = "";
	startPos = usedBoard.get(match.cursor.square);
	if (!startPos)
		return (console.log("errore cursor"));
	displayPlayerInfo(usedBoard, match);
	i = 0;
	for (let [pos, data] of usedBoard)
	{
		asciiArt = getAscii(data);
		if (data.piece && data.piece.team)
			buffer += `\x1b[48;5;${getSquareColor(data.piece.team)}m`;
		if (match.cursor.square == pos)
			buffer += `\x1b[32m[${asciiArt}]`;
		else if (pos == selected[0])
			buffer += `\x1b[33m[${asciiArt}]`;
		else if (TargetDangerSwitch == "Target" && startPos.targetZones.has(pos))
			buffer += `\x1b[31m[${asciiArt}]`;
		else if (TargetDangerSwitch == "Danger" && startPos.dangerZones.has(pos))
			buffer += `\x1b[31m[${asciiArt}]`;
		else if (match.board.get(pos)?.piece?.isBoostedBool == true)
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
 * @param {Map<string, Square>} usedBoard
 * @param {Match | null} match
 */
function displayPlayerInfo(usedBoard, match)
{
	let	player;
	let	col;

	if (!match)
		return ;
	player = match.currentPlayer;
	col = `\x1b[${getSquareColor(player.team)}m`;
	console.log(`It's ${col}${player.team}${RESET} turn.`);
	console.log(`points: ${player.nPoints}💲, bonus: ${player.bonusPointCounter}⚖️`);
	if (kingThreat(usedBoard, match) == true)
		console.log(`${player.team} king is threatened💀`);
}

/**
 * @param {*} board
 * @param {*} match
 */
function kingThreat(board, match)
{
	if (lib.utils.isDangerous(match, match.board.get(match.currentPlayer.King)?.dangerZones, match.currentPlayer.team))
		return (true);
	return (false);
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
			return ("232");
		case (eTeam.Blue) :
			return ("44");
		case (eTeam.Green) :
			return ("42");
		case (eTeam.Red) :
			return ("41");
		case (eTeam.White) :
			return ("247");
		case (eTeam.Yellow) :
			return ("43");
		default :
			return ("49");
	}
}

module.exports = {render};