//@ts-check

import { write } from "node:fs";

if (process.send)
	process.send("2");
process.on("message", (data) =>
{
	console.log(`finalmente, ecco papone con gli alimenti!`);
	console.log(data);
});
