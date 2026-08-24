//@ts-check

import { randomInt } from "crypto";
import { getLegalMoves } from "../../GameLogic/checkLegalMoves.js";
import { checkLostAll } from "../../GameLogic/checkMate.js";
import { AIprofilesArray, eTeam, enumNames } from "../../Macro/enums.js";
import { render } from "../../test/render.js";
import { cancelTurn, execTurn } from "../../utils/AI.js";
import { checkKingDanger } from "../../utils/checkDanger.js";
import { getBestNumber } from "../../utils/math.js";
import { rngProportional } from "../../utils/random.js";
import { AIProfileConstructor } from "./AIprofiles/constructors.js";
import fs from "fs";
import { isOneOf } from "../../utils/string.js";
import { DEBUG_AI_TRAINING } from "../../Macro/macro.js";

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
		this.defeatStatus = 0;//@ts-ignore
		this.memory = null;
		console.log(`A new opponent has spawned: ${profile}... fear its power!`);
		AIProfileConstructor(this);
	}
};

//SECTION - utils

let DEB = 0;
//15832
/**
 * 
 * @param {Match} match 
 * @return {{Turn: Turn, Score: number}} match 
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
	let	depth;
	const	DEBUGTEAM = match.currentPlayer.team;

	ai = match.currentPlayer.ai;
	if (!ai)
		throw (`getBestTurn: you are not a machine!`);
	console.log("Calculating best move...");
	alpha = -Infinity;
	beta = +Infinity;
	depth = 3;
	if (DEBUG_AI_TRAINING)
		depth = 0;
	else if (isOneOf(enumNames.CHAMPION, match.GetBoostedPieceTypes()))
		depth -= 1;
	arrayTurns = getLegalMoves(match);
	for (let i = 0; i != arrayTurns.length; i++)
	{
		DEB++;
		// console.log(`Turns: ${i}/${arrayTurns.length}`);
		const turn = arrayTurns[i];
		if (turn.move?.from == "g7" && turn.move.to == "g5")
			console.log("a");
		if (match.currentPlayer.team == eTeam.White)
			alpha = getBestNumber([alpha, bestTurns[0]?.score, bestTurns[1]?.score], false);
		else if (match.currentPlayer.team == eTeam.Black)
			beta = getBestNumber([beta, bestTurns[0]?.score, bestTurns[1]?.score], true);
		if (!execTurn(match, turn))
			continue ;
		if (match.currentPlayer.team == DEBUGTEAM)
			throw (`AI: Team has NOT changed..`);
		// render(match);
		playableTurn.push(turn);
		newTurns = getLegalMoves(match);
		if (match.zobristIndex in ai.memory && (!DEBUG_AI_TRAINING ||
		rngProportional(100, 50)))
		{
			val.score = ai.memory[match.zobristIndex][0];
			debugReaction(match, ai.memory[match.zobristIndex]);
		}
		else if (match.victory)
			val.score = victoryScore(match);
		else
			val.score = minMax(match, ai, newTurns, depth, [turn], alpha, beta);
		val.index = i;
		if (match.currentPlayer.team == DEBUGTEAM)
			throw (`AI: Team has NOT changed..`);
		cancelTurn(match, turn);
		if (match.currentPlayer.team != DEBUGTEAM)
			throw (`AI: Team has changed..`);
		if (val.score == +Infinity)
		{
			if (match.currentPlayer.team == eTeam.Black)
				continue ;
			else
				return ({Turn: turn, Score: +Infinity});
		}
		else if (val.score == -Infinity)
		{
			if (match.currentPlayer.team == eTeam.White)
				continue ;
			else
				return ({Turn: turn, Score: -Infinity});
		}
		// if (match.currentPlayer.team == eTeam.Black && val.score == +Infinity)
		// 	continue ;
		// else if (match.currentPlayer.team == eTeam.White && val.score == -Infinity)
		// 	continue ;
		if (bestTurns.length <= 1)
		{
			bestTurns.push({score: val.score, index: val.index});
			continue ;
		}
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
	if (match.currentPlayer.team != DEBUGTEAM)
		throw (`AI: Team has changed..`);
	// console.log(`Turns: ${arrayTurns.length}/${arrayTurns.length}`);
	if (bestTurns.length == 0)
	{//@ts-ignore
		ai.defeatStatus = 1;
		return ({Turn: playableTurn[Math.floor(Math.random() * 100000) % playableTurn.length], Score: 0});
	}
	if (bestTurns.length == 1)
		return ({Turn: arrayTurns[bestTurns[0].index], Score: bestTurns[0].score});
	if (match.currentPlayer.team == eTeam.Black)
	{
		bestTurns[0].score = -bestTurns[0].score;
		bestTurns[1].score = -bestTurns[1].score;
	}
	if (DEBUG_AI_TRAINING)
		bestTurnIdx = bestTurns[rngProportional(bestTurns[0].score, bestTurns[1].score)];
	else
		bestTurnIdx = bestTurns[0].score > bestTurns[1].score ? bestTurns[0] : bestTurns[1];
	return ({Turn: arrayTurns[bestTurnIdx.index], Score: bestTurnIdx.score});
}


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
			// if (DEB == 11 && turn.move?.from == "d1" && turn.move?.to == "h5")
			// 	console.log();
			if (execTurn(match, turn, pastTurns) == false)
				continue ;
			if (depth != 1)
				newTurns = getLegalMoves(match);
			// else
			// 	console.log(arrayTurns.length);
			pastTurns.push(turn);
			// console.log(turn);
			ai.Simulate(match, ai);
			if (match.zobristIndex in ai.memory && (!DEBUG_AI_TRAINING ||
			rngProportional(100, 50)))
			{
				val = ai.memory[match.zobristIndex][0];
				debugReaction(match, ai.memory[match.zobristIndex]);
			}
			else if (match.victory)
				val = victoryScore(match);
			else //@ts-ignore
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
		{
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
			if (match.zobristIndex in ai.memory && (!DEBUG_AI_TRAINING ||
			rngProportional(100, 50)))
			{
				val = ai.memory[match.zobristIndex][0];
				debugReaction(match, ai.memory[match.zobristIndex]);
			}
			else if (match.victory)
				val = victoryScore(match);
			else //@ts-ignore
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

/**
 * 
 * @param {Match} match 
 */
function victoryScore(match)
{
	let tmp;

	if (match.victory == "draw")
		return (match.victory = "", 0);
	tmp = match.victory;
	match.victory = "";
	return (tmp == eTeam.White ? +Infinity : -Infinity);
}

/**
 * 
 * @param {Match} match 
 * @param {Array<Number>} data
 */
function debugReaction(match, data)
{
	console.log(`Mi ricordo.. gia vista ${data[1]} volte`);
	if (match.currentPlayer.team == eTeam.White && data[0] >= 0 || match.currentPlayer.team == eTeam.Black && data[0] < 0)
		console.log(`Roba buona, punteggio ${data[0]}`);
	else
		console.log(`Molto male, punteggio ${data[0]}`);
	render(match);
	console.log("<======================>");
	console.log("<======================>");
}

export {getBestTurn};