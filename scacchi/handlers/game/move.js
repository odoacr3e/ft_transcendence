// @ts-check
import {MOVEMENT_MIN} from "../../Macro/macro.js";
import { Chess } from "../../lib/lib.js";
const {Square} = Chess;
import {Match} from "../../Classes/Chess/match.js";
import {paramCheck, Result, clientBoard} from "./utils.js";
import {endTurn} from "./endTurn.js";
import {checkMateCheckAll} from "../../GameLogic/checkMate.js";
import {updateChessboard} from "../../GameLogic/moveLogic.js";
import {enumNames} from "../../Macro/enums.js";
import { checkMove, checkSecondMove } from "../../GameLogic/checkMove.js";

/** @typedef {import('../../Classes/Chess/chessBoard.js').Square} Square */

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
	if (match.board.get(from).piece?.type != enumNames.BASTARDS && match.board.get(from).piece == null)
		++match.spareCountDown;
	else
		match.spareCountDown = 0;
	if (!updateChessboard([from, to], result, match, boostBool))
		return (result);
	result.status = 200;
	checkMateCheckAll(match, result);
	// @ts-ignore
	result.board = clientBoard(match);
	secondMoveBool = checkSecondMove(match, to);
	if ((match.moves >= MOVEMENT_MIN && !match.currentPlayer.nPoints) && !(secondMoveBool && boostBool) && 
	!(match.cursor.EdgeCheck(match.currentPlayer.team) && match.board.get(match.cursor.square)?.piece?.type == enumNames.BASTARDS))
		endTurn(match, false);
	return (result);
}

export {move};