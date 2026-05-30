// @ts-check
//SECTION - external libraries
import fs from "fs";
import { exec, execSync } from "child_process";
//SECTION - backend cute stuff >3
import { globals } from "../Classes/Match/globals.js";
import { historyRestore } from "../utils/history.js";
import {HISTORY_PATH} from "../Macro/macro.js";
import { colors as color } from "../utils/colors.js";
import { testerEnum as MSG, curlCmd } from "./enumsTest.js";
import {boardStringify} from "./render.js";
import { Match } from "../Classes/Match/match.js";
import {jsonParser} from "../utils/response.js";
import {render} from "./render.js";

/** @typedef {import ("../../history/HISTORY.json")} historyData */
/** @typedef {import ("../Classes/ChessBoard/chessBoard.js").ChessBoard} ChessBoard */
/** @typedef {{board: ChessBoard, log: {msg: string, status: ""}}} BackResponse*/

const curlWaitTimeMs = 10; 
let	currMatch = "";
let	errorFlag = 0;
let	fData = {};
let	BData = {};
let	msgErr = "";
let	currEvent = {};
let	currSquare = "";
let	fPiece = "";
let	bPiece = "";

async function testerMain()
{
	let	matchName;
	let	matchPath;

	// console.log = () => {};
	exec("npm run server", (err, stdout, stderr) =>{if (err){console.error(`${err} ${stderr}`)}});
	await msleep(1000);
	matchName = process.argv.at(2);
	if (!matchName)
		return (await execAllTests());
	if (matchName.endsWith(".json") == false)
		matchName = matchName + ".json";
	currMatch = matchName;
	if (matchName.indexOf("..") != -1)
		return (testerFail(MSG.INVALID_DIR));
	matchPath = `${HISTORY_PATH}${matchName}`;
	if (!matchPath)
		return (testerFail(MSG.INVALID_PATH, matchPath));
	if (fs.existsSync(matchPath) == false)
		return (testerFail(MSG.INVALID_PATH, matchPath));
	await execTest(matchPath);
	process.exit(errorFlag);
}

await testerMain();


async function execAllTests()
{
	for (const file of fs.readdirSync(HISTORY_PATH))
	{
		currMatch = file;
		await execTest(`${HISTORY_PATH}${file}`);
	}
	process.exit(errorFlag);
}

/**
 * 
 * @param {string} matchPath 
 * @returns 
 */
async function execTest(matchPath)
{
	/** @type {historyData}*/
	let	history;
	let	match;
	let	board;
	let	boards;

	match = globals.getDebugMatch();
	try
	{
		history = JSON.parse(fs.readFileSync(matchPath, 'utf-8'));
		if (history.seed == undefined || history.victory == undefined)
			return (testerFail(MSG.INVALID_JSON));
		match.Reset();
		await executeEvents(match, history);
	}
	catch(err)
	{
		if (typeof(err) == "string")
			gameFail(err);
		else//@ts-ignore
			testerFail(MSG.INVALID_MSG, err);
		return ;
	}
	board = boardStringify(match);
	if (history.finalBoard != board)
	{
		boards = highLightBoardDiff(history.finalBoard, board);
		return (gameFail(MSG.BOARD, boards.correct, boards.wrong));
	}
	// else if (history.victory && !match.victory)
	// 	return (gameFail(MSG.WIN_MISS, history.victory));
	// else if (!history.victory && match.victory)
	// 	return (gameFail(MSG.WIN_WRONG));
	// else if (history.victory != match.victory)
	// 	return (gameFail(MSG.WIN_PLAYER), match.victory);
	success();
}

/**
 * 
 * @param {Match} match 
 * @param {historyData} history 
 */
async function executeEvents(match, history)
{
	/** @type {BackResponse}*/
	let	res;
	let	backendBoard;

	currEvent = {type: "init", from: "", to: "", counter: 0};
	//@ts-ignore
	res = await curlSender("init", history.seed);
	updateBoard(match.board, res);
	backendBoard = await getBackBoard();
	if (cmpBoard(match.board, backendBoard) == false)
		return (curlFail());
	for (const event of history.events)
	{
		if (event.from && event.to)
			render(match, [event.from, event.to], "", true);
		else
			render(match, [], "", true);
		console.log(event);
		currEvent = event;
		res = await curlSender(event.type, event.from, event.to);
		updateBoard(match.board, res);
		backendBoard = await getBackBoard();
		if (cmpBoard(match.board, backendBoard) == false)
			return (curlFail());
	}
	render(match, [], "", true);
	currEvent = {type: "lastCheck"};
	if (cmpBoard(match.board, backendBoard) == false)
		return (curlFail());
	return (true);
}

//SECTION - tester utils


function success()
{
	console.debug(`${currMatch}: ${MSG.RESULT_OK}`);
}

/**
 * called when this tester fails
 * @param {string} msg 
 * @param {string} p1 
 * @param {string} p2 
 */
function testerFail(msg, p1="", p2="")
{
	console.debug(`${MSG.RESULT_ERROR}: riprova, ogni tanto si impalla`);
	//@ts-ignore
	console.debug(`${jsonStr(p1)} => `);
	process.exit();
	//fail(msg, p1, p2);
}

/**
 * called when some test fails
 * @param {string} msg 
 * @param {string} p1 
 * @param {string} p2 
 */
function gameFail(msg, p1="", p2="")
{
	errorFlag = 1;
	console.debug(`${currMatch}: ${MSG.RESULT_FAIL}`);
	fail(msg, p1, p2);
}

function curlFail()
{
	errorFlag = 1;
	console.debug(`${currMatch}: ${MSG.RESULT_FAIL}`);
	console.debug(`currEvent: \n${jsonStr(currEvent)}`);
	console.debug(`square: ${currSquare}: ${msgErr}`);
	console.debug(`frontend, piece ${fPiece}: ${jsonStr(fData)}`);
	console.debug(`backend, piece ${bPiece}: ${jsonStr(BData)}`);
	return (false);
}

/**
 * 
 * @param {string} msg 
 * @param {string} p1 
 * @param {string} p2 
 */
function fail(msg, p1, p2)
{
	if (p1)
		msg = msg.replace("$1", p1);
	if (p2)
		msg = msg.replace("$2", p2);
	console.debug(msg);
}

/**
 * 
 * @param {string} correct 
 * @param {string} wrong 
 */
function highLightBoardDiff(correct, wrong)
{
	let	diffIndex;

	diffIndex = 0;
	while (diffIndex < correct.length)
	{
		if (correct.at(diffIndex) != wrong.at(diffIndex))
			break ;
		++diffIndex;
	}
	correct = putColor(correct, diffIndex, color.green);
	wrong = putColor(wrong, diffIndex, color.red);
	return ({correct: correct, wrong: wrong});
}

/**
 * 
 * @param {string} str 
 * @param {number} i 
 * @param {string} col
 * @returns 
 */
function putColor(str, i, col)
{
	return (str.slice(0, i) + `${col}${str.at(i)}${color.reset}` + str.slice(i + 1, str.length)); 
}

/**
 * 
 * @param {number} milliseconds 
 */
async function msleep(milliseconds)
{
	return (new Promise(func => {setTimeout(func, milliseconds)}));
}

/**
 * 
 * @param {string} type 
 * @param {string | number} from 
 * @param {string | number} to 
 * @return {Promise<BackResponse>}
 */
async function curlSender(type, from="", to="")
{
	let	cmd;
	let	resp;

	await msleep(curlWaitTimeMs);
	cmd = curlCmd;
	cmd = cmd.replace("$type", type);
	cmd = cmd.replace("$from", from.toString());
	cmd = cmd.replace("$to", to.toString());
	resp = execSync(cmd).toString();
	//@ts-ignore
	return (jsonParser(resp));
}

/**
 * 
 * @param {ChessBoard} board 
 * @param {BackResponse} updates 
 */
function updateBoard(board, updates)
{
	if (!updates || !updates.board)
		return ;
	for (const [key, square] of updates.board)
	{
		board.set(key, square);
	}
}

async function getBackBoard()
{
	return (await curlSender("reload"));
}

/**
 * 
 * @param {ChessBoard} board 
 * @param {BackResponse} other 
 */
function cmpBoard(board, other)
{
	let	Fsquare;

	for (const [key, Bsquare] of other.board)
	{
		currSquare = key;
		Fsquare = board.get(key);//@ts-ignore
		fPiece = Fsquare.piece?.type; //@ts-ignore
		bPiece = Bsquare.piece?.type; 
		if (!cmp(Fsquare.targetZones, Bsquare.targetZones, MSG.BOARD_TARGET))
			return (false);
		if (!cmp(Fsquare.boostedTargetZones, Bsquare.boostedTargetZones, MSG.BOARD_BOOST, true))
			return (false);
		if (Fsquare.piece && !Bsquare.piece)
			return (setError(MSG.PIECE, Fsquare.piece, Bsquare.piece));
		if (!Fsquare.piece && Bsquare.piece)
			return (setError(MSG.PIECE, Fsquare.piece, Bsquare.piece));
		if (!Fsquare.piece || !Bsquare.piece)
			continue ;
		if (Fsquare.piece.type != Bsquare.piece.type)
			return (setError(MSG.PIECE_TYPE, Fsquare.piece, Bsquare.piece));
		if (Fsquare.piece.team != Bsquare.piece.team)
			return (setError(MSG.PIECE_TEAM, Fsquare.piece, Bsquare.piece));
		if (Fsquare.piece.pos != Bsquare.piece.pos)
			return (setError(MSG.PIECE_POS, Fsquare.piece, Bsquare.piece));
		if (Fsquare.piece.isBoostedBool != Bsquare.piece.isBoostedBool)
			return (setError(MSG.PIECE_BOOST, Fsquare.piece, Bsquare.piece));	
	}
	return (true);
}

/**
 * 
 * @param {Set<*> | Map<*, *>} fData
 * @param {Set<*> | Map<*, *>} bData 
 * @param {string} errMsg
 * @param {boolean | null} recBool
 */
function cmp(fData, bData, errMsg, recBool=false)
{
	let	s1;
	let	s2;

	//@ts-ignore
	s1 = fData.size != undefined ? fData.size: fData.length;
	//@ts-ignore
	s2 = bData.size != undefined ? bData.size: bData.length;
	if (s1 != s2)
		return (setError(errMsg, fData, bData));
	if (recBool)
	{
		for (const [key, boostVal] of bData)
		{//@ts-ignore
			if (cmp(fData.get(key), boostVal, errMsg) == false)
				return (setError(errMsg, fData, bData));
			return (true);
		}
	}
	for (const val of fData)
	{
		if (bData.has(val) == false)
			return (setError(errMsg, fData, bData));
	}
	return (true);
}

/**
 * 
 * @param {object} data 
 */
function jsonStr(data)
{
	return (JSON.stringify(jsonParser(data), null, 2));
}

/**
 * 
 * @param {string} msg 
 * @param {*} frontData 
 * @param {*} backData 
 */
function setError(msg, frontData=null, backData=null)
{
	msgErr =  msg;
	fData = frontData;
	fData = backData;
	return (false);
}
