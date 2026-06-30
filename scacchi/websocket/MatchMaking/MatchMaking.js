//@ts-check
import * as lib from "../lib/lib.js"
const { ALLOWED_URL } = lib;
const { jwt } = lib.auth;
const { redis } = lib.conn;
const { parse, app, server } = lib.include;
import { globals } from "../../Classes/Globals/globals.js";
import { announceMeOnline } from "./onlineStatus.js";
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
	queue.add(userId);
	// while ()
	// cerca playert
	// 	if ( setImmediate.size == playrenum)
	// 		break
	// creatematch
}