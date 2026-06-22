// @ts-check

import {Match} from "./match.js";
import {DEBUG} from "../../Macro/macro.js";

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

		if (DEBUG)
			this. matches.set(TEST_MATCH, new Match());
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