//@ts-check

import { getLegalMoves } from "../../GameLogic/checkLegalMoves.js";
import { checkMateCheckAll } from "../../GameLogic/checkMate.js";
import { AIprofilesArray, eTeam } from "../../Macro/enums.js";
import { render } from "../../test/render.js";
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
	let	ai;

	ai = match.currentPlayer.ai;
	if (!ai)
		throw (`getBestTurn: you are not a machine!`);
	console.log("Calculating best move...");
	arrayTurns = getLegalMoves(match);
	for (let i = 0; i != arrayTurns.length; i++)
	{
		console.log(`Turns: ${i}/${arrayTurns.length}`);
		const turn = arrayTurns[i];
		if (!execTurn(match, turn))
			continue ;
		// render(match);
		newTurns = getLegalMoves(match);
		val.score = minMax(match, ai, newTurns, 2, [turn]);
		val.score = Math.abs(val.score);
		val.index = i;
		cancelTurn(match, turn);
		// render(match);
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
	console.log(`Turns: ${arrayTurns.length}/${arrayTurns.length}`);
	bestTurnIdx = bestTurns[Math.floor(Math.random() * 100000) % bestTurns.length].index;
	console.log(bestTurnIdx);
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
{//@ts-ignore
	let	newTurns;
	let val;

	// console.log(depth);
	if ((depth <= 0) || checkMateCheckAll(match, null))
		return (evalScore(match, ai, pastTurns));
	if (match.currentPlayer.team == eTeam.White)
	{
		let maxEval = -Infinity;
		for (const turn of arrayTurns)
		{
			if (execTurn(match, turn) == false)
				continue ;
			// render(match);
			if (depth != 1)
				newTurns = getLegalMoves(match);
			// else
			// 	console.log(arrayTurns.length);
			pastTurns.push(turn);
			ai.Simulate(match, ai);//@ts-ignore
			val = minMax(match, ai, newTurns, depth - 1, pastTurns);
			ai.Cancel(match, ai);
			pastTurns.pop();
			maxEval = Math.max(val, maxEval);
			cancelTurn(match, turn);
			// render(match);
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
			// render(match);
			if (depth != 1)
				newTurns = getLegalMoves(match);
			// else
			// 	console.log(arrayTurns.length);
			pastTurns.push(turn);
			ai.Simulate(match, ai);//@ts-ignore
			val = minMax(match, ai, newTurns, depth - 1, pastTurns);
			ai.Cancel(match, ai);
			pastTurns.pop();
			minEval = Math.min(val, minEval);
			cancelTurn(match, turn);
			// render(match);
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
	let	score;

	if (checkKingDanger(match))
		return (-Infinity);
	else if (checkKingDanger(match, match.currentPlayer.next))
		return (+Infinity);
	score = ai.Eval(match, ai, turns);
	if (match.currentPlayer.team == eTeam.Black)
		score = -score;
	return (score);
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