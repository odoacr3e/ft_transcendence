// @ts-check
const {eTeam} =  require("./enums.js");
const {Match} = require("./match.js");
const {Cursor} = require("./cursor.js");
const {isDangerous, movePiece, DangerUpdate} = require("./utils.js");
const Macro = require("./macro.js");

//SECTION - Pezzo class
//ANCHOR - Definition 

class Piece
{
	/**
	 * @param {string} type
	 * @param {string} pos
	 * @param {string} team
	 */
	constructor (type, pos, team="")
	{
		let	preset;

		preset = new Preset(type);
		/** @type {string} */   						this.type = preset.type;
		/** @type {number} */   						this.price = preset.price;
		/** @type {string} */   						this.team = team;
		/** @type {boolean} */  						this.isMovedBool = false;
		/** @type {boolean} */  						this.isBoostedBool = false;
		/** @type {string} */ 							this.pos = pos;
		/** @type {Function} */ 						this.moveFunction = preset.booster;
		/** @type {Array<{dx: number, dy:number}>} */	this.moveArray = preset.movement;
		/** @type {boolean} */							this.moveLongRangeDEBUG = preset.longRange;
		/** @type {boolean} */							this.multipleMovesBool = preset.multipleMoves;
	}
}

//ANCHOR - Methods

/**
 * 
 * @param {Match} match
 */
let movementWithSecondTurn = function (match /* res */)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			match.board.get(match.cursor.square)?.dangerZones.add(startPos);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
			if (piece.moveLongRangeDEBUG == false || match.board.get(match.cursor.square)?.piece != null)
				break ;
		}
		match.cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

/**
 * @param {string} pos
 * @param {Match} match
 */
function berserkMode(pos, match)
{
	let startPos;
	let piece;

	startPos = match.cursor.square;
	piece = match.board.get(pos)?.piece;
	if (piece?.moveArray == null)
		throw ("entering in function berserkMode with a null piece :-(") ;//FIXME - errore grave, dare 500
	match.board.get(pos)?.boostedTargetZones.set(startPos, new Set());
	for (let {dx, dy} of piece?.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			if (piece.type == enumNames.CHAMPION)
			{
				match.board.get(match.cursor.square)?.dangerZones.add(pos);
				match.board.get(pos)?.boostedTargetZones.get(startPos)?.add(pos);
			}
			if (match.board.get(match.cursor.square)?.piece != null)
			{
				match.board.get(match.cursor.square)?.dangerZones.add(pos);
				match.board.get(pos)?.boostedTargetZones.get(startPos)?.add(pos);
				break ;
			}
		}
		match.cursor.square = startPos;
	}
	if (match.board.get(pos)?.boostedTargetZones.get(startPos)?.size == 0)
		match.board.get(pos)?.boostedTargetZones.delete(startPos);
}

/**
 * 
 * @param {Match} match
 */
let movementChampion = function (match /* res */)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == undefined)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			match.board.get(match.cursor.square)?.dangerZones.add(startPos);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
			if (!isDangerous(match, match.board.get(match.cursor.square)?.dangerZones, piece.team) && 
			(match.board.get(match.cursor.square)?.piece == null || 
			match.board.get(match.cursor.square)?.piece?.team != piece.team))
				berserkMode(startPos, match);
			if (match.board.get(match.cursor.square)?.piece != null)
				break ;
		}
		match.cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

/**
 * 
 * @param {Match} match
 */
let movementMinotaurus = function (match /* res */)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		while (movePiece(match, dx, dy, false))
		{
			match.board.get(match.cursor.square)?.dangerZones.add(startPos);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
			if (match.board.get(match.cursor.square)?.piece != null)
			{
				berserkMode(startPos, match);
				break ;
			}
		}
		match.cursor.square = startPos;
	}
	/* 
		da aggiungere la parte in cui mettiamo SecondMove nell'header
	*/
	return (1);
}

/**
 * 
 * @param {Match} match
 */
let movementJester = function (match)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		let row = match.cursor.getRow();
		let col = match.cursor.getCol();
		row = row + dx;
		col = col + dy;
		if (row > 8 || row <= 0 || col > 8 || col <= 0)
		{
			row = row % 8;
			col = col % 8;
			if (row < 0) row += 8;
			if (col < 0) col += 8;
			if (col == 0) col = 8;
			match.cursor.setCursor(row, col);
			match.board.get(startPos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
		}
		else
		{
			match.cursor.setCursor(row, col);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
		}
		match.board.get(match.cursor.square)?.dangerZones.add(startPos);
		match.cursor.square = startPos;
	}
	return (1);
}

/**
 * 
 * @param {Match} match
 */
let movementValkirya = function (match)
{
	let	startPos;
	let	piece;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		let maxTarget = 2; 
		while (movePiece(match, dx, dy, false))
		{
			if (maxTarget != 1)
			{
				match.board.get(match.cursor.square)?.dangerZones.add(startPos);
				match.board.get(startPos)?.targetZones.add(match.cursor.square);
				if (match.board.get(match.cursor.square)?.piece)
					match.board.get(startPos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
			}
			if (match.board.get(match.cursor.square)?.piece != null)
				maxTarget--;
			if (maxTarget == 0)
			{
				match.board.get(match.cursor.square)?.dangerZones.add(startPos);
				match.board.get(startPos)?.boostedTargetZones.get(startPos)?.add(match.cursor.square);
				break ;
			}
		}
		match.cursor.square = startPos;
	}
	return (1);
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
		price: enumValues.KING,
		multipleMoves: false,
		longRange: false,
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
		price: enumValues.CHAMPION,
		multipleMoves: true,
		longRange: true,
		movement:
		[
			{dx:1, dy:1}, {dx:-1, dy:-1}, //obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		 	{dx:0, dy:1}, {dx:0, dy:-1}, //orizzontale
		 	{dx:1, dy:0}, {dx:-1, dy:0}, //verticale
		],
		booster: movementChampion
	},
	Jester: {
		type: enumNames.JESTER,
		price: enumValues.JESTER,
		multipleMoves: false,
		longRange: false,
		movement:
		[
			{dx:2, dy:1}, {dx:2, dy:-1}, // +2 verticale
			{dx:-2, dy:1}, {dx:-2, dy:-1},
			{dx:1, dy:2}, {dx:1, dy:-2}, // +2 orizzontale
			{dx:-1, dy:2}, {dx:-1, dy:-2},
		],
		booster: movementJester
	},
	Valkirya: {
		type: enumNames.VALKIRYA,
		price: enumValues.VALKIRYA,
		multipleMoves: false,
		longRange: true,
		movement:
		[
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		],
		booster: movementValkirya
	},
	Minotaurus: {
		type: enumNames.MINOTAURUS,
		price: enumValues.MINOTAURUS,
		multipleMoves: true,
		longRange: true,
		movement:
		[
		 	{dx:0, dy:1}, {dx:0, dy:-1},//orizzontale
		 	{dx:1, dy:0}, {dx:-1, dy:0},//verticale
		],
		booster: movementMinotaurus
	},
	Bastards: {
		type: enumNames.BASTARDS,
		price: enumValues.BASTARDS,
		multipleMoves: false,
		longRange: false,
		movement:
		[
			{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
			{dx:0, dy:1}, {dx:0, dy:-1},//verticale
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1}
		],
		booster: movementWithSecondTurn	
	},
	Mage: {
		type: enumNames.MAGE,
		price: 3, // da capire
		multipleMoves: false,
		longRange: false,
		movement: [], // da capire
		booster: null
	},
	Ghoul: {
		type: enumNames.GHOUL,
		price: 3, // da capire
		multipleMoves: false,
		longRange: false,
		movement: [], // da capire
		booster: null
	},
}

class Preset
{
	/**
	 * 
	 * @param {string} type 
	 */
	constructor(type)
	{
		let	info;

		// @ts-ignore
		info = preset[type];
		if (!info)
			throw (`Preset: Invalid piece type ${type}`);
		/** @type {string} */							this.type = info.type;
		/** @type {number} */							this.price = info.price;
		/** @type {Array<{dx: number, dy:number}>} */	this.movement = info.movement;
		/** @type {function} */							this.booster = info.booster;
		/** @type {boolean} */							this.multipleMoves = info.multipleMoves;
		/** @type {boolean} */							this.longRange = info.longRange;
	}
}

module.exports = {Piece, enumNames, enumValues};