// @ts-check
const {Cursor} = require("./cursor.js");
const {eTeam, eEvents} = require("./enums.js");
const {initBoard, copyBoard, Square} = require("./chessBoard.js");
const preset = {
	white: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		nPieces: 0,
		team: eTeam.White,
		next: eTeam.Black,
		King: "a1"
	},
	black: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		nPieces: 0,
		team: eTeam.Black,
		next: eTeam.White,
		King: "a1"
	},
	red: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		nPieces: 0,
		team: eTeam.Red,
		next: eTeam.Blue,
		King: ""
	},
	blue: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		nPieces: 0,
		team: eTeam.Blue,
		next: eTeam.Green,
		King: ""
	},
	green: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		nPieces: 0,
		team: eTeam.Green,
		next: eTeam.Yellow,
		King: ""
	},
	yellow: 
	{
		name: "",
		nPoints: 0,
		bonusPointCounter: 0,
		nPieces: 0,
		team: eTeam.Yellow,
		next: eTeam.Red,
		King: ""
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
		this.currentPlayer = this.white;
	}
	endTurn = () =>
	{
		/** @type {String} */ let	next = this.currentPlayer.next;

		// @ts-ignore
		this.currentPlayer = this[next];
	}
	forceWhiteTurn = () =>
	{
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
		this.startBoard = copyBoard(board);
		/** @type {Array<HistoryEvent>} */
		this.events = new Array();
		this.UpdateMoves = updateMoves;
		this.UpdateBoost = updateBoost;
		this.UpdateEndTurn = updateEndTurn;
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
	 */
	constructor(eventType="", team="", pieceType="", from="", to="")
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
	}
}

/**
 * 
 * @this {History}
 * @param {Square} square 
 * @param {Array<string>} coords 
 */
function updateMoves(square, coords)
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
	record = new HistoryEvent(eEvents.Move, square.piece.team, square.piece.type, coords[0], coords[1]);
	this.events.push(record);
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
}

module.exports = {Match};