
import * as lib from "./lib/lib.js";
import { apiRouter } from "./routes/api.js";
import { authRouter } from "./routes/auth.js";
import { responseFormatter } from "./utils/response.js";
import { colors, tag } from "./utils/colors.js";
import { log } from "./utils/log.js";
import { globals } from "./Classes/Globals/globals.js";
import "./websocket/websocket.js"

const { ALLOWED_URL, PORT } = lib;
const { cors } = lib.auth;
const { cookieParser, app, server } = lib.include;

// NOTE: serve per parsing delle richieste da frontend
app.use(cors({
	origin: ALLOWED_URL,
	credentials: true,
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

// routes
log.info('Routes initilization...');
app.use("/api", apiRouter);
app.use("/auth", authRouter);
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


//NOTE - DO NOT TOUCH!!!
const oggettoVuotoPerFarFunzionareTermjsNONCANCELLARE = 42;
export {oggettoVuotoPerFarFunzionareTermjsNONCANCELLARE};
//NOTE - NON CANCELLARE!!!