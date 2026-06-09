// @ts-check
import {MOVEMENT_MIN} from "../../Macro/macro.js";
import { Chess } from "../../lib/lib.js";
const {Square} = Chess;
import {Match} from "../../Classes/Match/match.js";
import {paramCheck, Result, clientBoard} from "./utils.js";
import {endTurn} from "./endTurn.js";
import {checkMateCheckAll} from "../../GameLogic/checkMate.js";
import {checkMove, updateChessboard, checkSecondMove} from "../../GameLogic/moveLogic.js";
import {enumNames} from "../../Macro/enums.js";

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
	if (checkMateCheckAll(match, result) == true)
		return (result);
	// @ts-ignore
	result.board = clientBoard(match);
	secondMoveBool = checkSecondMove(match, to);
	if ((match.moves >= MOVEMENT_MIN && !match.currentPlayer.nPoints) && !(secondMoveBool && boostBool) && 
	!(match.cursor.EdgeCheck(match.currentPlayer.team) && match.board.get(match.cursor.square)?.piece?.type == enumNames.BASTARDS))
		endTurn(match, false);
	// else if (match.CheckOtherKingsDanger() == true)
	// 	endTurn(match);
	return (result);
}

export {move};