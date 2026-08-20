//@ts-check

import { matchMakingOpt } from "../../Classes/endPoint/matchInit.js";
import { Result } from "../../Classes/endPoint/result.js";
import { globals } from "../../Classes/Globals/globals.js";
import { enumConnection, enumSocketState } from "../../Macro/enums.js";
import { isOneOf } from "../../utils/string.js";
import { MatchMaking } from "../handlers/MatchMaking.js";
import { isBusy } from "../utils.js";

/** 
 * @param {import("socket.io").Socket} socket
 * @param {import("../../Classes/Chess/player").dbUser} user
 * */
export function routesMatchMaking(socket, user)
{
	let	socketData;

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
