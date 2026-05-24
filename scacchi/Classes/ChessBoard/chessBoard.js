// @ts-check
/** @typedef {pieces.Piece} Piece */

//SECTION import
const {CHESSBOARD_H, CHESSBOARD_W} = require("../../Macro/macro.js");
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
		if (other.piece != null)
			this.piece = pieces.copyPiece(other.piece);
		else
			this.piece = null;
		this.piece = other.piece;
		this.targetZones = other.targetZones;
		this.boostedTargetZones = other.boostedTargetZones;
		this.dangerZones = other.dangerZones;
	}
}

//ANCHOR - Methods

//SECTION - chessBoard Map 
//ANCHOR - Definition 

class ChessBoard
{
	/**
	 * 
	 * @param {number} w 
	 * @param {number} h 
	 */
	constructor(w, h)
	{
		this._data = initBoard(w, h);
		this.width = w;
		this.heigth = h;
	}
	clear(){this._data.clear();}
	/** @param {string} key*/
	delete(key){return (this._data.delete(key));}
	entries(){return (this._data.entries());}
	/**
	 * 
	 * @param {(value: Square, key: string, map: Map<string, Square>) => void} f
	 * @param {*} args 
	 */
	forEach(f, args=null){this._data.forEach(f, args);}
	/** @param {string} key*/
	get(key)
	{
		let	val;

		val = this._data.get(key);
		if (!val)
			throw (`ChessBoard: invalid position ${key}`);
		return (val);
	}
	/**
	 * 
	 * @param {string} key 
	 * @param {Square} val 
	 */
	set(key, val){this._data.set(key, val);}
	/** @param {string} key*/
	has(key){return (this._data.has(key));}
	keys(){return (this._data.keys());}
	values(){return (this._data.values());}
	[Symbol.iterator](){return (this._data[Symbol.iterator]());}
};

//ANCHOR - utils

/**
 * 
 * @param {number} maxWidth 
 * @param {number} maxHeigth 
 * @returns 
 */
function initBoard(maxWidth=CHESSBOARD_W, maxHeigth=CHESSBOARD_H)
{
	/** @type {string} */				let	row;
	/** @type {number} */				let	col;
	/** @type {string} */				let	squareId;
	/** @type {Map<string, Square>} */	let	board;

	board = new Map();
	row = "a";
	for (let i = 0; i < maxHeigth; i++)
	{
		for (col = 1; col <= maxWidth; col++)
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
		dest.set(pos, new Set(zones));
	}
	return (dest);
}

module.exports = {ChessBoard, Square, initBoard, copyBoard, copyBoostedTargetZones};