const getRow = () => {return(cursor.square.charCodeAt(0) - "a".charCodeAt(0) + 1);}
const getCol = () => {return(cursor.square.charCodeAt(1) - "0".charCodeAt(0));}

/**
 * 
 * @param {number} newRow 
 */
let setRow = (newRow) => 
{
	let col;
	let newSquare;

	col = getCol();
	newSquare = String.fromCharCode(newRow + "a".charCodeAt(0) - 1);
	newSquare += col;
	cursor.square = newSquare;
}

/**
 * 
 * @param {number} newCol 
 */
let setCol = (newCol) => 
{
	let newSquare;

	newSquare = String.fromCharCode(getRow() + "a".charCodeAt(0) - 1);
	newSquare += String(newCol);
	cursor.square = newSquare;
}

function moveRow(dy)
{
	let tmp = cursor.getRow();

	if ((tmp + dy) < 9 && (tmp + dy) > 0)
		cursor.setRow(cursor.getRow() + dy);
}

function moveCol(dx)
{
	let tmp = cursor.getCol();

	if ((tmp + dx) < 9 && tmp + dx > 0)
		cursor.setCol(tmp + dx);
}

/**
 * 
 * @param {number} newCol 
 * @param {number} newRow 
 */
let setCursor = (newRow, newCol) => 
{
	let newSquare;

	if (typeof newRow === "string" && newCol === undefined)
	{
		cursor.square = newRow;
		return ;
	}
	if (typeof newRow === "number" && typeof newCol === "number")
	{
		newSquare = String.fromCharCode(newRow + "a".charCodeAt(0) - 1);
		newSquare += String(newCol);
		cursor.square = newSquare;
		return ;
	}
	throw new Error("setCursor accetta una square string o due numeri");
}

/**
 * @param {String} pos
 */
let set = (pos) =>
{
	cursor.square = pos.at(0);
	cursor.square += pos.slice(1, pos.length);
}

let cursor = 
{
	/** @type {string} */ square: "a1", // the string position: a1, b2, c3...
	getRow: getRow,
	getCol: getCol,
	setRow: setRow,
	setCol: setCol,
	moveRow: moveRow,
	moveCol: moveCol,
	set: set,
	setCursor: setCursor
}

module.exports = {cursor};
