const {board, eTeam, Square} = require("./chessBoard");
const {CHESSBOARD_H, CHESSBOARD_W} = require("./macro"); 

//SECTION - cursor class
//ANCHOR - Definition 

class Cursor
{
	/**
	 * 
	 * @param {string} start starting position 
	 */
	constructor(start)
	{
		/** @type {function} */	this.Set = Set.bind(this);
		/** @type {function} */	this.Move = Move.bind(this);

		/** @type {string} */	this.position = Set(start);
		
	}
}

/**
 * 
 * @param {string} position 
 */
function Set(position)
{
	if (position.length != 2)
		throw new Error("CursorException::illegal cursor starting position" + position);
	this.position = position;
	return (this.position);
}

/**
 * 
 * @param {number} dx 
 * @param {number} dy 
 * @param {boolean} fly 
 */
function Move(dx=0, dy=0, flyBool=false)
{
	let	row;
	let	col;
	let	asciiCodeA;
	let	newPosition;
	let	square;

	asciiCodeA = "a".charCodeAt(0);
	row = this.position.charCodeAt(0) - asciiCodeA;
	col = parseInt(this.position.slice(1, this.position.length));
	row += dy;
	col += dx;
	newPosition = String.fromCharCode(row + asciiCodeA) + col;
	square = board.get(newPosition);
	if (square == null)
		return (0);
	else if (square.piece != null && flyBool == false)
		return (0);
	this.position = newPosition;
	return (1);
}

const cursor = new Cursor("a1");

module.exports = {cursor}