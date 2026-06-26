
import * as lib from "./lib/lib.js";
import { apiRouter } from "./routes/api.js";
import { authRouter } from "./routes/auth.js";
import { responseFormatter } from "./utils/response.js";
import { colors, tag } from "./utils/colors.js";
import { log } from "./utils/log.js";
const { redis } = lib.conn;
import { parse } from "cookie";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globals } from "./Classes/Globals/globals.js";
const { jwt } = lib.include;
const app = lib.include.express();
const server = lib.include.http.createServer(app);


// setup
const PORT = 8080;
const ALLOWED_URL = process.env.ALLOWED_URL?.split(',') ?? ['http://localhost:5173'];
let requests = 0;

// id_client -> Object {socket, bool (allowed/not allowed)}
export const userSocketMap = {};
// dentro userSocketMap
export const authorizedUserSocketMap = {};
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
	const cookies = parse(req.headers.cookie || "");
	const token = cookies.jwt_token;
	if (!token)
		return next(new Error("User not authorized"));
	if (await redis.get(`blacklist:${token}`))
		return next(new Error("User not authorized"));
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return next(new Error("User not authorized"));
	}
	next();
})

// NOTE: serve per parsing delle richieste da frontend
app.use(cors({
	origin: ALLOWED_URL,
	credentials: true
}));

app.use(cookieParser()); 
app.use(lib.include.express.static('public'));
app.use(lib.include.express.json());
app.set('json spaces', 2);
app.set('clientMap', globals.clientMap);

// global error middleware
app.use((err, req, res, next) => 
{
	let	formattedResponse;

	console.error(err);
	if (typeof(err) == "object")
		err = "unknown crash in chess engine";
	formattedResponse = responseFormatter(null, null, err, 500);
	res.status(500).json(formattedResponse);
});

sockio.on('connection', (socket) => 
{
	const user = socket.request.user;
	console.log("A new user connected with id ", user.id_user);
	globals.clientMap.set(user.id_user, {allowedBool: true, socket: socket});
	sockio.emit("start_game", { messaggio: "si comincia uahu" });
})

// routes
log.info('Routes initilization...')
app.use("/api", apiRouter);
app.use("/auth", authRouter)
log.ok(`Routes loaded`);

// server confiuration wit web socket
server.listen(PORT, () => {
	log.server(`Setting up server on port`, PORT);
});

server.on('listening', () => {
	log.banner(PORT)
});

server.on("error", (err) => {
	if (err.code === "EADDRINUSE") {
		log.err(`Server already in use on port ${PORT}`)
	} else {
		log.err(`Server error: ${err}`)
	}
	process.exit(1);
});

export {app};
