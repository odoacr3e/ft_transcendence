//@ts-check 

import { callbackify } from "node:util";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { boost, gameWebSocketHandler } from "../../handlers/game/Game.js";
import { enumConnection, enumSocketState } from "../../Macro/enums.js";
import { historyGetMatchState } from "../../utils/history.js";
import { gameMessage, isBusy } from "../utils.js";
import { fakeBoost } from "../../handlers/game/boost.js";
import { AIexecuteTurn } from "../../GameLogic/aiTurn.js";

/** @typedef {{from: *, to: *}} */

/** 
 * @param {import("socket.io").Socket} socket
 * @param {import("../../Classes/Chess/player").dbUser} user
 * */
export function routesGame(socket, user)
{
	let socketData;

	socket.on("amiplaying", async(req, callback) =>
	{
		let	socketData;
		let	isPlaying;

		if (!callback && typeof(req) == "function") //questo serve perchè io da frontend non mando mai callback come argomento
			callback = req;
		socketData = globals.clientMap.get(user.id_user);
		isPlaying = socketData?.state == enumSocketState.PLAYING;
		if (typeof(callback) == "function")
			callback(isPlaying);
	});

	socket.on("game", async(/** @type {{from: *, to: *, type: string, draw: boolean}}*/req, callback) =>
	{
		let	status;

		socketData = globals.clientMap.get(user.id_user);
		try
		{
			status = await gameWebSocketHandler(req, user.id_user, socketData);
		}
		catch(err)
		{
			let	match;

			//@ts-ignore
			match = globals.matches.get(socketData?.matchData?.matchId); 
			if (match)
				match.history.Log(match, `CRASH_${match.id}`);
			throw (`routesGame: ${err}`);
		}
		//NOTE - the callback alerts the frontend that emit is done
		if (typeof(callback) == "function")
			callback({log: {status: status}});
	});

	socket.on("simulate_boost", async(req, callback) => 
	{
		let result;
		let	socketData;
		let match;

		socketData = globals.clientMap.get(user.id_user);
		match = globals.matches.get(socketData?.matchData?.matchId);//@ts-ignore
		if (!match || !match[socketData?.matchData?.team])
			result = new Result().Error("You can't simulate the boost", 403);
		else
		{
			result = fakeBoost(match, req.from);
			socket.emit("simulate_boost", result);
		}
		if (typeof(callback) == 'function')
			callback(result);
	});

	socket.on("replay_game", async(/** @type {{matchId: number, moveId: number, delBool?: Boolean}}*/req, callback) => 
	{
		let	result;

		if (isBusy(user.id_user) == true)
			result = new Result().Error("You are already doing something", 400);
		else
			result = await historyGetMatchState(req);
		socket.emit("replay_game", result);
		if (typeof(callback) == "function")
			callback(result);
	});

	socket.on("spectate", async(/** @type {{matchId: number, exitBool: boolean}} */req, callback) =>
	{
		let	result;
		let	socketData;
//FIXME - gestione exitBool
		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			result = new Result().Error("Server lost your data", 500);
		else if (!globals.matches.get(`${req?.matchId}`))
			result = new Result().Error("Cannot find match " + req?.matchId, 404);
		else
		{
			result = new Result().Success();
			socket.join(`match_${req.matchId}`);
			socket.to(`match_${req.matchId}`).emit(`${socketData}`);
		}
		socket.emit("spectate", result);
		if (typeof(callback) == "function")
			callback(result);
	});

	socket.on("gameMsg", async(/** @type {{author: string, msg: string}}*/req, callback) => 
	{
		let	result;
		let	socketData;
		let	match;

		socketData = globals.clientMap.get(user.id_user);
		if (!req || !req.author || !req.msg)
			result = new Result().Error(`missing 'author' or 'msg' in ${req}`, 400);
		else if (!socketData)
			result = new Result().Error("Server lost your data", 500);
		else if (socketData.matchData && !(match = globals.matches.get(`${socketData.matchData.matchId}`)))
			result = new Result().Error("Cannot find match " + socketData.matchData.matchId, 500);
		else if (socketData.spectateData && !(match = globals.matches.get(`${socketData.spectateData}`)))
			result = new Result().Error("Cannot find match " + socketData.spectateData, 500);
		else if (!socketData.matchData && !socketData.spectateData)
			result = new Result().Error("You are not playing any match", 401);
		else
		{
			gameMessage(match, req.msg, req.author, console.log);
			result = new Result().Success("OK", "msg");
		}
		socket.emit("gameMsg", result);
		if (typeof(callback) == "function")
			callback(result);
	});

	socket.on("start_ai_match", async(req, callback) => 
	{
		let result;

		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			throw ("start_ai_match: socketData not found");
		if (socketData.state != enumSocketState.PLAYING)
			result = new Result().Error("Player is not playing any match", 404);
		else
		{
			let match;
//@ts-ignore
			match = globals.matches.get(socketData.matchData?.matchId);
			if (match?.history.events.length != 0)
				result = new Result().Error("The game is already started", 400);
			else if (!match.currentPlayer.ai)
				result = new Result().Success();
			else
			{
				AIexecuteTurn(match);
				result = new Result().Success();
			}
		}
		socket.emit('start_ai_match', result);
		if (typeof(callback) == "function")
			callback(result);
		if (typeof(req) == "function")
			req(result);
	});
}
