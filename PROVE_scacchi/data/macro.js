// @ts-check
const { abort } = require("node:process");
//const {include} = require("./lib.js");
//const {Chess} = require("./lib.js");
//const {Macro} = require("./lib.js");
//const {Enum} = require("./lib.js");

//SECTION macro

const MAX_CHESSBOARD_SIZE = 25;
const CHESSBOARD_H = 8;
const CHESSBOARD_W = 8;

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

module.exports = {CHESSBOARD_H, CHESSBOARD_W}