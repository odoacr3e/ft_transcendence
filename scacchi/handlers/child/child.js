// @ts-check

import { Match } from "../../Classes/Chess/match.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Child } from "../../Classes/Globals/Child.js";
import { eTeam, eChildEvents } from "../../Macro/enums.js";
import { responseFormatter } from "../../utils/response.js";
import { init } from "../game/init.js";

/** @typedef {import("../../Classes/Globals/Child").ChildData} ChildData */

let	id = 0;
/** @type {Set<number>} */
let	matchSet = new Set();

process.on("exit", () => {process.exit()});

process.on("message", (/** @type ChildData */ data) => 
{
	if (data.Event == eChildEvents.Init)
	{
		id = data.ChildId;
	}
	else if (data.Event == eChildEvents.CreateMatch)
		initMatch(data);
});

/**
 * 
 * @param {ChildData} data 
 */
function initMatch(data)
{
	let	match;
	let	result;
	/** @type {ChildData} */
	let	childData;

	if (!data.MatchId)
		throw (`child, initMatch: id undefined`);
	match = new Match();
	result = init(match, data.Data);
	match.id = `${data.MatchId}`;
	result.team = match.currentPlayer.ai? eTeam.White : eTeam.Black;
	globals.matches.set(match.id, match);
	childData = {ChildId: id, Event: eChildEvents.CreateMatch, MatchId: Number(match.id), Data: responseFormatter(match, result, null, null)};
	// @ts-ignore
	process.send(childData);
}
