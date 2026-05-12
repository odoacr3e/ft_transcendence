// @ts-check
const { Square} = require("./chessBoard.js");
const {eTeam} = require("./enums.js");
const { Cursor } = require("./cursor.js");
const lib = require("./lib/lib.js");
const {Match} = require("./match.js");
const {CHESSBOARD_H, CHESSBOARD_W} = require("./macro.js");
const enumNames = lib.Enums.enumNames;

/**
 * @param {Match | null} match 
 * @param {Array<String>} selected which positions are selected
 * @param {String} TargetDangerSwitch Valid value: "Target", "Danger", "None" 
 */
function render(match=null, selected=[], TargetDangerSwitch="")
{
	let buffer;
	let	board;
	let	coords;
	let	square;

	if (match)
		board = match.board;
	else
	{
		console.log("no match!");
		return ;
	}
	coords = getCoords(match);
	match.cursor.set(coords.start);
	buffer = "";	
	displayPlayerInfo(board, match);
	do
	{
		match.cursor.setCol(1);
		do
		{
			coords.curr = match.cursor.square;
			square = board.get(coords.curr);
			if (!square)
				throw (`board position ${match.cursor.square} gives back null pointer`);
			buffer += renderSquare(square, coords, selected, TargetDangerSwitch);
		}
		while (match.cursor.moveCol(+1))
		buffer += "\n";
	}
	while (match.cursor.moveRow(-1))
	match.cursor.set(coords.player);
	console.log(buffer);
}

/**
 * 
 * @param {Square} square 
 * @param {*} coords 
 * @param {Array<string>} selected
 * @param {string} TargetDangerSwitch 
 */
function renderSquare(square, coords, selected, TargetDangerSwitch)
{
	let	asciiArt;
	let	buffer;

	buffer = "";
	asciiArt = getAscii(square);
	if (square.piece && square.piece.team)
		buffer += `\x1b[48;5;${getSquareColor(square.piece.team)}m`;
	if (coords.player == coords.curr)
		buffer += `\x1b[32m[${asciiArt}]`;
	else if (coords.curr == selected[0])
		buffer += `\x1b[33m[${asciiArt}]`;
	else if (TargetDangerSwitch == "Target" && coords.playerSquare.targetZones.has(coords.curr))
		buffer += `\x1b[31m[${asciiArt}]`;
	else if (TargetDangerSwitch == "Danger" && coords.playerSquare.dangerZones.has(coords.curr))
		buffer += `\x1b[31m[${asciiArt}]`;
	else if (square.piece?.isBoostedBool == true)
		buffer += `\x1b[34m[${asciiArt}]`;
	else
		buffer += `[${asciiArt}]`;
	buffer += "\x1b[0m";
	return (buffer);
}

/**
 * 
 * @param {Match} match 
 * @returns 
 */
function getCoords(match)
{
	let	coords;
	let	endCol;

	coords = 
	{
		start: "",
		end: "",
		curr: "",
		player: "",
		playerSquare: new Square()
	};
	coords.start = "a" + CHESSBOARD_H;
	endCol = CHESSBOARD_W - "a".charCodeAt(0) + 1;
	coords.end = `${String.fromCharCode(endCol)}1`;
	coords.player = match.cursor.square;
	// @ts-ignore
	coords.playerSquare = match.board.get(coords.player);
	if (!coords.playerSquare)
		throw ("Render, getCoords: invalid cursor");
	return (coords);
}

/**
 * 
 * @param {Map<string, Square>} board
 * @param {Match | null} match
 */
function displayPlayerInfo(board, match)
{
	let	player;
	let	col;

	if (!match)
		return ;
	player = match.currentPlayer;
	col = getDotColor(match.currentPlayer.team);
	console.log(`It's ${col} turn.`);
	console.log(`points: ${player.nPoints}💲, bonus: ${player.bonusPointCounter}⚖️`);
	if (match.currentPlayer.useBoostBool == true)
		console.log("Ready to use boost! press t to cancel");
	else
		console.log("Press t to use boost!");
	if (kingThreat(board, match) == true)
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
 * @param {string} team
 */
function getDotColor(team)
{
	switch (team)
	{
		case (null) :
			return ("???");
		case (eTeam.Black) :
			return ("⚫️");
		case (eTeam.White) :
			return ("⚪");
		case (eTeam.Blue) :
			return ("🔵");
		case (eTeam.Green) :
			return ("🟢");
		case (eTeam.Red) :
			return ("🔴");
		case (eTeam.Yellow) :
			return ("🟡");
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