//@ts-check

import { getLegalMoves } from "../../GameLogic/checkLegalMoves.js";
import { checkMateCheckAll } from "../../GameLogic/checkMate.js";
import { eTeam } from "../../Macro/enums.js";
import { cancelTurn, execTurn } from "../../utils/AI.js";

/** @typedef {import("./match.js").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string}} Turn */


/** @template T */
export class AI
{
	/** @param {string} profile */
	constructor(profile)
	{
		this.Eval = () => {return (0)};
		this.Simulate = () => {};
		this.Cancel = () => {};
		this.profile = profile;
		/** @type {T}*/
		this.data;
	}
};

/**
 * 
 * @param {Match} match 
 * @param {AI<null>} ai 
 * @param {Array<Turn>} arrayTurns 
 * @param {number} depth 
 * @returns 
 */
function minMax(match, ai, arrayTurns, depth)
{
	let	newTurns;
	let val;

	if ((depth == 0) || checkMateCheckAll(match, null))
		return (ai.Eval());
	if (match.currentPlayer.team == eTeam.White)
	{
		let maxEval = -Infinity;
		for (const turn of arrayTurns)
		{
			if (execTurn(match, turn) == false)
				continue ;
			newTurns = getLegalMoves(match);
			val = minMax(match, ai, newTurns, --depth);
			maxEval = Math.max(val, maxEval)
			cancelTurn(match, turn);
		}
		return (maxEval);
	}
	else
	{
		let minEval = +Infinity;
		for (const turn of arrayTurns)
		{
			if (execTurn(match, turn) == false)
				continue ;
			newTurns = getLegalMoves(match);
			val = minMax(match, ai, newTurns, --depth);
			minEval = Math.min(val, minEval)
			cancelTurn(match, turn);
		}
		return (minEval);
	}
}

/*
	TRADURRE

	match =>							aggiungere match riferimento
	position =>							set di mosse figlie
	static evaluation of position =>	eval
	for each child of position =>		set mosse a partire da position
*/

// function minMax(match, ai, legalMovesArray, depth, team)
// {
// }