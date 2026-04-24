// @ts-check
const {Piece, board, Square} =					require("./lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("./lib.js").Enums;
const {isDangerous, movePiece, DangerUpdate} =	require("./utils.js");

const lib =			require("./lib.js");
const {abort} = 	require("node:process");
const fs = 	require("node:fs");
const {cursor} = 	require("./cursor.js");
const {render} = 	require("./render.js");
const readline = 	require('node:readline');

//SECTION - main: inizializza e fa primo render, mette terminale in ascolto

initTerminal();
initRandomBoard();
render();

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
			if (!board.get(cursor.square)?.piece?.isBoostedBool)
				DangerUpdate();
			else
				board.get(cursor.square)?.piece?.moveFunction();
	}
	if (key.name != "space" && !movePiece(dx, dy, false))
	{
		// let player1 = {
			// name: "player1",
			// team: eTeam.White,
			// pieces: 16,
			// points: 0,
		// 
		// }
		// let player2 = {
			// name: "player2",
			// team: eTeam.Black,
			// pieces: 16,
			// points: 0,
		// }
		// let match = { p1: player1, p2: player2, board: Object.fromEntries(board) };
		// const json = JSON.stringify(
    	// match,
    	// (key, value) => {
    	    // if (value instanceof Map) return Object.fromEntries(value);
    	    // if (value instanceof Set) return Array.from(value);
    	    // return value;
    	// },2);
		// fs.writeFileSync("./match.json", json);
		console.log("lol no");
	}
	console.log("row", cursor.getRow(), ", col", cursor.getCol(), ", cursor", cursor.square);
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

	for (let [key, data] of board)
	{
		rand = Math.random() * 16;
		rand = Math.floor(rand);
		if (rand <= 10)
			continue ;
		if (rand == 11)
			data.piece = new Piece(lib.preset.Bastards, "", key, false);
		else if (rand == 12)
		{
			data.piece = new Piece(lib.preset.Champion, "", key, true);
			data.piece.isBoostedBool = true;
		}
		else if (rand == 13)
		{
			data.piece = new Piece(lib.preset.Jester, "", key, false);
			data.piece.isBoostedBool = true;
		}
		else if (rand == 14)
		{
			data.piece = new Piece(lib.preset.Minotaurus, "", key, true);
			data.piece.isBoostedBool = true;
		}
		else
		{
			data.piece = new Piece(lib.preset.Valkirya, "", key, true);
			data.piece.isBoostedBool = true;
		}
	}
}
