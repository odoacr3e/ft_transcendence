//@ts-check

import { getLegalMoves } from "../../GameLogic/checkLegalMoves.js";
import { checkMateCheckAll } from "../../GameLogic/checkMate.js";
import { AIprofilesArray, eTeam } from "../../Macro/enums.js";
import { cancelTurn, execTurn } from "../../utils/AI.js";
import { checkKingDanger } from "../../utils/checkDanger.js";
import { AIProfileConstructor } from "./AIprofiles/constructors.js";

/** @typedef {import("./match.js").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string}} Turn */
/** @typedef {{score: number, index: number}} Eval */

/** @template T */
export class AI
{
	/** @param {string | null} profile */
	constructor(profile=null)
	{
		/** @type {(match: Match, ai: AI<*>, turns: Array<Turn>) => number} */
		this.Eval = () => {return (0);};
		/** @type {(match: Match, ai: AI<*>) => void} */
		this.Simulate = () => {};
		/** @type {(match: Match, ai: AI<*>) => void} */
		this.Cancel = () => {};
		/** @type {T}*/
		this.data;
		let	i = (Math.floor(Math.random() * 10000)) % AIprofilesArray.length;
		if (!profile)
			profile = AIprofilesArray[i];
		this.profile = profile;
		console.log(`A new opponent has spawned: ${profile}... fear its power!`);
		AIProfileConstructor(this);
	}
};

// /**
//  * 
//  * @param {Array<Eval>} turns
//  */
// function sortTurns(turns)
// {
// 	let tmp;

// 	if (turns.length <= 1)
// 		return ;
// 	if (!turns.at(0) || !turns.at(1))
// 		throw (`sortTurns: error in checking for turns`);//@ts-ignore
// 	turns.sort((x, y) => {x.score - y.score});
// }

/**
 * 
 * @param {Match} match 
 */
function getBestTurn(match)
{
	let	arrayTurns;
	/** @type {Eval} */
	let	val = {};
	let newTurns;
	/** @type {Array<Eval>} */
	let bestTurns = new Array();
	let	bestTurnIdx;

	if (!match.currentPlayer.ai)
		throw (`getBestTurn: you are not a machine!`);
	arrayTurns = getLegalMoves(match);
	for (let i = 0; i != arrayTurns.length; i++)
	{
		const turn = arrayTurns[i];
		if (!execTurn(match, turn))
			continue ;
		newTurns = getLegalMoves(match);
		val.score = minMax(match, match.currentPlayer.ai, newTurns, 3, [turn]);
		val.score = Math.abs(val.score);
		val.index = i;
		cancelTurn(match, turn);
		if (bestTurns.length <= 1)
			bestTurns.push(val);
		for (let i = 0; i != bestTurns.length; i++)
		{
			const x = bestTurns[i];

			if (val.score > x.score)
			{
				bestTurns[i] = val;
				break ;
			}
		}
	}
	bestTurnIdx = bestTurns[Math.floor(Math.random() * 100000) % bestTurns.length].index; 
	return (arrayTurns[bestTurnIdx]);
}

/**
 * 
 * @param {Match} match 
 * @param {AI<null>} ai 
 * @param {Array<Turn>} arrayTurns 
 * @param {number} depth 
 * @param {Array<Turn>} pastTurns
 * @returns 
 */
function minMax(match, ai, arrayTurns, depth, pastTurns)
{
	let	newTurns;
	let val;

	if ((depth == 0) || checkMateCheckAll(match, null))
		return (evalScore(match, ai, pastTurns));
	if (match.currentPlayer.team == eTeam.White)
	{
		let maxEval = -Infinity;
		for (const turn of arrayTurns)
		{
			if (execTurn(match, turn) == false)
				continue ;
			newTurns = getLegalMoves(match);
			pastTurns.push(turn);
			ai.Simulate(match, ai);
			val = minMax(match, ai, newTurns, --depth, pastTurns);
			ai.Cancel(match, ai);
			pastTurns.pop();
			maxEval = Math.max(val, maxEval);
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
			pastTurns.push(turn);
			ai.Simulate(match, ai);
			val = minMax(match, ai, newTurns, --depth, pastTurns);
			ai.Cancel(match, ai);
			pastTurns.pop();
			minEval = Math.min(val, minEval);
			cancelTurn(match, turn);
		}
		return (minEval);
	}
}

/**
 * 
 * @param {Match} match 
 * @param {AI<null>} ai 
 * @param {Array<Turn>} turns 
 * @returns 
 */
function evalScore(match, ai, turns)
{
	if (checkKingDanger(match))
		return (-Infinity);
	else if (checkKingDanger(match, match.currentPlayer.next))
		return (+Infinity);
	return (ai.Eval(match, ai, turns));
}

// /**
//  * 
//  * @param {Match} match 
//  * @param {AI<null>} ai 
//  * @param {Array<Turn>} arrayTurns 
//  * @param {number} depth 
//  * @returns 
//  */
// function minMax(match, ai, arrayTurns, depth)
// {
// 	let	newTurns;
// 	/**  */
// 	let val;

// 	if ((depth == 0) || checkMateCheckAll(match, null))
// 		return (ai.Eval());
// 	if (match.currentPlayer.team == eTeam.White)
// 	{
// 		let maxEval = -Infinity;
// 		for (const turn of arrayTurns)
// 		{
// 			if (execTurn(match, turn) == false)
// 				continue ;
// 			newTurns = getLegalMoves(match);
// 			val = minMax(match, ai, newTurns, --depth);
// 			maxEval = Math.max(val, maxEval);
// 			cancelTurn(match, turn);
// 		}
// 		return (maxEval);
// 	}
// 	else
// 	{
// 		let minEval = +Infinity;
// 		for (const turn of arrayTurns)
// 		{
// 			if (execTurn(match, turn) == false)
// 				continue ;
// 			newTurns = getLegalMoves(match);
// 			val = minMax(match, ai, newTurns, --depth);
// 			minEval = Math.min(val, minEval);
// 			cancelTurn(match, turn);
// 		}
// 		return (minEval);
// 	}
// }

export {getBestTurn};