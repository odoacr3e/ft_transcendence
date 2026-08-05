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

/** @typedef {import("../Classes/endPoint/result.js").Result} Result*/

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
 */
function roomMessage(roomName, eventType, result)
{
	if (!roomName || !eventType || !result)
		return ;
	sockio.to(roomName).emit(`${eventType}`, result);
}

export {getReconnectTime, isBusy, roomMessage};