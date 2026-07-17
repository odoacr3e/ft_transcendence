//@ts-check 

import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { gameWebSocketHandler } from "../../handlers/game/Game.js";
import { enumSocketState } from "../../Macro/enums.js";
import { historyGetMatchState } from "../../utils/history.js";
import { isBusy } from "../utils.js";

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
	
		socketData = globals.clientMap.get(user.id_user);
		socket.emit("amiplaying", socketData?.state == enumSocketState.PLAYING);
		if (typeof(callback) == "function")
			callback({log: {status: status}});
	});

	socket.on("game", async(/** @type {{from: *, to: *, type: string}}*/req, callback) =>
	{
		let	status;

		socketData = globals.clientMap.get(user.id_user);
		status = await gameWebSocketHandler(req, user.id_user, socketData);
		//NOTE - the callback alerts the frontend that emit is done
		if (typeof(callback) == "function")
			callback({log: {status: status}});
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