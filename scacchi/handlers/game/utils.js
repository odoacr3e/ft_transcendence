// @ts-check

const { assert } = require("node:console");
const { Square, copyBoard } = require("../../Classes/ChessBoard/chessBoard");
const {Result} = require("../../Classes/endPoint/result");

/** @typedef {Map<String, Square>} Board */

//SECTION - Board manipulation
//			useful to send filtered content to clients

/**
 * generate a copy of a board without dangerZones and other useless info
 * @param {Board} src the board to copy
 * @param {Array<string> | null} selected optional: the squares to swap
 * @returns {Object} a regular Object is returned. JSON does not support Map
 */
function clientBoard(src, selected=null)
{
	let	dest;

	if (!selected || selected.length != 2)
		dest = copyBoard(src);
	else
	{
		dest = copyOnlyBoardUpdates(src, selected);
	}
	for (let [key, square] of dest)
	{
		square.dangerZones.clear();
		// @ts-ignore
		square.targetZones = [...square.targetZones];
		// @ts-ignore
		square.boostedTargetZones = Object.fromEntries(square.boostedTargetZones);
	}
	return (Object.fromEntries(dest));
}

/**
 * perform a deep copy only on the squares useful for client:
 * 1. the from, to square;
 * 2. the square from the dangerZone of from and to.
 * @param {Board} src the board to copy
 * @param {Array<string>} selected the squares to swap
 * @returns {Board}
 */
function copyOnlyBoardUpdates(src, selected)
{
	let	newBoard;
	let	from;
	let	to;

	newBoard = new Map();
	from = src.get(selected[0]);
	to = src.get(selected[1]);
	assert(from && to, `invalid from "${selected[0]}" or to "${selected[1]}"`)
	if (!from || !to)
		return (newBoard);
	newBoard.set(selected[0], new Square(from));
	newBoard.set(selected[1], new Square(to));
	addDangerZonesCoords(src, newBoard, from);
	addDangerZonesCoords(src, newBoard, to);
	return (newBoard);
}

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
		assert(dangerSquare, `Invalid DangerSquare: "${dangerCoord}"`);
		if (!dangerSquare)
			continue ;
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
	result.youWin = true;
	result.msg = `Player ${team} has won!!!`
	return (result);
}

module.exports = {Result, clientBoard, paramCheck, checkMateAlert, error};