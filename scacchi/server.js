
const lib = require("./lib.js");

const express = lib.include.express;
const app = express();
const { db } = require("./database.js");
const { rejects } = require("node:assert");

const port = 8080;
let requests = 0;

async function getAllUsers() {
	return (new Promise((resolve, reject) => {
		db.query("SELECT * FROM userss")
		.then((res) => {
			resolve(res.rows);
		})
		.catch((err) => {
			reject(err);
		})
	}));
}

app.get('/', async (request, response) => {
	console.log("Arrivata request " + ++requests); // scrive sul server
	try {
		const users = await getAllUsers();
		console.log("Trovati utenti");
		response.send(users); // manda response al client
	}
	catch (err){
		console.log(err.message);
		response.status(500).json({error: err.message});
	}
})

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});