// @ts-check
const { abort } = require("node:process");
const lib = require("./lib.js");
const {cursor} = require("./cursor.js");
const {render} = require("./render.js");
const readline = require('node:readline');

//SECTION - main: inizializza e fa primo render, mette terminale in ascolto

initTerminal();
initRandomBoard();
render();

/**
 * 
 * @param {number} dx 
 * @param {number} dy
 * @param {boolean} clear
 */
function movePiece(dx, dy, clear)
{
	let newRow = cursor.getRow() + dy;
	let newCol = cursor.getCol() + dx;

	if (newRow < 0 || newRow >= lib.Macro.CHESSBOARD_H)
		return false;
	else if (newCol <= 0 || newCol > lib.Macro.CHESSBOARD_W)
		return false;

	if (clear == true)
	{
		let currentSquare = lib.Chess.board.get(cursor.square);
		let zones = currentSquare?.targetZones;

		if (zones != null)
		{
			for (let zone of zones)
			{
				lib.Chess.board.get(zone)?.dangerZones.delete(cursor.square);
			}
			zones.clear();
		}
	}
	cursor.setCursor(newRow, newCol);
	return true;
}

//SECTION - eventLoop: binda i tasti per fare cose

process.stdin.on('keypress', (str, key) => 
{
	let	dx;
	let	dy;

	dx = 0;
	dy = 0;
	if (key.ctrl && key.name == "c")
		process.exit();
	console.clear();
	switch (key.name)
	{
		case ("up") : case ("w") :
			dy -= 1;
			break ;
		case ("down") : case ("s") :
			dy += 1;
			break ;
		case ("left") : case ("a") :
			dx -= 1;
			break ;
		case ("right") : case ("d") :
			dx += 1;
			break ;
		case ("space") :
			DangerUpdate()
	}
	if (key.name != "space" && !movePiece(dx, dy, true))
		console.log("lol no");
	render();
	console.log("key", key.name);
});

function DangerUpdate()
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = lib.Chess.board.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArrayDEBUG)
	{
		while (movePiece(dx, dy, false))
		{
			lib.Chess.board.get(cursor.square)?.dangerZones.add(startPos);
			lib.Chess.board.get(startPos)?.targetZones.add(cursor.square);
			if (piece.moveLongRangeDEBUG == false || lib.Chess.board.get(cursor.square)?.piece != null)
				break ;
		}
		cursor.square = startPos;
	}
	return (1);
}

function initTerminal()
{
	readline.emitKeypressEvents(process.stdin);

	if (process.stdin.isTTY)
	{
		process.stdin.setRawMode(true);
	}
	else
	{
		console.log("questo test funziona da terminale");
		abort();
	}
}

/**
 * in futuro pescheremo questi dati da strutture fatte bene
 */
function initRandomBoard()
{
	let	rand;

	for (let [key, data] of lib.Chess.board)
	{
		rand = Math.random() * 16;
		rand = Math.floor(rand);
		if (rand <= 10)
			continue ;
		if (rand == 11)
			data.piece = new lib.Chess.Piece(lib.preset.Bastards, "", key, false);
		else if (rand == 12)
			data.piece = new lib.Chess.Piece(lib.preset.Champion, "", key, true);
		else if (rand == 13)
			data.piece = new lib.Chess.Piece(lib.preset.Jester, "", key, false);
		else if (rand == 14)
			data.piece = new lib.Chess.Piece(lib.preset.Minotaurus, "", key, true);
		else
			data.piece = new lib.Chess.Piece(lib.preset.Valkirya, "", key, true);
	}
}
