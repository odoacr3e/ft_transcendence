
const lib = require("../lib.js");
const {Piece, board, Square} = require("../lib.js").Chess;

// const { match } = require("../main.js")// quando ci sara la board aggiornata in game sul main

// body post -> {start: "a1", end: "a2"}

// ritorniamo il JSON dell'oggetto Partita con Player e ChessBoard
// prendo input chessBoard con situazioone di gioco
// lancio funzione board.checkMove(??)
// restituzione JSON con board aggiornata
const checkPosition = (req, res) => 
{
	const { type, from, to } = req.body;
	console.log(`${type}, ${from}, ${to}`);
	const square = board.get(from);
	console.log(square);
	res.json({message: "arrivato"});
}

module.exports = { checkPosition };