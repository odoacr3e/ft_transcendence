//@ts-check
import { globals } from "../../Classes/Globals/globals.js";
import { enumConnection } from "../../Macro/enums.js";
import { Match } from "../../Classes/Chess/match.js";
import { init } from "../../handlers/game/init.js";
import { render } from "../../test/render.js";
import { getUserById } from "../../query/usersQuery.js";

/** @typedef {import("../../Classes/Chess/player.js").Player} Player*/
/** @typedef {{socket: *, allowedBool: boolean, matchData?: Player}} Socket */
/** @typedef {import("../../Classes/endPoint/matchInit.js").matchMakingOpt} MatchMakingOpt*/
/** @typedef {{id_user: string, points: number}} dbUser*/
/** @typedef {import("../../Classes/Globals/Queue.js").Queue} Queue*/
/** @typedef {import("../../Classes/Globals/Queue.js").QueueNode} QueueNode*/

/**
 * 
 * @param {*} sockio 
 * @param {dbUser} user
 * @param {Map<string, Socket>} clientMap 
 * @param {MatchMakingOpt} options
 */
export async function MatchMaking(sockio, user, clientMap, options)
{
	let queue;
	let	socketData;

	console.log(user);
	socketData = clientMap.get(user.id_user);
	if (!socketData)
		throw (`user id ${user.id_user} does not exist`);
	queue = globals.GetQueue(options.roomType);
	queue.AddNode(user, options);
	findMatch(queue, user);
	console.log(`user in queue ${options.roomType}:`);
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
export async function createMatch(queueNode)
{
	let	match;
	let	result;
	let	socket;
	let	preset;

	if (await validateMatch(queueNode) == false)
		return (false);
	preset = queueNode.matchOptions? queueNode.matchOptions: queueNode.matchType;
	match = new Match(preset);
	result = init(match, preset);
	globals.lastMatchId = match.CreateId(queueNode);
	globals.matches.set(globals.lastMatchId, match);
	await bindPlayersToMatch(match, queueNode);
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
 */
async function bindPlayersToMatch(match, queueNode)
{
	let	i;
	let	userArray;
	let	user;
	let	userId;
	let	startTeam;
	let	promises = [];

	i = 0;
	userArray = Array.from(queueNode.userSet)
	startTeam = match.currentPlayer.team;
	do
	{
		userId = userArray[i];
		user = globals.clientMap.get(userId);
		if (!user)
			throw ("bindPlayerToMatch: userId " + userArray[i] + " has left");
		match.currentPlayer.matchId = match.id;
		match.currentPlayer.socket = user.socket;
		match.currentPlayer.id = userId;
		promises.push(getUserById(userId));
		user.matchData = match.currentPlayer;
		globals.arenaQueue.DelNode(userId);
		globals.friendlyQueue.DelNode(userId);
		globals.rankedQueue.DelNode(userId);
		++i;
		match.endTurn();
	}
	while (startTeam != match.currentPlayer.team)
	//this makes the queries asynchronous from the matchMaker
	Promise.all(promises).then(
	(dbData) =>
	{
		i = 0;
		do
		{
			match.currentPlayer.dbTable = dbData[i];
			++i;
			match.endTurn();
		}
		while (startTeam != match.currentPlayer.team)
	}).catch((err)=>{console.log(err);});
}
