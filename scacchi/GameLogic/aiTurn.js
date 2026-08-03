//@ts-check

import { getBestTurn } from "../Classes/Chess/AI.js";
import { Result } from "../Classes/endPoint/result.js";
import { boost } from "../handlers/game/boost.js";
import { endTurn } from "../handlers/game/endTurn.js";
import { move } from "../handlers/game/move.js";
import { makeTransfiguration } from "../handlers/game/transfiguration.js";
import { eEvents } from "../Macro/enums.js";
import { render } from "../test/render.js";
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

	if (!match.currentPlayer.ai)
		throw (`AIexecuteTurn: there is no AI`);
	match.aiSimulation = true;
	turn = getBestTurn(match);
	match.aiSimulation = false;
	team = match.currentPlayer.team;
	if (turn.move)
	{
		result = move(match, turn.move.from, turn.move.to, false);
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
		result = makeTransfiguration(match, turn.moveBoost? turn.moveBoost.to : turn.move?.to, turn.transform, false);
		sendResult(match, result, eEvents.Transform);
	}
	if (team == match.currentPlayer.team)
	{
		result = endTurn(match, false);
		sendResult(match, result, eEvents.EndTurn);
	}
	render(match);
	// console.profileEnd();
	// console.log(`Killo processo.`);
	// console.log(`Time: ${console.timeEnd()}`);
	// process.exit(0);
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