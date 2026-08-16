// @ts-check
//SECTION - external libraries
import fs from "fs";
//SECTION - backend cute stuff >3
import { globals } from "../Classes/Globals/globals.js";
import { historyRestore } from "../utils/history.js";
import {AI_PROFILE_PATH, HISTORY_DEFAULT, HISTORY_FILE, HISTORY_PATH} from "../Macro/macro.js";
import { testerEnum as MSG } from "./enumsTest.js";
import { Match } from "../Classes/Chess/match.js";
import { includesOneOf } from "../utils/string.js";
import { AI } from "../Classes/Chess/AI.js";
import { AIexecuteTurn } from "../GameLogic/aiTurn.js";
import { init } from "../handlers/game/init.js";
import { boardStringify, render } from "./render.js";
import { jsonParser } from "../utils/response.js";
import { colors } from "./colorsOld.js";
import { AIprofiles, eEvents } from "../Macro/enums.js";
import { endTurn } from "../handlers/game/endTurn.js";

const TEST_PATH = `${HISTORY_PATH}`;

//@ts-ignore
/** @typedef {import ("../../history/HISTORY.json")} historyData */

let	currMatch = "";
let	renderOutput = "";
let	currMatchData = new Match();
let	errorFlag = 0;

function testerMain()
{
	let	matchName;
	let	matchPath;

	console.debug = console.log;
	console.log = () => {};
	globals.matches.set("0", new Match());
	matchName = process.argv.at(2);
	if (!matchName)
		return (execAllTests());
	if (matchName.endsWith(".json") == false)
		matchName = matchName + ".json";
	currMatch = matchName;
	if (matchName.indexOf("..") != -1)
		return (testerFail(MSG.INVALID_DIR));
	matchPath = `${TEST_PATH}${matchName}`;
	if (!matchPath)
		return (testerFail(MSG.INVALID_PATH, matchPath));
	if (fs.existsSync(matchPath) == false)
		return (testerFail(MSG.INVALID_PATH, matchPath));
	execTest(matchPath);
	process.exit(errorFlag);
}

testerMain();


function execAllTests()
{
	for (let i = 0; i != 5; i++)
	{
		currMatch = "fresh " + i;
		execTest(null);
	}
	for (const file of fs.readdirSync(TEST_PATH))
	{
		currMatch = file;
		if (includesOneOf(file, "todo", "TODO", HISTORY_FILE, "four"))
		{
			testerTodo();
			continue ;
		}
		execTest(`${TEST_PATH}${file}`);
	}
	process.exit(errorFlag);
}

/**
 * 
 * @param {string | null} matchPath 
 * @returns 
 */
function execTest(matchPath=null)
{
	let	match;
	let	i;

	match = globals.getDebugMatch();
	if (!match)
	{
		testerFail(MSG.INVALID_MSG, "you need to set up DEBUG to true to use localTester");
		process.exit();
	}
	try
	{
		if (!matchPath)
		{
			match = new Match();
			init(match);
		}
		else
			match = loadHistory(matchPath);
		currMatchData = match;
		if (!includesOneOf(match.history.Last().type, eEvents.EndTurn, "Empty") && endTurn(match, false).status != 200)
		{
			console.debug(`${currMatch}: ${MSG.RESULT_IGNORED}`);
			return ;
		}
		match.currentPlayer.ai = new AI(AIprofiles.FIRST_AI);
		match.NextPlayer().ai = new AI(AIprofiles.FIRST_AI);
		match.aiBool = true;
		i = 0;
		while (!match.victory)
		{
			console.debug(`Executing test "${currMatch}", move ${i++}`);
			match.cursor.square = "";
			render(match, [], "", false, console.debug);
			AIexecuteTurn(match);
		}
		console.debug(`${colors.red}${match.victory} has won.${colors.reset}`);
		render(match, [], "", false, console.debug);
		console.debug("\n\n====================\n\n");
	}
	catch(err)
	{
		if (!err)
			err = "MISSING";
		else if (typeof(err) != "string")
			err = JSON.stringify(err);//@ts-ignore
		gameFail(err);
	}
}

/**
 * 
 * @param {string} matchPath 
 * @returns 
 */
function loadHistory(matchPath)
{
	let	match;

	match = new Match("1v1");
	historyRestore(match, matchPath);
	return (match);
}

/**
 * called when this tester fails
 * @param {string} msg 
 * @param {string} err
 */
function testerFail(msg="", err="")
{
	msg = `${currMatch}: ${msg? msg : MSG.RESULT_ERROR}`;
	fail(msg, err);
}

/**
 * called when a test is marked with todo
 */
function testerTodo()
{
	if (currMatch == HISTORY_FILE)
		console.debug(`${currMatch}: ${MSG.RESULT_IGNORED}`);
	else
		console.debug(`${currMatch}: ${MSG.RESULT_TODO}`);
}

/**
 * called when some test fails
 * @param {string} msg 
 */
function gameFail(msg)
{
	let	err;

	errorFlag = 1;
	err = `${currMatch}: ${MSG.RESULT_FAIL}`;
	console.debug(err);
	fail(msg, err);
}

/**
 * 
 * @param {string} msg 
 * @param {string} err 
 */
function fail(msg, err)
{
	if (typeof(err) != "string")
		err = JSON.stringify(err, null, 2);
	if (typeof(msg) != "string")
		msg = JSON.stringify(err, null, 2);
	currMatchData.timer = null;
	try
	{
		render(currMatchData, [], "", false, redirectRender);
	}
	catch(err)
	{}
	let	log = 
	{
		game: err,
		info: msg,
		render: renderOutput,
		events: JSON.stringify(currMatchData.history.events, null, 2)
	};
	console.debug(`ERROR saved in: "test/log/${currMatch}_${Date.now()}.json".\n\n\n\n`);
	if (!fs.existsSync("test/log/"))
		fs.mkdirSync("test/log/", { recursive: true });
	fs.writeFileSync(`test/log/${currMatch}_${Date.now()}.json`, JSON.stringify(log, null, 2), "utf-8");
	renderOutput = "";
}

/**
 * 
 * @param {String} str string from render function 
 */
function redirectRender(str)
{
	let	ansiIndex;
	let	ansiEndIndex;

	while ((ansiIndex = str.indexOf("\x1b[")) != -1)
	{
		ansiEndIndex = str.indexOf("m", ansiIndex);
		str = str.slice(0, ansiIndex) + str.slice(ansiEndIndex + 1);
	}
	renderOutput += `${str}\n`;
}
