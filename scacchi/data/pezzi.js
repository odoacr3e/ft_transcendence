
//SECTION - Position class 
//ANCHOR - Definition 

class Position
{
	constructor()
	{
		/** @type {number} */	this.row = 0;
		/** @type {number} */	this.col = 0;
	}
}

//ANCHOR - Methods

//SECTION - enum

/**
 * @enum {string}
 */
const eTeam = 
{
	Black: `Black`,
	White: 'White'
};

//SECTION - Pezzo class
//ANCHOR - Definition 

class Pezzo
{
	constructor()
	{
		/** @type {string} */ this.tipo;
		/** @type {number} */ this.price;
		/** @type {eTeam} */	this.team = eTeam.Black;
		/** @type {boolean} */ this.isMovedBool;
		/** @type {boolean} */ this.isBoostedBool;
		/** @type {Position} */ this.pos = new Position();
		/** @type {Function} */ this.moveFunction = () => {};
	}
}

/*
	pezzo

*/

//ANCHOR - Methods
