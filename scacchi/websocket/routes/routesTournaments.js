//@ts-check

import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Room } from "../../Classes/Globals/room.js";
import { query } from "../../lib/query.js";
import { enumSocketState } from "../../Macro/enums.js";
import { isBusy, roomMessage } from "../utils.js";

/** 
 * 
 * @param {import("socket.io").Socket} socket
 * @param {import("../../Classes/Chess/player").dbUser} user
 * */
export function routesTournament(socket, user)
{
	let socketData;

	socket.on('create_tournament', async (/** @type {{name: string, maxPlayers: number}}*/req, callback) => 
	{
		let result;
		let room;

		try
		{
			socketData = globals.clientMap.get(user.id_user);
			if (!socketData)
				throw (`create_tournament: socketData is empty`);
			if (isBusy(user.id_user) == true)
				result = new Result().Error("You are already doing something", 400);
			else if (await query.tournamentsQuery.checkTournamentName(req?.name) == true)
				result = new Result().Error(`Tournament already exists`, 409);
			else
			{
				room = new Room(user.id_user, req?.maxPlayers, req?.name);
				globals.rooms.set(room.cryptId, room);
				socket.join(room.id);
				if (socketData)
					socketData.state = enumSocketState.JOIN_TOURNAMENT;
				result = new Result().Success();//@ts-ignore
				result.tournament_link = room.cryptId;
			}
		}
		catch (error)
		{
			result = new Result().Error(String(error), 500);
		}
		socket.emit('create_tournament', result);
		if (typeof(callback) == "function")
			callback(result.log);
	});

	socket.on('join_tournament', async(/** @type {{tournament_link: string}}*/req, callback) =>
	{
		let	result;
		let	room;
		let	socketData;

		room = globals.rooms.get(req?.tournament_link);
		if (!room)
			result = new Result().Error(`tournament ${req?.tournament_link} does not exist`, 400);
		else if (isBusy(user.id_user) == true)
			result = new Result().Error("You are already doing something", 400);
		else
		{
			result = room.addPlayer(user.id_user);
			socket.join(room.id);
			socketData = globals.clientMap.get(user.id_user);
			if (socketData)
				socketData.state = enumSocketState.JOIN_TOURNAMENT;
		}
		if (room && result.status == 200 && room.players.size == room.maxPlayers)
			initTournament(); //TODO - AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
		else
			socket.emit('join_tournament', result);
		if (typeof(callback) == "function")
			callback(result.log);
	});

	socket.on('leave_tournament', async(req, callback) =>
	{
		let	result;

		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			throw (`leave_tournament: socketData is empty`);
		socketData.state = enumSocketState.NAVIGATING;
		result = globals.LeaveRoom(socketData, user.id_user)
		roomMessage(socketData.roomData?.cryptId, 'leave_tournament', result);
		if (typeof(callback) == "function")
			callback(result?.log);
	});
}