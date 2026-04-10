// @ts-check
const {include} = require("./lib.js");
const {Chess} = require("./lib.js");
const {Macro} = require("./lib.js");
//const {Enum} = require("./lib.js");

/** @typedef {pieces.Piece} Piece */

//SECTION import

const macro = require("./macro.js");
const pieces = require("./pieces.js");

//ANCHOR - Definition 

class Square
{
	constructor()
	{
        /** @type {string} */  			this.color = eTeam.Black;
        /** @type {Piece | null} */   	this.piece = null;
		/** @type {Array<string>} */	this.targetZones = [];
		/** @type {Array<string>} */	this.dangerZones = [];
	}
    //tutti i dati
}



/**
 * @enum {string}
 */
const eTeam = 
{
	Black: 'Black',
	White: 'White'
};

//ANCHOR - Methods

//SECTION - chessBoard Map 
//ANCHOR - Definition 

/** @type {Map<string, Square>} */ const Board = new Map();
board.constructor = () => 
{

}  

module.exports = {Board, eTeam, Square};