
//SECTION macro

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
	}
}

// utilizzare la mappa per metterci i costruttori, Pazzo e' un template adesso

/**
 * @enum {string}
 */
const values = new Map([
	['king' , 0],
	['champion', 10],
	['minotaurus', 5],
	['jester', 5],
	['valkirya', 3],
	['bastards', 1]
]);

//ANCHOR - Methods


module.exports = {Piece};