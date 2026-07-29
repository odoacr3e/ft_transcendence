//@ts-check

import { AIprofiles, AIprofilesArray } from "../../../Macro/enums.js";
import { AI_first_eval } from "./theFirstOne/eval.js";

/** @typedef {import("../AI.js").AI<*>} AI*/

/** @param {string} profile */
function AIProfileCheck(profile)
{
	return (AIprofilesArray.indexOf(profile) != -1);
}

/**
 * 
 * @param {AI} ai 
 */
function AIProfileConstructor(ai)
{
	switch (ai.profile)
	{
		case (AIprofiles.FIRST_AI):
			ai.Eval = AI_first_eval;
			break ;
		default :
			throw (`AI profile ${ai.profile} not recognized.`);
	}
}

export {AIProfileCheck, AIProfileConstructor};