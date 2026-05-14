// @ts-check
const {Preset} = require("./preset.js");

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

module.exports = {Piece};