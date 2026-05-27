// @ts-check
const {ChessBoard} = require("../../Classes/ChessBoard/chessBoard.js");
const {Match} = require("../../Classes/Match/match.js");
const {clientBoard, Result} = require("./utils.js");
const {initRng} = require("../../utils/random");
const { CHESSBOARD_W, CHESSBOARD_H } = require("../../Macro/macro.js");
const creators = require("../../GameLogic/createChessBoard.js");

/**
 * The Map board is added to result to be sent to the client. Steps:
 * 1) the property board is added to the result object
 * 2) JSON does not support Map. So we convert the Map board to an Object
 * @param {Match} match
 * @param {number | null} seed seed to start
 * @param {string | null} boardString seed to start
 * @returns 
 */
function init(match, seed=null, boardString=null)
{
	let	result;
	let	rng;

	if (boardString && boardString.indexOf("|") == -1)
		boardString = null;
	if (seed == null)
		seed = Math.floor(Math.random() * (1 << 30));
	result = new Result();
	rng = initRng(seed);
	match.board = new ChessBoard(CHESSBOARD_W, CHESSBOARD_H);
	if (boardString != null)
		creators.initSavedBoard(match, boardString);
	else if (seed == 0)
		creators.initClassicBoard(match);
	else
		creators.initRandomBoard(match, rng);
	// @ts-ignore
	result.status = 200;
	// @ts-ignore
	result.board = clientBoard(match, true);
	return (result);
}

module.exports = {init};