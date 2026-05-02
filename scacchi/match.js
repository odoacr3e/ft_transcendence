// @ts-check
const {cursor} =						require("./cursor.js");
const {Piece, board, Square} = 			require("./lib/lib.js").Chess;
const {eTeam, enumValues, enumNames} =	require("./lib/lib.js").Enums;

const preset = {
	white: 
	{
		name: "",
		nPoints: 0,
		nPieces: 0,
		team: eTeam.White,
		next: eTeam.Black,
		King: "a1"
	},
	black: 
	{
		name: "",
		nPoints: 0,
		nPieces: 0,
		team: eTeam.Black,
		next: eTeam.White,
		King: "a1"
	},
	red: 
	{
		name: "",
		nPoints: 0,
		nPieces: 0,
		team: eTeam.Red,
		next: eTeam.Blue,
		King: ""
	},
	blue: 
	{
		name: "",
		nPoints: 0,
		nPieces: 0,
		team: eTeam.Blue,
		next: eTeam.Green,
		King: ""
	},
	green: 
	{
		name: "",
		nPoints: 0,
		nPieces: 0,
		team: eTeam.Green,
		next: eTeam.Green,
		King: ""
	},
	yellow: 
	{
		name: "",
		nPoints: 0,
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
		this.board = board;
		this.currentPlayer = this.white;
	}
	endTurn = () =>
	{
		/** @type {String} */ let	next = this.currentPlayer.next;

		this.currentPlayer = this[next];
	}
	getCurrentPlayer = () =>
	{
		return (this.currentPlayer);
	}
}

const match = new Match();

module.exports = {match};