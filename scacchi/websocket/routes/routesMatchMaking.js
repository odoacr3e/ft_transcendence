//@ts-check

import { matchMakingOpt } from "../../Classes/endPoint/matchInit.js";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { AIprofilesArray, eMatchPresets, enumConnection, enumInitNames, enumSocketState, eChildEvents, AIprofiles } from "../../Macro/enums.js";
import { isOneOf } from "../../utils/string.js";
import { MatchMaking } from "../handlers/MatchMaking.js";
import { isBusy } from "../utils.js";
import { init } from "../../handlers/game/init.js";
import { Match, MatchSettings } from "../../Classes/Chess/match.js";
import { openMatch } from "../../query/gameQuery.js";

/** 
 * @param {import("socket.io").Socket} socket
 * @param {import("../../Classes/Chess/player").dbUser} user
 * */
export function routesMatchMaking(socket, user)
{
	let	socketData;

	// TODO - da aggiungere team nel caso
	socket.on('create_ai_match', async(/** @type {{profile: string, team: string | null}} */req, callback) => 
	{
		let result = new Result().Success();
		let resArray = new Array();
		let	matchId;
		let setting;
		let ChildId;
		let child;

		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			result = result.Error("Player data are lost", 500);
		else if (!req || !req.profile)
		{
			for (let i = 0; i < AIprofilesArray.length; ++i)
			{
				switch (AIprofilesArray[i]) {
					case AIprofiles.FIRST_AI:
						resArray.push(AIprofilesArray[i] + "_easy");
						break;
					case AIprofiles.GMU:
						resArray.push(AIprofilesArray[i] + "_hard");
						break;
					case AIprofiles.DEBUG:
						// resArray.push(AIprofilesArray[i] + "_medium");
						break;
					default:
						resArray.push(AIprofilesArray[i] + "_medium");
						break;
				}
			} // @ts-ignore
			result.aiProfiles = resArray;
		}
		else if (AIprofilesArray.indexOf(req.profile) == -1)
			result.Error("Profile does not exist", 404);
		else
		{
			setting = new MatchSettings(eMatchPresets.ClassicTwoPlayers);
			setting.SetAiProfile(req.profile, req.team);
			ChildId = globals.LessBusyChild();
			child = globals.childMap.get(ChildId);
			if (!child)
				throw (`create_ai_match: child not found`);
			matchId = await openMatch();
			child?.matchSet.add(matchId);
			//FIXME - fare in un listener
			// result.team = socketData.matchData.team;
			socketData.state = enumSocketState.PLAYING;
			socketData.aiMatchData = {ChildId: ChildId, matchId: matchId};
			child?.Send(eChildEvents.CreateMatch, setting, matchId);
		}
		socket.join(`match_${matchId}`);
		if (typeof(callback) == 'function')
			callback(result);
	});

	socket.on('find_match', async(/** @type {matchMakingOpt}*/options) => 
	{
		if (isBusy(user.id_user) == true)
		{
			socket.emit('error', new Result().Error("You are already doing something", 400));
			return ;
		}
		if (!options || !options.roomType || !options.matchType)
		{
			socket.emit('error', {log: {status: 403, msg: `bad options parameter: ${options}. expected: ${matchMakingOpt}`}});
			return ;
		}
		if (isOneOf(options.roomType, enumConnection.FRIENDLY, enumConnection.RANKED, enumConnection.ARENA))
			MatchMaking(user, options);
		else
			throw ("stanze non implementate");
	});

	socket.on('cancel_match', async() => 
	{
		globals.RemoveFromAllQueues(user.id_user);
	});
}
