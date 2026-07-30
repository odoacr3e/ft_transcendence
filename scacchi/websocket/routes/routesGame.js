//@ts-check 

import { callbackify } from "node:util";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { boost, gameWebSocketHandler } from "../../handlers/game/Game.js";
import { enumSocketState } from "../../Macro/enums.js";
import { historyGetMatchState } from "../../utils/history.js";
import { isBusy } from "../utils.js";
import { fakeBoost } from "../../handlers/game/boost.js";

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

	socket.on("game", async(/** @type {{from: *, to: *, type: string}}*/req, callback) =>
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
		match = globals.matches.get(socketData?.matchData?.matchId);
		if (!match || !match[socketData?.matchData?.team])
			result = new Result().Error("You can't simulate the boost", 403);
		else
		{
			result = fakeBoost(match, req.from);
			console.log(`fakeBoost response: ${result}`);
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
			callback(result?.log);
	});
}