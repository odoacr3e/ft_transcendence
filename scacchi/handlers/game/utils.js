// @ts-check
/** @typedef {import("../../Classes/Chess/match.js").Match} Match*/
/** @typedef {import("../../Classes/Chess/cursor.js").Cursor} Cursor*/

import { Square, copyBoard } from "../../Classes/Chess/chessBoard.js";
import {Result} from "../../Classes/endPoint/result.js";
import {jsonParser} from "../../utils/response.js";
import {coordNormify} from "../../Classes/Chess/cursor.js";

/** @typedef {Map<String, Square>} Board */

//SECTION - Board manipulation
//			useful to send filtered content to clients

/**
 * generate a copy of a board without dangerZones and other useless info
 * @param {Match} match
 * @param {boolean} copyAll if false copies only updates, else copy all
 * @param {boolean} avoidReset if true, avoid resetting the update array 
 * @returns {Object} a regular Object is returned. JSON does not support Map
 */
function clientBoard(match, copyAll=false, avoidReset=false)
{
	let	src;
	let	dest;

	src = match.board._data;
	if (copyAll == true)
		dest = copyBoard(src, null, match);
	else
	{
		dest = copyOnlyBoardUpdates(match);
	}
	// console.log("updates:");
	// console.log(match.board.updates);
	if (avoidReset == false)
		match.board.updates.clear();
	modifyBoard(dest);
	return (jsonParser(dest));
}

/**
 * perform a deep copy only on the squares useful for client:
 * 1. the from, to square;
 * 2. the square from the dangerZone of from and to.
 * @param {Board} src the board to copy
 * @param {Array<string>} selected the squares to swap
 * @returns {Board}
 */

/**
 * perform a deep copy only on the squares useful for client:
 * 1. the from, to square;
 * 2. the square from the dangerZone of from and to.
 * @param {Match} match 
 * @returns 
 */
function copyOnlyBoardUpdates(match)
{
	let	src;
	let	newBoard;
	let	square;

	src = match.board;
	newBoard = new Map();
	console.log(`Board updates: ${match.board.updates.size}`);
	for (const coord of match.board.updates)
	{
		square = src.get(coord);
		newBoard.set(coordNormify(coord), new Square(square, coordNormify));
	}
	return (newBoard);
}

/** @typedef {{from: string, to: string, type: string}} RequestBody*/

/**
 * 
 * @param {Cursor} cursor 
 * @param {RequestBody} body 
 */
function normifyRequest(cursor, body)
{
	if (body.type == "init")
		return body;
	body.type = body.type.toLocaleLowerCase();
	if (body.from && typeof(body.from) == "string")
		body.from = cursor.Normify(body.from);
	if (body.to && typeof(body.to) == "string" && body.to.length == 3)
		body.to = cursor.Normify(body.to);
	return (body);
}

/**
 * 
 * @param {Board} copiedBoard
 */
function modifyBoard(copiedBoard)
{
	for (const [pos, square] of copiedBoard)
	{
		// @ts-ignore
		delete (square).dangerZones;
		// @ts-ignore
		delete (square).influenceZones;
		// @ts-ignore
		if (!square.piece)
			continue ;
		square.piece.moveArray = [];
		// @ts-ignore
		delete (square).piece?.isMovedBool;
		// @ts-ignore
		delete (square).piece?.multipleMovesBool;
		// @ts-ignore
		delete (square).piece?.moveLongRangeDEBUG;
		// @ts-ignore
		delete (square).piece?.pos;
	}
}

//FIXME - x di mbiagi
/**
 * Adds all dangerZones of a square to the dest Board
 * @param {Board} src the source board 
 * @param {Board} dest the board to send to client
 * @param {Square} square the from/to Square 
 */
function addDangerZonesCoords(src, dest, square)
{
	let	dangerSquare;

	for (let dangerCoord of square.dangerZones)
	{
		dangerSquare = src.get(dangerCoord);
		// assert(dangerSquare, `Invalid DangerSquare: "${dangerCoord}"`);
		// if (!dangerSquare)
		// 	continue ;
		dest.set(dangerCoord, new Square(dangerSquare));
	}
}

//SECTION - game error management utils

/**
 * check the validity of the input received by the move function.
 * @param {Result} result 
 * @param {String | undefined} from optional: if passed, checks if it's valid
 * @param {String | undefined} to optional: if passed, checks if it's valid
 * @returns {boolean} true if success, false if failure
 */
function paramCheck(result, from="ignoreCheck", to="ignoreCheck")
{
	if (!from)
		return (error(result, 400, `invalid param from "${from}"`));
	if (!to)
		return (error(result, 400, `invalid param from "${to}"`));
	return (true);
}

/**
 * 
 * @param {Result} result 
 * @param {Number} status 
 * @param {String} msg 
 * @returns {boolean} always return false
 */
function error(result, status, msg)
{
	result.msg = msg;
	result.status = status;
	return (false);
}

/**
 * 
 * @param {Result} result 
 * @param {string} team
 * @returns {Result}
 */
function checkMateAlert(result, team="")
{
	result.status = 200;
	result.msg = `Player ${team} has won!!!`
	return (result);
}

export {Result, clientBoard, paramCheck, checkMateAlert, error, normifyRequest};