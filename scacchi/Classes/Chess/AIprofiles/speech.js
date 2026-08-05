//@ts-check

import { getDotColor } from "../../../test/render.js";
import { roomMessage } from "../../../websocket/utils.js";

/** @typedef {import("../match").Match} Match */

/**
 * 
 * @param {Match} match 
 * @param {string} type the event to search in the speech.json
 * @param {Array<string> | boolean} vars vars[0] replaces $VAR1, vars[1] $VAR2...
 * @param {boolean} currPlayerBool true if AI is currentPlayer, else false
 */
export function aiSpeech(match, type, vars=[], currPlayerBool=true)
{
	let	player;
	let	ai;
	/** @type {Array<string>} */
	let	msgArray;
	let	msg;
	let	i;

	if (match.aiBool == false || match.aiSimulation == true)
		return ;
	if (typeof(vars) == "boolean")
	{
		currPlayerBool = vars;
		vars = [];
	}
	if (currPlayerBool == true)
		player = match.currentPlayer;
	else
		player = match.PrevPlayer();
	ai = player.ai;
	if (!ai || !ai.speechJSON)
		return ;//@ts-ignore
	msgArray = ai.speechJSON[type];
	if (!msgArray || msgArray.length == 0)
		return ;
	msg = msgArray[Math.floor(Math.random() * msgArray.length)];
	if (!msg)
		return ;
	i = 1;
	for (const variable of vars)
	{
		while (msg.includes(`$VAR${i}`))
			msg.replace(`$VAR${i}`, variable);
		i++;
	}
	console.debug(`${ai.profile}${getDotColor(player.team)}: ${msg}`);
	roomMessage(`match_${match.id}`, "aiMsg", {msg: msg});
}
