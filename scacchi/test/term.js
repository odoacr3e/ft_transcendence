// @ts-check
const {HISTORY_FILE, HISTORY_PATH} = require("../Macro/macro.js");
const {movePiece, dangerUpdateAll} =	require("../utils/moveUtils.js");
const {includesOneOf} = require("../utils/string.js");
const {historyRestore} = require("../utils2.js");
const {error, move, boost, endTurn, init} = require("../handlers/game/Game.js");
const {Result} = require("../handlers/game/utils.js");
const {vault} = require("../Classes/Vault/Vault.js");

const lib =			require("../lib/lib.js");
const {abort} = 	require("node:process");
const {render} = 	require("./render.js");
const readline = 	require('node:readline');
const server = require("../server.js");
const { makeTransfiguration } = require("../handlers/game/transfiguration.js");
const cmd = require("./enumsTest.js").cmd;


//SECTION - main: inizializza e fa primo render, mette terminale in ascolto
function mainTerm()
{
	let	match;

	termInit();
	match = vault.getDebugMatch();
	init(match, lib.Macro.SEED);
	dangerUpdateAll(match);
	render(match);
	return (match);
}

let match = mainTerm();
let	helpBool = true;

//SECTION - eventLoop: binda i tasti per fare cose

								let	TargetDangerSwitch = "None";
/** @type {Array<string>} */	let	selected = [];

process.stdin.on('keypress', (str, key) => 
{
	/** @type {Result}*/let	result;
	let	dx;
	let	dy;

	dx = 0;
	dy = 0;
	if ((key.ctrl && key.name == "c") || match.victory)
	{
		termCleanup(key.name);
	}
	console.clear();
	switch (key.name)
	{
		case (cmd.UP) : case (cmd.W) :
			dy += 1;
			break ;
		case (cmd.DOWN) : case (cmd.S) :
			dy -= 1;
			break ;
		case (cmd.LEFT) : case (cmd.A) :
			dx -= 1;
			break ;
		case (cmd.RIGHT) : case (cmd.D) :
			dx += 1;
			break ;
		case (cmd.TARGET_DANGER_SWITCH) :
			if (TargetDangerSwitch == "None")
				TargetDangerSwitch = "Target";
			else if (TargetDangerSwitch == "Target")
				TargetDangerSwitch = "Danger";
			else if (TargetDangerSwitch == "Danger")
				TargetDangerSwitch = "None";
			break ;
		case (cmd.END_TURN) :
			result = endTurn(match);
			if (result.status != 200)
				return (error(null, result));
			break ;
		case (cmd.BUY_BOOST) :
			result = boost(match, match.cursor.square);
			if (result.status != 200)
				return (error(null, result));
			break ;
		case (cmd.USE_BOOST) :
			match.currentPlayer.useBoostBool = !match.currentPlayer.useBoostBool;
			break ;
		case (cmd.MOVE) :
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
		case (cmd.HELP):
			helpBool = !helpBool;
			break ;
		case (cmd.TRANSFORM):
			let	newType = getline("insert new piece type");
			result = makeTransfiguration(match, match.cursor.square, newType);
			if (result.status != 200)
				return (error(null, result));
			break ;
		case (cmd.LOAD_HISTORY):
		{
			let	name;

			name = getline(`name of the file? press enter for default name "${HISTORY_FILE}"`);
			if (!name)
				name = HISTORY_FILE;
			historyRestore(match, HISTORY_PATH + name);
			break ;
		}
	}
	if (includesOneOf(key.name, cmd.MOVEMENTS) && !movePiece(match, dx, dy, false))
	{
		console.log("lol no");
	}
	print(key.name);
});

//SECTION - utils

/**
 * 
 * @param {string} key 
 * @returns 
 */
function print(key)
{
	console.log("row", match.cursor.getRow(), ", col", match.cursor.getCol(), ", cursor", match.cursor.square);
	if (TargetDangerSwitch != "None")
		console.log(`Visualizing ${TargetDangerSwitch} zones`);
	render(match, selected, TargetDangerSwitch);
	console.log(`keypressed: ${key}`);
	console.log(`Commands summary: ${cmd.HELP}`);
	if (!helpBool)
		return ;
	console.log(`"move: "${cmd.MOVE}"`);
	console.log(`buyBoost: "${cmd.BUY_BOOST}"`);
	console.log(`useBoost: "${cmd.USE_BOOST}"`);
	console.log(`dangerLightMode: "${cmd.TARGET_DANGER_SWITCH}"`);
	console.log(`endTurn "${cmd.END_TURN}"`);
}

function termInit()
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
 * 
 * @param {string} key 
 */
function termCleanup(key)
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
			match.Log(HISTORY_FILE);
		else
			match.Log(name);
	}
	process.exit();
}

/**
 * 
 * @param {string} prompt 
 */
function getline(prompt)
{
	const 	buffer = Buffer.alloc(50);
	let		bRead;
	let		input;

	console.log(prompt);
	process.stdin.setRawMode(false);
	bRead = lib.include.fs.readSync(1, buffer);
	process.stdin.setRawMode(true);
	if (!bRead)
		return ("");
	input = buffer.toString('utf8', 0, bRead).trim().toLowerCase();
	return (input);
}
