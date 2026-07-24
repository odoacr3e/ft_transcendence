// @ts-check

import { Result } from "../Classes/endPoint/result.js";
import { globals } from "../Classes/Globals/globals.js";
import { Match, Timer } from "../Classes/Chess/match.js";

/**
 * 
 * @param {Match} match 
 */
export function setTimerGame(match)
{
	let timeout;
	let start;
	let time;

	time = match.currentPlayer.time;
	/** @param {string} matchId */
	timeout = setTimeout((matchId) =>
	{
		let result;
		let match = globals.matches.get(matchId);
		if (!match)
		{
			console.warn(`Warning: timer of game ${matchId}: already finish`);
			return ;
		}
		result = new Result();
		result = match.PlayerLost(result, match?.currentPlayer.team);
		return (result);
	}, time, match.id);
	start = Date.now();
	match.timer = new Timer(time, start, timeout);
	match.history.Last().time = time;
}
