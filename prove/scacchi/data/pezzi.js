
//SECTION - Position class 
//ANCHOR - Definition 

class Position
{
	constructor()
	{
		/** @type {number} */	this.row = 0;
		/** @type {string} */	this.col = 0;
	}
}

//ANCHOR - Methods

//SECTION - enum

/**
 * @enum {string}
 */
const eTeam = 
{
	Black: 'Black',
	White: 'White'
};

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

//SECTION - Pezzo class
//ANCHOR - Definition 

class Pezzo
{
	{
		/** @type {string} */   this.tipo;
		/** @type {number} */   this.price;
		/** @type {eTeam} */    this.team;
		/** @type {boolean} */  this.isMovedBool = false;
		/** @type {boolean} */  this.isBoostedBool = false;
		/** @type {Position} */ this.pos;
		/** @type {Function} */ this.moveFunction;
	}
}

// utilizzare la mappa per metterci i costruttori, Pazzo e' un template adesso

//ANCHOR - Methods
