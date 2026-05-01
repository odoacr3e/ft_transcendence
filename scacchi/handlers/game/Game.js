const { abort } = require("node:process");

// @ts-check
const	move = require("./move").move; 
const	endTurn = require("./endTurn").endTurn; 
const	boost = require("./boost").boost;
const	render = require("../../render").render;

/** @typedef {import("express").Response} Response*/

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function gameHandler(req, res)
{
	const	{ type, from, to } = req.body;
	let		result;

	//FIXME - Ale: da mettere in un middleware questi controlli
	if (!req || !req.body)
		return (error(res, null, "bad request format", 400));
	if (!res || !res.status || !res.end)
		return (error(res, null, "bad response object format", 500));
	if (!req.body.type || !req.body.from || !req.body.to)
		return (error(res, null, "body must be of form {type, form, to}", 400));

	console.log(`EXTERNAL REQUEST: ${type}, ${from}, ${to}`);
	if (type == "move")
		result = move(from, to);
	else if (type == "boost")
		result = boost();
	else if (type == "endTurn")
		result = endTurn();
	else
		return (error(res, null, `invalid type ${type}`, 400));
	if (!result || !result.status)
		return (error(res, null, "backend function failed for unknown reasons", 500));
	if (result.status != 200)
		return (error(res, result));
	render();
	res.status(200).json(result);
}

/**
 * @param {*} result 
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
 *      ?board: null;
 *      p1: null;
 *      p2: null;
 *      p3: null;
 *      p4: null;
 * }
 * ```
 */
function responseFormatter(result, msg, status)
{
	let	log;
	let	p1 = null;
	let	p2 = null;
	let	p3 = null;
	let	p4 = null;

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
	result.log = log;
	result.p1 = p1;
	result.p2 = p2;
	result.p3 = p3;
	result.p4 = p4;
	console.log(result);
	return (result);
}

/**
 * prints the error set in 
 * @param {Response | null} res default: null
 * @param {*} result
 * @param {String | null} msg default: null
 * @param {Number} status default: 0
 * @returns false
 */
function error(res=null, result=null, msg=null, status=0)
{
	result = responseFormatter(result, msg, status);
	console.log("\x1b[31mGame error\x1b[0m");
	console.log(`status: ${result.log.status}\nmsg: ${result.log.msg}`);
	render();
	if (!res)
		return (false);
	if (result.log.status != 0)
		res.status(result.log.status);
	res.json(result);
}

module.exports = {gameHandler, error, move, endTurn, boost};