// @ts-check
import fs from "fs";

import {Cursor} from "./cursor.js";
import {eTeam, eEvents, enumNames} from "../../Macro/enums.js";
import {Square, initBoard, copyBoard, copyBoostedTargetZones, ChessBoard} from "../ChessBoard/chessBoard.js";
import {HISTORY_PATH, CHESSBOARD_W, CHESSBOARD_H} from "../../Macro/macro.js";
import {Result} from "../endPoint/result.js";
import {Player, Timer} from "./player.js";
import {boardStringify} from "../../test/render.js";
import { isDangerous } from "../../utils/gameUtils.js";
import { match } from "assert";
import { clientBoard } from "../../handlers/game/utils.js";

class Match
{
	constructor()
	{
		this.white = new Player(eTeam.White);
		this.black = new Player(eTeam.Black);
		this.red = new Player(eTeam.Red);
		this.blue = new Player(eTeam.Blue);
		this.green = new Player(eTeam.Green);
		this.yellow = new Player(eTeam.Yellow);
		this.board = new ChessBoard(CHESSBOARD_W, CHESSBOARD_H);//FIXME - conf json?
		this.cursor = new Cursor();
		this.moves = 0;
		this.boost = 0;
		this.history = new History();
		this.historyCreateBool = false;
		this.currentPlayer = this.white;
		this.playerNum = 2;
		this.victory = "";
		/** @type {Timer | null} */ this.timer = null;
	}
	endTurn()
	{
		/** @type {String} */ let	next = this.currentPlayer.next;

		// @ts-ignore
		if (!this.currentPlayer || !next || !this[next])
		{
			throw ("currentPlayer BUG");
		}
		// @ts-ignore
		this.currentPlayer = this[next];
	}
	forceWhiteTurn()
	{
		this.currentPlayer = this.white;
	}
	CheckOtherKingsDanger()
	{
		/** @type {Player} */let	player;
		/** @type {Square} */let	kingSquare;

		//@ts-ignore
		player = this[this.currentPlayer.next];
		while (player.team != this.currentPlayer.team)
		{
			kingSquare = this.board.get(player.King);
			if (isDangerous(this, kingSquare.dangerZones, player.team) == true)
				return (true);
			//@ts-ignore
			player = this[player.next];
		}
		return (false);
	}
	GetOBoostedPieceCoords()
	{
		/** @type {Player} */			let	player;
		/** @type {Square | undefined} */let	pieceSquare;
		/** @type {Array<string>} */let	arr = [];

		//@ts-ignore
		player = this[this.currentPlayer.next];
		while (player.team != this.currentPlayer.team)
		{
			pieceSquare = this.board._data.get(player.boostedPiece);
			if (!pieceSquare?.piece?.type)
			{
				//@ts-ignore
				player = this[player.next];
				continue ;
			}
			arr.push(player.boostedPiece);
			//@ts-ignore
			player = this[player.next];
		}
		if (arr.length == 0)
			return (null);
		return (arr);
	}
	/** @param {Result | null} result */
	CheckMate(result=null)
	{
		console.log("haaaaaiiiiii viiiiiiintoooooooooo!!!!!!!");
		console.log("Premi un qualsiasi tasto per concludere...");
		this.victory = this.currentPlayer.team;
		this.history.victory = this.victory;
		if (result != null)
		{
			result.msg = "you win!";
			result.status = 200;
			result.youWin = true;
			result.specialMoves.SetCheckMate();
			//@ts-ignore
			result.board = clientBoard(this);
		}
		else
			return (new Result());
		return (result);
	}
	Reset()
	{
		this.white = new Player(eTeam.White);
		this.black = new Player(eTeam.Black);
		this.red = new Player(eTeam.Red);
		this.blue = new Player(eTeam.Blue);
		this.green = new Player(eTeam.Green);
		this.yellow = new Player(eTeam.Yellow);
		this.board = new ChessBoard(CHESSBOARD_W, CHESSBOARD_H);//FIXME
		this.cursor = new Cursor();
		this.moves = 0;
		this.boost = 0;
		this.history = new History();
		this.currentPlayer = this.white;
		this.victory = "";
	}
	/** @param {string} name */
	Log(name)
	{
		this.history.Log(this, name);
	}
}

class History
{
	constructor()
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
	}
	Last()
	{
		if (this.events.length != 0)
			return (this.events[this.events.length - 1]);
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

class HistoryEvent
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
			throw ("History Event: invalid team");
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
	if (!square.piece)
		throw (`History: missing piece in square: ${square}`);
	eName = eEvents.Move;
	if (match.currentPlayer.useBoostBool)
		eName = eEvents.MoveBoost;
	record = new HistoryEvent(this.moves, eName, square.piece.team, match.board.updates, square.piece.type, coords[0], coords[1], square.boostedTargetZones, square.piece.isBoostedBool);
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
	if (!square.piece)
		throw (`History: missing piece in square: ${square}`);
	record = new HistoryEvent(this.moves, eEvents.Boost, square.piece.team, match.board.updates, square.piece.type, from);
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
	if (!square.piece)
		throw (`History: missing piece in square: ${square}`);
	record = new HistoryEvent(this.moves, eEvents.Transform, square.piece.team, match.board.updates, newType, from);
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

export {Match, History, HistoryEvent};