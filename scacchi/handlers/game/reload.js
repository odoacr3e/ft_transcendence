//@ts-check
import { enumNames } from "../../Macro/enums.js";
import { includesOneOf } from "../../utils/string.js";
import { clientBoard } from "./utils.js";

/**
 * 
 * @param {import("../../Classes/Chess/match.js").Match} match
 * @param {import("../../Classes/endPoint/result.js").Result} result
 * @param {import("../../Classes/Globals/globals.js").Socket | null} socketData
 */
export function reload(match, result, socketData)
{
	let	yourTurnBool;
	let	lastMovedPiece;

	result.Success();
	if (match.timer && match.timer.start != 0)
		match.currentPlayer.time = match.timer.time - (Date.now() - match.timer.start);
	// @ts-ignore
	result.board = clientBoard(match, true, true);
	result.team = socketData?.matchData?.team;
	if (result.team == undefined)
		result.team = "spectating";
	if (!socketData)
	{//@ts-ignore
		result.NO_SOCKET = true;
		return ;
	}
	yourTurnBool = socketData?.matchData?.team == match.currentPlayer.team; 
	if (yourTurnBool && match.moves != 0)//@ts-ignore
		result.secondMove = true;
	else//@ts-ignore
		result.secondMove = false;
	result.usedBoost = "";
	if (yourTurnBool && match.moves != 0)
	{
		lastMovedPiece = match.board._data.get(match.history.Last().to)?.piece;
		if (lastMovedPiece && lastMovedPiece.isBoostedBool == true &&
		includesOneOf(lastMovedPiece.type, enumNames.BASTARDS, enumNames.MINOTAURUS, enumNames.CHAMPION))
			result.usedBoost = match.history.Last().to;
	}
}