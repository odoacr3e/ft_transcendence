// @ts-check
import {Match} from "../../Classes/Chess/match.js";
import {clientBoard, Result} from "./utils.js";
import {initRng} from "../../utils/random.js";
import { CHESSBOARD_W, CHESSBOARD_H } from "../../Macro/macro.js";
import * as creators from "../../GameLogic/createChessBoard.js";
import { MatchSettings, matchPresets } from "../../Classes/Chess/match.js";

/**
 * The Map board is added to result to be sent to the client. Steps:
 * 1) the property board is added to the result object
 * 2) JSON does not support Map. So we convert the Map board to an Object
 * @param {Match} match
 * @param {MatchSettings | number | string | null} preset other types for compatibility
 */
function init(match, preset=null)
{
	let	result;
	let	rng;
	let	seed;

	seed = null;
	if (typeof(preset) == "number")
	{
		seed = preset;
		preset = null;
	}
	else if (preset == null)
		seed = Math.floor(Math.random() * (1 << 30));
	if (preset == "")
		preset = null;
	result = new Result();
	match.Reset(preset);
	if (seed == null)
		seed = match.settings.board.seed;
	else
		match.settings.board.seed = seed;
	rng = initRng(seed);
	if (match.settings.board.start)
		creators.initSavedBoard(match);
	else if (seed == 0 || preset == null)
		creators.initClassicBoard(match);
	else
		creators.initRandomBoard(match, rng);
	result.status = 200;
	// @ts-ignore
	result.board = clientBoard(match, true);
	return (result);
}

export {init};