import { hashSync } from "bcrypt";

console.log(hashSync("ciao", 10));
console.log(hashSync("|M|J| |C|K|V| |M|\n|B|B|B|V|B| | | |\n| | | | | | | | |\n| |V|+C| | | | |B|\n| | | |B| |B| | |\n| | | | |B| |B| |\n|B|B|B| | | | |B|\n|M|J|V| |K| |J|M|\n", 10));