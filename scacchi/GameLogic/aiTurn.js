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

let	DEBUG_turn = {};

/**
 * 
 * @param {Match} match 
 */
export function AIexecuteTurn(match)
{
	let	result;
	let	turn;
	let	team;
	let	aiDefeatBool = false;
	let	lastEvents;

	if (!match.currentPlayer.ai)
		throw (`AIexecuteTurn: there is no AI`);
	match.aiSimulation = true;
	turn = getBestTurn(match);
	// render(match);
	DEBUG_turn = turn;
	match.aiSimulation = false;
	team = match.currentPlayer.team;
	if (match.currentPlayer.ai?.defeatStatus == 1)
	{
		console.log("AI: qua si mette male");
		aiDefeatBool = true;
		match.currentPlayer.ai.defeatStatus = 2;
	}
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
	lastEvents = match.history.LastTurn();
	for (let event of lastEvents)
		event.score = 0;
	render(match);
	if (aiDefeatBool)
	{
		result = new Result().Success(`😭Pareggiamo please senpai😭`);
		console.log(result.msg);
		roomMessage(`match_${match.id}`, "gameDraw", result);
	}
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
function sendResult(match, result, type="")
{
	if (result.status != 200)
		throw (`AIExecuteTurn: ${type} failed. Reason: "${result.msg}".Info: ${JSON.stringify(DEBUG_turn, null, 2)}`);
	roomMessage(`match_${match.id}`, "game", result, true);
}
