// @ts-check

import { Match } from "../Classes/Chess/match.js";
import { createMatch, createUsersMatch } from "../query/gameQuery.js";
import { updateTournament } from "../websocket/handlers/tournament.js";


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
		console.log("Salvataggio partita nel database...");
		await createMatch(match);
		await createUsersMatch(match);
		console.log("Successo!");
	}
	catch (error)
	{
		console.log("Error: ", error);
	}
	if (match.tournament)
		updateTournament(match, match.victory == "draw");
}