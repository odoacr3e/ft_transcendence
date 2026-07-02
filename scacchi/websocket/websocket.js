
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
import { DEBUG_WEBSOCKETS, SOCKET_RECONNECT_TIMER } from "../Macro/macro.js";

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

	if (DEBUG_WEBSOCKETS == false)
		user = socket.request.user;
	else
		user = socket.handshake.auth;
	globals.ClearTimer(user.id_user);
	console.log("A new user connected with id ", user.id_user);
	socketData = clientMap.get(user.id_user);
	if (socketData?.reconnectBool == true)
		return (handleReconnect(sockio, user, socketData));
	clientMap.set(user.id_user, {allowedBool: true, socket: socket, matchData: null});
	let friendsId = [];
	try {
		friendsId = await announceMeOnline(sockio, user, clientMap, friendsId);
	} catch (error) {
		console.error("Server error loading friends:", error);
	}

	socket.on('init', async(/** @type {matchMakingOpt}*/options) => 
	{
		if (!options || !options.roomType || !options.matchType)
		{
			socket.emit('error', {log: {status: 403, msg: `bad options parameter: ${options}. expected: ${matchMakingOpt}`}});
			return ;
		}
		if (includesOneOf(options.roomType, enumConnection.FRIENDLY, enumConnection.RANKED, enumConnection.ARENA))
			MatchMaking(sockio, user, clientMap, options);
		else
			throw ("stanze non implementate");
	})

	socket.on('disconnect', async () => {
		clearTimeout(globals.timers.get(user.id_user));
		globals.clientMap.get(user.id_user).reconnectBool = true;
		//NOTE - after SOCKET_RECONNECT_TIMER, user is considered disconnected
		console.log("setting reconnection timeout for user", user.id_user);
		globals.timers.set(user.id_user, setTimeout(() =>
		{
			console.log(`User with id ${user.id_user} disconnected`);
			globals.RemoveFromAllQueues(user.id_user);
			globals.ClearTimer(user.id_user);
			clientMap.delete(user.id_user);
			for (const id of friendsId)
			{
				const friendSock = clientMap.get(id);
				if (friendSock)
					sockio.to(friendSock.socket.id).emit('friend:offline', { userId: user.id_user });
			}
		}, SOCKET_RECONNECT_TIMER));
	})
});

/**
 * 
 * @param {*} sockio 
 * @param {*} dbUser 
 * @param {Socket} socketData 
 */
function handleReconnect(sockio, dbUser, socketData)
{
	socketData.reconnectBool = false;
	if (socketData.state == enumSocketState.MATCHMAKING)
		return (MatchMaking(sockio, dbUser, clientMap));
}
