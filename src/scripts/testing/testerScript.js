//@ts-check
import fs from 'fs';
import {colors, testerEnum} from "./enumsTest.js";
import * as fendLogic from "./Archi.js";
import * as fendVars from "./Variables.js";
import * as fendReq from "./BackLinkCopy.js";

// const HISTORY_PATH = "../../../../backend/history/";
const HISTORY_PATH = "../backend/history/";
/** @typedef {import ("../../../../backend/history/HISTORY.json")} historyData */
/** @typedef {import ("../../../../backend/scacchi/Classes/Match/match.js").HistoryEvent} Event */
/** @typedef {import ("../../../../backend/scacchi/Classes/ChessBoard/chessBoard.js")} Board */
/** @typedef {import("./templateResponse.json")} BResp*/
const MSG = testerEnum;

let	currMatch = "";

//SECTION - exec test
//1)prende dati da file history
//2)inizializza partita
//3)check su prima scacchiera
//4)per ogni evento, si itera run_move. Se torna errore, vaffanculo
//5)OK!

	//SECTION - run move
	/**
	 * 
	 * prende richiesta
	 * la manda backend
	 * prende risposta
	 * aggiorna scacchiera frontend
	 * compareFrontendBackend()
	 * if true
	 * 		torna true =>
	 *		 		{status: true}	
	 * else
	 * 		torna false =>
	 * 			{
	 * 			mappa di errori
	 * 			status: false
	 * 			msg: 			
	 * 	}
	 */
	
	//SECTION - compareBackendFrontend
	/**
 * richiesta reload 
 * SI riparsa board backend
 * si confronta i seguenti parametri:
 * 
	*/
	//SECTION - Square del front
		/**
		*	class Square {
		*	constructor(id, piece, targetZones = [], boostedTargetZones = {}) {
		*		this.id = id;
		*		this.piece = piece;
		*		this.targetZones = new Set(targetZones);
		*		this.boostedTargetZones = new Map(boostedTargetZones);
		*	}
		*}
		*/
	//SECTION - Piece del front 
		/**
		*   "a7": {
		*	"piece": {
		* 	"type": "Bastards",
		* 	"price": 1,
		* 	"team": "black",
		* 	"isMovedBool": false,
		* 	"isBoostedBool": false,
		* 	"pos": "a7"
		* },
		*/
	
async function testerMain()
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
	await execTest(matchPath);
	process.exit();
}

testerMain();


async function execAllTests()
{
	for (const file of fs.readdirSync(HISTORY_PATH))
	{
		currMatch = file;
		await execTest(`${HISTORY_PATH}${file}`);
	}
	process.exit();
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


	history = JSON.parse(fs.readFileSync(matchPath, 'utf-8'));
	if (history.seed == undefined || history.victory == undefined)
		return (testerFail(MSG.INVALID_JSON));
	try
	{
		//exec-test
		if (await exec_test(history) == false)
			formatError("13");
	}
	catch(err)
	{
		if (typeof(err) == "string")
			gameFail(err);
		else
			testerFail(MSG.INVALID_MSG);
		return ;
	}
	// board = boardStringify(match);
	// if (history.finalBoard != board)
	// {
	// 	boards = highLightBoardDiff(history.finalBoard, board);
	// 	return (gameFail(MSG.BOARD, boards.correct, boards.wrong));
	// }
	// else if (history.victory && !match.victory)
	// 	return (gameFail(MSG.WIN_MISS, history.victory));
	// else if (!history.victory && match.victory)
	// 	return (gameFail(MSG.WIN_WRONG));
	// else if (history.victory != match.victory)
	// 	return (gameFail(MSG.WIN_PLAYER), match.victory);
	success();
}


//SECTION - exec test
//✅)prende dati da file history
//✅)inizializza partita
//3)check su prima scacchiera
//4)per ogni evento, si itera run_move. Se torna errore, vaffanculo
//5)OK!
/**
 * 
 * @param {historyData} history 
 */
async function exec_test(history)
{
	let	frontMatch;
	let	result;

	frontMatch = await fendLogic.initLocalMatchState(history.seed); // -->inizializza localBoard ossia la mappa della scacchiera del front
	result = await compareBackFront();
	if (result.status == false)
		return (false);
	for (const event of history.events)
	{
		await fendReq.requestToBack(event.from, event.to, event.type);
		result = await compareBackFront();
		if (result.status == false)
			return (false);
	}
	return (true);

}


//SECTION - compareBackendFrontend
//SECTION - Square del front
		/**
		*	class Square {
			*	constructor(id, piece, targetZones = [], boostedTargetZones = {}) {
				*		this.id = id;
		*		this.piece = piece;
		*		this.targetZones = new Set(targetZones);
		*		this.boostedTargetZones = new Map(boostedTargetZones);
		*	}
		*}
		*/
	//SECTION - Piece del front 
	/**
	 *   "a7": {
	*	"piece": {
		* 	"type": "Bastards",
		* 	"price": 1,
		* 	"team": "black",
		* 	"isMovedBool": false,
		* 	"isBoostedBool": false,
		* 	"pos": "a7"
		* },
		*/
		/**
		 * richiesta reload 
		 * SI riparsa board backend
		 * si confronta i seguenti parametri:
		 * 
*/
async function compareBackFront()
{
	/** @type {BResp} */let	bResp;
	/** @type {Map<string, fendVars.Square>}  */let	bBoard;
	/** @type {Map<string, fendVars.Square>}  */let	fBoard;
	/** @type {fendVars.Square} 	*/let	fSquare;

	bResp = await fendReq.requestToBack("", "", "reload");
	bBoard = bResp.board;
	fBoard = fendVars.localBoard;
	if (!bBoard)
		return (formatError("2"));
	for (const [key, square] of bBoard)
	{
		//@ts-ignore
		fSquare = fBoard.get(key);
		if (square.id != fSquare.id)
			return (formatError("3"));
		if (square.piece && !fSquare.piece)
			return (formatError("4"));
		if (!square.piece && fSquare.piece)
			return (formatError("5"));
		if (square.targetZones.size != fSquare.targetZones.size)
			return (formatError("6"));
		square.targetZones.forEach((key) => {
			if (!fSquare.targetZones || !fSquare.targetZones.has(key))
				return (formatError("7"));
		})
		if (square.boostedTargetZones.size != fSquare.boostedTargetZones.size)
			return (formatError("8"));
		square.boostedTargetZones.forEach((key, set) => {
			//@ts-ignore
			set.forEach(value => {
				if (!fSquare.boostedTargetZones.get(key).has(value))
					return (formatError("puttana troia"));
			});
		})
	}
	return ({status: true, msg: "top"});
}


function success()
{
	console.debug(`${currMatch}: ${MSG.RESULT_OK}`);
}


function formatError(debug="")
{
	console.debug(debug);
	return ({msg: "oh no nigerudayo smokey", status: false});
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