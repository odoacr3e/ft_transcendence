// @ts-check
const fs = require("fs");

const {Cursor} = require("../../cursor.js");
const {eTeam, eEvents} = require("../../Macro/enums.js");
const {Square, initBoard, copyBoard, copyBoostedTargetZones} = require("../ChessBoard/chessBoard.js");
const {HISTORY_DEFAULT, HISTORY_PATH} = require("../../Macro/macro.js");

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
		boostedPiece: ""
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
		boostedPiece: ""
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
		boostedPiece: ""
	},
	blue: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Blue,
		next: eTeam.Green,
		King: "",
		boostedPiece: ""
	},
	green: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Green,
		next: eTeam.Yellow,
		King: "",
		boostedPiece: ""
	},
	yellow: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		useBoostBool: false,
		nPieces: 0,
		team: eTeam.Yellow,
		next: eTeam.Red,
		King: "",
		boostedPiece: ""
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
		this.board = initBoard();
		this.cursor = new Cursor();
		this.moves = 0;
		this.boost = 0;
		this.history = new History(this.board);
		this.historyCreateBool = false;
		this.currentPlayer = this.white;
	}
	endTurn = () =>
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
	forceWhiteTurn = () =>
	{
		this.currentPlayer = this.white;
	}
	Reset()
	{
		this.white = preset.white;
		this.black = preset.black;
		this.red = preset.red;
		this.blue = preset.blue;
		this.green = preset.green;
		this.yellow = preset.yellow;
		this.board = new Map(Object.entries(this.history.startBoard));
		this.cursor = new Cursor();
		this.moves = 0;
		this.boost = 0;
		this.history = new History(this.board);
		this.currentPlayer = this.white;		
	}
}

class History
{
	/**
	 * 
	 * @param {Map<string, Square>} board 
	 */
	constructor(board)
	{
		this.startBoard = Object.fromEntries(copyBoard(board));
		/** @type {Array<HistoryEvent>} */
		this.events = new Array();
		this.moves = 0;
		this.UpdateMoves = updateMoves;
		this.UpdateBoost = updateBoost;
		this.UpdateEndTurn = updateEndTurn;
	}
	Last()
	{
		if (this.events.length != 0)
			return (this.events[this.events.length - 1]);
		return (new HistoryEvent("Empty", "Empty"));
	}
	/** @param {string} name */
	Log(name)
	{
		let	history;

		if (fs.existsSync(HISTORY_PATH) == false)
			fs.mkdirSync(HISTORY_PATH);
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
	 * @param {string} eventType
	 * @param {string} team
	 * @param {string} pieceType
	 * @param {string} from
	 * @param {string} to
	 * @param {Map<string, Set<string>> | null} pieceBoosterZones
	 */
	constructor(eventType="", team="", pieceType="", from="", to="", pieceBoosterZones=null, isBoosted=false)
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
	record = new HistoryEvent(eEvents.Move, square.piece.team, square.piece.type, coords[0], coords[1], square.boostedTargetZones, square.piece.isBoostedBool);
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
	record = new HistoryEvent(eEvents.Boost, square.piece.team, square.piece.type, from);
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
	record = new HistoryEvent(eEvents.EndTurn, match.currentPlayer.team);
	this.events.push(record);
	this.moves += 1;
}

module.exports = {Match, History};