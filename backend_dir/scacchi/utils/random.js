// @ts-check

import {SEED} from "../Macro/macro.js";
import seedrandom from "seedrandom";

/**
 * @param {number | null} seed
 */
function initRng(seed=null)
{
	if (seed == null)
		seed = Math.floor(Math.random() * (1 << 30));
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

export {initRng, rng};