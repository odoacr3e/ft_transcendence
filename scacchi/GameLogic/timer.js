// @ts-check

import { Result } from "../Classes/endPoint/result.js";
import { globals } from "../Classes/Globals/globals.js";
import { Match, Timer } from "../Classes/Chess/match.js";
import { clientSetState, roomMessage } from "../websocket/utils.js";
import { saveMatch } from "../utils/saveMatch.js";
import { responseFormatter } from "../utils/response.js";
import { enumSocketState } from "../Macro/enums.js";

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

		p = match?.currentPlayer;
		if (!match)
		{
			console.warn(`Warning: timer of game ${matchId}: already finish`);
			return ;
		}
		result = new Result();
		match.endTurn();
		result = match.PlayerLost(result, p);//@ts-ignore
		clientSetState(p?.dbTable?.id_user, enumSocketState.NAVIGATING);
		result = responseFormatter(match, result, null, null);
		roomMessage(`match_${match.id}`, "game", result);
		if (match.playerNum == 1)
		{
			result = match.CheckMate();
			result = responseFormatter(match, result, null, null);
			roomMessage(`match_${match.id}`, "game", result);
			clientSetState(match.currentPlayer.dbTable?.id_user, enumSocketState.NAVIGATING);
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
