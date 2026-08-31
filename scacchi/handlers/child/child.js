// @ts-check

import { Match } from "../../Classes/Chess/match.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Child } from "../../Classes/Globals/Child.js";
import { eTeam, eChildEvents } from "../../Macro/enums.js";
import { responseFormatter } from "../../utils/response.js";
import { init } from "../game/init.js";
import { gameMessage } from "../../websocket/utils.js";
import { normifyRequest } from "../game/utils.js";
import { isOneOf } from "../../utils/string.js";
import { gameHandler, gamePlayerNotificationHandler } from "../game/Game.js";

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
	else if (data.Event == eChildEvents.Game)
		matchEvent(data);
	else if (data.Event == eChildEvents.GameMsg)
		gameMessage(data.MatchId, data.Data?.msg, data.Data?.author);
});

/**
 * 
 * @param {ChildData} data 
 */
function initMatch(data)
{
	let	match;
	let	result;

	if (!data.MatchId)
		throw (`child, initMatch: id undefined`);
	match = new Match();
	result = init(match, data.Data);
	match.id = `${data.MatchId}`;
	result.team = match.currentPlayer.ai? eTeam.White : eTeam.Black;
	globals.matches.set(match.id, match);
	sendData(eChildEvents.CreateMatch, match.id, responseFormatter(match, result, null, null));
}

/**
 * 
 * @param {ChildData} data 
 */
function matchEvent(data)
{
	let	match;
	let	req;
	let	result;

	if (data?.MatchId == undefined)
		throw (`child, matchEvent: match not found`);
	//@ts-ignore
	match = globals.matches.get(data.MatchId);
	if (!match)
	{
		sendData(eChildEvents.Game, data.MatchId, responseFormatter(null, null, "Match not found", 404));
		return ;
	}
	req = normifyRequest(match.cursor, data.Data);
	if (!req?.type)
	{
		sendData(eChildEvents.Game, data.MatchId, responseFormatter(match, null, `req with no type`, 400));
		return ;
	}
	if (isOneOf(req.type, "giveup", "draw"))
		result = gamePlayerNotificationHandler(match, req, null);
	else
		result = gameHandler(match, req, null);
	sendData(eChildEvents.Game, data.MatchId, result);
}

/**
 * 
 * @param {string} event 
 * @param {string | number} matchId 
 * @param {*} data 
 */
function sendData(event, matchId, data=null)
{
	/** @type {ChildData} */
	let	childData;

	childData = {ChildId: id, Event: event, MatchId: Number(matchId), Data: data};
	//@ts-ignore
	process.send(childData);
}