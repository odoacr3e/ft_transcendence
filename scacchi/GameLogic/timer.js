// @ts-check

import { Result } from "../Classes/endPoint/result.js";
import { globals } from "../Classes/Globals/globals.js";
import { Match, Timer } from "../Classes/Chess/match.js";
import { roomMessage } from "../websocket/utils.js";
import { saveMatch } from "../utils/saveMatch.js";

/**
 * 
 * @param {Match} match 
 */
export function setTimerGame(match)
{
	let timeout;
	let start;
	let time;

	if (match.aiSimulation == true)
		return ;
	time = match.currentPlayer.time;
	/** @param {string} matchId */
	timeout = setTimeout((matchId) =>
	{
		let p;
		let result;
		let match = globals.matches.get(matchId);
		let	hasSockets;

		p = match?.currentPlayer;
		if (!match)
		{
			console.warn(`Warning: timer of game ${matchId}: already finish`);
			return ;
		}
		hasSockets = match.currentPlayer.dbTable != null;
		result = new Result();
		match.endTurn();
		result = match.PlayerLost(result, p);
		if (hasSockets)
			roomMessage(`match_${match.id}`, "game", result);
		if (match.playerNum == 1)
		{
			result = match.CheckMate();
			if (hasSockets)
				roomMessage(`match_${match.id}`, "game", result);
			if (match.victory != "" && match.id != "0")
				saveMatch(match);
		}
		else
		{
			setTimerGame(match);
		}
		return (result);
	}, time, match.id);
	start = Date.now();
	match.timer = new Timer(time, start, timeout);
	match.history.Last().time = time;
}
