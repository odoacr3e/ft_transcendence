// @ts-check

import { Match } from "../../Classes/Chess/match.js";
import { Tournament } from "../../Classes/Chess/tournament.js";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Room } from "../../Classes/Globals/room.js";
import { init } from "../../handlers/game/init.js";
import { query } from "../../lib/query.js";
import { bindPlayersToMatch } from "./MatchMaking.js";
const { tournamentsQuery } = query;

/**
 * 
 * @param {Room} room 
 */
export async function initTournament(room)
{
	let tournament;
	let i = 0;

	try
	{
		tournament = new Tournament(room.name, room.matchType, room.maxPlayers);
		tournament.id = (await tournamentsQuery.createTournament(room.name, room.ownerId)).id_tournament;
		await tournamentsQuery.addPlayersToTournament(tournament.id, Array.from(room.players));
		tournament.startUserIds = new Set(room.players);
		tournament.userIds[tournament.round] = new Array();
		tournament.userIds[tournament.round] = Array.from(room.players);
		console.log("THE 84 TENKAICHI TOURNAMENT WILL START!!!");
		console.log(tournament.userIds);
		tournament.RNGplayer();
		console.log(tournament.userIds);
		while (tournament.userIds[tournament.round].length != i)
		{
			
			i += 2;
		}
	}
	catch(error)
	{
		//FIXME - mandare 500 server error via websockets
		console.log("ERROR: cannot init tournament");
	}
}

/*
	1-	admin: voglio fare torneo
	2-	e possibile creare il torneo
	3-	prendiamo id torneo da db
	4-	settiamo nella map tornei id torneo =>	oggetto
	5-	avvisiamo e diamo dati del pairing iniziale
	6-	socketData: salvare =>	{id_torneo, me: ...}
	7-	aspettare entrambi pronti
	8-	appena entrambi pronti: match
	9-	quando finisce match, aggiornare torneo
*/

/**
 * @param {string} matchType 
 * @param {Set<number>} players 
 */
async function createMatchFromRoom(matchType, players)
{
	let	match;
	let	result;
	let	preset;

	preset = matchType;
	match = new Match(preset);
	result = init(match, preset);
	match.settings.room.isRanked = false;
	globals.lastMatchId = match.CreateId(players);
	globals.matches.set(globals.lastMatchId, match);
	//@ts-ignore
	result.id = match.id;
	await bindPlayersToMatch(match, players, result);
	// render(match);
	console.log("CREAZIONE MATCH: ♟️");
	return (true);
}
