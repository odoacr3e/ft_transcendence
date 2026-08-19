import { createHash } from "crypto";



let	board = "|M|J| |C|K|V| |M|\n|B|B|B|V|B| | | |\n| | | | | | | | |\n| |V|+C| | | | |B|\n| | | |B| |B| | |\n| | | | |B| |B| |\n|B|B|B| | | | |B|\n|M|J|V| |K| |J|M|\n";
let	test = 
{
	"0": "ciao0",
	"2": "ciao2",
	"4": "ciao4",
}

function hashPosition(boardString) {
	return createHash("sha256").update(boardString).digest("hex");
}

console.log(test[0]);
console.log(test[3]);
console.log(test[4]);
console.log(hashPosition(board));
console.log(hashPosition(board));