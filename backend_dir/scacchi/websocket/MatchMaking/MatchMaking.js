//@ts-check
import { globals } 							from "../../Classes/Globals/globals.js";
import { enumConnection, enumSocketState } 	from "../../Macro/enums.js";
import { Match } 							from "../../Classes/Chess/match.js";
import { init } 							from "../../handlers/game/init.js";
import { render } 							from "../../test/render.js";
import { query } 							from "../../lib/query.js";
import { responseFormatter }				from "../../utils/response.js";

const getUserById = query.usersQuery.getUserById;

/** @typedef {import("../../Classes/Chess/player.js").Player} Player*/
/** @typedef {import("../../Classes/endPoint/result.js").Result} Result*/
/** @typedef {import("../../Classes/Globals/socketInfo.js")} Socket */
/** @typedef {import("../../Classes/endPoint/matchInit.js").matchMakingOpt} MatchMakingOpt*/
/** @typedef {{id_user: string, points: number}} dbUser*/
/** @typedef {import("../../Classes/Globals/Queue.js").Queue} Queue*/
/** @typedef {import("../../Classes/Globals/Queue.js").QueueNode} QueueNode*/

/**
 * 
 * @param {dbUser} user
 * @param {MatchMakingOpt} options
 *///@ts-ignore
export async function MatchMaking(user, options={})
{
	let queue;
	let	queueNode;
	let	socketData;

	console.log(user);
	socketData = globals.clientMap.get(user.id_user);
	if (!socketData)
		throw (`user id ${user.id_user} does not exist`);
	socketData.reconnectBool = false;
	if (socketData.state == enumSocketState.MATCHMAKING)//NOTE - se il client era in fase di disconnessione
		queue = globals.FindQueue(user.id_user, options);
	else
		queue = globals.GetQueue(options.roomType);
	socketData.state = enumSocketState.MATCHMAKING;
	queueNode = queue.get(user.id_user);
	if (queueNode?.IsFull() == true)
		return createMatch(queue, queueNode);
	queue.AddNode(user, options);
	findMatch(queue, user);
	console.log(`user in queue ${options?.roomType}:`);
	console.log(queue);
}

/**
 * 
 * @param {Queue} queue 
 * @param {dbUser} user 
 * @returns 
 */
export async function findMatch(queue, user)
{
	let findBool = false;
	let	queueNode;

	queueNode = queue.get(user.id_user);
	if (!queueNode)
		throw (`findMatch: node for user ${user.id_user} undefined. ${console.trace()}`);
	if (queue.get(user.id_user)?.IsFull())
		return createMatch(queue, queueNode);
	else
		findBool = queue.Find(user);
	if (findBool && queue.get(user.id_user)?.IsFull())
		return createMatch(queue, queueNode);
	else if (!findBool)
		queueNode.increaseDelta(queueNode.eloRange.max + 15, queueNode.eloRange.min + 15);
	console.log("Adding timer for", user.id_user);
	globals.timers.set(user.id_user, setTimeout(() => {
		globals.timers.delete(user.id_user);
		findMatch(queue, user);
	}, 5000));
	return (true);
}

/**
 * @param {Queue} queue 
 * @param {QueueNode} queueNode
 */
export async function createMatch(queue, queueNode)
{
	let	match;
	let	result;
	let	preset;

	if (await validateMatch(queueNode) == false)
		return (false);
	preset = queueNode.matchOptions? queueNode.matchOptions: queueNode.matchType;
	match = new Match(preset);
	result = init(match, preset);
	if (queue.roomType == enumConnection.RANKED)
		match.settings.room.isRanked = true;
	globals.lastMatchId = match.CreateId(queueNode);
	globals.matches.set(globals.lastMatchId, match);
	//@ts-ignore
	result.id = match.id;
	await bindPlayersToMatch(match, queueNode, result);
	render(match);
	console.log("CREAZIONE MATCH: ♟️");
	console.log(queueNode);
	return (true);
}

/**
 * check that all players are properly connected
 * @param {QueueNode} queueNode
 */
function validateMatch(queueNode)
{
	let	socket;

	for (const id_user of queueNode.userSet)
	{
		socket = globals.clientMap.get(id_user);
		if (socket?.reconnectBool == true)
			return (false);
	}
	return (true);
}

/**
 * check that all players are properly connected
 * @param {Match} match
 * @param {QueueNode} queueNode
 * @param {Result} result
 */
async function bindPlayersToMatch(match, queueNode, result)
{
	let	i;
	let	userArray;
	let	user;
	let	userId;
	let	startTeam;
	let	currTeam;
	let dbTable;

	i = 0;
	userArray = Array.from(queueNode.userSet)
	currTeam = match.currentPlayer.team;
	do
	{
		userId = userArray[i];
		user = globals.clientMap.get(userId);
		if (!user)
			throw ("bindPlayerToMatch: userId " + userArray[i] + " has left");
		user.state = enumSocketState.PLAYING;
		match.currentPlayer.matchId = match.id;
		match.currentPlayer.id = userId;
		dbTable = await getUserById(userId);
		if (!dbTable)
			throw (`bindPlayersToMatch: cannot get user ${userId} from db`);//@ts-ignore
		match.currentPlayer.dbTable = dbTable;//@ts-ignore
		startTeam = match.settings?.players[match.currentPlayer.team];
		match.users.push({id_user: userId, outcome: "Lose", startTeam: null, team: match.currentPlayer.team});
		user.matchData = match.currentPlayer;
		globals.RemoveFromAllQueues(userId, false);
		//@ts-ignore
		result.team = match.currentPlayer.team;
		user.socket.join(`match_${match.id}`);
		++i;
		match.endTurn();
	}
	while (currTeam != match.currentPlayer.team)
	match.ExpectedElo();
	result = responseFormatter(match, result, "Room created!", 200);
	i = 0;
	do
	{
		userId = userArray[i];
		user = globals.clientMap.get(userId);
		if (!user?.socket)
			throw (`bindPlayersToMatch: user 0 with id ${userId} undefined or invalid`);
		//@ts-ignore
		result.team = match.currentPlayer.team;
		user.socket.emit("game", result);
		i++;
		match.endTurn();
	}
	while (currTeam != match.currentPlayer.team)
}
