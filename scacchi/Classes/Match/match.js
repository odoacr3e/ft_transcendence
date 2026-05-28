// @ts-check
const fs = require("fs");

const {Cursor} = require("./cursor.js");
const {eTeam, eEvents} = require("../../Macro/enums.js");
const {Square, initBoard, copyBoard, copyBoostedTargetZones, ChessBoard} = require("../ChessBoard/chessBoard.js");
const {HISTORY_PATH, MATCHTIMER, CHESSBOARD_W, CHESSBOARD_H} = require("../../Macro/macro.js");
const {Result} = require("../endPoint/result.js");

/**
 * timeout = puntatore alla funzione setTimeout
 * start = tempo in cui inizia il countdown
 * time = tempo limite del coutdown
 * @typedef {{timeout: object, start: number, time: number}} Timer
 */

const preset = {
	white: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.White,
		next: eTeam.Black,
		King: "",
		boostedPiece: "",
		time: MATCHTIMER
	},
	black: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Black,
		next: eTeam.White,
		King: "",
		boostedPiece: "",
		time: MATCHTIMER
	},
	red: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Red,
		next: eTeam.Blue,
		King: "",
		boostedPiece: "",
		time: MATCHTIMER
	},
	blue: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Blue,
		next: eTeam.Yellow,
		King: "",
		boostedPiece: "",
		time: MATCHTIMER
	},
	green: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Green,
		next: eTeam.Red,
		King: "",
		boostedPiece: "",
		time: MATCHTIMER
	},
	yellow: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Yellow,
		next: eTeam.Green,
		King: "",
		boostedPiece: "",
		time: MATCHTIMER
	},
}

class Match
{
	constructor()
	{
		this.white = preset.white;
		this.black = preset.black;
		this.red = preset.red;
		this.blue = preset.blue;
		this.green = preset.green;
		this.yellow = preset.yellow;
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
		}
		else
			return (new Result());
		return (result);
	}
	Reset()
	{
		this.white = preset.white;
		this.black = preset.black;
		this.red = preset.red;
		this.blue = preset.blue;
		this.green = preset.green;
		this.yellow = preset.yellow;
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
		for (const event of this.events)
		{
			// @ts-ignore
			delete event.pieceBoosterTargetZones;
			// @ts-ignore
			delete event.movedPiece;
			//@ts-ignore
			delete event.isBoostedBool;
		}
		if (name)
		{
			name = HISTORY_PATH + name;
			if (name.indexOf(".json") == -1)
				name = name + ".json";
		}
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
	 * @param {string} pieceType
	 * @param {string} from
	 * @param {string} to
	 * @param {Map<string, Set<string>> | null} pieceBoosterZones
	 */
	constructor(counter, eventType="", team="", pieceType="", from="", to="", pieceBoosterZones=null, isBoosted=false)
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

	if (!this)
		throw ("updateMoves must be called inside of History class");
	if (!coords[0] || !coords[1])
		throw (`History: invalid move coords [${coords[0]}, ${coords[1]}]`);
	if (!square)
		throw (`History: invalid square`);
	if (!square.piece)
		throw (`History: missing piece in square: ${square}`);
	record = new HistoryEvent(this.moves, eEvents.Move, square.piece.team, square.piece.type, coords[0], coords[1], square.boostedTargetZones, square.piece.isBoostedBool);
	record.useBoostBool = match.currentPlayer.useBoostBool;
	this.events.push(record);
	this.moves += 1;
}

/**
 * 
 * @this {History}
 * @param {Square} square 
 * @param {string} from 
 */
function updateBoost(square, from)
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
	record = new HistoryEvent(this.moves, eEvents.Boost, square.piece.team, square.piece.type, from);
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
	record = new HistoryEvent(this.moves, eEvents.EndTurn, match.currentPlayer.team);
	this.events.push(record);
	this.moves += 1;
}

module.exports = {Match, History, HistoryEvent};