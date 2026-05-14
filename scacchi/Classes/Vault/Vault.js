// @ts-check

const {Match} = require("./match.js");
const {DEBUG} = require("../../Macro/macro.js");

const	TEST_MATCH = "0";

/**SECTION class Vault 
 * the place where server runtime data are stored
 * 
*/
class Vault
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
			throw ("No debug match in Vault!");
		return (debugMatch);
	}
}

const	vault = new Vault();

module.exports = {vault};