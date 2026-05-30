// @ts-check
//SECTION - external libraries
import fs from "fs";
//SECTION - backend cute stuff >3
import { globals } from "../Classes/Match/globals.js";
import * as TEST from "./testLocal.js";

/** @typedef {import ("../../history/HISTORY.json")} historyData */

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
	TEST.currMatch = matchName;
	if (matchName.indexOf("..") != -1)
		return (TEST.testerFail(TEST.MSG.INVALID_DIR));
	matchPath = `${TEST.HISTORY_PATH}${matchName}`;
	if (!matchPath)
		return (TEST.testerFail(TEST.MSG.INVALID_PATH, matchPath));
	if (fs.existsSync(matchPath) == false)
		return (TEST.testerFail(TEST.MSG.INVALID_PATH, matchPath));
	execTest(matchPath);
	process.exit();
}

testerMain();


function execAllTests()
{
	for (const file of fs.readdirSync(TEST.HISTORY_PATH))
	{
		TEST.currMatch = file;
		execTest(`${TEST.HISTORY_PATH}${file}`);
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
		return (TEST.testerFail(TEST.MSG.INVALID_JSON));
	try
	{
		//historyRestore(match, matchPath);
		//board = boardStringify(match);
		console.assert(true, "NON IMPLEMENTATO");
	}
	catch(err)
	{
		if (typeof(err) == "string")
			TEST.gameFail(err);
		else
			TEST.testerFail(TEST.MSG.INVALID_MSG);
		return ;
	}
	board = TEST.boardStringify(match);
	if (history.finalBoard != board)
	{
		boards = TEST.highLightBoardDiff(history.finalBoard, board);
		return (TEST.gameFail(TEST.MSG.BOARD, boards.correct, boards.wrong));
	}
	else if (history.victory && !match.victory)
		return (TEST.gameFail(TEST.MSG.WIN_MISS, history.victory));
	else if (!history.victory && match.victory)
		return (TEST.gameFail(TEST.MSG.WIN_WRONG));
	else if (history.victory != match.victory)
		return (TEST.gameFail(TEST.MSG.WIN_PLAYER), match.victory);
	TEST.success();
}