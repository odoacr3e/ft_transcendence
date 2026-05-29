// @ts-check
const fs = require("fs");
const {eEvents} = require("./Macro/enums.js");
const {Match, HistoryEvent} = require("./Classes/Match/match.js");
const { Piece } = require("./Classes/Pieces/pieces.js");
const {move, boost, endTurn, init, error} = require("./handlers/game/Game.js");
const { render } = require("./test/render.js");
const { Result } = require("pg");


/** @typedef {import ("./Classes/Match/match.js").History} History */

let	DEBUGCounter = 0;

/** 
 * 
 * @param {Match} match
 * @param {string} path
 */
function historyRestore(match, path)
{
	/** @type {History} */
	let	history;
	let	buffer;
	let	result;

	DEBUGCounter = 0;
	if (path.endsWith(".json") == false)
		path += ".json";
	if (!path || !fs.existsSync(path))
		throw (`History, restore: path "${path}" invalid`);
	buffer = fs.readFileSync(path, "utf-8");
	history = JSON.parse(buffer);
	match.Reset();
	try
	{
	init(match, history.seed);
	match.historyCreateBool = true;
	for (const event of history.events)
	{
		if (event.type == eEvents.Move)
			result = move(match, event.from, event.to, event.useBoostBool);
		else if (event.type == eEvents.Boost)
			result = boost(match, event.from);
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
		//NOTE - print di ogni risposta/richiesta
		// printResponse(match, event, result);
	}
	match.historyCreateBool = false;
	match.history.events = history.events;
	match.history.moves = history.moves;
	}
	catch(err)
	{
		throw (`Move ${DEBUGCounter}: ${err}`);
	}
}

/**
 * 
 * @param {Match} match
 * @param {HistoryEvent} event 
 * @param {import("./Classes/endPoint/result.js").Result} result 
 */
function printResponse(match, event, result)
{
	console.debug("\x1b[33m");
	console.debug(JSON.stringify(event, null, 2));
	console.debug("\x1b[0m");
	console.debug(JSON.stringify(result.board, null, 2));
	// console.log("data for g5:\n\n" + JSON.stringify(match.board.get("g5").targetZones, null, 2));
	console.debug("*--------------------*\n");
}

module.exports = {historyRestore};