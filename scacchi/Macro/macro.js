// @ts-check
import { abort } from "node:process";


//SECTION debug
const DEBUG = true;
//@ts-ignore
/** @type {boolean} */const DEBUG_WEBSOCKETS = process.env.DEBUG_WEBSOCKETS == "true" ? true : false;
//@ts-ignore
/** @type {boolean} */const DEBUG_CURL = process.env.DEBUG_CURL == "true" ? true : false;

//SECTION - history
const HISTORY_PATH = "../history/";
const HISTORY_FILE = "HISTORY.json";
const HISTORY_DEFAULT = `${HISTORY_PATH}${HISTORY_FILE}`;

//SECTION - timers
const MATCHTIMER = 15 * 60 * 1000;
const SOCKET_RECONNECT_TIMER = 3 * 1 * 1000;//3 seconds
const MATCH_RECONNECT_TIMER = 60 * 1 * 1000;//60 seconds
const TOURNAMENT_WAIT_TIMER = 60 * 5 * 1000;//5 minutes

const HASH_SALT = process.env.HASH_SALT? process.env.HASH_SALT : "10";

/*
	seed interessanti
	0:	classic mode
	1:	trono di spade
	1057: scacco matto ciao ciao
	63: scacco matto prevenibile
*/
const SEED = 0;

//ANCHOR - chess

const MAX_CHESSBOARD_SIZE = 25;
let CHESSBOARD_H = 8;
let CHESSBOARD_W = 8;
let MOVEMENT_MAX = 2;
let MOVEMENT_MIN = 1;
let BOOSTED_MAX = 1;
let MOVEMENT_BONUS_POINT = 4;

//SECTION - utils

function macroReset()
{
	CHESSBOARD_H = 8;
	CHESSBOARD_W = 8;
	MOVEMENT_MAX = 2;
	MOVEMENT_MIN = 1;
	BOOSTED_MAX = 1;
	MOVEMENT_BONUS_POINT = 4;
}

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

export { macroReset, DEBUG, DEBUG_WEBSOCKETS, DEBUG_CURL, HISTORY_FILE, HISTORY_DEFAULT, HISTORY_PATH, CHESSBOARD_H, CHESSBOARD_W, MOVEMENT_MIN, MOVEMENT_MAX, MOVEMENT_BONUS_POINT, BOOSTED_MAX, HASH_SALT, SEED, MATCHTIMER, SOCKET_RECONNECT_TIMER, MATCH_RECONNECT_TIMER, TOURNAMENT_WAIT_TIMER};