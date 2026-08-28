// @ts-check

import { Match } from "../Classes/Chess/match.js";
import { openMatch, createUsersMatch } from "../query/gameQuery.js";
import { updateTournament } from "../websocket/handlers/tournament.js";
import { gameMessage } from "../websocket/utils.js";


/**
 * 
 * @param {Match} match 
 */
export async function saveMatch(match) 
{
	try 
	{
		if (match.victory == "draw")
			throw ("the match ended in a draw");
		gameMessage(match, "Salvataggio partita nel database...");
		await openMatch(match);
		await createUsersMatch(match);
		gameMessage(match, "Successo!");
	}
	catch (error)
	{
		gameMessage(match, "Error: " + error);
	}
	if (match.tournament)
		updateTournament(match, match.victory == "draw");
}