
//SECTION - Position class 
//ANCHOR - Definition 

const default_cost = 5;

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
const eType =
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


const preset = {
	Re: {
		type: eType.Re,
		price: 0,
		movement: "" /// da aggiungere funzione di movimento
	},
	Campione: {
		type: eType.Campione,
		price: 10,
		movement: ""
	},
	Giullare: {
		type: eType.Giullare,
		price: 5,
		movement: ""
	},
	Valchiria: {
		type: eType.Valchiria,
		price: 3,
		movement: ""
	},
	Minotauro: {
		type: eType.Minotauro,
		price: 5,
		movement: ""
	},
	Bastardo: {
		type: eType.Bastardo,
		price: 1,
		movement: ""
	},
	Mago: {
		type: eType.Mago,
		price: default_cost,
		movement: ""
	},
	Ghoul: {
		type: eType.Ghoul,
		price: default_cost,
		movement: ""
	},
}

//SECTION - Pezzo class
//ANCHOR - Definition 

export class Pezzo
{
	constructor({type, price, movement})
	{
		/** @type {string} */ this.type = type;
		/** @type {number} */ this.price = price;
		/** @type {eTeam} */	this.team = eTeam.Black;
		/** @type {boolean} */ this.isMovedBool;
		/** @type {boolean} */ this.isBoostedBool;
		/** @type {Position} */ this.pos = new Position(0, 0);
		/** @type {Function} */ this.moveFunction = movement;
	}
}
// creazione oggetto con preset
// const re = new Pezzo(preset.Re);

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
