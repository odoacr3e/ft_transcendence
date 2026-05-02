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
	/**
	 * 
	 * @param {Square | null} other 
	 * @returns 
	 */
	constructor(other=null)
	{
        /** @type {string | undefined} */		this.color = undefined;
        /** @type {Piece | null | undefined} */ this.piece = null;
		/** @type {Set<string>} */				this.targetZones = new Set();
		/** @type {Map<string, Set<string>>} */	this.boostedTargetZones = new Map();
		/** @type {Set<string>} */				this.dangerZones = new Set();

		if (other == null)
			return ;
		this.color = other.color;
		this.piece = other.piece;
		this.targetZones = other.targetZones;
		this.boostedTargetZones = other.boostedTargetZones;
		this.dangerZones = other.dangerZones;
	}
    //tutti i dati
}

/**
 * @enum {string}
 */
const eTeam = 
{
	Black: 'black',
	White: 'white',
	Red: 'red',
	Blue: 'blue',
	Green: 'green',
	Yellow: 'yellow',
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
