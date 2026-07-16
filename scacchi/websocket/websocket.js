//@ts-check
//SECTION - websocket main file
/*
	list of exports:
	OBJECTS:
	-	sockio: the websocket server.
*/

import * as lib from "../lib/lib.js";
const { ALLOWED_URL } = lib;
const { jwt } = lib.auth;
const { redis } = lib.conn;
const { parse, server } = lib.include;
import { globals } from "../Classes/Globals/globals.js";
import { DEBUG_WEBSOCKETS, MATCH_RECONNECT_TIMER, SOCKET_RECONNECT_TIMER, TOURNAMENT_WAIT_TIMER} from "../Macro/macro.js";
import { query } from "../lib/query.js";
import { websocketConnectionHandler, websocketDisconnectionHandler } from "./handlers/connection.js";
import { routesMatchMaking } from "./routes/routesMatchMaking.js";
import { routesGame } from "./routes/routesGame.js";
import { routesTournament } from "./routes/routesTournaments.js";

/** @typedef {import("../Classes/Globals/socketInfo.js").SocketInfo} Socket */

export const sockio = new lib.include.SocketIO(server, {
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
	req.user = await query.usersQuery.getUserById(req.user.id_user);
	next();
});

sockio.on('connection', async (socket) => 
{
	let	friendsId = [];
	let	user;

	user = await websocketConnectionHandler(socket, friendsId);
	routesMatchMaking(socket, user);
	routesGame(socket, user);
	routesTournament(socket, user);
	websocketDisconnectionHandler(socket, user, friendsId);
	// socket.on('find_match', async(/** @type {matchMakingOpt}*/options) => 
	// {
	// 	if (isBusy(user.id_user) == true)
	// 	{
	// 		socket.emit('error', new Result().Error("You are already doing something", 400));
	// 		return ;
	// 	}
	// 	if (!options || !options.roomType || !options.matchType)
	// 	{
	// 		socket.emit('error', {log: {status: 403, msg: `bad options parameter: ${options}. expected: ${matchMakingOpt}`}});
	// 		return ;
	// 	}
	// 	if (includesOneOf(options.roomType, enumConnection.FRIENDLY, enumConnection.RANKED, enumConnection.ARENA))
	// 		MatchMaking(user, options);
	// 	else
	// 		throw ("stanze non implementate");
	// });

	// socket.on("amiplaying", async(req, callback) =>
	// {
	// 	let	socketData;

	// 	socketData = clientMap.get(user.id_user);
	// 	socket.emit("amiplaying", socketData?.state == enumSocketState.PLAYING);
	// 	if (typeof(callback) == "function")
	// 		callback({log: {status: status}});
	// });

	// socket.on("game", async(/** @type {{from: *, to: *, type: string}}*/req, callback) =>
	// {
	// 	let	status;

	// 	socketData = globals.clientMap.get(user.id_user);
	// 	status = await gameWebSocketHandler(req, user.id_user, socketData);
	// 	//NOTE - the callback alerts the frontend that emit is done
	// 	if (typeof(callback) == "function")
	// 		callback({log: {status: status}});
	// });

	// socket.on("replay_game", async(/** @type {{matchId: number, moveId: number, delBool?: Boolean}}*/req, callback) => 
	// {
	// 	let	result;

	// 	if (isBusy(user.id_user) == true)
	// 		result = new Result().Error("You are already doing something", 400);
	// 	else
	// 		result = historyGetMatchState(req);
	// 	socket.emit("replay_game", result);
	// 	if (typeof(callback) == "function")
	// 		callback(result?.log);
	// });

	// socket.on('create_tournament', async (/** @type {{name: string, maxPlayers: number}}*/req, callback) => 
	// {
	// 	let result;
	// 	let room;

	// 	try
	// 	{
	// 		socketData = clientMap.get(user.id_user);
	// 		if (!socketData)
	// 			throw (`create_tournament: socketData is empty`);
	// 		if (isBusy(user.id_user) == true)
	// 			result = new Result().Error("You are already doing something", 400);
	// 		else if (await checkTournamentName(req?.name) == true)
	// 			result = new Result().Error(`Tournament already exists`, 409);
	// 		else
	// 		{
	// 			room = new Room(user.id_user, req?.maxPlayers, req?.name);
	// 			globals.rooms.set(room.cryptId, room);
	// 			socket.join(room.id);
	// 			if (socketData)
	// 				socketData.state = enumSocketState.JOIN_TOURNAMENT;
	// 			result = new Result().Success();//@ts-ignore
	// 			result.tournament_link = room.cryptId;
	// 		}
	// 	}
	// 	catch (error)
	// 	{
	// 		result = new Result().Error(String(error), 500);
	// 	}
	// 	socket.emit('create_tournament', result);
	// 	if (typeof(callback) == "function")
	// 		callback(result.log);
	// });

	// socket.on('join_tournament', async(/** @type {{tournament_link: string}}*/req, callback) =>
	// {
	// 	let	result;
	// 	let	room;
	// 	let	socketData;

	// 	room = globals.rooms.get(req?.tournament_link);
	// 	if (!room)
	// 		result = new Result().Error(`tournament ${req?.tournament_link} does not exist`, 400);
	// 	else if (isBusy(user.id_user) == true)
	// 		result = new Result().Error("You are already doing something", 400);
	// 	else
	// 	{
	// 		result = room.addPlayer(user.id_user);
	// 		socket.join(room.id);
	// 		socketData = clientMap.get(user.id_user);
	// 		if (socketData)
	// 			socketData.state = enumSocketState.JOIN_TOURNAMENT;
	// 	}
	// 	if (room && result.status == 200 && room.players.size == room.maxPlayers)
	// 		initTournament(); //TODO - AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	// 	else
	// 		socket.emit('join_tournament', result);
	// 	if (typeof(callback) == "function")
	// 		callback(result.log);
	// });

	// socket.on('leave_tournament', async(req, callback) =>
	// {
	// 	let	result;

	// 	socketData = clientMap.get(user.id_user);
	// 	if (!socketData)
	// 		throw (`leave_tournament: socketData is empty`);
	// 	socketData.state = enumSocketState.NAVIGATING;
	// 	result = globals.LeaveRoom(socketData, user.id_user)
	// 	roomMessage(socketData.roomData?.cryptId, 'leave_tournament', result);
	// 	if (typeof(callback) == "function")
	// 		callback(result?.log);
	// });

	// socket.on('disconnect', async () => {
	// 	clearTimeout(globals.timers.get(user.id_user));
	// 	socketData = globals.clientMap.get(user.id_user);
	// 	if (!socketData)
	// 		return (console.error("ERROR: invalid socket during disconnect"));
	// 	socketData.reconnectBool = true;
	// 	//NOTE - after SOCKET_RECONNECT_TIMER, user is considered disconnected
	// 	console.log("setting reconnection timeout for user", user.id_user);
	// 	globals.timers.set(user.id_user, setTimeout(() =>
	// 	{
	// 		let	result;

	// 		socketData = globals.clientMap.get(user.id_user);
	// 		if (!socketData)
	// 			throw (`disconnect: socketData is empty`);
	// 		globals.ClearTimer(user.id_user);
	// 		socket.removeAllListeners();
	// 		socket.disconnect();
	// 		console.log(`User with id ${user.id_user} disconnected`);
	// 		globals.RemoveFromAllQueues(user.id_user);
	// 		result = globals.DeletePlayer(socketData.matchData?.matchId, socketData.matchData?.team);
	// 		roomMessage(socketData.matchData?.matchId, `game`, result);
	// 		result = globals.LeaveRoom(socketData, user.id_user);
	// 		roomMessage(socketData.roomData?.id, "leave_room", result);
	// 		clientMap.delete(user.id_user);
	// 		for (const id of friendsId)
	// 		{
	// 			const friendSock = clientMap.get(id);
	// 			if (friendSock)
	// 				sockio.to(friendSock.socket.id).emit('friend:offline', { userId: user.id_user });
	// 		}
	// 	}, getReconnectTime(socketData.state)));
	// })
});
