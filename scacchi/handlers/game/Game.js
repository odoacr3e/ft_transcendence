// @ts-check

//SECTION - boost function
/*
	list of exports:
	-	gameHttpHandler:		Handles game http request/responses
	-	gameWebSocketHandler:	Handles game websocket events
	-	error:					USED ONLY BY TERM.JS to display game error
*/

import {jsonParser, responseFormatter} from "../../utils/response.js";
import { Result, clientBoard, normifyRequest } from "./utils.js";
import { move } from "./move.js";
import { endTurn } from "./endTurn.js";
import { boost } from "./boost.js";
import { init } from "./init.js";
import { render } from "../../test/render.js";
import {makeTransfiguration} from "./transfiguration.js";
import { globals } from "../../Classes/Globals/globals.js";
import { query } from "../../lib/query.js";
const { createMatch, createUsersMatch } = query.gameQuery;
import { Match} from "../../Classes/Chess/match.js";
import { includesOneOf } from "../../utils/string.js";
import { updateTournament } from "../../websocket/handlers/tournament.js";
import { roomMessage } from "../../websocket/utils.js";
import { enumSocketState } from "../../Macro/enums.js";

const DEBUG_MATCH = globals.getDebugMatch();

/** @typedef {import("express").Request} Request*/
/** @typedef {import("express").Response} Response*/

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

	match = globals.getDebugMatch();
	if (!match)
		return (res.status(401).json({log: {status: 401, msg: "DEBUG IS FALSE"}}));
	body = normifyRequest(match.cursor, req.body);
	if (body.type == "init")
	{
		result = init(match, body.from);
		match.cursor.set(match.currentPlayer.King);
		responseFormatter(match, result, null, null);
		render(match);
		globals.matches.set("0", match);
	}
	else
		result = await gameHandler(match, body);
	res.status(result.log.status).json(result);
}

/**
 * 
 * @param {{from: *, to: *, type: string}} req 
 * @param {number} id_user 
 * @param {import("../../Classes/Globals/globals.js").Socket | undefined} socketData 
 */
async function gameWebSocketHandler(req, id_user, socketData)
{
	let	match;
	let	matchId;
	let	result;
	let	id;
	let	user;

	if (!socketData)
		return (console.error("ERROR: disconnected player not eliminated"), 500);
	if (!socketData.matchData)
		return (socketError(socketData.socket, null, 401, "Socket: you are not a player."));
	matchId = socketData.matchData.matchId;
	if (!matchId)
		return (socketError(socketData.socket, null, 401, `Socket: match ${matchId} does not exist.`));
	match = globals.matches.get(matchId);
	if (!match)
		return (socketError(socketData.socket, null, 403, "Socket: invalid match id " + matchId));
	id = match.id;
	req = normifyRequest(match.cursor, req);
	if (includesOneOf(req.type, "reload", "history"))
		result = await gameInfoHandler(match, req);
	else if (match.currentPlayer.team != socketData.matchData?.team)
		return (socketError(socketData.socket, null, 401, "Socket: it's not your turn, mr.greedy cheeta"));
	else if (!req.type)
		return (socketError(socketData.socket, null, 403, "Socket: missing param type in request"));
	else
		result = await gameHandler(match, req);
	if (result.log.status != 200)
		return (socketError(socketData.socket, result));
	for (let p of match.loserSet)
	{
		user = globals.clientMap.get(p);
		if (user)
			user.state = enumSocketState.NAVIGATING;
	}
	match.loserSet.clear();
	result = jsonParser(result);
	//@ts-ignore
	result.type = req.type; //Leo per capire quando la riposta che ci mandate si tratta di una reload
	socketData.socket.emit("game", result);	
	socketData.socket.to(`match_${id}`).emit("game", result);
	console.log(socketData.socket.rooms);
	if (match.victory != "")
	{
		user = globals.clientMap.get(match.currentPlayer.id);
		if (match.victory != "draw" && user)
			user.state = enumSocketState.NAVIGATING;//@ts-ignore
		roomMessage(`match_${id}`, "game", {victory: match.victory, log: result.log});
	}
	return (200);
}

/**
 * handler of websockets and http request
 * @param {import("../../Classes/Chess/match.js").Match} match
 * @param {import("./utils.js").RequestBody} body
 */
async function gameHandler(match, body)
{
	let	result;

	if (includesOneOf(body.type, "reload", "history"))
		return (gameInfoHandler(match, body));
	result = new Result();
	console.clear();
	if (match.victory != "")
	{
		if (match.victory == "draw")
			error(null, result, 403, `match already finished in a ${match.victory}!`);
		else
			error(null, result, 403, `match already finished: won by ${match.victory}!`);
		return (result);
	}
	if (body.type == "move")
		result = move(match, body.from, body.to);
	else if (body.type == "boost")
		result = boost(match, body.from);
	else if (body.type == "moveboost")
		result = move(match, body.from, body.to, true);
	else if (body.type == "endturn")
		result = endTurn(match);
	else if (body.type == "trans")
		result = makeTransfiguration(match, body.from, body.to);
	else if (body.type == "giveup")
	{
		match.PlayerLost(result);
		match.endTurn();
		if (match.playerNum <= 1)
			match.CheckMate(result);
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
	if (match.victory != "" && match.id != "0")
	{
		try 
		{
			if (match.victory == "draw")
				throw ("the match ended in a draw");
			console.log("Salvataggio partita nel database...");
			await createMatch(match);
			await createUsersMatch(match);
			console.log("Successo!");
		}
		catch (error)
		{
			console.log("Error: ", error);
		}
		if (match.tournament)
			updateTournament(match, match.victory == "draw");
	}
	return (result);
}

/**
 * handler of game info request
 * @param {import("../../Classes/Chess/match.js").Match} match
 * @param {import("./utils.js").RequestBody} body
 */
async function gameInfoHandler(match, body)
{
	let	result;

	result = new Result();
	if (body.type == "reload")
	{
		result.Success();
		// if (match.timer?.start != 0)// @ts-ignore
		// 	match.currentPlayer.time = match.timer.time - (Date.now() - match.timer.start);// @ts-ignore
		result.board = clientBoard(match, true, true);
	}
	else if (body.type == "history")
	{
		result.Success();//@ts-ignore
		result.history = match.history;
	}
	else
		throw ("gameInfoHandler: invalid type " + body.type);
	result = responseFormatter(match, result, null, null);
	return (result);
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

/**
 * 
 * @param {*} socket
 * @param {Result | null} result 
 * @param {number} status 
 * @param {string | null} msg 
 * @param {Match | null} match 
 * @param {boolean} renderBool 
 */
function socketError(socket=null, result=null, status=0, msg=null, match=null, renderBool=false)
{
	if (!result)
	{
		result = responseFormatter(null, result, msg, status);
		if (renderBool == true)
			console.clear();
		console.log("\x1b[31mGame error\x1b[0m");
		console.log(`status: ${result.log.status}\nmsg: ${result.log.msg}`);
		if (renderBool == true)
			render(DEBUG_MATCH);
	}
	if (socket)
		socket.emit("game", jsonParser(result));
	return (result?.log?.status? result.log.status: 500);
}

export {gameHttpHandler, gameWebSocketHandler, error, move, endTurn, boost, init};
