
const lib = require("./lib.js");

const express = lib.include.express;
const http = lib.include.http;
const app = express();


const port = 8080;
let requests = 0;

app.get('/', (request, response) => {
	console.log("Arrivata request " + ++requests); // scrive sul server
	console.log("Con hostname: " + request.);
	response.send("Hello world\n"); // manda response al client
})

app.listen(port, () => {
	console.log("Server is listening on port " + port);
});