// @ts-check

import {Match} from "../Chess/match.js";
import {Queue} from "./Queue.js";
import {DEBUG} from "../../Macro/macro.js";
import { enumConnection } from "../../Macro/enums.js";

/** @typedef {import("../Chess/player.js").Player} Player*/
/** @typedef {{socket: *, allowedBool: boolean, matchData?: Player}} Socket */

const	TEST_MATCH = "0";

/**SECTION class Globals 
 * the place where server runtime data are stored
 * 
*/
class Globals
{
	constructor()
	{
		/** @type {Map<string, Match>} */
		this.matches = new Map();
		/** @type {Map<string, Socket>} */
		this.clientMap = new Map();
		/** @type {Queue} */
		this.rankedQueue = new Queue(enumConnection.RANKED);
		/** @type {Queue} */
		this.friendlyQueue = new Queue(enumConnection.FRIENDLY);
		/** @type {Queue} */
		this.arenaQueue = new Queue(enumConnection.ARENA);
		/** @type {Map<string, NodeJS.Timeout>} */
		this.timers = new Map();
		if (DEBUG)
			this.matches.set(TEST_MATCH, new Match());
		this.lastMatchId = "0";
	}
	getDebugMatch()
	{
		let	debugMatch;

		if (!DEBUG)
			throw ("Please turn DEBUG on to use this function");
		debugMatch = this.matches.get(TEST_MATCH);
		if (!debugMatch)
			throw ("No debug match in Globals!");
		return (debugMatch);
	}
	/** @param {string} roomType */
	GetQueue(roomType)
	{
		switch (roomType)
		{
			case (enumConnection.RANKED):
				return (this.rankedQueue);
			case (enumConnection.FRIENDLY):
				return (this.friendlyQueue);
			case (enumConnection.ARENA):
				return (this.arenaQueue);
			case (enumConnection.PRIVATE):
				throw (`GetQueue: roomType ${roomType} invalid for matchmaking`);
			default:
				throw (`GetQueue: roomType ${roomType} invalid`);
		}
	}
}

const	globals = new Globals();

export {globals};