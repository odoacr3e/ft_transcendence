// @ts-check
const {MOVEMENT_MIN} = require("../../Macro/macro.js");
const {Square} = require("../../lib/lib.js").Chess;
const {Match} = require("../../Classes/Vault/match.js");
const {paramCheck, Result, clientBoard, checkMateAlert} = require("./utils.js");
const {endTurn} = require("./endTurn");
const {CheckMateCheck} = require("../../GameLogic/checkMate.js");
const {checkMove, updateChessboard, checkSecondMove} = require("../../GameLogic/moveLogic.js");

/** @typedef {import('../../Classes/ChessBoard/chessBoard.js').Square} Square */

/**
 * 
 * @param {Match} match
 * @param {String} from the piece to move's coords
 * @param {String} to the new piece location's coords
 * @param {boolean} boostBool player wants to use a boost?
 * @returns {Result}
 */
function move(match, from, to, boostBool=false)
{
	let	result;
	let secondMoveBool = false;

	result = new Result();
	if (!paramCheck(result, from, to))
		return (result);
	if (!checkMove([from, to], result, match, boostBool))
		return (result);
	if (!updateChessboard([from, to], result, match, boostBool))
		return (result);
	result.status = 200;
	// @ts-ignore
	if (CheckMateCheck(match, match[match.currentPlayer.next].King))
		return (console.log("haaaaaiiiiii viiiiiiintoooooooooo!!!!!!!"), checkMateAlert(result, match.currentPlayer.team));
	// @ts-ignore
	result.board = clientBoard(match.board, [from, to]);
	secondMoveBool = checkSecondMove(match, to);
	if ((match.moves >= MOVEMENT_MIN && !match.currentPlayer.nPoints && match.historyCreateBool == false) && !(secondMoveBool && boostBool))
		endTurn(match);
	return (result);
}

module.exports = {move};