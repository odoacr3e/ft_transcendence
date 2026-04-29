// @ts-check
const {board} =  require("./chessBoard.js");
const {eTeam} =  require("./chessBoard.js");
const {cursor} = require("./cursor.js");
const {isDangerous, movePiece, DangerUpdate} = require("./utils.js");
const Macro = require("./macro.js");

//ANCHOR - Methods

let movementWithSecondTurn = function ( /* res */)
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = board.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(dx, dy, false))
		{
			board.get(cursor.square)?.dangerZones.add(startPos);
			board.get(startPos)?.targetZones.add(cursor.square);
			if (piece.moveLongRangeDEBUG == false || board.get(cursor.square)?.piece != null)
				break ;
		}
		cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

/**
 * @param {string} pos
 */
function berserkMode(pos)
{
	let startPos;
	let piece;

	startPos = cursor.square;
	piece = board.get(pos)?.piece;
	if (piece?.moveArray == null)
		throw ("entering in function berserkMode with a null piece :-(") ;//FIXME - errore grave, dare 500
	for (let {dx, dy} of piece?.moveArray)
	{
		while (movePiece(dx, dy, false))
		{
			if (board.get(pos)?.piece?.type == enumNames.CHAMPION)
			{
				board.get(cursor.square)?.dangerZones.add(pos);
				board.get(pos)?.boostedTargetZones.get(startPos)?.add(pos);
			}
			if (board.get(cursor.square)?.piece != null)
			{
				board.get(cursor.square)?.dangerZones.add(pos);
				board.get(pos)?.boostedTargetZones.get(startPos)?.add(pos);
				break ;
			}
		}
		cursor.square = startPos;
	}
}

let movementChampion = function ( /* res */)
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = board.get(cursor.square)?.piece;
	if (piece == undefined)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(dx, dy, false))
		{
			board.get(cursor.square)?.dangerZones.add(startPos);
			board.get(startPos)?.targetZones.add(cursor.square);
			if (!isDangerous(board.get(cursor.square)?.dangerZones, piece.team) && 
			(board.get(cursor.square)?.piece == null || 
			board.get(cursor.square)?.piece?.team != piece.team))
				berserkMode(startPos);
			if (board.get(cursor.square)?.piece != null)
				break ;
		}
		cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

let movementMinotaurus = function ( /* res */)
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = board.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(dx, dy, false))
		{
			board.get(cursor.square)?.dangerZones.add(startPos);
			board.get(startPos)?.targetZones.add(cursor.square);
			if (board.get(cursor.square)?.piece != null)
			{
				berserkMode(startPos);
				break ;
			}
		}
		cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

let movementJester = function ()
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = board.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		let row = cursor.getRow();
		let col = cursor.getCol();
		row = row + dx;
		col = col + dy;
		row = row % 8;
		col = col % 8;
		if (row < 0) row += 8;
		if (col < 0) col += 8;
		if (col == 0) col = 8;
		cursor.setCursor(row, col);
		board.get(cursor.square)?.dangerZones.add(startPos);
		board.get(startPos)?.targetZones.add(cursor.square);
		cursor.square = startPos;
	}
	return (1);
}

let movementValkirya = function ()
{
	let	startPos;
	let	piece;

	startPos = cursor.square;
	piece = board.get(cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		let maxTarget = 2; 
		while (movePiece(dx, dy, false))
		{
			if (maxTarget != 1)
			{
				board.get(cursor.square)?.dangerZones.add(startPos);
				board.get(startPos)?.targetZones.add(cursor.square);
			}
			if (board.get(cursor.square)?.piece != null)
				maxTarget--;
			if (maxTarget == 0)
			{
				board.get(cursor.square)?.dangerZones.add(startPos);
				board.get(startPos)?.targetZones.add(cursor.square);
				break ;
			}
		}
		cursor.square = startPos;
	}
	return (1);
}

//SECTION - Pezzo class
//ANCHOR - Definition 

class Piece
{
	/**
	 * @param {{type: string, price: number, movement: Array<{dx: number, dy:number}>, booster: Function}} obj
	 * @param {string} team
	 * @param {string} pos
	 * @param {boolean} long
	 */
	constructor ({type, price, movement, booster}, team, pos, long)
	{
		/** @type {string} */   						this.type = type;
		/** @type {number} */   						this.price = price;
		/** @type {string} */   						this.team = eTeam.Black;
		/** @type {boolean} */  						this.isMovedBool = false;
		/** @type {boolean} */  						this.isBoostedBool = false;
		/** @type {string} */ 							this.pos = pos;
		/** @type {Function} */ 						this.moveFunction = booster;
		/** @type {Array<{dx: number, dy:number}>} */	this.moveArray = movement;
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
	KING: 'King',
	CHAMPION: 'Champion',
	MINOTAURUS: 'Minotaurus',
	JESTER: 'Jester',
	VALKIRYA: 'Valkirya',
	BASTARDS: 'Bastards',
	MAGE: 'Mage',
	GHOUL: 'Ghoul'
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
		booster: DangerUpdate
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
		booster: movementChampion
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
		booster: movementJester
	},
	Valkirya: {
		type: enumNames.VALKIRYA,
		price: 3,
		movement:
		[
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		],
		booster: movementValkirya
	},
	Minotaurus: {
		type: enumNames.MINOTAURUS,
		price: 5,
		movement:
		[
		 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
		 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
		],
		booster: movementMinotaurus
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



module.exports = {Piece, enumNames, enumValues, preset};