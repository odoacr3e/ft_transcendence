//@ts-check
import { globals } from "../../Classes/Globals/globals.js";
import { enumConnection } from "../../Macro/enums.js";
import { useId } from "react";

/** @typedef {import("../../Classes/Chess/player.js").Player} Player*/
/** @typedef {{socket: *, allowedBool: boolean, matchData?: Player}} Socket */
/** @typedef {import("../../Classes/endPoint/matchInit.js").matchMakingOpt} MatchMakingOpt*/

/**
 * 
 * @param {*} sockio 
 * @param {string} userId
 * @param {Map<string, Socket>} clientMap 
 * @param {MatchMakingOpt} options
 */
export function MatchMaking(sockio, userId, clientMap, options)
{
	let queue;
	let	socketData;

	socketData = clientMap.get(userId);
	if (!socketData)
		throw (`user id ${userId} does not exist`);
	queue = globals.GetQueue(options.roomType);
	queue.AddNode(userId, options);
	console.log(`userId ${userId} added to queue ${queue.roomType}`);
}