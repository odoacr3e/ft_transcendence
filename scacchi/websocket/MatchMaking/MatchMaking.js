//@ts-check
import { globals } from "../../Classes/Globals/globals.js";
import { Queue } from "../../Classes/Globals/Queue.js";
import { enumConnection } from "../../Macro/enums.js";
import { Match } from "../../Classes/Chess/match.js";
import { init } from "../../handlers/game/init.js";
import { render } from "../../test/render.js";

/** @typedef {import("../../Classes/Chess/player.js").Player} Player*/
/** @typedef {{socket: *, allowedBool: boolean, matchData?: Player}} Socket */
/** @typedef {import("../../Classes/endPoint/matchInit.js").matchMakingOpt} MatchMakingOpt*/
/** @typedef {{id_user: string, points: number}} dbUser*/
/** @typedef {import("../../Classes/Globals/Queue.js").QueueNode} QueueNode*/

/**
 * 
 * @param {*} sockio 
 * @param {dbUser} user
 * @param {Map<string, Socket>} clientMap 
 * @param {MatchMakingOpt} options
 */
export function MatchMaking(sockio, user, clientMap, options)
{
	let queue;
	let	socketData;

	console.log(user);
	socketData = clientMap.get(user.id_user);
	if (!socketData)
		throw (`user id ${user.id_user} does not exist`);
	queue = globals.GetQueue(options.roomType);
	queue.AddNode(user, options);
	if (findMatch(queue, user) == true)
		return ;
	console.log(`user in queue ${options.roomType}:`);
	console.log(queue);
}

/**
 * 
 * @param {Queue} queue 
 * @param {dbUser} user 
 * @returns 
 */
export function findMatch(queue, user)
{
	let findBool = false;
	let	queueNode;

	queueNode = queue.get(user.id_user);
	if (!queueNode)
		throw (`findMatch: node for user ${user.id_user} undefined`);
	if (queue.get(user.id_user)?.IsFull())
		return createMatch(queueNode);
	else
		findBool = queue.Find(user);
	if (findBool && queue.get(user.id_user)?.IsFull())
		return createMatch(queueNode);
	// else if (!findBool)
	// 	aumentaRangeElo();//TODO - 
	globals.timers.set(user.id_user, setTimeout(() => {
		globals.timers.delete(user.id_user);
		findMatch(queue, user);
	}, 5000));
	return (true);
}

/**
 * 
 * @param {QueueNode} queueNode
 */
export function createMatch(queueNode)
{
	let	match;
	let	result;
	let	socket;
	let	preset;

	preset = queueNode.matchOptions? queueNode.matchOptions: queueNode.matchType;
	match = new Match(preset);
	result = init(match, preset);
	globals.lastMatchId = match.CreateId(queueNode);
	globals.matches.set(globals.lastMatchId, match);
	render(match);
	console.log("CREAZIONE MATCH: ♟️");
	console.log(queueNode);
	for (const id_user of queueNode.userSet)
	{
		socket = globals.clientMap.get(id_user);
		if (!socket)
			throw (`createMatch: disconnection for ${id_user}`);
		socket.socket.emit("datiInizialiPOISIVEDECHENOMEDAREEH", result);
	}
	return (true);
}
