const lib = require("../lib.js");
const {Piece, board, Square, cursor} = require("../lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../utils.js");
const {render} = require("../render.js");

// const { match } = require("../main.js")// quando ci sara la board aggiornata in game sul main

// body post -> {start: "a1", end: "a2"}

// ritorniamo il JSON dell'oggetto Partita con Player e ChessBoard
// prendo input chessBoard con situazioone di gioco
// lancio funzione board.checkMove(??)
// restituzione JSON con board aggiornata
const checkPosition = (req, res) => 
{
	const { type, from, to } = req.body;
	console.clear();
	console.log(`EXTERNAL REQUEST: ${type}, ${from}, ${to}`);
	// let square = board.get(from);
	// console.log(square);
	// square = board.get(to);
	// console.log(square);
	if (!moveFunctionDEBUG([from, to]))
		console.log("you cannot move LMAO");
	res.json({message: "arrivato"});
}

/**
 * 
 * @param {Array<String>} selected 
 */
function moveFunctionDEBUG (selected=[])
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
		return (false);
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
	render();
	return (true);
}

module.exports = { checkPosition };