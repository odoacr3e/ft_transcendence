// @ts-check

const {CHESSBOARD_H, CHESSBOARD_W} = require("../../Macro/macro.js");

/**
 * 
 * @this {Cursor}
 */
function getRow()
{
	return(this.square.charCodeAt(0) - "a".charCodeAt(0) + 1);
}

/**
 * 
 * @this {Cursor}
 */
function getCol()
{
	return(this.square.charCodeAt(1) - "0".charCodeAt(0));
}

/**
 * 
 * @this {Cursor}
 * @param {number} newRow 
 */
function setRow(newRow) 
{
	let col;
	let newSquare;

	col = this.getRow();
	newSquare = String.fromCharCode(newRow + "a".charCodeAt(0) - 1);
	newSquare += col;
	this.square = newSquare;
}

/**
 * 
 * @this {Cursor}
 * @param {number} newCol 
 */
function setCol(newCol) 
{
	let newSquare;

	newSquare = String.fromCharCode(this.getCol() + "a".charCodeAt(0) - 1);
	newSquare += String(newCol);
	this.square = newSquare;
}

/**
 * 
 * @this {Cursor}
 * @param {Number} dy 
 */
function moveRow(dy)
{
	let tmp = this.getCol();

	if ((tmp + dy) < CHESSBOARD_H + 1 && (tmp + dy) > 0)
		this.setCol(this.getCol() + dy);
	else
		return (false);
	return (true);
}

/**
 * 
 * @this {Cursor}
 * @param {Number} dx 
 */
function moveCol(dx)
{
	let tmp = this.getRow();

	if ((tmp + dx) < CHESSBOARD_W + 1 && tmp + dx > 0)
		this.setRow(tmp + dx);
	else
		return (false);
	return (true);
}

/**
 * 
 * @this {Cursor}
 * @param {number} newCol 
 * @param {number} newRow 
 */
function setCursor(newCol, newRow)
{
	let newSquare;

	if (typeof newRow === "string" && newCol === undefined)
	{
		this.square = newRow;
		return ;
	}
	if (typeof newRow === "number" && typeof newCol === "number")
	{
		newSquare = String.fromCharCode(newRow + "a".charCodeAt(0) - 1);
		newSquare += String(newCol);
		this.square = newSquare;
		return ;
	}
	throw new Error("setCursor accetta una square string o due numeri");
}

/**
 * 
 * @this {Cursor}
 * @param {String} pos
 */
function set(pos)
{
	let	square;

	square = pos.at(0);
	console.assert(square != undefined, `cursor.set: square in ${pos} does not exist`);
	if (!square)
		return ;
	this.square = square;
	this.square += pos.slice(1, pos.length);
}

class Cursor
{
	constructor()
	{
		/** @type {string} */ this.square = "a1"; // the string position: a1, b2, c3...
		this._save_pos = "a1"; 
		this.getRow = getCol.bind(this);
		this.getCol = getRow.bind(this);
		this.setRow = setCol.bind(this);
		this.setCol = setRow.bind(this);
		this.moveRow = moveCol.bind(this);
		this.moveCol = moveRow.bind(this);
		this.set = set.bind(this);
		this.setCursor = setCursor.bind(this);
	}
	/** saves the current cursor square */
	Save()
	{
		this._save_pos = this.square;
	}
	/** restore the cursor square saved by cursor::Save */
	Restore()
	{
		this.square = this._save_pos;
	}
}


module.exports = {Cursor};
