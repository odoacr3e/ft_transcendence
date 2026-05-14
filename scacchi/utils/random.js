// @ts-check

const {SEED} = require("../Macro/macro.js");

/**
 * @param {number | null} seed
 */
function initRng(seed=null)
{
	if (seed == null)
		seed = Math.floor(Math.random() * (1 << 30));
	console.log("seed:", seed);
	const	seedrandom = require("seedrandom");
	const	rngBase = seedrandom(seed.toString());
	const	rng = (mod = (1 << 30)) =>
	{
		let x;
		
		x = rngBase() * mod;
		return (Math.floor(x));
	}
	return (rng);
}

const rng = initRng(SEED);

module.exports = {initRng, rng};