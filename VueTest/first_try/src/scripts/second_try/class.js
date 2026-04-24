class Square
{
	constructor()
	{
        /** @type {string | undefined} */			this.color = undefined;
        /** @type {string | "white" | "black"} */   this.piece = null;
		/** @type {Set<string>} */					this.targetZones = new Set();
		/** @type {Set<string>} */					this.dangerZones = new Set();
	}
}

class Piece
{
	/**
	 * @param {{type: string, price: number, movement: Array<{dx: number, dy:number}>}} obj
	 * @param {string} team
	 * @param {string} pos
	 * @param {boolean} long
	 */
	constructor ({type, price, movement}, team, pos, long)
	{
		/** @type {string} */   						this.type = type;
		/** @type {number} */   						this.price = price;
		/** @type {string} */   						this.team = TEAM.BLACK;
		/** @type {boolean} */  						this.isMovedBool = false;
		/** @type {boolean} */  						this.isBoostedBool = false;
		/** @type {string} */ 							this.pos = pos;
		/** @type {Function} */ 						this.moveFunction;
		/** @type {Array<{dx: number, dy:number}>} */	this.moveArray = movement;
		/** @type {boolean} */							this.moveLongRange = long;
	}
}