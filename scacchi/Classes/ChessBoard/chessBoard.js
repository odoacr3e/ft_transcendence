// @ts-check
//const {include} = require("./lib/lib.js");
const {CHESSBOARD_H, CHESSBOARD_W} = require("../../macro.js");
//const {Enum} = require("./lib/lib.js");

/** @typedef {pieces.Piece} Piece */

//SECTION import

const macro = require("../../macro.js");
const pieces = require("../Pieces/pieces.js");

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

//ANCHOR - Methods

//SECTION - chessBoard Map 
//ANCHOR - Definition 

//ANCHOR - utils

function initBoard()
{
	/** @type {string} */				let	row;
	/** @type {number} */				let	col;
	/** @type {string} */				let	squareId;
	/** @type {Map<string, Square>} */	let	board;

	// @ts-ignore
	board = new Map();
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
	return (board);
}

/**
 * 
 * @param {Map<string, Square>} src 
 * @param {Map<string, Square> | null} dest optional: if passed, is cleared
 * @returns {Map<string, Square>} a deep copy of src
 */
function copyBoard(src, dest=null)
{
	if (!dest)
		dest = new Map();
	dest.clear();
	for (const [key, val] of src)
	{
		let	squareCopy;

		squareCopy = new Square(val);
		dest.set(key, squareCopy);
	}
	return (dest);
}

/**
 * 
 * @param {Map<string, Set<string>>} src 
 * @param {Map<string, Set<string>> | null} dest optional: if passed, is cleared
 * @returns {Map<string, Set<string>>} a deep copy of src
 */
function copyBoostedTargetZones(src, dest=null)
{
	let	zones;

	if (!dest)
		dest = new Map();
	dest.clear();
	zones = new Set();
	for (const [pos, targets] of src) //FIXME - non vengono copiati bene
	{
		zones.clear();
		for (const bonusPos of targets)
		{
			zones.add(bonusPos);
		}
		dest.set(pos, zones);
	}
	return (dest);
}

initBoard();
// console.log(board);

module.exports = {Square, initBoard, copyBoard, copyBoostedTargetZones};
