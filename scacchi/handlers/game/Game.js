// @ts-check

const	{abort} = require("node:process");
const	{Match} = require("../../match"); 
const	{ Result } = require("./utils");
const	{responseFormatter} = require("../../utils/response");
const	move = require("./move").move; 
const	endTurn = require("./endTurn").endTurn; 
const	boost = require("./boost").boost;
const	init = require("./init").init;
const	render = require("../../render").render;
//FIXME - solo debug
const	vault = require("../../Vault.js").vault;
const DEBUG_MATCH = vault.getDebugMatch();

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
	try
	{
		next();
	}
	catch (err)
	{
		error(res, null, 500, "RAP (Backend) HAS DIED");
		console.log("seed:", req.body.from, "err", err);
		abort();
	}
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
	let		match;

	match = vault.getDebugMatch();
	console.clear();
	if (type == "move")
		result = move(match, from, to);
	else if (type == "boost")
		result = boost(match, from);
	else if (type == "endTurn")
		result = endTurn(match);
	else if (type == "init")
		result = init(match, from);
	else
		return (error(res, null, 400, `invalid type ${type}`));
	if (!result || !result.status)
		return (error(res, null, 500, "backend function failed for unknown reasons"));
	if (result.status != 200)
		return (error(res, result));
	result = responseFormatter(result, null, null);
	render([], "", match);
	res.status(200).json(result);
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
	render([], "", DEBUG_MATCH);
	if (!res)
		return (false);
	if (result.log.status != 0)
		res.status(result.log.status);
	res.json(result);
}

module.exports = {gameChecks, gameHandler, error, move, endTurn, boost, init};