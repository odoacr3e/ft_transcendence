//@ts-check

const {MATCHTIMER} = require("../../Macro/macro.js");
const {eTeam, eEvents} = require("../../Macro/enums.js");

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
		this.nPoints = 0;
		this.bonusPointCounter = 0;
		this.useBoostBool = false;
		this.nPieces = 0;
		this.King = "";
		this.boostedPiece = "";
		this.time = new Timer(MATCHTIMER);
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
		next: eTeam.Blue,
	},
	blue: 
	{
		team: eTeam.Blue,
		next: eTeam.Yellow,
	},
	green: 
	{
		team: eTeam.Green,
		next: eTeam.Red,
	},
	yellow: 
	{
		team: eTeam.Yellow,
		next: eTeam.Green,
	},
}

/**
 * timeout = puntatore alla funzione setTimeout
 * start = tempo in cui inizia il countdown
 * time = tempo limite del coutdown
 */
class Timer
{
	/** @param {number} time */
	constructor(time)
	{
		this.timeout = ()=>{};
		this.start = 0;
		this.time = time;
	}
}

module.exports = {Player, Timer};