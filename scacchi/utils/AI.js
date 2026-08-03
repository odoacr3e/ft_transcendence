//@ts-ignore

import { cancelEvent } from "../GameLogic/cancelEvent.js";
import { move } from "../handlers/game/move.js";
import { boost } from "../handlers/game/boost.js";
import { makeTransfiguration } from "../handlers/game/transfiguration.js";
import { endTurn } from "../handlers/game/endTurn.js";
import { eEvents } from "../Macro/enums.js";
import { render } from "../test/render.js";

/** @typedef {import("../Classes/Chess/match.js").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string}} Turn */


/**
 * 
 * @param {Match} match 
 * @param {Turn} turn 
 */
export function execTurn(match, turn)
{
	/** @type {string} */	let	toCoord;
	let	team;
	let	result;
	let	oldPlayerDEBUG;

	oldPlayerDEBUG = {team: match.currentPlayer.team, boosted: match.currentPlayer.boostedPiece};
	team = match.currentPlayer.team;
	if (turn.move && move(match, turn.move.from, turn.move.to).status != 200)
		return (false);
	if (turn.moveBoost && move(match, turn.moveBoost.from, turn.moveBoost.to, true).status != 200)
	{
		if (turn.move)
			cancelEvent(match);
		return false;
	}
	if (turn.boost && (result = boost(match, turn.boost)).status != 200)
	{
		render(match);
		throw (`execTurn: boost's function has failed : ${result.msg}`); // @ts-ignore
	}
	toCoord = turn.moveBoost ? turn.moveBoost.to : turn.move?.to;
	if (turn.transform && makeTransfiguration(match, toCoord, turn.transform).status != 200)
		throw (`execTurn: transfiguration has failed`);
	if (team == match.currentPlayer.team)
		endTurn(match, false);
	return true;
}

/**
 * 
 * @param {Match} match 
 * @param {Turn} turn 
 */
export function cancelTurn(match, turn)
{
	if (match.history.Last().type != eEvents.EndTurn)
		throw ("cancelTurn: last turn is not endTurn");
	cancelEvent(match);
	while (match.history.Last().type != eEvents.EndTurn)
		cancelEvent(match);
}

