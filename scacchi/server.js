
import * as lib from "./lib/lib.js";
import { apiRouter } from "./routes/api.js";
import { authRouter } from "./routes/auth.js";
import { responseFormatter } from "./utils/response.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = lib.include.express();
const server = lib.include.http.createServer(app);
const sockio = new lib.include.SocketIO(server);

// setup
const PORT = 8080;
let requests = 0;
let conn;

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));

app.set('json spaces', 2);

// NOTE: finche non ci sara un web server su frontend vengono usati questi header per comunicazione BE-FE
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	next();
});

// app.use(cors());
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

conn = app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});

export {app, sockio};
