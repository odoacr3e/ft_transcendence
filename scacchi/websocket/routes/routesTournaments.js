//@ts-check

import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Room } from "../../Classes/Globals/room.js";
import { query } from "../../lib/query.js";
import { enumSocketState } from "../../Macro/enums.js";
import { isBusy, roomMessage } from "../utils.js";
import { createMatchTournament, createTournamentRoomHandler, initTournament, joinTournamentRoomHandler, startRoundHandler } from "../handlers/tournament.js";

/** 
 * 
 * @param {import("socket.io").Socket} socket
 * @param {import("../../Classes/Chess/player").dbUser} user
 * */
export function routesTournament(socket, user)
{
	let socketData;
	let result;

	socket.on('create_tournament', async (/** @type {{name: string, maxPlayers: number}}*/req, callback) => 
	{
		result = await createTournamentRoomHandler(req, socket, user);
		socket.emit('create_tournament', result);
		if (typeof(callback) == "function")
			callback(result);
	});

	socket.on('join_tournament', async(/** @type {{tournament_pwd: string}}*/req, callback) =>
	{
		// console.log(JSON.stringify(req, null, 2));
		// console.log("join");
		result = await joinTournamentRoomHandler(req, socket, user);
		socket.emit('join_tournament', result);
		if (typeof(callback) == "function")
			callback(result);
	});

	socket.on('leave_tournament', async(req, callback) =>
	{
		// console.log(JSON.stringify(req, null, 2));
		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			throw (`leave_tournament: socketData is empty`);
		// query.tournamentsQuery.deleteUserInTournament();
		socketData.state = enumSocketState.NAVIGATING;
		result = globals.LeaveRoom(socketData, user.id_user);
		roomMessage(socketData.roomData?.cryptId, 'leave_tournament', result);
		if (typeof(callback) == "function")
			callback(result);
	});

	socket.on('start_round', async (req, callback) => 
	{
		// console.log(JSON.stringify(req, null, 2));
		result = await startRoundHandler(req, socket, user);
		if (typeof(callback) == "function")
			callback(result);
	});

	//FIXME - ban_tournament
}