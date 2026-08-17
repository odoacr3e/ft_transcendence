//@ts-check

import { getLegalMoves } from "../../GameLogic/checkLegalMoves.js";
import { checkLostAll } from "../../GameLogic/checkMate.js";
import { AIprofilesArray, eTeam } from "../../Macro/enums.js";
import { render } from "../../test/render.js";
import { cancelTurn, execTurn } from "../../utils/AI.js";
import { checkKingDanger } from "../../utils/checkDanger.js";
import { getBestNumber } from "../../utils/math.js";
import { rngProportional } from "../../utils/random.js";
import { AIProfileConstructor } from "./AIprofiles/constructors.js";

/** @typedef {import("./match.js").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string}} Turn */
/** @typedef {{score: number, index: number}} Eval */

/*

	g1: win {t1, t2, t3} => {b1, b2, b3} 
	g2: lost {t1, t2, t3} => {b1, b2, b3}

	g1-t3 =>	g1-b3 (+1)	
	g1-t2 =>	g1-b2 (+0.95)
	g1-t1 =>	g1-b1 (+0.90)

	g2-t3 =>	g2-b3 (-1)
	g2-t2 =>	g2-b2 (-0.95)
	g2-t1 =>	g2-b1 (-0.90)

	x migliori
	{
		b1: {scores: [80, -500], count: 1}
		b2: {scores: [80, -500], count: 1}
	}
*/

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
		/** @type {null | import("./AIprofiles/speech.json")} */
		this.speechJSON = null;
		this.defeatStatus = 0;
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

//SECTION - utils

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
	let playableTurn = new Array();
	let	ai;
	let	alpha;
	let	beta;

	ai = match.currentPlayer.ai;
	if (!ai)
		throw (`getBestTurn: you are not a machine!`);
	console.log("Calculating best move...");
	alpha = -Infinity;
	beta = +Infinity;
	arrayTurns = getLegalMoves(match);
	if (ai.defeatStatus != 0)
		return (arrayTurns[0]);
	for (let i = 0; i != arrayTurns.length; i++)
	{
		console.log(`Turns: ${i}/${arrayTurns.length}`);
		const turn = arrayTurns[i];
		if (turn.boost == "g8" && turn.move?.from == "b5" && turn.move.to == "c4")
			console.log("a");
		if (match.currentPlayer.team == eTeam.White)
			alpha = getBestNumber([alpha, bestTurns[0]?.score, bestTurns[1]?.score], false);
		else if (match.currentPlayer.team == eTeam.Black)
			beta = getBestNumber([beta, bestTurns[0]?.score, bestTurns[1]?.score], true);
		if (!execTurn(match, turn))
			continue ;
		render(match);
		playableTurn.push(turn);
		newTurns = getLegalMoves(match);
		val.score = minMax(match, ai, newTurns, 2, [turn], alpha, beta);
		// val.score = Math.abs(val.score);
		val.index = i;
		cancelTurn(match, turn);
		// render(match);
		if (val.score == +Infinity)
		{
			if (match.currentPlayer.team == eTeam.Black)
				continue ;
			else
				return (turn);
		}
		else if (val.score == -Infinity)
		{
			if (match.currentPlayer.team == eTeam.White)
				continue ;
			else
				return (turn);
		}
		// if (match.currentPlayer.team == eTeam.Black && val.score == +Infinity)
		// 	continue ;
		// else if (match.currentPlayer.team == eTeam.White && val.score == -Infinity)
		// 	continue ;
		if (bestTurns.length <= 1)
			bestTurns.push({score: val.score, index: val.index});
		for (let i = 0; i != bestTurns.length; i++)
		{
			const x = bestTurns[i];

			if (match.currentPlayer.team == eTeam.Black && val.score < x.score)
			{
				bestTurns[i] = {score: val.score, index: val.index};
				break ;
			}
			else if (match.currentPlayer.team != eTeam.Black && val.score > x.score)
			{
				bestTurns[i] = {score: val.score, index: val.index};
				break ;
			}
		}
	}
	console.log(`Turns: ${arrayTurns.length}/${arrayTurns.length}`);
	if (bestTurns.length == 0)
	{//@ts-ignore
		ai.defeatStatus = 1;
		return (playableTurn[Math.floor(Math.random() * 100000) % playableTurn.length]);
	}
	if (bestTurns.length == 1)
		return (arrayTurns[bestTurns[0].index]);
	if (match.currentPlayer.team == eTeam.Black)
	{
		bestTurns[0].score = -bestTurns[0].score; 
		bestTurns[1].score = -bestTurns[1].score; 
	}
	bestTurnIdx = bestTurns[rngProportional(bestTurns[0].score, bestTurns[1].score)];
	console.log(bestTurnIdx);
	return (arrayTurns[bestTurnIdx.index]);
}

let DEB = 0;
//1176
/**
 * 
 * @param {Match} match 
 * @param {AI<null>} ai 
 * @param {Array<Turn>} arrayTurns 
 * @param {number} depth 
 * @param {Array<Turn>} pastTurns
 * @param {number} alpha
 * @param {number} beta
 * @returns 
 */
function minMax(match, ai, arrayTurns, depth, pastTurns, alpha, beta)
{//@ts-ignore
	let	newTurns;
	let val;
	let	lostTeam;

	DEB++;
	if ((depth <= 0))
		return (evalScore(match, ai, pastTurns));
	lostTeam = checkLostAll(match);
	if (lostTeam)
		return (evalScore(match, ai, pastTurns, lostTeam));
	if (match.currentPlayer.team == eTeam.White)
	{
		let maxEval = -Infinity;
		let i = -1;
		for (const turn of arrayTurns)
		{
			++i;
			if (DEB == 83 && i == 82)
				console.log("BREAKPOINT");
			if (execTurn(match, turn, pastTurns) == false)
				continue ;
			if (depth != 1)
				newTurns = getLegalMoves(match);
			// else
			// 	console.log(arrayTurns.length);
			pastTurns.push(turn);
			// console.log(turn);
			ai.Simulate(match, ai);//@ts-ignore
			val = minMax(match, ai, newTurns, depth - 1, pastTurns, alpha, beta);
			ai.Cancel(match, ai);
			pastTurns.pop();
			maxEval = Math.max(val, maxEval);
			cancelTurn(match, turn);
			if (maxEval == +Infinity)
				break ;
			alpha = Math.max(maxEval, alpha);
			if (beta <= alpha)
				break ;
			// render(match);
		}
		return (maxEval);
	}
	else
	{
		let minEval = +Infinity;
		let i = -1;
		for (const turn of arrayTurns)
		{//3423
			++i;
			if (DEB == 3423 && i == 76)
				console.log("BREAKPOINT");
			if (execTurn(match, turn, pastTurns) == false)
				continue ;
			// render(match);
			if (depth != 1)
				newTurns = getLegalMoves(match);
			// else
			// 	console.log(arrayTurns.length);
			pastTurns.push(turn);
			// console.log(turn);
			ai.Simulate(match, ai);//@ts-ignore
			val = minMax(match, ai, newTurns, depth - 1, pastTurns, alpha, beta);
			ai.Cancel(match, ai);
			pastTurns.pop();
			minEval = Math.min(val, minEval);
			cancelTurn(match, turn);
			if (minEval == -Infinity)
				break ;
			beta = Math.min(minEval, beta);
			if (beta <= alpha)
				break ;
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
 * @param {string} lostTeam
 * @returns 
 */
function evalScore(match, ai, turns, lostTeam="")
{
	let	score;

	if (lostTeam == match.currentPlayer.team)
		return (match.currentPlayer.team == eTeam.Black? +Infinity : -Infinity);
	else if (lostTeam)
		return (match.currentPlayer.team == eTeam.Black? -Infinity : +Infinity);
	score = ai.Eval(match, ai, turns);
	if (match.currentPlayer.team == eTeam.Black)
		score = -score;
	return (score);
}

export {getBestTurn};