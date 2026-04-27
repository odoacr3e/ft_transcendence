// @ts-check
const { abort } = require("node:process");
const lib = require("./data/lib.js");
const {render} = require("./render/render.js");
const readline = require('node:readline');
const { Piece } = require("./data/pieces.js");

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
			lib.Chess.cursor.DangerUpdate();
	}
	if (key.name != "space" && !lib.Chess.cursor.Move(dx, dy, true, true))
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
		data.piece = new Piece();
		if (rand == 11)
		{
			data.piece.type = lib.Enums.enumNames.BASTARDS;
			data.piece.moveArray = 
			[{dx:0, dy:1}, {dx:0, dy:-1}];
		}
		else if (rand == 12)
		{
			data.piece.type = lib.Enums.enumNames.CHAMPION;
			data.piece.moveLongRangeDEBUG = true;
			data.piece.moveArray = 
			[
				{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
				{dx:-1, dy:1}, {dx:1, dy:-1},
			 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
			 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
			];
		}
		else if (rand == 13)
		{
			data.piece.type = lib.Enums.enumNames.JESTER;
			data.piece.moveArray = 
			[
				{dx:2, dy:1}, {dx:2, dy:-1}, // +2 orizzontale
				{dx:-2, dy:1}, {dx:-2, dy:-1},
				{dx:1, dy:2}, {dx:1, dy:-2}, // +2 verticale
				{dx:-1, dy:2}, {dx:-1, dy:-2},
			];
		}
		else if (rand == 14)
		{
			data.piece.type = lib.Enums.enumNames.MINOTAURUS;
			data.piece.moveLongRangeDEBUG = true;
			data.piece.moveArray = 
			[
			 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
			 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
			];
		}
		else
		{
			data.piece.type = lib.Enums.enumNames.VALKIRYA;
			data.piece.moveLongRangeDEBUG = true;
			data.piece.moveArray = 
			[
				{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
				{dx:-1, dy:1}, {dx:1, dy:-1},
			];
		}
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
