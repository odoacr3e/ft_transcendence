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
 */
function movePiece(dx, dy)
{
	let newRow = cursor.getRow() + dy;
	let newCol = cursor.getCol() + dx;

	if (newRow < 0 || newRow >= lib.Macro.CHESSBOARD_H)
		return false;
	else if (newCol <= 0 || newCol > lib.Macro.CHESSBOARD_W)
		return false;

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
		// case ("space") :
		// 	DangerUpdate()
	}
	// if (key.name != "space" && !lib.Chess.cursor.Move(dx, dy, true, true))
	if (!movePiece(dx, dy))
		console.log("lol no");
	render();
	console.log("key", key.name);
});

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
