
const lib = require("./lib.js");

const app = lib.include.express();
const { db } = require("./services/dbConnection.js");
const { rejects } = require("node:assert");

// setup
const port = 8080;
let requests = 0;
app.set('json spaces', 2);

app.use("/api", require("./routes"));

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});