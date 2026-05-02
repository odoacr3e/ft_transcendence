// @ts-check
// const {include} = require("./lib/lib.js");
// const {Chess} = require("./lib/lib.js");
// const {Macro} = require("./lib/lib.js");
//const {Enum} = require("./lib/lib.js");

//SECTION - Position class 

//SECTION - enum

//SECTION - Pezzo class
//ANCHOR - Definition 

class Piece
{
	constructor ()
	{
		/** @type {string} */   this.type;
		/** @type {number} */   this.price;
		/** @type {string} */   this.team;
		/** @type {boolean} */  this.isMovedBool = false;
		/** @type {boolean} */  this.isBoostedBool = false;
		/** @type {string} */ 	this.pos;
		/** @type {Function} */ this.moveFunction;
		/** @type {Array<{dx: number, dy:number}>} */	this.moveArray;
		/** @type {boolean} */	this.moveLongRangeDEBUG = false;
	}
}

// utilizzare la mappa per metterci i costruttori, Piece e' un template adesso

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
	BASTARDS: 'bastards'
};

//ANCHOR - Methods


module.exports = {Piece, enumNames, enumValues};