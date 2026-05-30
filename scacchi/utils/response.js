// @ts-check
import { Match } from "../Classes/Match/match.js";
import { Square } from "../Classes/ChessBoard/chessBoard.js";
import { Result } from "../Classes/endPoint/result.js";

/**
 * 
 * @param {String} message
 */
const ResponseError = (message) => {
	return ({ "status": "error", "message": message });
}

/**
 * 
 * @param {Object} object
 */
const ResponseSuccess = (object) => {
	return ({ "status": "success", "data": object })
}

/**
 * 
 * @param {Match | null} match
 * @param {*} result the base object from which the response json is made
 * @param {String | null} msg 
 * @param {Number | null} status 
 * @returns {{}}
 * format frontend response as an object.
 * ? means the field is optional.
 * ```ts
 * {
 *      log: 
 * 		{
 *         msg: string;
 *         status: number;
 *     	};
 *      ?board: Board;
 * 		youWin: boolean;
 *      p1: Player;
 *      p2: Player;
 *      ?p3: Player;
 *      ?p4: Player;
 * }
 * ```
 */
function responseFormatter(match, result, msg, status)
{
	let	log;

	if (match)
	{
		formatPlayer(match, result);
	}
	if (result && result.msg && result.status)
		log = {msg: result.msg, status: result.status};
	else
		log = {msg: msg, status: status};
	if (!log.status)
	{
		log.msg = "backend function failed for unknown reasons";
		log.status = 500;
	}
	if (!result)
		result = {};
	delete result.msg;
	delete result.status;
	if (!result.board)
		delete result.board;
	result.log = log;
	if (!result.youWin)
		result.youWin = false;
	if (log.status != 200)
		result.log.msg = "Game Error: " + result.log.msg;
	result.match = null;
	delete result.match;
	if (result.specialMoves)
		result.mask = result.specialMoves._mask;
	return (result);
}

/**
 * 
 * @param {Match} match 
 * @param {*} result 
 */
function formatPlayer(match, result)
{
	result.p1 = match.white ? match.white : match.green;
	result.p2 = match.black ? match.black : match.blue;
	result.p3 = match.red;
	result.p4 = match.yellow;
	result.p1.name = "p1";
	result.p2.name = "p2";
	result.p3.name = "p3";
	result.p4.name = "p4";
	result.p1.isPlaying = false;
	result.p2.isPlaying = false;
	result.p3.isPlaying = false;
	result.p4.isPlaying = false;
	if (match.currentPlayer === result.p1)
		result.p1.isPlaying = true;
	if (match.currentPlayer === result.p2)
		result.p2.isPlaying = true;
	if (match.currentPlayer === result.p3)
		result.p3.isPlaying = true;
	if (match.currentPlayer === result.p4)
		result.p4.isPlaying = true;
}

/**
 * this function is used by JSON to recursively parse Objects
 * this should not be called
 * @param {*} key 
 * @param {*} val 
 */
function _jsonParser(key, val)
{
	if (val instanceof Set)
	{
		return [...val];
	}
	else if (val instanceof Map) 
	{
		return Object.fromEntries(val);
	}
	else
		return (val);
}

/**
 * JSON does not support Maps, Sets. This function manages this
 * it stringify and then parse because Express calls stringify natively
 * so we need to parse it again (the RAM is happy)
 * @param {object} data a javascript object
 * @returns {object}
 * @example let dataForClient = jsonParser(data)
 */
function jsonParser(data)
{
	return (JSON.parse(JSON.stringify(data, _jsonParser, 2)));
}

const jsonResponse = { ResponseError, ResponseSuccess };

export { jsonResponse, jsonParser, responseFormatter };
