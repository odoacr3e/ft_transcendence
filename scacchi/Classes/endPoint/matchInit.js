//@ts-check

/** @typedef {import("../Chess/match.js").MatchSettings} MatchSettings*/

export class matchMakingOpt
{
	/**
	 * //FIXME - controllare parametri di cosa ci viene dato
	 * @param {matchMakingOpt} options 
	 */
	constructor(options)
	{
		/** @type {string} */ 				this.matchType = "1v1";
		/** @type {string} */ 				this.roomType = "friendly";
		/** @type {MatchSettings | null} */	this.matchSettings = null;
		if (!options)
			return ;
		this.matchType = options.matchType;
		this.roomType = options.roomType;
		this.matchSettings = options.matchSettings;
	}
}

	/*
		joinBool: boolean
		matchSettings-->
		{
			type <string> 1v1 | 2v2 | 1v1v1v1
			matchType <string> "private" | "friendly" | "ranked" | "arena"
		}
		matchSettings?: null | MatchSettings
		this.presetType = null;
		@type {string | null}
		timer <number> 30 | 20 | 10
		this.board =
		{
			width: CHESSBOARD_W,
			heigth: CHESSBOARD_H,
			seed: 0,
			start: "",
			corners: false
		}
		this.players =
		{
			number: 2,
			startPoints: 0,
			teams:
			{
				white: "",
				black: "",
				yellow: "",
				red: "",
				blue: "",
				green: ""
			}
		}
	*/