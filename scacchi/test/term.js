// @ts-check
const {Piece, board, Square} =					require("../lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("../lib.js").Enums;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../utils.js");

const lib =			require("../lib.js");
const {abort} = 	require("node:process");
const fs = 	require("node:fs");
const {cursor} = 	require("../cursor.js");
const {render} = 	require("../render.js");
const readline = 	require('node:readline');

//SECTION - main: inizializza e fa primo render, mette terminale in ascolto

initTerminal();
initRandomBoard();
dangerUpdateAll();
render();

//SECTION - eventLoop: binda i tasti per fare cose

								let	TargetDangerSwitch = "None";
/** @type {Array<String>} */	let	selected = [];

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
		case ("e") :
			if (TargetDangerSwitch == "None")
				TargetDangerSwitch = "Target";
			else if (TargetDangerSwitch == "Target")
				TargetDangerSwitch = "Danger";
			else if (TargetDangerSwitch == "Danger")
				TargetDangerSwitch = "None";
			break ;
		case ("q") :
			let	square = board.get(cursor.square);
			if (square?.piece == null)
				console.log("LMAO you can't boost the literal NOTHING LOL");
			else
				square.piece.isBoostedBool = !square.piece.isBoostedBool;
			let	temp = cursor.square;
			dangerUpdateAll();
			cursor.set(temp);
			break ;
		case ("space") :
			console.assert((selected.length < 2), "move array too large");
			selected.push(cursor.square);
			if (selected.length == 2)
			{
				if (moveFunctionDEBUG() == false)
					console.log("you cannot move LMAO");			
				selected = [];
			}
	}
	if (key.name != "space" && key.name != "e" && key.name != "q" && 
		!movePiece(dx, dy, false))
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
	console.log("Visualizing", TargetDangerSwitch, "press \"e\" to change");
	render(selected, TargetDangerSwitch);
	console.log(`keypressed: ${key.name}\n`, `Press \"space\" to move, \"q\" to boost`);
});

function moveFunctionDEBUG ()
{
	let	temp;
	let	from;
	let	to;
	let	fromType;
	let	toType;

	from = board.get(selected[0]);
	to = board.get(selected[1]);
	if (!from || !to)
	{
		return (false);
	}
	fromType = from.piece?.type;
	toType = to.piece?.type;
	if (fromType == null)
		fromType = "Square";
	else
		fromType = `\x1b[33m${fromType}\x1b[0m`;
	if (!from.targetZones.has(selected[1]))
		return false;
	if (toType == null)
		toType = "Square";
	else
		toType = `\x1b[33m${toType}\x1b[0m`;
	temp = from.piece;
	from.piece = to.piece;
	to.piece = temp;
	temp = cursor.square;
	dangerUpdateAll();
	cursor.set(temp);
	console.log(`SWAP ${fromType} with ${toType}`);
	console.log(`from ${selected[0]} to ${selected[1]}`);
	return (true);
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
		}
		else if (rand == 13)
		{
			data.piece = new Piece(lib.preset.Jester, "", key, false);
			data.piece.isBoostedBool = true;
		}
		else if (rand == 14)
		{
			data.piece = new Piece(lib.preset.Minotaurus, "", key, true);
		}
		else
		{
			data.piece = new Piece(lib.preset.Valkirya, "", key, true);
		}
	}
}
