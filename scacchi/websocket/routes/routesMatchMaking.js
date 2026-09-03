//@ts-check

import { matchMakingOpt } from "../../Classes/endPoint/matchInit.js";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { AIprofilesArray, eMatchPresets, enumConnection, enumInitNames, enumSocketState, eChildEvents, AIprofiles } from "../../Macro/enums.js";
import { isOneOf } from "../../utils/string.js";
import { MatchMaking, matchMakingAI } from "../handlers/MatchMaking.js";
import { clientSetState, isBusy } from "../utils.js";
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
		let result = matchMakingAI(req, user);
		console.log(`risposta ai match: ${JSON.stringify(result, null, 2)}`);
		if (typeof(callback) == 'function')
			callback(result);
		if (typeof(req) == 'function')//@ts-ignore
			req(result);
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
		clientSetState(user.id_user);
	});
}
