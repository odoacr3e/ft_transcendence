
import * as lib from "./lib/lib.js";
import { apiRouter } from "./routes/api.js";
import { authRouter } from "./routes/auth.js";
import { responseFormatter } from "./utils/response.js";
import { colors, tag } from "./utils/colors.js";
import { log } from "./utils/log.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = lib.include.express();
const server = lib.include.http.createServer(app);

export const userSocketMap = {};
export const authorizedUserSocketMap = {};
export const sockio = new lib.include.SocketIO(server, {
	cors: {
		origin: "*", // per sviluppo, in produzione metti l'url preciso
		methods: ["GET", "POST"],
		credentials: true
	},
	connectionStateRecovery: {} // se il client si disconnette temporaneamente gli arrivano gli eventi alla riconnessione, senza vengono persi
});

// setup
const PORT = 8080;
const URL = 'http://localhost:5173';
let requests = 0;

// NOTE: serve per parsing delle richieste da frontend
app.use(cors({
	origin: URL,
	credentials: true
}));

app.set('json spaces', 2);
app.use(lib.include.express.json());

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
	socket.on("", ()=>{
		// socket.emit...
	})
	sockio.emit("start_game", { messaggio: "si comincia uahu" });
	console.log("A new user connected");
})

app.use(cookieParser()); 
app.use(lib.include.express.static('public'));


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

export {app, sockio};
