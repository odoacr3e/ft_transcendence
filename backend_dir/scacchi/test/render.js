// @ts-check
import { Square, ChessBoard} from "../Classes/Chess/chessBoard.js";
import { getLegalMoves } from "../GameLogic/checkLegalMoves.js";
import {eTeam, getInitialOfTeam} from "../Macro/enums.js";
import * as lib from "../lib/lib.js";
import { isDangerous } from "../utils/checkDanger.js";
// const {Match} = require("../Classes/Chess/match.js");
const enumNames = lib.Enums.enumNames;
import { includesOneOf } from "../utils/string.js";

/** @typedef {import("../Classes/Chess/match.js").Match} Match*/

/**
 * @param {Match | null} match 
 * @param {Array<String>} selected which positions are selected
 * @param {String} TargetDangerSwitch Valid value: "Target", "Danger", "None" 
 * @param {boolean} silentBool  
 */
function render(match=null, selected=[], TargetDangerSwitch="", silentBool=false)
{
	let buffer;
	let	board;
	let	coords;
	let	square;

	if (match)
		board = match.board;
	else
	{
		console.log("no match!");
		return ;
	}
	coords = getCoords(match);
	match.cursor.set(coords.start);
	buffer = "";
	if (silentBool == false)
		displayPlayerInfo(board, match);
	do
	{
		match.cursor.setCol(1);
		do
		{
			coords.curr = match.cursor.square;
			square = board.get(coords.curr);
			buffer += renderSquare(match, square, coords, selected, TargetDangerSwitch);
		}
		while (match.cursor.moveCol(+1))
		buffer += "\n";
	}
	while (match.cursor.moveRow(-1))
	match.cursor.set(coords.player);
	// console.log(getLegalMoves(match));
	console.log(buffer);
	console.log(match.yellow.King, match.red.King, match.blue.King, match.green.King);
}

/**
 * 
 * @param {Match} match
 * @param {Square} square 
 * @param {*} coords 
 * @param {Array<string>} selected
 * @param {string} TargetDangerSwitch 
 */
function renderSquare(match, square, coords, selected, TargetDangerSwitch)
{
	let	asciiArt;
	let	buffer;

	buffer = "";
	asciiArt = getAscii(square);
	if (square.piece && square.piece.team)
		buffer += `\x1b[37;${getSquareColor(square.piece.team)}m`;
	if (square.wallBool == true)
		buffer += "[X]";
	else if (coords.player == coords.curr)
		buffer += `\x1b[32m[${asciiArt}]`;
	else if (includesOneOf(coords.curr, match.lastMenace.from, match.lastMenace.mid, match.lastMenace.to))
		buffer += `\x1b[31m[${asciiArt}]`;
	else if (coords.curr == selected[0])
		buffer += `\x1b[33m[${asciiArt}]`;
	else if (TargetDangerSwitch == "Target" && coords.playerSquare.targetZones.has(coords.curr))
		buffer += `\x1b[31m[${asciiArt}]`;
	else if (TargetDangerSwitch == "Danger" && coords.playerSquare.dangerZones.has(coords.curr))
		buffer += `\x1b[31m[${asciiArt}]`;
	else if (TargetDangerSwitch == "Influence" && match.board.influenceMap.get(coords.player)?.has(coords.curr))
		buffer += `\x1b[31m[${asciiArt}]`;
	else if (square.piece?.isBoostedBool == true)
		buffer += `\x1b[34m[${asciiArt}]`;
	else
		buffer += `\x1b[37m[${asciiArt}]`;
	buffer += "\x1b[0m";
	return (buffer);
}

/**
 * 
 * @param {Match} match 
 * @returns 
 */
function getCoords(match)
{
	let	coords;
	let	endCol;

	coords = 
	{
		start: "",
		end: "",
		curr: "",
		player: "",
		playerSquare: new Square()
	};
	coords.start = "a" + String.fromCharCode(match.board.heigth + "0".charCodeAt(0));
	endCol = String.fromCharCode(match.board.width - "a".charCodeAt(0) - 1);
	coords.end = `${endCol}1`;
	coords.player = match.cursor.square;//@ts-ignore
	coords.playerSquare = match.board._data.get(coords.player);
	if (!coords.playerSquare)
	{
		coords.playerSquare = new Square();
		// throw ("Render, getCoords: invalid cursor");
	}
	return (coords);
}

/**
 * 
 * @param {ChessBoard} board
 * @param {Match | null} match
 */
function displayPlayerInfo(board, match)
{
	let	player;
	let	col;

	if (!match)
		return ;
	player = match.currentPlayer;
	col = getDotColor(match.currentPlayer.team);
	console.log(`It's ${col} turn.`);
	console.log(`points: ${player.nPoints}💲, bonus: ${player.bonusPointCounter}⚖️`);
	if (match.currentPlayer.boostedPiece)
		console.log(`Boosted piece: ${match.currentPlayer.boostedPiece}`);
	if (match.lastMenace.from)
		console.log(`⚠️: ${match.lastMenace.from} => ${match.lastMenace.mid} => ${match.lastMenace.to}`);
	if (match.currentPlayer.useBoostBool == true)
		console.log(`Ready to use boost!`);
	else
		console.log(`Boost NOT used`);
	if (kingThreat(board, match) == true)
		console.log(`${player.team} king is threatened💀`);
}

/**
 * @param {*} board
 * @param {*} match
*/
function kingThreat(board, match)
{
	if (isDangerous(match, match.board.get(match.currentPlayer.King)?.dangerZones, match.currentPlayer.team))
		return (true);
	return (false);
}

/**
 * 
 * @param {Match} match
 * @param {Array<string>} coords 
 * @param {Square} from 
 * @param {Square} to 
 */
function printSwap(match, coords, from, to)
{
	let	fromType;
	let	toType;
	let fromString;
	let toString;

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
	console.log(`SWAP ${fromType} with ${toType}`);
	match.cursor.Save();
	match.cursor.set(coords[0]);
	fromString = match.cursor.Normify();
	match.cursor.set(coords[1]);
	toString = match.cursor.Normify();
	console.log(`from ${fromString} to ${toString}`);
	match.cursor.Restore();
}

/**
 * 
 * @param {Square} data 
 */
function getAscii(data)
{
	switch (data.piece?.type)
	{
		case (null) :
			return (" ");
		case (enumNames.BASTARDS) :
			return ("B");
		case (enumNames.CHAMPION) :
			return ("C");
		case (enumNames.JESTER) :
			return ("J");
		case (enumNames.KING) :
			return ("K");
		case (enumNames.MINOTAURUS) :
			return ("M");
		case (enumNames.VALKIRYA) :
			return ("V");
		default :
			return (" ");
	}
}

/**
 * 
 * @param {string} team
 */
function getDotColor(team)
{
	switch (team)
	{
		case (null) :
			return ("???");
		case (eTeam.Black) :
			return ("⚫️");
		case (eTeam.White) :
			return ("⚪");
		case (eTeam.Blue) :
			return ("🔵");
		case (eTeam.Green) :
			return ("🟢");
		case (eTeam.Red) :
			return ("🔴");
		case (eTeam.Yellow) :
			return ("🟡");
	}
}

/**
 * 
 * @param {eTeam | null} team 
 */
function getSquareColor(team)
{
	switch (team)
	{
		case (null) :
			return ("49");
		case (eTeam.Black) :
			return ("40");
		case (eTeam.Red) :
			return ("41");
		case (eTeam.Green) :
			return ("42");
		case (eTeam.Yellow) :
			return ("43");
		case (eTeam.Blue) :
			return ("44");
		case (eTeam.White) :
			return ("47");
		default :
			return ("49");
	}
}

/**
 * 
 * @param {Match} match
 */
function boardStringify(match, otherInfoBool=false)
{
	let buffer;
	let	board;
	let	coords;
	let	square;
	let	ascii;

	if (match)
		board = match.board;
	else
	{
		throw("no match!");
	}
	coords = getCoords(match);
	match.cursor.set(coords.start);
	buffer = "";
	do
	{
		buffer += "|";
		match.cursor.setCol(1);
		do
		{
			coords.curr = match.cursor.square;
			square = board.get(coords.curr);
			if (!square)
				throw (`board position ${match.cursor.square} gives back null pointer`);
			ascii = getAscii(square);
			if (otherInfoBool == true && square.piece)
				ascii = `${getInitialOfTeam(square.piece.team)}${ascii}`;
			if (square.piece?.isBoostedBool)
				ascii = `+${ascii}`;
			buffer += `${ascii}|`;
		}
		while (match.cursor.moveCol(+1))
		buffer += "\n";
	}
	while (match.cursor.moveRow(-1))
	match.cursor.set(coords.player);
	if (otherInfoBool == true)
		buffer += `|${boardOtherInfo(match)}|`;
	return (buffer);
}

/** @param {Match} match*/
function boardOtherInfo(match)
{
	let	currTeam;
	let	buffer = "";

	currTeam = match.currentPlayer.team;
	do
	{
		if (match.currentPlayer.castlingArray.size > 0)
			buffer += '1';
		else
			buffer += '0';
		match.endTurn();
	}
	while(match.currentPlayer.team != currTeam)
	return buffer;
}

export {render, printSwap, boardStringify};