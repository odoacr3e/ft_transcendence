// @ts-check
import { Match } from "../Classes/Chess/match.js";
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
 * @returns {Result}
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
	if (match.settings.players.number == 2)
	{
		result.p1 = match.white; 
		result.p2 = match.black;
		result.p1.dbTable = undefined;
		result.p2.dbTable = undefined;
	}
	else if (match.settings.players.number == 4)
	{
		result.p1 = match.yellow; 
		result.p2 = match.blue;
		result.p3 = match.red;
		result.p4 = match.green;
		result.p3.name = "p3";
		result.p4.name = "p4";
		result.p3.isPlaying = false;
		result.p4.isPlaying = false;
		result.p1.dbTable = undefined;
		result.p2.dbTable = undefined;
		result.p3.dbTable = undefined;
		result.p4.dbTable = undefined;
	}
	else
		throw ("formatPlayer: bad player number");
	result.p1.name = "p1";
	result.p2.name = "p2";
	result.p1.isPlaying = false;
	result.p2.isPlaying = false;
	if (match.currentPlayer.team == result.p1.team)
		result.p1.isPlaying = true;
	else if (match.currentPlayer.team == result.p2.team)
		result.p2.isPlaying = true;
	else if (match.currentPlayer.team == result.p3?.team)
		result.p3.isPlaying = true;
	else if (match.currentPlayer.team == result.p4?.team)
		result.p4.isPlaying = true;
	else
		throw ("formatPlayer: backend forgot the turn order, sorry");
}

// FIXME - con questa va il FRONTEND
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

// FIXME - con questa va test/curlTest.js
/**
 * 
 * @param {string} key 
 * @param {object} val 
 * @returns 
 */

// function _jsonParser(key, val)
// {
// 	if (val instanceof Set)
// 		return ({ __type: "Set", data: [...val] });
// 	if (val instanceof Map)
// 		return ({ __type: "Map", data: [...val.entries()]});
// 	return (val);
// }

/**
 * 
 * @param {string} key 
 * @param {*} val 
 * @returns 
 */
function _jsonReviver(key, val)
{
	if (val && val.__type == "Set")
		return (new Set(val.data));
	if (val && val.__type == "Map")
		return (new Map(val.data));
	return val;
}

/**
 * JSON does not support Maps, Sets. This function manages this
 * it stringify and then parse because Express calls stringify natively
 * so we need to parse it again (the RAM is happy)
 * @param {object | string} data a javascript object
 * @returns {object}
 * @example let dataForClient = jsonParser(data)
 */
function jsonParser(data)
{
	if (typeof(data) == "string")
		return (JSON.parse(data, _jsonReviver));
	else
		return (JSON.parse(JSON.stringify(data, _jsonParser, 2)));
}

const jsonResponse = { ResponseError, ResponseSuccess };

export { jsonResponse, jsonParser, responseFormatter };
