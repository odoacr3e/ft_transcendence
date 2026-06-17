// @ts-check
import {Preset} from "./preset.js";

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
		/** @type {Map<string, Array<Set<string>>>} */	this.boostedInfluence = new Map();
	}
	Copy()
	{
		let	other;

		other = new Piece(this.type, this.pos, this.team);
		other.isBoostedBool = this.isBoostedBool;
		other.isMovedBool = this.isMovedBool;
		other.boostedInfluence = this.boostedInfluence;
		return (other);
	}
}

/**
 * 
 * @param {Piece} other
 */
function copyPiece(other)
{
	let	preset;
	let	piece;
	let	moveArray;

	preset = new Preset(other.type);
	piece = new Piece(other.type, other.pos, other.team);
	if (!piece)
		throw ("Piece, copy: something bad happen");
	piece.price = other.price;
	piece.isMovedBool = other.isMovedBool;
	piece.isBoostedBool = other.isBoostedBool;
	piece.moveFunction = other.moveFunction;
	moveArray = [];
	if (other.moveArray)
	{
		for (const move of other.moveArray)
		{
			moveArray.push({dx: move.dx, dy: move.dy});
		}
	}
	else
	{
		throw ("copyPiece error: " + piece.pos + "NO");
	}
	piece.moveArray = moveArray;
	piece.moveLongRangeDEBUG = other.moveLongRangeDEBUG;
	piece.multipleMovesBool = other.multipleMovesBool;
	return (piece);
}

export {Piece, copyPiece};