//@ts-check

const {paramCheck} = require("./utils");
const {transfiguration} = require("../../GameLogic/moveLogic");
const { Match } = require("../../Classes/Vault/match");
const { Result } = require("../../Classes/endPoint/result");

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

module.exports = {makeTransfiguration};