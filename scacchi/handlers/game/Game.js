// @ts-check

const	{match} = require("../../match"); 
const	{ Result } = require("./utils");
const	move = require("./move").move; 
const	endTurn = require("./endTurn").endTurn; 
const	boost = require("./boost").boost;
const	init = require("./init").init;
const	render = require("../../render").render;

//FIXME - ale: i controlli di gameChecks danno per scontato che:
//				1.	l'utente che manda le richieste sia un giocatore
//				2.	che il giocatore mandi richieste SOLO per il proprio colore

/** @typedef {import("express").Request} Request*/
/** @typedef {import("express").Response} Response*/

/**
 * checks if the request params are valid
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @returns next middleware or an error response
 */
function gameChecks(req, res, next)
{
	if (!req || !req.body)
		return (error(res, null, 400, "bad request format"));
	if (!res || !res.status || !res.end || !next)
		return (error(res, null, 500, "bad response object format"));
	if (!req.body.type)
		return (error(res, null, 400, "json must have a string named `type`"));
	next();
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function gameHandler(req, res)
{
	const	{ type, from, to } = req.body;
	let		result;

	console.clear();
	if (type == "move")
		result = move(from, to);
	else if (type == "boost")
		result = boost(from);
	else if (type == "endTurn")
		result = endTurn();
	else if (type == "init")
		result = init(from);
	else
		return (error(res, null, 400, `invalid type ${type}`));
	if (!result || !result.status)
		return (error(res, null, 500, "backend function failed for unknown reasons"));
	if (result.status != 200)
		return (error(res, result));
	result = responseFormatter(result, null, null);
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
 *      ?board: Board;
 * 		youWin: boolean;
 *      p1: Player;
 *      p2: Player;
 *      ?p3: Player;
 *      ?p4: Player;
 * }
 * ```
 */
function responseFormatter(result, msg, status)
{
	let	log;
	let	p1 = match.white ? match.white : match.green;
	let	p2 = match.black ? match.black : match.blue;
	let	p3 = match.red;
	let	p4 = match.yellow;

	if (result && result.msg && result.status)
		log = {msg: result.msg, status: result.status};
	else
		log = {msg: msg, status: status};
	if (!log.status)
	{
		log.msg = "backend function failed for unknown reasons";
		log.status = 500;
	}
	if (!p1 || !p2)
	{
		log.msg = `cannot find p1 or p2`;
		log.status = 500;
		// @ts-ignore
		p1 = {};
		// @ts-ignore
		p2 = {};
	}
	if (!result)
		result = {};
	delete result.msg;
	delete result.status;
	if (!result.board)
		delete result.board;
	if (!p3)// @ts-ignore
		delete p3;
	if (!p4)// @ts-ignore
		delete p4;
	result.log = log;
	if (log.status != 200)
		result.log.msg = "Game Error: " + result.log.msg;
	result.p1 = p1;
	result.p2 = p2;
	result.p3 = p3;
	result.p4 = p4;
	return (result);
}

/**
 * prints the error in console and return a valid json
 * @param {Response | null} res default: null
 * @param {*} result
 * @param {Number} status default: 0
 * @param {String | null} msg default: null
 * @returns false
 */
function error(res=null, result=null, status=0, msg=null)
{
	result = responseFormatter(result, msg, status);
	console.clear();
	console.log("\x1b[31mGame error\x1b[0m");
	console.log(`status: ${result.log.status}\nmsg: ${result.log.msg}`);
	render();
	if (!res)
		return (false);
	if (result.log.status != 0)
		res.status(result.log.status);
	res.json(result);
}

module.exports = {gameChecks, gameHandler, error, move, endTurn, boost, init};