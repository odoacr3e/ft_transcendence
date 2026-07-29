//@ts-check

import { getBestTurn } from "../Classes/Chess/AI.js";
import { Result } from "../Classes/endPoint/result.js";
import { boost } from "../handlers/game/boost.js";
import { endTurn } from "../handlers/game/endTurn.js";
import { move } from "../handlers/game/move.js";
import { makeTransfiguration } from "../handlers/game/transfiguration.js";
import { eEvents } from "../Macro/enums.js";
import { roomMessage } from "../websocket/utils.js";

/** @typedef {import("../Classes/Chess/match").Match} Match */

/**
 * 
 * @param {Match} match 
 */
export function AIexecuteTurn(match)
{
	let	result;
	let	turn;
	let	team;

	turn = getBestTurn(match);
	team = match.currentPlayer.team;
	if (turn.move)
	{
		result = move(match, turn.move.from, turn.move.to);
		sendResult(match, result, eEvents.Move);
	}
	if (turn.moveBoost)
	{
		result = move(match, turn.moveBoost.from, turn.moveBoost.to, true);
		sendResult(match, result, eEvents.MoveBoost);

	}
	if (turn.boost)
	{
		result = boost(match, turn.boost);
		sendResult(match, result, eEvents.Boost);

	}
	else if (turn.transform)
	{//@ts-ignore
		result = makeTransfiguration(match, turn.moveBoost? turn.moveBoost.to : turn.move?.to, turn.transform);
		sendResult(match, result, eEvents.Transform);

	}
	if (team == match.currentPlayer.team)
	{
		result = endTurn(match, true);
		sendResult(match, result, eEvents.EndTurn);
	}
}

/**
 * 
 * @param {Match} match 
 * @param {Result} result 
 * @param {string} type
 */
function sendResult(match, result, type)
{
	if (result.status != 200)
		throw (`AIExecuteTurn: ${type} failed.`);
	roomMessage(`Match_${match.id}`, "game", result);
}