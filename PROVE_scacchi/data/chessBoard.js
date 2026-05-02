// @ts-check
//const {include} = require("./lib/lib.js");
//const {Chess} = require("./lib/lib.js");
const {CHESSBOARD_H, CHESSBOARD_W} = require("./macro.js");
//const {Enum} = require("./lib/lib.js");

/** @typedef {pieces.Piece} Piece */

//SECTION import

const macro = require("./macro.js");
const pieces = require("./pieces.js");

//ANCHOR - Definition 

class Square
{
	constructor()
	{
        /** @type {string} */  			this.color = eTeam.Black;
        /** @type {Piece | null} */   	this.piece = null;
		/** @type {Array<string>} */	this.targetZones = [];
		/** @type {Array<string>} */	this.dangerZones = [];
	}
    //tutti i dati
}



/**
 * @enum {string}
 */
const eTeam = 
{
	Black: 'Black',
	White: 'White'
};

//ANCHOR - Methods

//SECTION - chessBoard Map 
//ANCHOR - Definition 

/** @type {Map<string, Square>} */ const board = new Map();

//ANCHOR - utils

function initBoard()
{
	/** @type {string} */	let	row;
	/** @type {number} */	let	col;
	/** @type {string} */	let	squareId;

	row = "a";
	for (let i = 0; i < CHESSBOARD_H; i++)
	{
		for (col = 1; col <= CHESSBOARD_W; col++)
		{
			squareId = row + col;
			board.set(squareId, new Square());
		}
		row = String.fromCharCode(row.charCodeAt(0) + 1);
	}
}

initBoard();
// console.log(board);

module.exports = {board, eTeam, Square};