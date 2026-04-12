// @ts-check
const { abort } = require("node:process");
const lib = require("./data/lib.js");
const {render} = require("./render/render.js");
const readline = require('node:readline');


initTerminal();
render();

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
	}
	if (!lib.Chess.cursor.Move(dx, dy, true))
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

//FIXME - fare funzione che muove cursore (in fase di testing)

// /**
//  * 
//  * @param {*} letter 
//  * @param {*} dX 
//  * @param {*} dY 
//  * @param {*} fly
//  */
// function next (letter, dX = 0, dY = 0, fly = false)
// {

// }
