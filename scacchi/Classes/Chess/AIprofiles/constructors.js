//@ts-check

import fs from "fs";
import { AIprofiles, AIprofilesArray } from "../../../Macro/enums.js";
import { AI_first_eval } from "./First/eval.js";
import { AI_gmu_eval } from "./gmu/eval.js";
import { AI_PROFILE_PATH } from "../../../Macro/macro.js";
import { globals } from "../../Globals/globals.js";

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
			// ai.memory = globals.AITraining.get(AIprofiles.FIRST_AI);
			ai.Eval = AI_first_eval;
			ai.difficulty = "easy";
			ai.depth = 2;
			break ;
		case (AIprofiles.GMU):
			ai.memory = globals.AITraining.get(AIprofiles.GMU);
			ai.Eval = AI_gmu_eval; // TODO - da scrivere/fixare altre eval functions
			ai.difficulty = "hard";
			ai.depth = 3;
			break ;
		case (AIprofiles.HAL9000):
			ai.memory = globals.AITraining.get(AIprofiles.HAL9000);
			ai.Eval = AI_first_eval; // TODO - da scrivere/fixare altre eval functions
			ai.difficulty = "medium";
			ai.depth = 2;
			break ;
		case (AIprofiles.AM):
			ai.memory = globals.AITraining.get(AIprofiles.AM);
			ai.Eval = AI_first_eval; // TODO - da scrivere/fixare altre eval functions
			ai.difficulty = "easy";
			ai.depth = 1;
			break ;
		case (AIprofiles.GRIEVOUS):
			ai.memory = globals.AITraining.get(AIprofiles.GRIEVOUS);
			ai.Eval = AI_first_eval; // TODO - da scrivere/fixare altre eval functions
			ai.difficulty = "easy";
			ai.depth = 1;
			break ;
		case (AIprofiles.DEBUG):
			ai.Eval = () => {return (0);};
			break ;
		default :
			throw (`AI profile ${ai.profile} not recognized.`);
	}
	setSpeechFile(ai);
}

//SECTION - utils

/**
 * 
 * @param {AI} ai 
 */
function setSpeechFile(ai)
{
	let	path;
	let	buffer;
	let	data;

	path = `${AI_PROFILE_PATH}/${ai.profile}/speech.json`;
	if (fs.existsSync(path) == false)
	{
		console.warn(`AI ${ai.profile} has no speech file`);
		return ;
	}
	buffer = fs.readFileSync(path, "utf-8");
	data = JSON.parse(buffer);
	ai.speechJSON = data;
}

export {AIProfileCheck, AIProfileConstructor};