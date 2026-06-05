
import * as lib from "./lib/lib.js";
import { apiRouter } from "./routes/api.js";
import { authRouter } from "./routes/auth.js";
import { responseFormatter } from "./utils/response.js";
import { colors, tag } from "./utils/colors.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { log } from "./utils/log.js";
const app = lib.include.express();
const server = lib.include.http.createServer(app);
const sockio = new lib.include.SocketIO(server);

// setup
const PORT = 8080;
let requests = 0;

log.header('ft_transcendence', '1.0.0');

// NOTE: serve per parsing delle richieste da frontend
app.use(cors({
	origin: 'http://localhost:5173',
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

sockio.on('connection', (socket) => {
	console.log("A new user connected");
})

app.use(cookieParser()); 

// routes
app.use("/api", apiRouter);
app.use("/auth", authRouter)

const conn = app.listen(PORT, () => {
	log.banner(PORT)
	// (`Setting up server on port ${PORT}`);
});

conn.on('listening', () => {
	// console.log(`-> ${colors.bgGreen}${colors.bold}Server is listening${colors.reset} on port ${PORT}\n`);
});

conn.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Porta ${PORT} già in uso`);
  } else {
    console.error("Errore server:", err);
  }
  process.exit(1);
});

export {app, sockio};
