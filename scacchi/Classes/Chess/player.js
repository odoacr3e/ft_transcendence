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
		/** @type {dbUser} *///@ts-ignore
		this.dbTable = null;
		this.matchId = "0";
		this.id = 0;
		/** @type {number | undefined} */
		this.tournament_index = undefined;
		/** @type {number | null} */
		this.expectedElo = null;
		//SECTION - gameData
		this.nPoints = settings.players.startPoints;
		this.bonusPointCounter = 0;
		this.useBoostBool = false;
		this.nPieces = 16;
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
		this.allie = data.allie;
		this.allieGuardianCoord = "";
	}
}

const preset = 
{
	white: 
	{
		team: eTeam.White,
		next: eTeam.Black,
		prev: eTeam.Black,
		allie: eTeam.White,
	},
	black: 
	{
		team: eTeam.Black,
		next: eTeam.White,
		prev: eTeam.White,
		allie: eTeam.Black,
	},
	red: 
	{
		team: eTeam.Red,
		next: eTeam.Green,
		prev: eTeam.Blue,
		allie: eTeam.Yellow,
	},
	blue: 
	{
		team: eTeam.Blue,
		next: eTeam.Red,
		prev: eTeam.Yellow,
		allie: eTeam.Green,
	},
	green: 
	{
		team: eTeam.Green,
		next: eTeam.Yellow,
		prev: eTeam.Red,
		allie: eTeam.Blue,
	},
	yellow: 
	{
		team: eTeam.Yellow,
		next: eTeam.Blue,
		prev: eTeam.Green,
		allie: eTeam.Red,
	},
}

export {Player};