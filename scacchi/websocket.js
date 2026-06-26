
import * as lib from "./lib/lib.js"
const { ALLOWED_URL } = lib;
const { jwt } = lib.auth;
const { redis } = lib.conn;
const { parse, app, server } = lib.include;
import { globals } from "./Classes/Globals/globals.js";


// MAP: id_client -> Object {socket, bool (allowed/not allowed)}
const userSocketMap = {};

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
	console.log("QUI FORSE?")
	if (!firstConn)
		return next();
	console.log("QUI?")
	const cookies = parse(req.headers.cookie || "");
	const token = cookies.jwt_token;
	if (!token)
	{
		console.log("1")
		return next(new Error("User not authorized"));
	}
	if (await redis.get(`blacklist:${token}`))
	{
		console.log("2")
		return next(new Error("User not authorized"));
	}
	try {
		console.log("3")
		req.user = jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		console.log("error: ", error);
		return next(new Error("User not authorized"));
	}
	next();
});

sockio.on('connection', (socket) => 
{
	const user = socket.request.user;
	console.log("A new user connected with id ", user.id_user);
	globals.clientMap.set(user.id_user, {allowedBool: true, socket: socket});
	sockio.emit("start_game", { messaggio: "si comincia uahu" });
});