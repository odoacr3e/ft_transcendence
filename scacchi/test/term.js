// @ts-check
const {HISTORY_FILE, HISTORY_DEFAULT} = require("../Macro/macro.js");
const {movePiece, dangerUpdateAll, includesOneOf} =	require("../utils.js");
const {historyRestore} = require("../utils2.js");
const {error, move, boost, endTurn, init} = require("../handlers/game/Game.js");
const {Result} = require("../handlers/game/utils.js");
const {vault} = require("../Classes/Vault/Vault.js");

const lib =			require("../lib/lib.js");
const {abort} = 	require("node:process");
const {render} = 	require("./render.js");
const readline = 	require('node:readline');
const server = require("../server.js");

//SECTION - main: inizializza e fa primo render, mette terminale in ascolto
let match;

initTerminal();
match = vault.getDebugMatch();
init(match, lib.Macro.SEED);
dangerUpdateAll(match);
// console.log(match);
render(match);

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
	{
		const	buffer = Buffer.alloc(50);
		let		bRead;

		process.stdin.setRawMode(false);
		while (key != "y" && key != "n")
		{
			console.log("Save game in a backup file?[y;n]");
			bRead = lib.include.fs.readSync(1, buffer);
			key = buffer.toString('utf8', 0, bRead).trim().toLowerCase();
		}
		if (key == "y")
		{
			let	name;

			console.log("Choose name of the history file. empty = default name");
			bRead = lib.include.fs.readSync(1, buffer);
			name = buffer.toString('utf8', 0, bRead).trim().toLowerCase();
			if (!name)
				match.history.Log(HISTORY_FILE);
			else
				match.history.Log(name);
		}
		process.exit();
	}
	console.clear();
	console.log(match.currentPlayer);
	switch (key.name)
	{
		case ("up") : case ("w") :
			dy += 1;
			break ;
		case ("down") : case ("s") :
			dy -= 1;
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
			result = endTurn(match);
			if (result.status != 200)
				return (error(null, result));
			break ;
		case ("q") :
			result = boost(match, match.cursor.square);
			if (result.status != 200)
				return (error(null, result));
			break ;
		case ("t") :
			match.currentPlayer.useBoostBool = !match.currentPlayer.useBoostBool;
			break ;
		case ("space") :
			console.assert((selected.length < 2), "move array too large");
			selected.push(match.cursor.square);
			if (selected.length == 2)
			{
				console.clear();
				let	result = move(match, selected[0], selected[1], match.currentPlayer.useBoostBool);
				selected = [];
				if (result.status != 200)
					return (error(null, result));
			}
			break ;
		case ("p"):
		{
			historyRestore(match, HISTORY_DEFAULT);
			render(match);
			return ;
		}
	}
	if (!includesOneOf(key.name, "r", "e", "space") && !movePiece(match, dx, dy, false))
	{
		console.log("lol no");
	}
	console.log("row", match.cursor.getRow(), ", col", match.cursor.getCol(), ", cursor", match.cursor.square);
	console.log("Visualizing", TargetDangerSwitch, "press \"r\" to change");
	render(match, selected, TargetDangerSwitch);
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
