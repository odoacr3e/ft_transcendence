// @ts-check

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

	col = this.getCol();
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

	newSquare = String.fromCharCode(this.getRow() + "a".charCodeAt(0) - 1);
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
	let tmp = this.getRow();

	if ((tmp + dy) < 9 && (tmp + dy) > 0)
		this.setRow(this.getRow() + dy);
}

/**
 * 
 * @this {Cursor}
 * @param {Number} dx 
 */
function moveCol(dx)
{
	let tmp = this.getCol();

	if ((tmp + dx) < 9 && tmp + dx > 0)
		this.setCol(tmp + dx);
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
		/** @type {string} */ this.square = "a1", // the string position: a1, b2, c3...
		this.getRow = getCol.bind(this),
		this.getCol = getRow.bind(this),
		this.setRow = setCol.bind(this),
		this.setCol = setRow.bind(this),
		this.moveRow = moveCol.bind(this),
		this.moveCol = moveRow.bind(this),
		this.set = set.bind(this),
		this.setCursor = setCursor.bind(this)
	}
}


module.exports = {Cursor};
