//@ts-check

import {MATCHTIMER} from "../../Macro/macro.js";
import {eTeam, eEvents} from "../../Macro/enums.js";

class Player
{
	/** @param {string} color */
	constructor(color)
	{
		//@ts-ignore
		let	data = preset[color];
		if (!data)
			throw (`cannot find player ${color}`);
		this.name = "";
		this.nPoints = 42;
		this.bonusPointCounter = 0;
		this.useBoostBool = false;
		this.nPieces = 0;
		this.King = "";
		this.boostedPiece = "";
		/** @type {Set<string>} */
		this.castlingArray = new Set();
		this.time = MATCHTIMER;
		this.team = data.team;
		this.next = data.next;
	}
}

const preset = 
{
	white: 
	{
		team: eTeam.White,
		next: eTeam.Black
	},
	black: 
	{
		team: eTeam.Black,
		next: eTeam.White,
	},
	red: 
	{
		team: eTeam.Red,
		next: eTeam.Green,
	},
	blue: 
	{
		team: eTeam.Blue,
		next: eTeam.Red,
	},
	green: 
	{
		team: eTeam.Green,
		next: eTeam.Yellow,
	},
	yellow: 
	{
		team: eTeam.Yellow,
		next: eTeam.Blue,
	},
}

export {Player};