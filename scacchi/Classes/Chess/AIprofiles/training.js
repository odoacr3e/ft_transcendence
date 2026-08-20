//@ts-check

import { json } from "stream/consumers";
import { eTeam } from "../../../Macro/enums.js";
import { AI_PROFILE_PATH, MAX_MOVES_REWARD_AND_PENALITY } from "../../../Macro/macro.js";
import { globals } from "../../Globals/globals.js";
import fs from "fs";

/**@typedef {import("../match.js").Match} Match*/
/**@typedef {import("../../Globals/globals.js").globals} Globals */
/**@typedef {import("../match.js").MatchSettings} MatchSettings*/
/**@typedef {import("../chessBoard.js").Square} Square*/
/**@typedef {import("../Pieces/pieces.js").Piece} Piece*/
/**@typedef {import("../player.js").Player} Player*/
/**@typedef {import("../history.js").HistoryEvent} HistoryEvent*/
/**@typedef {import("../../Globals/globals.js").ZobristCache} ZobristCache*/


/**
 * 
 * @param {Match} match
 */
export function AItraining(match)
{
	let data;
	let profileW;
	let profileB;
	let events = match.history.events;
	let	dataW;
	let	dataB;

	profileW = match.white.ai?.profile;
	profileB = match.black.ai?.profile;
	if (profileW)
		dataW = globals.AITraining.get(profileW);
	if (profileB)
		dataB = globals.AITraining.get(profileB);
	for (let event of events)
	{
		let val;

		data = event.team == eTeam.Black? dataB : dataW;
		if (!data)
			continue ;
		if (data[event.zobristIndex])
		{
			val = evaluateEvent(match, event, data[event.zobristIndex][0], data[event.zobristIndex][1]);
			data[event.zobristIndex][0] = val;
			data[event.zobristIndex][1] += 1;
		}
		else
		{
			val = evaluateEvent(match, event, event.score, 1);
			data[event.zobristIndex][0] = val;
			data[event.zobristIndex][1] = 1;
		}
	}
	// if (globals.AIgameCounter % 20 != 0)
	// 	return (updateData(match));
	if (globals.AIgameCounter % 20 == 0 && dataW != undefined)
		updateTrainingData(dataW);
	if (globals.AIgameCounter % 20 == 0 && dataB != undefined)
		updateTrainingData(dataB);
	//NOTE - i file li aggiornerei quando il counter arriva a 20
	globals.AIgameCounter += 1;
	if (profileB && profileW)
		globals.AIgameCounter += 1;
	if (dataB)
		fs.writeFileSync(`${AI_PROFILE_PATH}/${profileB}/cache.json`, JSON.stringify(dataB));
	if (dataW)
		fs.writeFileSync(`${AI_PROFILE_PATH}/${profileW}/cache.json`, JSON.stringify(dataW));
}

//SECTION - utils

/**
 * 
 * @param {Match} match 
 * @param {HistoryEvent} event 
 * @param {number} oldVal 
 * @param {number} counter 
 */
function evaluateEvent(match, event, oldVal, counter)
{
	let delta;
	let val;

	delta = getDelta(match, event);
	val = oldVal - (delta - oldVal) / counter;//media incrementale: una mossa viene penalizzata meno se e' ripetuta piu' volte
	return val;
}

/**
 * 
 * @param {Match} match 
 * @param {HistoryEvent} event 
 */
function getDelta(match, event)
{
	let win = undefined;
	let delta;
	let result;

	win = match.victory == event.team ? 1 : -1;
	if (match.victory == "draw")
		return 0.1;
	if (event.team == eTeam.Black)
		win *= -1;
	//FIXME - event counter non e il contatore dell'intero turno, ma dell'evento
	//NOTE - potremmo generare in history event.turnNumber
	delta = match.moves - event.turnCounter;
	result = MAX_MOVES_REWARD_AND_PENALITY * (1 / delta == 0 ? 1 : delta);
	return result * win;
}

/**
 * 
 * @param {ZobristCache} data 
 */
function updateTrainingData(data)
{
	Object.entries(data)
	
}