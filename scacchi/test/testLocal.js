// @ts-check
//SECTION - external libraries
const fs = require("fs");
//SECTION - backend cute stuff >3
const globals = require("../Classes/Match/globals").globals;
const historyRestore = require("../utils2").historyRestore;
const {HISTORY_PATH} = require("../Macro/macro");
const color = require("../utils/colors").colors;
const MSG = require("./enumsTest").testerEnum;
const {boardStringify} = require("./render");

/** @typedef {import ("../../history/HISTORY.json")} historyData */

let	currMatch = "";

function testerMain()
{
	let	matchName;
	let	matchPath;

	console.log = () => {};
	matchName = process.argv.at(2);
	if (!matchName)
		return (execAllTests());
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
	execTest(matchPath);
	process.exit();
}

testerMain();


function execAllTests()
{
	for (const file of fs.readdirSync(HISTORY_PATH))
	{
		currMatch = file;
		execTest(`${HISTORY_PATH}${file}`);
	}
	process.exit();
}

/**
 * 
 * @param {string} matchPath 
 * @returns 
 */
function execTest(matchPath)
{
	/** @type {historyData}*/
	let	history;
	let	match;
	let	board;
	let	boards;

	match = globals.getDebugMatch();
	history = JSON.parse(fs.readFileSync(matchPath, 'utf-8'));
	if (history.seed == undefined || history.victory == undefined)
		return (testerFail(MSG.INVALID_JSON));
	try
	{
		historyRestore(match, matchPath);
		board = boardStringify(match);
	}
	catch(err)
	{
		if (typeof(err) == "string")
			gameFail(err);
		else
			testerFail(MSG.INVALID_MSG);
		return ;
	}
	board = boardStringify(match);
	if (history.finalBoard != board)
	{
		boards = highLightBoardDiff(history.finalBoard, board);
		return (gameFail(MSG.BOARD, boards.correct, boards.wrong));
	}
	else if (history.victory && !match.victory)
		return (gameFail(MSG.WIN_MISS, history.victory));
	else if (!history.victory && match.victory)
		return (gameFail(MSG.WIN_WRONG));
	else if (history.victory != match.victory)
		return (gameFail(MSG.WIN_PLAYER), match.victory);
	success();
}


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
	console.debug(`${currMatch}: ${MSG.RESULT_ERROR}`);
	fail(msg, p1, p2);
}

/**
 * called when some test fails
 * @param {string} msg 
 * @param {string} p1 
 * @param {string} p2 
 */
function gameFail(msg, p1="", p2="")
{
	console.debug(`${currMatch}: ${MSG.RESULT_FAIL}`);
	fail(msg, p1, p2);
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

module.exports = {HISTORY_PATH, MSG, color, currMatch, boardStringify, fail, gameFail, highLightBoardDiff, putColor, testerFail, success};