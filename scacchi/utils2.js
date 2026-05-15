// @ts-check
const fs = require("fs");
const {eEvents} = require("./Macro/enums.js");
const {Match} = require("./Classes/Vault/match.js");
const { Piece } = require("./Classes/Pieces/pieces.js");
const {dangerUpdateAll} = require("./utils/moveUtils.js");
const {move, boost, endTurn} = require("./handlers/game/Game.js");
const { render } = require("./test/render.js");


/** @typedef {import ("./Classes/Vault/match.js").History} History */

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

	if (!path || !fs.existsSync(path))
		throw (`History, restore: path ${path} invalid`);
	buffer = fs.readFileSync(path, "utf-8");
	history = JSON.parse(buffer);
	match.Reset();
	match.board = new Map(Object.entries(history.startBoard));
	for (let [pos, square] of match.board)
	{
		if (square.piece)
		{
			square.piece = new Piece(square.piece.type, pos, square.piece.team);
		}
		square.boostedTargetZones = new Map();
		square.dangerZones = new Set();
		square.targetZones = new Set();
	}
	dangerUpdateAll(match);
	render(match);
	match.historyCreateBool = true;
	for (const event of history.events)
	{
		console.log(event);
		if (event.type == eEvents.Move)
			result = move(match, event.from, event.to, true);
		else if (event.type == eEvents.Boost)
			result = boost(match, event.from);
		else if (event.type == eEvents.EndTurn)
			result = endTurn(match);
		else
			continue ;
		if (result.status != 200)
			console.log(`\x1b[31m${result.msg}\x1b[0m`);
		render(match);
	}
	match.historyCreateBool = false;
	match.history.startBoard = history.startBoard;
	match.history.events = history.events;
	match.history.moves = history.moves;
	console.log("first board");
	render(match);
}

module.exports = {historyRestore};