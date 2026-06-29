// @ts-check

import {Match} from "../Chess/match.js";
import {DEBUG} from "../../Macro/macro.js";

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
		if (DEBUG)
			this.matches.set(TEST_MATCH, new Match());
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
}

const	globals = new Globals();

export {globals};