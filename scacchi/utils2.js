// @ts-check
const fs = require("fs");
const {eEvents} = require("./Macro/enums.js");
const {Match} = require("./Classes/Match/match.js");
const { Piece } = require("./Classes/Pieces/pieces.js");
const {move, boost, endTurn, init} = require("./handlers/game/Game.js");
const { render } = require("./test/render.js");


/** @typedef {import ("./Classes/Match/match.js").History} History */

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

	if (path.endsWith(".json") == false)
		path += ".json";
	if (!path || !fs.existsSync(path))
		throw (`History, restore: path "${path}" invalid`);
	buffer = fs.readFileSync(path, "utf-8");
	history = JSON.parse(buffer);
	match.Reset();
	init(match, history.seed);
	match.historyCreateBool = true;
	for (const event of history.events)
	{
		if (event.type == eEvents.Move)
			result = move(match, event.from, event.to, event.useBoostBool);
		else if (event.type == eEvents.Boost)
			result = boost(match, event.from);
		else if (event.type == eEvents.EndTurn)
			result = endTurn(match);
		else
			continue ;
		if (result.status != 200)
			throw (`${result.status}: ${result.msg}\n${JSON.stringify(event, null, 2)}`);
	}
	match.historyCreateBool = false;
	match.history.events = history.events;
	match.history.moves = history.moves;
}

module.exports = {historyRestore};