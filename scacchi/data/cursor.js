const getRow = () => {return(cursor.square.charCodeAt(0) - "a".charCodeAt(0));}
const getCol = () => {return(cursor.square.charCodeAt(1) - "0".charCodeAt(0));}

/**
 * 
 * @param {number} newRow 
 */
let setRow = (newRow) => {
	let col;
	let newSquare;

	col = getCol();
	newSquare = String.fromCharCode(newRow) + "a".charCodeAt(0);
	newSquare += col;
	cursor.square = newSquare;
}

/**
 * 
 * @param {number} newCol 
 */
let setCol = (newCol) => {
	let newSquare;

	newSquare = String.fromCharCode(getRow());
	newSquare += String.fromCharCode(newCol) + "0".charCodeAt(0);
	cursor.square = newSquare;
}

/**
 * 
 * @param {number} newCol 
 * @param {number} newRow 
 */
let setCursor = (newRow, newCol) => {
	let newSquare;

	newSquare = String.fromCharCode(newRow) + "a".charCodeAt(0);
	newSquare += String.fromCharCode(newCol) + "0".charCodeAt(0);
	cursor.square = newSquare;
}

let cursor = {
	square: "a1",
	getRow: getRow,
	getCol: getCol,
	setRow: setRow,
	setCol: setCol,
	setCursor: setCursor
}

module.exports = {cursor};