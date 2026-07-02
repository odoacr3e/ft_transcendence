//@ts-check

import {MATCHTIMER} from "../../Macro/macro.js";
import {eTeam, eEvents} from "../../Macro/enums.js";

/** @typedef {import("./match.js").MatchSettings} MatchSettings*/
/**
 *  @typedef {{
 * id_user: number; name: string; surname: string; username: string; email: string; nationality: string; image: Uint8Array<ArrayBuffer> | null; points: number; title: string; preferences: *}
 * } dbUser
 * 
*/

class Player
{
	/** 
	 * 
	 * @param {string} color 
	 * @param {MatchSettings} settings 
	*/
	constructor(color, settings)
	{
		//SECTION - preset data
		//@ts-ignore
		let	data = preset[color];
		if (!data)
			throw (`cannot find player ${color}`);
		//SECTION - user data
		/** @type {dbUser | null} */
		this.dbTable = null;
		/** @type {* | null} */
		this.socket = null;
		this.matchId = "0";
		this.id = "0";
		//SECTION - gameData
		this.nPoints = settings.players.startPoints;
		this.bonusPointCounter = 0;
		this.useBoostBool = false;
		this.nPieces = 0;
		this.King = "";
		this.boostedPiece = "";
		/** @type {Set<{coord: string, target: string}>} */
		this.guardianPieces = new Set;
		/** @type {Set<string>} */
		this.castlingArray = new Set();
		this.time = MATCHTIMER;
		this.team = data.team;
		this.next = data.next;
		this.prev = data.prev;
	}
}

const preset = 
{
	white: 
	{
		team: eTeam.White,
		next: eTeam.Black,
		prev: eTeam.Black,
	},
	black: 
	{
		team: eTeam.Black,
		next: eTeam.White,
		prev: eTeam.White,
	},
	red: 
	{
		team: eTeam.Red,
		next: eTeam.Green,
		prev: eTeam.Blue,
	},
	blue: 
	{
		team: eTeam.Blue,
		next: eTeam.Red,
		prev: eTeam.Yellow,
	},
	green: 
	{
		team: eTeam.Green,
		next: eTeam.Yellow,
		prev: eTeam.Red,
	},
	yellow: 
	{
		team: eTeam.Yellow,
		next: eTeam.Blue,
		prev: eTeam.Green,
	},
}

export {Player};