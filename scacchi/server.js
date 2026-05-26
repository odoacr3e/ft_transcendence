
const lib = require("./lib/lib.js");
const app = lib.include.express();
const { responseFormatter } = require("./utils/response.js");

// setup
const PORT = 8080;
let requests = 0;

app.set('json spaces', 2);
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	next();
});
app.use(lib.include.express.json());

// global error middleware
app.use((err, req, res, next) => 
{
	let	formattedResponse;

	console.error(err);
	formattedResponse = responseFormatter(null, null, err, 500);
	res.status(500).json(formattedResponse);
});

// routes
app.use("/api", require("./routes/api.js"));
app.use("/auth", require("./routes/auth.js"))

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});

module.exports = {app};
