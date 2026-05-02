// @ts-check

const {match} = require("../../match.js");
const {error, paramCheck, Result} = require("./utils.js");

//FIXME - ale: puoi sempre cambiare turno anche se non hai mosso

/**
 * goes to the next turn
 * @returns {Result}
 */
function endTurn()
{
	let	result;

	result = new Result();
	if (!updateTurn(result))
		return (result);
	console.log(`Now it's ${match.currentPlayer.team} turn.`);
	result.status = 200;
	return (result);
}

/**
 * 
 * @param {Result} result 
 * @returns {boolean}
 */
function updateTurn(result)
{
	match.endTurn();
	return (true);
}

module.exports = {endTurn};