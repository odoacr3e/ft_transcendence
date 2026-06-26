// @ts-check

import http from "http";
import express from "express";
import {Server as SocketIO} from "socket.io";
import {responseFormatter} from "../../utils/response.js";
import { Result, clientBoard, normifyRequest } from "./utils.js";
import { move } from "./move.js";
import { endTurn } from "./endTurn.js";
import { boost } from "./boost.js";
import { init } from "./init.js";
import { render } from "../../test/render.js";
import {makeTransfiguration} from "./transfiguration.js";
//FIXME - solo debug
import { globals as vault } from "../../Classes/Globals/globals.js";
import { matchQuery } from "../../query/gameQuery.js";
import { Match } from "../../Classes/Chess/match.js";
const DEBUG_MATCH = vault.getDebugMatch();

// const app1 = express();
// const server1 = http.createServer(app1);
// const sockio = new SocketIO(server1, {
// 	cors: {
// 		origin: "*", // per sviluppo, in produzione metti l'url preciso
// 		methods: ["GET", "POST"],
// 		credentials: true
// 	},
// 	connectionStateRecovery: {} // se il client si disconnette temporaneamente gli arrivano gli eventi alla riconnessione, senza vengono persi
// });

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
	if (req.body.from && typeof(req.body.from) != "string" && req.body.type != "init")
		return (error(res, null, 400, "param `from` must be of type string"));
	if (req.body.from && typeof(req.body.to) != "string")
		return (error(res, null, 400, "param `to` must be of type string"));
	if (typeof(req.body.type) != "string")
		return (error(res, null, 400, "param `type` must be of type string"));
	req.body.type = req.body.type.trim().toLowerCase();
	next();
}

/**
 * handler of game POST requests
 * @param {*} req 
 * @param {*} res 
 */
async function gameHttpHandler(req, res)
{
	let	body;
	let	match;
	let	result;

	match = vault.getDebugMatch();
	body = normifyRequest(match.cursor, req.body);
	result = await gameHandler(match, body);
	res.status(result.log.status).json(result);
}

/**
 * handler of game POST requests
 * @param {import("../../Classes/Chess/match.js").Match} match
 * @param {import("./utils.js").RequestBody} body
 */
async function gameHandler(match, body)
{
	let	result;

	result = new Result();
	// if (!sockio || !sockio.on || !sockio.emit)
	// 	return (res.status(400).json({msg: "non importato"}));
	// sockio.on('connection' () => {
	// 	sockio.emit("start_game", { messaggio: "si comincia uahu" });
	// })
	console.clear();
	if (body.type == "move")
		result = move(match, body.from, body.to);
	else if (body.type == "boost")
		result = boost(match, body.from);
	else if (body.type == "moveboost")
		result = move(match, body.from, body.to, true);
	else if (body.type == "endturn")
		result = endTurn(match);
	else if (body.type == "init")
		result = init(match, body.from);
	else if (body.type == "trans")
		result = makeTransfiguration(match, body.from, body.to);
	else if (body.type == "reload")
	{
		result.Success();
		// @ts-ignore
		result.board = clientBoard(match, true, true);
		result.youWin = match.victory != "";
	}
	else if (body.type == "history")
	{
		result.Success();//@ts-ignore
		result.history = match.history;
	}
	else
	{
		error(null, result, 400, `invalid type ${body.type}`);
		return (result);
	}
	if (!result || !result.status)
		return (error(null, result, 500, "backend function failed for unknown reasons"), result);
	if (result.status != 200)
		return (error(null, result), result);
	result = responseFormatter(match, result, null, null);
	render(match);
	if (match.playerNum <= 1)
	{
		try 
		{
			console.log("Salvataggio partita nel database...");
			await matchQuery.createMatch(match);
			console.log("Successo!");
		}
		catch (error)
		{
			console.log("Error: ", error);
		}
	}
	return (result);
}

/**
 * handler of game GET requests
 * @param {*} req 
 * @param {*} res 
 */
function gameInfo(req, res)
{
	const	{type, from, to} = req?.body;
	let		result;
	let		match;

	if (!res || !res.status || !res.end || !req)
		return (error(res, null, 500, "bad response object format"));
	if (!req.body || !req.body.type)
		return (error(res, null, 400, "json must have a string named `type`"));
	match = vault.getDebugMatch();
	result = new Result();
	if (type == "reload")
	{
		result.Success();//@ts-ignore
		result.board = clientBoard(match.board, true, true);
		result.youWin = match.victory != "";
	}
	else if (type == "history")
	{
		result.Success();//@ts-ignore
		result.history = match.history;
	}
	else
		return (error(res, null, 400, `invalid type ${type}`));
	result = responseFormatter(match, result, null, null);
	res.status(200).json(result);
}

/**
 * prints the error in console and return a valid json
 * @param {Response | null} res default: null
 * @param {*} result
 * @param {Number} status default: 0
 * @param {String | null} msg default: null
 * @param {boolean} renderBool
 * @returns false
 */
function error(res=null, result=null, status=0, msg=null, renderBool=true)
{
	if (!result)
		result = responseFormatter(null, result, msg, status);
	else
		result = responseFormatter(result.match, result, msg, status);
	if (renderBool == true)
		console.clear();
	console.log("\x1b[31mGame error\x1b[0m");
	console.log(`status: ${result.log.status}\nmsg: ${result.log.msg}`);
	if (renderBool == true)
		render(DEBUG_MATCH);
	if (!res)
		return (result);
	if (result.log.status != 0)
		res.status(result.log.status);
	res.json(result);
	return (result);
}

export {gameChecks, gameHttpHandler, gameInfo, error, move, endTurn, boost, init};
