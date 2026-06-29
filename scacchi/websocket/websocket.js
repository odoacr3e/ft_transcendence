
import * as lib from "../lib/lib.js"
const { ALLOWED_URL } = lib;
const { jwt } = lib.auth;
const { redis } = lib.conn;
const { parse, app, server } = lib.include;
import { globals } from "../Classes/Globals/globals.js";
import { announceMeOnline } from "./onlineStatus.js";

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
	const user = socket.request.user;
	console.log("A new user connected with id ", user.id_user);
	clientMap.set(user.id_user, {allowedBool: true, socket: socket, matchData: null});
	let friendsId = [];
	try {
		friendsId = await announceMeOnline(sockio, user, clientMap, friendsId);
	} catch (error) {
		console.error("Server error loading friends:", error);
	}

	socket.on('disconnect', async () => {
		console.log(`User with id ${user.id_user} disconnected`)
		clientMap.delete(user.id_user);
		for (const id of friendsId)
		{
			const friendSock = clientMap.get(id);
			if (friendSock)
				sockio.to(friendSock.socket.id).emit('friend:offline', { userId: user.id_user });
		}
	})
	// sockio.emit("start_game", { messaggio: "si comincia uahu" });
});