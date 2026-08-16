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

/**
 * select a random index from a pair of number, basing on their highness.
 * @param {number} x first number
 * @param {number} y second number
 * @returns {0 | 1} zero 
 */
function rngProportional(x, y)
{
	let	n;

	if (x == y)
		return (0);
	else if (y < 0 && x > 0)
		return (0);
	else if (x < 0 && y > 0)
		return (1);
	x = Math.abs(x);
	y = Math.abs(y);
	n = rng(y);
	return (n <= x? 0 : 1);
}

export {initRng, rng};