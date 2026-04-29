
const lib = require("./lib.js");

const app = lib.include.express();
const { db } = require("./services/dbConnection.js");
const { rejects } = require("node:assert");

// setup
const PORT = 8080;
let requests = 0;

app.set('json spaces', 2);
app.use(lib.include.express.json());

// global error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Errore interno del server' });
});

// routes
app.use("/api", require("./routes/api.js"));
app.use("/login", require("./routes/auth.js"))

app.listen(PORT, () => {
	console.log("Server is listening on port " + PORT);
});

module.exports = {app};