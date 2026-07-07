//@ts-check

import {paramCheck} from "./utils.js";
import {transfiguration} from "../../GameLogic/moveLogic.js";
import { Match } from "../../Classes/Chess/match.js";
import { Result } from "../../Classes/endPoint/result.js";

/**
 * 
 * @param {Match} match 
 * @param {string} from 
 * @param {string} to 
 */
function makeTransfiguration(match, from, to)
{
	let	result;

	result = new Result();
	if (!paramCheck(result, from, to))
		return (result);
	return (transfiguration(match, result, from, to));
}

export {makeTransfiguration};