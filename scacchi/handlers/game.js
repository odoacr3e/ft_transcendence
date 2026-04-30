// @ts-check
const lib = require("../lib.js");
const {Piece, board, Square, cursor} = require("../lib.js").Chess;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../utils.js");
const {render} = require("../render.js");
const {match} = require("../match.js");

// const { match } = require("../main.js")// quando ci sara la board aggiornata in game sul main

// body post -> {start: "a1", end: "a2"}

// ritorniamo il JSON dell'oggetto Partita con Player e ChessBoard
// prendo input chessBoard con situazioone di gioco
// lancio funzione board.checkMove(??)
// restituzione JSON con board aggiornata
// TODO - da aggiornare poi come middleware (fatti a step)
// 1. Utente loggato
// 2. Utente appartenente alla partita
// 3. Mossa valida -> OK ritorno json con info per il frontend

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const gameHandler = (req, res) => 
{
	const { type, from, to } = req.body;
	console.clear();
	console.log(`EXTERNAL REQUEST: ${type}, ${from}, ${to}`);
	if (!checkMove([from, to]))
		return (gameError(res, "you cannot move LMAO"));
	if (!moveFunctionDEBUG([from, to]))
		return (gameError(res, "illegal move LMAO"));
	res.json({message: "OK"});
}

/**
 * 1)	valid move
 * 2)	
 * @param {Array<String>} arr 
 */
function checkMove (arr=[])
{
	let	from;
	let	to;
	let	king;

	from = board.get(arr[0]);
	to = board.get(arr[1]);
	// king = board.get(match.currentPlayer.King);
	// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	king = board.get(match.black.King);//FIXME - usare currentPlayer.King
	if (from == null || to == null || king == null)
		return (false);//FIXME - 500 server error
	if (!from.targetZones.has(arr[1]))
		return (false);
	if (to.piece)
	{
		if (to.piece.team == from.piece.team)
			return false;
	}
	if (isDangerous(king.dangerZones, king.piece.team) && !simulation(arr, king))
		return (false);
	if (!simulation(arr, king))
		return false;
	if (to.piece)
		match.currentPlayer.nPoints += to.piece.price;
	to.piece = from.piece;
	from.piece = null;
	return (true);
}

/**
 * 
 * @param {Array<String>} arr
 * @param {Square} king
 */
function simulation(arr, king)
{
	let tmp = new Map();

	for (const [key, val] of board)
	{
		let	squareCopy;

		squareCopy = new Square(val);
		tmp.set(key, squareCopy);
	}
	board.get(arr[1]).piece = board.get(arr[0])?.piece;
	board.get(arr[0]).piece = null;
	dangerUpdateAll();
	if (isDangerous(king.dangerZones, king.piece.team))
	{
		copyBoard(tmp);
		return (false);
	}
	copyBoard(tmp);
	return (true);
}

/**
 * 
 * @param {Array<String>} selected 
 */
function moveFunctionDEBUG (selected=[])
{
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
	if (toType == null)
		toType = "Square";
	else
		toType = `\x1b[33m${toType}\x1b[0m`;
	to.piece = from.piece;
	from.piece = null;
	dangerUpdateAll();
	console.log(`SWAP ${fromType} with ${toType}`);
	console.log(`from ${selected[0]} to ${selected[1]}`);
	//render();
	return (true);
}

//SECTION - gameHandler utils

/**
 * 
 * @param {String} msg 
 * @param {*} res 
 * @returns 
 */
function gameError(res, msg)
{
	console.log(msg);
	render();
	return(res.json({message: msg}));
}

/**
 * 
 * @param {Map<string, Square>} tmp 
 */
function copyBoard(tmp)
{
	board.clear();
	for (let [key, val] of tmp)
		board.set(key, val);
	tmp.clear();
}

module.exports = { gameHandler, checkMove, moveFunctionDEBUG };