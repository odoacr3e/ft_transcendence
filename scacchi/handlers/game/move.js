// @ts-check
const {MOVEMENT_MIN} = require("../../Macro/macro.js");
const {Square} = require("../../lib/lib.js").Chess;
const {Match} = require("../../Classes/Match/match.js");
const {paramCheck, Result, clientBoard} = require("./utils.js");
const {endTurn} = require("./endTurn");
const {CheckMateCheck} = require("../../GameLogic/checkMate.js");
const {checkMove, updateChessboard, checkSecondMove} = require("../../GameLogic/moveLogic.js");
const {enumNames} = require("../../Macro/enums.js")

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
		return (match.CheckMate(result));
	// @ts-ignore
	result.board = clientBoard(match);
	secondMoveBool = checkSecondMove(match, to);
	if ((match.moves >= MOVEMENT_MIN && !match.currentPlayer.nPoints) && !(secondMoveBool && boostBool) && 
	!(match.cursor.EdgeCheck(match.currentPlayer.team) && match.board.get(match.cursor.square)?.piece?.type == enumNames.BASTARDS))
		endTurn(match);
	// else if (match.CheckOtherKingsDanger() == true)
	// 	endTurn(match);
	return (result);
}

module.exports = {move};