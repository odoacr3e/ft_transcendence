// @ts-check
const {Piece, board, Square} =					require("../lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("../lib.js").Enums;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../utils.js");
const {error, move} = require("../handlers/game/Game.js");

const lib =			require("../lib.js");
const {abort} = 	require("node:process");
const fs = 	require("node:fs");
const {cursor} = 	require("../cursor.js");
const {render} = 	require("../render.js");
const readline = 	require('node:readline');
const {app} = require("../server.js");
const {match} = require("../match.js");

//SECTION - main: inizializza e fa primo render, mette terminale in ascolto
const	rng = initRng(1);
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
				console.clear();
				let	result = move(selected[0], selected[1]);
				selected = [];
				if (result.status != 200)
					return (error(null, result));	
			}
	}
	if (key.name != "space" && key.name != "e" && key.name != "q" && 
		!movePiece(dx, dy, false))
	{
		console.log("lol no");
	}
	console.log("row", cursor.getRow(), ", col", cursor.getCol(), ", cursor", cursor.square);
	console.log("Visualizing", TargetDangerSwitch, "press \"e\" to change");
	render(selected, TargetDangerSwitch);
	console.log(`keypressed: ${key.name}\n`, `Press \"space\" to move, \"q\" to boost`);
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

//SECTION - random

/**
 * @param {number | null} seed
 */
function initRng(seed=null)
{
	if (seed == null)
		seed = Math.floor(Math.random() * (1 << 30));
	console.log("seed:", seed);
	const	seedrandom = require("seedrandom");
	const	rngBase = seedrandom(seed.toString());
	const	rng = (mod = (1 << 30)) =>
	{
		let x;
		
		x = rngBase() * mod;
		return (Math.floor(x));
	}
	return (rng);
}

/**
 * in futuro pescheremo questi dati da strutture fatte bene
 */
function initRandomBoard()
{
	let	rand;

	for (let [key, data] of board)
	{
		rand = rng(16);
		if (key == "a1")
		{
			data.piece = new Piece(lib.preset.King, "", key, false);
			match.black.King = key;
		}
		else if (rand <= 10)
			continue ;
		else if (rand == 11)
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
		if (rng(2) == 1)
			data.piece.team = eTeam.White;
	}
}

/*
	seed interessanti
	62: scacco matto ciao ciao
	63: scacco matto prevenibile
*/
