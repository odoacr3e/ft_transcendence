// @ts-check
const {Cursor} = require("./cursor.js");
const {eTeam} = require("./enums.js");
const {initBoard} = require("./chessBoard.js");
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
		this.white = preset.white,
		this.black = preset.black,
		this.red = preset.red,
		this.blue = preset.blue,
		this.green = preset.green,
		this.yellow = preset.yellow,
		this.board = initBoard();
		this.cursor = new Cursor();
		this.moves = 0;
		this.boost = 0;
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

const match = new Match();

module.exports = {match, Match};