// @ts-check

import { Match } from "../../Classes/Chess/match.js";
import { Tournament } from "../../Classes/Chess/tournament.js";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { Room } from "../../Classes/Globals/room.js";
import { init } from "../../handlers/game/init.js";
import { query } from "../../lib/query.js";
import { eMatchPresets } from "../../Macro/enums.js";
import { bindPlayersToMatch } from "./MatchMaking.js";
const { tournamentsQuery } = query;

/**
 * 
 * @param {Room} room 
 */
export async function initTournament(room)
{
	let tournament;
	let	me;
	let	opponent;
	let i = 0;

	try
	{
		tournament = new Tournament(room.name, room.matchType, room.maxPlayers);
		tournament.id = (await tournamentsQuery.createTournament(room.name, room.ownerId)).id_tournament;
		await tournamentsQuery.addPlayersToTournament(tournament.id, Array.from(room.players));
		globals.tournamentMap.set(tournament.id, tournament);
		tournament.startUserIds = new Set(room.players);
		tournament.userIds[tournament.round] = new Array();
		tournament.userIds[tournament.round] = Array.from(room.players);
		console.log("THE 84 TENKAICHI TOURNAMENT WILL START!!!");
		console.log(tournament.userIds);
		tournament.RNGplayer();
		console.log(tournament.userIds);
		while (tournament.userIds[tournament.round].length != i)
		{
			me = globals.clientMap.get(tournament.userIds[tournament.round][i]);
			opponent = globals.clientMap.get(tournament.userIds[tournament.round][i + 1]);
			if (!me)

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
	OK-	admin: voglio fare torneo
	OK-	e possibile creare il torneo
	OK-	prendiamo id torneo da db
	OK-	settiamo nella map tornei id torneo =>	oggetto
	5-	avvisiamo e diamo dati del pairing iniziale
	6-	socketData: salvare =>	{id_torneo, me: ...}
	OK-	aspettare entrambi pronti
	OK-	appena entrambi pronti: match
	9-	quando finisce match, aggiornare torneo
*/

/**
 * @param {Set<number>} players 
 * @param {{round: number, id: number}} tournament
 * @param {string} matchType 
 */
export async function createMatchTournament(players, tournament, matchType=eMatchPresets.ClassicTwoPlayers)
{
	let	match;
	let	result;
	let	preset;

	preset = matchType;
	match = new Match(preset);
	match.tournament = tournament;
	result = init(match, preset);
	match.settings.room.isRanked = false;
	globals.lastMatchId = match.CreateId(players);
	globals.matches.set(globals.lastMatchId, match);
	//@ts-ignore
	result.id = match.id;
	await bindPlayersToMatch(match, players, result);
	// render(match);
	console.log("CREAZIONE MATCH: ♟️");
	return (match);
}
