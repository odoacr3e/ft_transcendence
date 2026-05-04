// @ts-check
const { abort } = require("node:process");
//const {include} = require("./lib/lib.js");
//const {Chess} = require("./lib/lib.js");
//const {Macro} = require("./lib/lib.js");
//const {Enum} = require("./lib/lib.js");

//SECTION macro

const HASH_SALT = 10;

/*
	seed interessanti
	62: scacco matto ciao ciao
	63: scacco matto prevenibile
*/
const SEED = 1;

const MAX_CHESSBOARD_SIZE = 25;
const CHESSBOARD_H = 8;
const CHESSBOARD_W = 8;
const MOVEMENT_MAX = 2;
const MOVEMENT_MIN = 1;
const BOOSTED_MAX = 1;

//SECTION checks

if ((CHESSBOARD_H >= MAX_CHESSBOARD_SIZE || CHESSBOARD_W >= MAX_CHESSBOARD_SIZE) || 
	(CHESSBOARD_H <= 0 || CHESSBOARD_W <= 0))
{
	error("illegal chessboard size");
}

/**
 * 
 * @param {string} text 
 */
function error(text)
{
	console.error(text);
	abort();
}

module.exports = { CHESSBOARD_H, CHESSBOARD_W, MOVEMENT_MIN, MOVEMENT_MAX, BOOSTED_MAX, HASH_SALT, SEED }