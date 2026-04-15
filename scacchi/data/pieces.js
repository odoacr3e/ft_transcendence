// @ts-check
// const {include} = require("./lib.js");
// const {Chess} = require("./lib.js");
// const {Macro} = require("./lib.js");
//const {Enum} = require("./lib.js");

const { eTeam } = require("./chessBoard");

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

// class Piece
// {
// 	constructor ()
// 	{
// 		/** @type {string} */   this.type;
// 		/** @type {number} */   this.price;
// 		/** @type {string} */   this.team;
// 		/** @type {boolean} */  this.isMovedBool = false;
// 		/** @type {boolean} */  this.isBoostedBool = false;
// 		/** @type {string} */ 	this.pos;
// 		/** @type {Function} */ this.moveFunction;
// 		/** @type {Array<{dx: number, dy:number}>} */	this.moveArrayDEBUG;
// 		/** @type {boolean} */	this.moveLongRangeDEBUG = false;
// 	}
// }

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

// creazione oggetto con preset
// const re = new Pezzo(preset.Re);
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
		]
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
		]
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
		]
	},
	Valkirya: {
		type: enumNames.VALKIRYA,
		price: 3,
		movement:
		[
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1},
		]
	},
	Minotaurus: {
		type: enumNames.MINOTAURUS,
		price: 5,
		movement:
		[
		 	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
		 	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
		]
	},
	Bastards: {
		type: enumNames.BASTARDS,
		price: 1,
		movement:
		[
			{dx:0, dy:1}, {dx:0, dy:-1},//verticale
			{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
			{dx:-1, dy:1}, {dx:1, dy:-1}
		]		
	},
	Mage: {
		type: enumNames.MAGE,
		price: 3, // da capire
		movement: [] // da capire
	},
	Ghoul: {
		type: enumNames.GHOUL,
		price: 3, // da capire
		movement: [] // da capire
	},
}

//ANCHOR - Methods


module.exports = {Piece, enumNames, enumValues, preset};