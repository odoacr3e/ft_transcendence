// @ts-check
const {Piece, board, Square} =					require("../lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("../lib.js").Enums;
const {isDangerous, movePiece, DangerUpdate} =	require("../utils.js");

const lib =			require("../lib.js");
const {abort} = 	require("node:process");
const {cursor} = 	require("../cursor.js");
const {render} = 	require("../render.js");

//SECTION - random

let   seed = null;
if (seed == null)
    seed = Math.floor(Math.random() * (1 << 30));
console.log("seed:", seed);
const   seedrandom = require("seedrandom");
const   rngBase = seedrandom(seed);
const   rng = (mod = (1 << 30)) =>
{
    let x = rngBase() * mod;

    return (Math.floor(x));
}

console.log("generating 3 random numbers");
console.log(rng(32));
console.log(rng(32));
console.log(rng());