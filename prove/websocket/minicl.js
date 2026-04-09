const { Socket } = require("node:net");
const { io } = require("socket.io-client");
const s = io("https://localhost:8443", { rejectUnauthorized: false });
s.on("connect", () => console.log("connesso", s.id));
s.on('a', (msg, callback) => {console.log(msg); callback("111");});
s.emit("p", "uuuuuuuuuuu");
s.on("connect_error", console.error);

function callback(msg)
{
	console.log(msg);
}