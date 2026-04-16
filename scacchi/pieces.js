// @ts-check
const lib =		 require("./lib.js");
const {eTeam} =  require("./chessBoard");
const {cursor} = require("./cursor.js");

//SECTION - Pezzo class
//ANCHOR - Definition 

class Piece
{
	/**
	 * @param {{type: string, price: number, movement: Array<{dx: number, dy:number}>}} obj
	 * @param {string} team
	 * @param {string} pos
	 * @param {boolean} long
	 */
	constructor ({type, price, movement}, team, pos, long)
	{
		/** @type {string} */   						this.type = type;
		/** @type {number} */   						this.price = price;
		/** @type {string} */   						this.team = eTeam.Black;
		/** @type {boolean} */  						this.isMovedBool = false;
		/** @type {boolean} */  						this.isBoostedBool = false;
		/** @type {string} */ 							this.pos = pos;
		/** @type {Function} */ 						this.moveFunction;
		/** @type {Array<{dx: number, dy:number}>} */	this.moveArrayDEBUG = movement;
		/** @type {boolean} */							this.moveLongRangeDEBUG = long;
	}
}

//SECTION - enum

/**
 * @enum {number}
 */
const enumValues = {
	KING: 0,
	CHAMPION: 10,
	MINOTAURUS: 5,
	JESTER: 5,
	VALKIRYA: 3,
	BASTARDS: 1
};

/**
 * @enum {string}
 */
const enumNames = {
	KING: 'king',
	CHAMPION: 'champion',
	MINOTAURUS: 'minotaurus',
	JESTER: 'jester',
	VALKIRYA: 'valkirya',
	BASTARDS: 'bastards',
	MAGE: 'mage',
	GHOUL: 'ghoul'
};

const preset = {
	King: {
		type: enumNames.KING,
		price: 0,
		movement: 
		[
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
		 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
		],
		booster: null
	},
	Champion: {
		type: enumNames.CHAMPION,
		price: 10,
		movement:
		[
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
		 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
		],
		booster: movementWithSecondTurn
	},
	Jester: {
		type: enumNames.JESTER,
		price: 5,
		movement:
		[
			{dx:2, dy:1}, {dx:2, dy:-1}, // +2 orizzontale
			{dx:-2, dy:1}, {dx:-2, dy:-1},
			{dx:1, dy:2}, {dx:1, dy:-2}, // +2 verticale
			{dx:-1, dy:2}, {dx:-1, dy:-2},
		],
		booster: null
	},
	Valkirya: {
		type: enumNames.VALKIRYA,
		price: 3,
		movement:
		[
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		],
		booster: null
	},
	Minotaurus: {
		type: enumNames.MINOTAURUS,
		price: 5,
		movement:
		[
		 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
		 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
		],
		booster: movementWithSecondTurn
	},
	Bastards: {
		type: enumNames.BASTARDS,
		price: 1,
		movement:
		[
			{dx:0, dy:1}, {dx:0, dy:-1},//verticale
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1}
		],
		booster: movementWithSecondTurn		
	},
	Mage: {
		type: enumNames.MAGE,
		price: 3, // da capire
		movement: [], // da capire
		booster: null
	},
	Ghoul: {
		type: enumNames.GHOUL,
		price: 3, // da capire
		movement: [], // da capire
		booster: null
	},
}

//ANCHOR - Methods

/**
 * 
 * @param {number} dx 
 * @param {number} dy
 * @param {boolean} clear
 */
function movePiece(dx, dy, clear)
{
	let newRow = cursor.getRow() + dy;
	let newCol = cursor.getCol() + dx;

	if (newRow < 0 || newRow >= lib.Macro.CHESSBOARD_H)
		return false;
	else if (newCol <= 0 || newCol > lib.Macro.CHESSBOARD_W)
		return false;

	if (clear == true)
	{
		let currentSquare = lib.Chess.board.get(cursor.square);
		let zones = currentSquare?.targetZones;

		if (zones != null)
		{
			for (let zone of zones)
			{
				lib.Chess.board.get(zone)?.dangerZones.delete(cursor.square);
			}
			zones.clear();
		}
	}
	cursor.setCursor(newRow, newCol);
	return true;
}

function movementWithSecondTurn(/* res */)
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = lib.Chess.board.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArrayDEBUG)
	{
		while (movePiece(dx, dy, false))
		{
			lib.Chess.board.get(cursor.square)?.dangerZones.add(startPos);
			lib.Chess.board.get(startPos)?.targetZones.add(cursor.square);
			if (piece.moveLongRangeDEBUG == false || lib.Chess.board.get(cursor.square)?.piece != null)
				break ;
		}
		cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

function movementJester()
{

}

module.exports = {Piece, enumNames, enumValues, preset};