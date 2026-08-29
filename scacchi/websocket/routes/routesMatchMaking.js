//@ts-check

import { matchMakingOpt } from "../../Classes/endPoint/matchInit.js";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { AIprofilesArray, eMatchPresets, enumConnection, enumInitNames, enumSocketState } from "../../Macro/enums.js";
import { isOneOf } from "../../utils/string.js";
import { MatchMaking } from "../handlers/MatchMaking.js";
import { isBusy } from "../utils.js";
import { init } from "../../handlers/game/init.js";
import { Match, MatchSettings } from "../../Classes/Chess/match.js";

/** 
 * @param {import("socket.io").Socket} socket
 * @param {import("../../Classes/Chess/player").dbUser} user
 * */
export function routesMatchMaking(socket, user)
{
	let	socketData;

	socket.on('create_ai_match', async(/** @type {{profile: string}} */req, callback) => 
	{
		let result = new Result();
		let	match;
		let setting;

		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			result = result.Error("Player data are lost", 500);
		else if (!req || !req.profile)// @ts-ignore
			result.aiProfiles = AIprofilesArray;
		else if (AIprofilesArray.indexOf(req.profile) == -1)
			result.Error("Profile does not exist", 404);
		else
		{
			setting = new MatchSettings(eMatchPresets.ClassicTwoPlayers);
			setting.SetAiProfile(req.profile);
			match = new Match();
			result = init(match, setting);
			socketData.matchData = match.currentPlayer.ai? match.NextPlayer() : match.currentPlayer;
			result.team = socketData.matchData.team;
			socketData.state = enumSocketState.PLAYING;
		}
		socket.emit('create_ai_match', result);
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
