//@ts-check

import fs from "fs";

import {eTeam, eEvents, enumNames} from "../../Macro/enums.js";
import {copyBoostedTargetZones} from "../ChessBoard/chessBoard.js";
import {HISTORY_PATH, CHESSBOARD_W, CHESSBOARD_H} from "../../Macro/macro.js";
import {boardStringify} from "../../test/render.js";

/**@typedef {import("./match.js").Match} Match*/
/**@typedef {import("../ChessBoard/chessBoard.js").Square} Square*/

export class History
{
	constructor(matchSettings=null)
	{
		this.seed = 0;
		/** @type {Array<HistoryEvent>} */
		this.events = new Array();
		this.moves = 0;
		this.victory = "";
		this.finalBoard = "";
		this.UpdateMoves = updateMoves;
		this.UpdateBoost = updateBoost;
		this.UpdateEndTurn = updateEndTurn;
		this.UpdateTransform = updateTransform;
		this.settings =
		{
			w: 8,
			h: 8,
			nPlayers: 2,
			startBoard: ""
		}
	}
	Last()
	{
		let	i;

		i = 0;
		while (this.events.length != i)
		{
			if (this.events[this.events.length - 1 - i].error == false)
				return (this.events[this.events.length - 1 - i]);
			++i;
		}
		return (new HistoryEvent(0, "Empty", "Empty"));
	}
	/** 
	 * 
	 * @param {Match} match 
	 * @param {string} name 
	 * */
	Log(match, name)
	{
		let	history;

		if (fs.existsSync(HISTORY_PATH) == false)
			fs.mkdirSync(HISTORY_PATH);
		if (name && fs.existsSync(name) == true)
			fs.rmSync(name);
		for (const event of this.events)
		{
			// @ts-ignore
			delete event.pieceBoosterTargetZones;
			//@ts-ignore
			delete event.isBoostedBool;
		}
		if (name)
		{
			name = HISTORY_PATH + name;
			if (name.indexOf(".json") == -1)
				name = name + ".json";
		}
		match.history.finalBoard = boardStringify(match);
		history = JSON.stringify(this, null, 2);
		if (!name)
			console.log(history);
		else
			fs.writeFileSync(name, history);
	}
};

export class HistoryEvent
{
	/**
	 * 
	 * @param {number} counter
	 * @param {string} eventType
	 * @param {string} team
	 * @param {Set<string>} updates
	 * @param {string} pieceType
	 * @param {string} from
	 * @param {string} to
	 * @param {Map<string, Set<string>> | null} pieceBoosterZones
	*/
	constructor(counter, eventType="", team="", updates=new Set, pieceType="", from="", to="", pieceBoosterZones=null, isBoosted=false)
	{
		if (!eventType)
			throw ("History Event: invalid event type");
		if (!team)
			team = "???";
		this.from = from;
		this.to = to;
		this.movedPiece = pieceType;
		this.team = team;
		this.type = eventType;
		this.pieceBoosterTargetZones = null;
		this.isBoostedBool = isBoosted;
		this.useBoostBool = false;
		this.counter = counter;
		this.updates = updates;
		this.error = false;
		if (pieceBoosterZones)
			this.pieceBoosterTargetZones = copyBoostedTargetZones(pieceBoosterZones);
	}
}

/**
 * 
 * @this {History}
 * @param {Match} match
 * @param {Square} square 
 * @param {Array<string>} coords 
 */
function updateMoves(match, square, coords)
{
	let	record;
	let	eName;

	if (!this)
		throw ("updateMoves must be called inside of History class");
	if (!coords[0] || !coords[1])
		throw (`History: invalid move coords [${coords[0]}, ${coords[1]}]`);
	if (!square)
		throw (`History: invalid square`);
	// if (!square.piece)
	// 	throw (`History: missing piece in square: ${square}`);
	eName = eEvents.Move;
	if (match.currentPlayer.useBoostBool)
		eName = eEvents.MoveBoost;
	record = new HistoryEvent(this.moves, eName, square.piece?.team, match.board.updates, square.piece?.type, coords[0], coords[1], square.boostedTargetZones, square.piece?.isBoostedBool);
	this.events.push(record);
	this.moves += 1;
}

/**
 * 
 * @this {History}
 * @param {Match} match
 * @param {Square} square 
 * @param {string} from 
 */
function updateBoost(match, square, from)
{
	let	record;

	if (!this)
		throw ("updateMoves must be called inside of History class");
	if (!from)
		throw (`History: invalid from coord`);
	if (!square)
		throw (`History: invalid square`);
	// if (!square.piece)
	// 	throw (`History: missing piece in square: ${square}`);
	record = new HistoryEvent(this.moves, eEvents.Boost, square.piece?.team, match.board.updates, square.piece?.type, from);
	this.events.push(record);
	this.moves += 1;
}

/**
 * 
 * @this {History}
 * @param {Match} match
 * @param {Square} square 
 * @param {string} from 
 * @param {string} newType
 */
function updateTransform(match, square, from, newType)
{
	let	record;

	if (!this)
		throw ("updateMoves must be called inside of History class");
	if (!from)
		throw (`History: invalid from coord`);
	if (!square)
		throw (`History: invalid square`);
	// if (!square.piece)
	// 	throw (`History: missing piece in square: ${square}`);
	record = new HistoryEvent(this.moves, eEvents.Transform, square.piece?.team, match.board.updates, newType, from);
	record.to = newType;
	this.events.push(record);
	this.moves += 1;
}

/**
 * 
 * @this {History}
 * @param {Match} match 
 */
function updateEndTurn(match)
{
	let	record;

	if (!this)
		throw ("updateMoves must be called inside of History class");
	if (!match)
		throw (`History: invalid match`);
	if (!match.currentPlayer)
		throw (`History: invalid currentPlayer`);
	if (!match.currentPlayer.team)
		throw (`History: invalid currentPlayer team`);
	record = new HistoryEvent(this.moves, eEvents.EndTurn, match.currentPlayer.team, match.board.updates);
	this.events.push(record);
	this.moves += 1;
}
