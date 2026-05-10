// @ts-check
const fs = require("fs");

const {Square} = require("./chessBoard.js");
// const {Piece} = require("./pieces.js");
const Macro = require("./macro.js");
const {eEvents} = require("./enums.js");
const {Cursor} = require("./cursor.js");
const {Match} = require("./match.js");
const { Piece } = require("./pieces.js");
const {dangerUpdateAll} = require("./utils.js");
const {move, boost, endTurn} = require("./handlers/game/Game.js");
const { render } = require("./render.js");


/** @typedef {import ("./match.js").History} History */

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
			square.piece.isBoostedBool = false;
			square.piece.isMovedBool = false;
		}
		square.boostedTargetZones = new Map();
		square.dangerZones = new Set();
		square.targetZones = new Set();
	}
	dangerUpdateAll(match);
	for (const event of history.events)
	{
		if (event.type == eEvents.Move)
			move(match, event.from, event.to);
		else if (event.type == eEvents.Boost)
			boost(match, event.from);
		else if (event.type == eEvents.EndTurn)
			endTurn(match);
	}
	match.history.startBoard = history.startBoard;
	match.history.events = history.events;
	match.history.moves = history.moves;
}

module.exports = {historyRestore};