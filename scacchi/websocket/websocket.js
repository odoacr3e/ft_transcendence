
import * as lib from "../lib/lib.js"
const { ALLOWED_URL } = lib;
const { jwt } = lib.auth;
const { redis } = lib.conn;
const { parse, app, server } = lib.include;
import { globals } from "../Classes/Globals/globals.js";
import { announceMeOnline } from "./onlineStatus.js";
import {enumConnection, eMatchPresets, enumSocketState} from "../Macro/enums.js";
import { includesOneOf } from "../utils/string.js";
import { MatchMaking } from "./MatchMaking/MatchMaking.js";
import { DEBUG_WEBSOCKETS, MATCH_RECONNECT_TIMER, SOCKET_RECONNECT_TIMER } from "../Macro/macro.js";
import { gameWebSocketHandler, init } from "../handlers/game/Game.js";
import { responseFormatter } from "../utils/response.js";
import { Result } from "../Classes/endPoint/result.js";
import { historyGetMatchState, historyRestoreFromDb } from "../utils/history.js";

/** @typedef {{socket: *, allowedBool: boolean, state?: string, reconnectBool?: boolean, matchData?: Player}} Socket */

const clientMap = globals.clientMap;

const sockio = new lib.include.SocketIO(server, {
	cors: {
		origin: ALLOWED_URL,
		methods: ["GET", "POST"],
		credentials: true
	},
	connectionStateRecovery: {} // se il client si disconnette temporaneamente gli arrivano gli eventi alla riconnessione, senza vengono persi
});

//FIXME - ⚠️senza questo le connessioni websockets non sono sicure!
//NOTE - ⚠️	https://www.youtube.com/watch?v=SgR8NAkQ3cc&themeRefresh=1
// middleware aunteticazione websocket
sockio.engine.use(async (req, res, next) => {
	const firstConn = req._query.sid === undefined;
	if (!firstConn)
		return next();
	//NOTE - questa macro (settata di default a false, abilitata da .env)
	//			permette di avere user fasulli per testare il matchmaking
	if (DEBUG_WEBSOCKETS == true)
		return (next());
	const cookies = parse(req.headers.cookie || "");
	const token = cookies.jwt_token;
	if (!token)
		return next(new Error("User not authorized"));
	if (await redis.get(`blacklist:${token}`))
		return next(new Error("User not authorized"));
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		console.log("error: ", error);
		return next(new Error("User not authorized"));
	}
	next();
});

sockio.on('connection', async (socket) => 
{
	let user;
	let	socketData;
	let	friendsId = [];

	if (DEBUG_WEBSOCKETS == false)
		user = socket.request.user;
	else
		user = socket.handshake.auth;
	globals.ClearTimer(user.id_user);
	socketData = clientMap.get(user.id_user);
	if (socketData?.reconnectBool == true || socketData?.state)
		await handleReconnect(sockio, user, socketData, socket);
	else
		await firstConnection(sockio, user, socket, friendsId);
	try {
		friendsId = await announceMeOnline(sockio, user, clientMap, friendsId);
	} catch (error) {
		//FIXME - entra sempre qui! da controllare come mai
		// console.error("Server error loading friends:", error);
	}
	socket.on('find_match', async(/** @type {matchMakingOpt}*/options) => 
	{
		if (!options || !options.roomType || !options.matchType)
		{
			socket.emit('error', {log: {status: 403, msg: `bad options parameter: ${options}. expected: ${matchMakingOpt}`}});
			return ;
		}
		if (includesOneOf(options.roomType, enumConnection.FRIENDLY, enumConnection.RANKED, enumConnection.ARENA))
			MatchMaking(user, clientMap, options);
		else
			throw ("stanze non implementate");
	});

	socket.on("amiplaying", async(req, callback) =>
	{
		let	socketData;

		socketData = clientMap.get(user.id_user);
		socket.emit("amiplaying", socketData?.state == enumSocketState.PLAYING);
		if (typeof(callback) == "function")
			callback({log: {status: status}});
	});

	socket.on("game", async(/** @type {{from: *, to: *, type: string}}*/req, callback) =>
	{
		let	status;

		socketData = globals.clientMap.get(user.id_user);
		status = await gameWebSocketHandler(req, user.id_user, socketData);
		//NOTE - the callback alerts the frontend that emit is done
		if (typeof(callback) == "function")
			callback({log: {status: status}});
	});

	socket.on("replay_game", async(/** @type {{matchId: number, moveId: number, delBool?: Boolean}}*/req, callback) => 
	{
		let	result;

		result = historyGetMatchState(req);
		socket.emit("replay_game", result);
		if (typeof(callback) == "function")
			callback(result.log);
	});

	socket.on('disconnect', async () => {
		clearTimeout(globals.timers.get(user.id_user));
		socketData = globals.clientMap.get(user.id_user);
		if (!socketData)
			return (console.error("ERROR: invalid socket during disconnect"));
		socketData.reconnectBool = true;
		//NOTE - after SOCKET_RECONNECT_TIMER, user is considered disconnected
		console.log("setting reconnection timeout for user", user.id_user);
		globals.timers.set(user.id_user, setTimeout(() =>
		{
			let	result;

			socketData = globals.clientMap.get(user.id_user);
			if (!socketData)
				return (console.error("ERROR: invalid socket during timeout end"));
			globals.ClearTimer(user.id_user);
			socket.removeAllListeners();
			socket.disconnect();
			console.log(`User with id ${user.id_user} disconnected`);
			globals.RemoveFromAllQueues(user.id_user);
			result = globals.DeletePlayer(socketData.matchData?.matchId, socketData.matchData?.team);
			if (result)
				roomMessage(socketData.matchData?.matchId, result);
			clientMap.delete(user.id_user);
			for (const id of friendsId)
			{
				const friendSock = clientMap.get(id);
				if (friendSock)
					sockio.to(friendSock.socket.id).emit('friend:offline', { userId: user.id_user });
			}
		}, getReconnectTime(socketData.state)));
	})
});

/**
 * 
 * @param {*} sockio 
 * @param {*} user 
 * @param {*} socket 
 * @param {[]} friendsId
 */
async function firstConnection(sockio, user, socket, friendsId)
{
	console.log("A new user connected with id ", user.id_user);
	clientMap.set(user.id_user, {allowedBool: true, socket: socket, matchData: null});
}

/**
 * 
 * @param {*} sockio 
 * @param {*} dbUser 
 * @param {Socket} socketData 
 */
function handleReconnect(sockio, dbUser, socketData, newSocket)
{
	console.log(`reconnect user ${dbUser.id_user}...`);
	socketData.reconnectBool = false;
	socketData.socket.removeAllListeners();
	if (socketData.socket.id != newSocket.id)
		socketData.socket.disconnect();
	socketData.socket = newSocket;
	if (socketData.state == enumSocketState.MATCHMAKING)
		return (MatchMaking(dbUser, clientMap));
	else if (socketData.state == enumSocketState.PLAYING)
	{
		if (!socketData.matchData)
			console.log("ERROR: data for player are lost! OH NO!");
	}
}

/**
 * 
 * @param {string} state 
 */
function getReconnectTime(state)
{
	if (state == enumSocketState.PLAYING)
		return (MATCH_RECONNECT_TIMER);
	return (SOCKET_RECONNECT_TIMER);
}

/**
 * 
 * @param {string} roomName 
 * @param {Result} result 
 */
function roomMessage(roomName, result)
{
	if (!roomName || !result)
		return ;
	sockio.to(roomName, responseFormatter(null, result));
}
