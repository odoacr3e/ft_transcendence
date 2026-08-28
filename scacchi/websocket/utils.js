//@ts-check

//SECTION - websocket main file
/*
	list of exports:
	FUNCTIONS
	-	getReconnectTime:	time to become offline, based on client activity.
	-	isBusy:				false if client is NAVIGATING, else true.
	-	roomMessage:		emit a message to all client in a socket.io room.
*/

import { enumSocketState } from "../Macro/enums.js";
import { MATCH_RECONNECT_TIMER, TOURNAMENT_WAIT_TIMER, SOCKET_RECONNECT_TIMER } from "../Macro/macro.js";
import { globals } from "../Classes/Globals/globals.js";
import { sockio } from "./websocket.js";
import { responseFormatter } from "../utils/response.js";
import { Result } from "../Classes/endPoint/result.js";

/** @typedef {import("../Classes/endPoint/result.js").Result} Result*/
/** @typedef {import("../Classes/Chess/match.js").Match} Match*/

/**
 * time to become offline, based on client activity.
 * @param {string} state 
 */
function getReconnectTime(state)
{
	if (state == enumSocketState.PLAYING)
		return (MATCH_RECONNECT_TIMER);
	else if (state == enumSocketState.JOIN_TOURNAMENT)
		return (TOURNAMENT_WAIT_TIMER);
	return (SOCKET_RECONNECT_TIMER);
}

/** 
 * false if client is NAVIGATING, else true.
 * @param {number} userId 
 * */
function isBusy(userId)
{
	let	socketInfo = globals.clientMap.get(userId);

	if (!socketInfo)
		return (false);
	if (socketInfo.state != enumSocketState.NAVIGATING)
		console.log("you are already doing " + socketInfo.state);
	return (socketInfo.state != enumSocketState.NAVIGATING);
}

/**
 * emit a message to all client in a socket.io room.
 * @param {string | undefined} roomName the name of the room
 * @param {string | undefined} eventType the name of the event to emit
 * @param {*} result the object to emit
 * @param {boolean} gameFormatBool
 */
function roomMessage(roomName, eventType, result, gameFormatBool=false)
{
	if (!roomName || !eventType || !result)
		return ;
	if (gameFormatBool)
		result = responseFormatter(null, result, null, null);
	sockio.to(roomName).emit(`${eventType}`, result);
}

/**
 * 
 * @param {Number | undefined} id 
 */
function clientSetState(id, state=enumSocketState.NAVIGATING)
{
	let	socketInfo;
	
	if (!id)
		return ;
	socketInfo = globals.clientMap.get(id);
	if (!socketInfo)
		return ;
	socketInfo.state = state;
}

/**
 * 
 * @param {Set<number> | number | Array<number>} ids 
 */
function clientResetData(ids)
{
	let	socketData;

	if (typeof(ids) == "number")
		ids = [ids];
	for (const id of ids)
	{
		socketData = globals.clientMap.get(id);
		if (!socketData)
		{
			console.warn(`clientResetData: socket ${id} already quit. Trace:`);
			console.trace();
			continue ;
		}
		globals.RemoveFromAllQueues(id, false);
		globals.DeletePlayer(socketData.matchData?.matchId, socketData.matchData?.team);
		globals.LeaveRoom(socketData, id);
		globals.ClearTimer(id);
	}
}

/**
 * 
 * @param {Match | number | undefined} match 
 * @param {string} msg 
 * @param {string} author
 * @param {function | null} printer 
 */
function gameMessage(match, msg, author="server", printer=console.log)
{
	let	id;
	let	result;

	if (match == undefined)
		return ;
	if (typeof(match) == "number")
		match = globals.matches.get(`${match}`);
	if (!match)
		return ;
	if (printer)
		printer(msg);
	if (match.socketBool == false)
		return ;
	result = new Result().Success("OK", "msg");//@ts-ignore
	result.author = author;
	result.msg = msg;
	roomMessage(`match_${match.id}`, `game`, result);
}

export {getReconnectTime, isBusy, roomMessage, gameMessage, clientSetState, clientResetData};