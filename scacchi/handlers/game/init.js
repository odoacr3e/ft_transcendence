// @ts-check
const lib = require("../../lib.js");
const {Piece, board, Square, cursor} = require("../../lib.js").Chess;
const {eTeam} = require("../../lib.js").Enums;
const {SEED} = require("../../lib.js").Macro;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {render} = require("../../render.js");
const {match} = require("../../match.js");
const {error, paramCheck, Result} = require("./utils.js");
const {initRng} = require("../../utils/random");

/**
 * 
 * @param {Number} seed seed to start 
 * @returns 
 */
function init(seed=SEED)
{
	let	result;
	let	rng;

	if (!seed)
		seed = SEED;
	result = new Result();
	rng = initRng(seed);
	initRandomBoard(rng);
	result.status = 200;
	//FIXME - ale: fare result.board = board
	//				va mandata la board, cosi per non va
	return (result);
}

/**
 * 
 * @param {function} rng 
 */
function initRandomBoard(rng)
{
	let	rand;

	for (let [key, data] of board)
	{
		rand = rng(16);
		if (key == "a1")
		{
			data.piece = new Piece(lib.preset.King, "", key, false);
			match.black.King = key;
		}
		else if (rand <= 10)
			continue ;
		else if (rand == 11)
			data.piece = new Piece(lib.preset.Bastards, "", key, false);
		else if (rand == 12)
		{
			data.piece = new Piece(lib.preset.Champion, "", key, true);
		}
		else if (rand == 13)
		{
			data.piece = new Piece(lib.preset.Jester, "", key, false);
			data.piece.isBoostedBool = true;
		}
		else if (rand == 14)
		{
			data.piece = new Piece(lib.preset.Minotaurus, "", key, true);
		}
		else
		{
			data.piece = new Piece(lib.preset.Valkirya, "", key, true);
		}
		if (rng(2) == 1)
			data.piece.team = eTeam.White;
	}
}

module.exports = {init};