// @ts-check

//SECTION - history function
/*
	list of exports:
	-	historyRestore:	restores a match using a history file.
*/

import fs from "fs";
import {eEvents} from "../Macro/enums.js";
import {Match} from "../Classes/Chess/match.js";
import {HistoryEvent} from "../Classes/Chess/history.js";
import {move, boost, endTurn, init, error} from "../handlers/game/Game.js";
import { render } from "../test/render.js";
import { makeTransfiguration } from "../handlers/game/transfiguration.js";


/** @typedef {import ("../Classes/Chess/history.js").History} History */

let	DEBUGCounter = 0;
let	DEBUGEvent = "";

/** 
 * restores a match using a history file.
 * @param {Match} match
 * @param {string} path
 */
function historyRestore(match, path)
{
	/** @type {History} */
	let	history;
	let	buffer;
	let	result;
	let	playerNum;

	DEBUGCounter = 0;
	if (path.endsWith(".json") == false)
		path += ".json";
	if (!path || !fs.existsSync(path))
		throw (`History, restore: path "${path}" invalid`);
	buffer = fs.readFileSync(path, "utf-8");
	history = JSON.parse(buffer);
	match.Reset(history.matchSettings);
	try
	{
		init(match, match.settings);
		match.historyCreateBool = true;
		for (const event of history.events)
		{
			//@ts-ignore
			DEBUGEvent = event;
			playerNum = match.playerNum;
			console.log(`History: move number ${event.counter}`);
			if (DEBUGCounter == 12)
				console.log("");
			if (event.type == eEvents.Move)
				result = move(match, event.from, event.to, event.useBoostBool);
			else if (event.type == eEvents.MoveBoost)
				result = move(match, event.from, event.to, true);
			else if (event.type == eEvents.Boost)
				result = boost(match, event.from);
			else if (event.type == eEvents.Transform)
				result = makeTransfiguration(match, event.from, event.to);
			else if (event.type == eEvents.EndTurn)
			{
				result = endTurn(match);
				continue ;
			}
			else
				continue ;//@ts-ignore
			if (result.status != 200 && !event.error)
				throw (`${result.status}: ${result.msg}\n${JSON.stringify(event, null, 2)}`);//@ts-ignore
			else if (result.status == 200 && event.error == true)
				throw (`${result.status}: \n${JSON.stringify(event, null, 2)}`);
			else if (result.status == 200)
				DEBUGCounter++;
			else
				error(null, result, 0, null, false);
			// if (match.victory)
			// 	console.debug(`this move give invalid victory for ${match.victory}. \nevent: ${JSON.stringify(event)}`);
			if (event.lastLost && playerNum == match.playerNum)
				throw(`player ${event.lastLost} should have lost. \nevent: ${JSON.stringify(event)}`);
			if (!event.lastLost && playerNum != match.playerNum)
				throw(`Invalid loss for a player. \nevent: ${JSON.stringify(event)}`);
			render(match);
			//NOTE - print di ogni risposta/richiesta
			// printResponse(match, event, result);
		}
		match.historyCreateBool = false;
		match.history.events = history.events;
		match.history.moves = history.moves;
	}
	catch(err)
	{
		DEBUGEvent = JSON.stringify(DEBUGEvent, null, 2);
		throw (`Move ${DEBUGEvent}: ${err}`);
	}
}

/**
 * 
 * @param {Match} match
 * @param {HistoryEvent} event 
 * @param {import("../Classes/endPoint/result.js").Result} result 
 */
function printResponse(match, event, result)
{
	console.debug("\x1b[33m");
	console.debug(JSON.stringify(event, null, 2));
	console.debug("\x1b[0m");
	//console.debug(JSON.stringify(result.board, null, 2));
	// console.log("data for g5:\n\n" + JSON.stringify(match.board.get("g5").targetZones, null, 2));
	console.debug("*--------------------*\n");
}

export {historyRestore};