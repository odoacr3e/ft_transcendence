const { clear } = require("node:console");
const {board, eTeam, Square} = require("./chessBoard");
const {CHESSBOARD_H, CHESSBOARD_W} = require("./macro"); 
const { start } = require("node:repl");

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
		/** @type {function} */	this.DangerUpdate = DangerUpdate.bind(this);
		/** @type {function} */	this.DangerReset = DangerReset.bind(this);

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
function Move(dx=0, dy=0, flyBool=false, clearDangerZones=false)
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
	if (clearDangerZones == true)
		this.DangerReset();
	this.position = newPosition;
	return (1);
}

function DangerUpdate()
{
	let	startPos;
	let	piece;

	startPos = this.position;
	piece = board.get(this.position).piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArrayDEBUG)
	{
		while (this.Move(dx, dy, false))
		{
			board.get(this.position).dangerZones.push(startPos);
			board.get(startPos).targetZones.push(this.position);
			if (piece.moveLongRangeDEBUG == false)
				break ;
		}
		this.position = startPos;
	}
	return (1);
}

function DangerReset()
{
	let	startPos;
	let	zones;
	let	i;

	startPos = this.position;
	zones = board.get(this.position).targetZones;
	if (zones.length == 0)
		return (0);
	for (let zone of zones)
	{
		i = board.get(zone).dangerZones.indexOf(startPos);
		if (i != -1)
			board.get(zone).dangerZones.splice(i, 1);
	}
	board.get(this.position).targetZones = [];
	return (1);
}

const cursor = new Cursor("a1");

module.exports = {cursor, Cursor}