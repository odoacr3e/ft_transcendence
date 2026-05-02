// @ts-check
const {Piece, board, Square} =					require("../lib/lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("../lib/lib.js").Enums;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../utils.js");
const {error, move, boost, endTurn, init} = require("../handlers/game/Game.js");
const {Result} = require("../handlers/game/utils.js");

const lib =			require("../lib/lib.js");
const {abort} = 	require("node:process");
const fs = 	require("node:fs");
const {cursor} = 	require("../cursor.js");
const {render} = 	require("../render.js");
const readline = 	require('node:readline');
const {app} = require("../server.js");
const {match} = require("../match.js");

//SECTION - main: inizializza e fa primo render, mette terminale in ascolto
initTerminal();
init();
dangerUpdateAll();
render();

//SECTION - eventLoop: binda i tasti per fare cose

								let	TargetDangerSwitch = "None";
/** @type {Array<String>} */	let	selected = [];

process.stdin.on('keypress', (str, key) => 
{
	/** @type {Result}*/let	result;
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
		case ("r") :
			if (TargetDangerSwitch == "None")
				TargetDangerSwitch = "Target";
			else if (TargetDangerSwitch == "Target")
				TargetDangerSwitch = "Danger";
			else if (TargetDangerSwitch == "Danger")
				TargetDangerSwitch = "None";
			break ;
		case ("e") :
			result = endTurn();
			if (result.status != 200)
				return (error(null, result));
			break ;
		case ("q") :
			result = boost(cursor.square);
			if (result.status != 200)
				return (error(null, result));
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
	if (key.name != "space" && key.name != "e" && key.name != "q" && key.name != "q" &&
		!movePiece(dx, dy, false))
	{
		console.log("lol no");
	}
	console.log("row", cursor.getRow(), ", col", cursor.getCol(), ", cursor", cursor.square);
	console.log("Visualizing", TargetDangerSwitch, "press \"r\" to change");
	render(selected, TargetDangerSwitch);
	console.log(`keypressed: ${key.name}\n`, `Press \"space\" to move, \"q\" to boost, \"e\" to change turn`);
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
