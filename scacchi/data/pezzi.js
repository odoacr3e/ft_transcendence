
//SECTION - Position class 
//ANCHOR - Definition 

class Position
{
	/** 
	 * @brief aggiunti row e col come parametri al costruttore
	*/
	constructor(row, col)
	{
		/** @type {number} */	this.row = row;
		/** @type {number} */	this.col = col;
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

/**
 * @enum {string}
 */
const eTipo =
{
	Re: `Re`,
	Campione: `Campione`,
	Giullare: `Giullare`,
	Valchiria: `Valchiria`,
	Minotauro: `Minotauro`,
	Bastardo: `Bastardo`,
	Mago: `Mago`,
	Ghoul: `Goul`
}

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
		/** @type {Position} */ this.pos = new Position(0, 0);
		/** @type {Function} */ this.moveFunction = () => {};
	}
}

/*
	pezzo

*/

//SECTION - Cursor class
//ANCHOR - Definition 

class cursor
{
	constructor(position)
	{
		
	}
}

//ANCHOR - Methods
