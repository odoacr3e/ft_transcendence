//@ts-check
import * as lib from "../lib/lib.js"
const { ALLOWED_URL } = lib;
const { jwt } = lib.auth;
const { redis } = lib.conn;
const { parse, app, server } = lib.include;
import { globals } from "../Classes/Globals/globals.js";
import { announceMeOnline } from "./onlineStatus.js";

/** @typedef {import("../../Classes/Chess/player.js").Player} Player*/
/** @typedef {{socket: *, allowedBool: boolean, matchData?: Player}} Socket */
/** @typedef {import("../../Classes/endPoint/matchInit.js").matchMakingOpt} MatchMakingOpt*/

/**
 * 
 * @param {*} sockio 
 * @param {*} socketData 
 * @param {*} user 
 * @param {Map<string, Socket>} clientMap 
 * @param {MatchMakingOpt} options
 */
function MatchMaking(sockio, socketData, user, clientMap, options)
{
	let queue;

	switch (options.roomType)
	{
		default: return;
	}
}