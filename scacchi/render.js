// @ts-check
const { Square} = require("./chessBoard.js");
const {eTeam} = require("./enums.js");
const { Cursor } = require("./cursor.js");
const lib = require("./lib/lib.js");
const {Match} = require("./match.js");
const {CHESSBOARD_H, CHESSBOARD_W} = require("./macro.js");
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
	let	asciiArt;
	let	startPos;
	let	usedBoard;
	let	pos;
	let	corners;
	let	square;

	// console.log(match?.board);
	if (match)
		usedBoard = match.board;
	else
	{
		console.log("no match!");
		return ;
	}
	buffer = "";
	startPos = usedBoard.get(match.cursor.square);
	if (!startPos)
		return (console.log("errore cursor"));
	corners = getCorners();
	pos = corners.left;//starts from top-left corner
	
	displayPlayerInfo(usedBoard, match);
	while (pos)
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
	}
	console.log(buffer);
}

function getCorners()
{
	let	corners;
	let	rightCol;

	corners = 
	{
		left: "",
		right: ""
	};
	corners.left = "a" + CHESSBOARD_H;
	rightCol = CHESSBOARD_W - "a".charCodeAt(0) + 1;
	corners.right = `${String.fromCharCode(rightCol)}1`;
	return (corners);
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