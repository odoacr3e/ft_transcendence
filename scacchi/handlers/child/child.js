// @ts-check

import { Match } from "../../Classes/Chess/match.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Child } from "../../Classes/Globals/Child.js";
import { eTeam, eChildEvents, eEvents } from "../../Macro/enums.js";
import { responseFormatter, sendData } from "../../utils/response.js";
import { init } from "../game/init.js";
import { gameMessage } from "../../websocket/utils.js";
import { normifyRequest, Result } from "../game/utils.js";
import { isOneOf } from "../../utils/string.js";
import { gameHandler, gamePlayerNotificationHandler } from "../game/Game.js";
import { AIexecuteTurn } from "../../GameLogic/aiTurn.js";

/** @typedef {import("../../Classes/Globals/Child").ChildData} ChildData */

let	id = 0;
/** @type {Set<number>} */
let	matchSet = new Set();

process.on("exit", () => {process.exit()});

process.on("message", (/** @type ChildData */ data) => 
{
	try
	{
		if (data.Event == eChildEvents.Init)
		{
			id = data.ChildId;
			globals.childId = id;
		}
		else if (data.Event == eChildEvents.CreateMatch)
			initMatch(data);
		else if (data.Event == eChildEvents.Game)
			matchEvent(data);
		else if (data.Event == eChildEvents.GameMsg)
			gameMessage(data.MatchId, data.Data?.msg, data.Data?.author);
	}
	catch(err)
	{//@ts-ignore
		sendData(eChildEvents.Error, Number(data.MatchId), err);
	}
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
	result.type = "init";
	match.id = `${data.MatchId}`;
	result.team = match.currentPlayer.ai? eTeam.White : eTeam.Black;
	globals.matches.set(match.id, match);
	sendData(eChildEvents.Game, match.id, responseFormatter(match, result, null, null));
	if (match.currentPlayer.ai)
		setTimeout(moveAI, 3000, match);
}

/**
 * 
 * @param {ChildData} data 
 */
async function matchEvent(data)
{
	let	match;
	let	req;
	let	result;

	if (data?.MatchId == undefined)
		throw (`child, matchEvent: match not found`);
	//@ts-ignore
	match = globals.matches.get(`${data.MatchId}`);
	if (!match)
	{
		sendData(eChildEvents.Game, data.MatchId, responseFormatter(null, null, "Match not found", 404));
		return ;
	}
	req = normifyRequest(match.cursor, data.Data);
	if (!req?.type)
	{
		// sendData(eChildEvents.Game, data.MatchId, responseFormatter(match, null, `req with no type`, 400));
		return ;
	}
	if (isOneOf(req.type, "giveup", "draw"))
		result = gamePlayerNotificationHandler(match, req, null);
	else
		result = await gameHandler(match, req, null);//@ts-ignore
	if (!result.victory && match.currentPlayer.ai)
		setTimeout(moveAI, 1000, match);
	sendData(eChildEvents.Game, data.MatchId, result);
}

/**
 * 
 * @param {Match} match 
 */
function moveAI(match)
{
	try
	{
		AIexecuteTurn(match);
	}
	catch (error)
	{
		sendData(eChildEvents.Error, Number(match.id), error);
	}
}
