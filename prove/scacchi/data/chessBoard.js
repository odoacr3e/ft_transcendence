// @ts-check

//SECTION import

const macro = require("./macro.js");

//ANCHOR - Definition 

class Position
{
	constructor()
	{
		/** @type {number} */	this.row = 0;
		/** @type {string} */	this.col = "";
	}
}

let map = new Map();

//ANCHOR - Methods

//SECTION - chessBoard class 
//ANCHOR - Definition 

class chessBoard
{
	/**
	 * 
	 * @param {number} sizeX 
	 * @param {number} sizeY 
	 */
	constructor(sizeX, sizeY)
	{
		this.pos = new Map();
		if (sizeY > macro.MAX_CHESSBOARD_SIZE)
			throw ("");
	}
}

