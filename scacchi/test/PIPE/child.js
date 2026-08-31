//@ts-check

import { globals } from "../../Classes/Globals/globals.js";

globals.lastMatchId = "70"

if (process.send)
	process.send("2");
process.on("message", (data) =>
{
	console.log(`finalmente, ecco papone con gli alimenti!`);
	console.log(data);
	console.log(`child: ${globals.lastMatchId}`);
});
