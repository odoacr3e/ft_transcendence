// @ts-check
const lib = require("../../lib/lib.js");
const {Piece, Board, copyBoard, Square, cursor} = require("../../lib/lib.js").Chess;
const {initBoard} = require("../../chessBoard.js");
const {eTeam} = require("../../lib/lib.js").Enums;
const {SEED} = require("../../lib/lib.js").Macro;
const {isDangerous, movePiece, DangerUpdate, dangerUpdateAll} =	require("../../utils.js");
const {render} = require("../../render.js");
const {Match} = require("../../match.js");
const {error, clientBoard, paramCheck, Result} = require("./utils.js");
const {initRng} = require("../../utils/random");

/**
 * The Map board is added to result to be sent to the client. Steps:
 * 1) the property board is added to the result object
 * 2) JSON does not support Map. So we convert the Map board to an Object
 * @param {Match} match
 * @param {Number | null} seed seed to start
 * @returns 
 */
function init(match, seed=null)
{
	let	result;
	let	rng;

	// match.board = initBoard();
	console.log(seed);
	if (seed == null)
		seed = Math.floor(Math.random() * (1 << 30));
	result = new Result();
	rng = initRng(seed);
	match.board = initBoard();
	if (seed != 0)
		initRandomBoard(match, rng);
	else
		initClassicBoard(match);
	result.status = 200;
	// @ts-ignore
	result.board = clientBoard(match.board);
	return (result);
}

/**
 * 
 * @param {Match} match 
 */
function initClassicBoard(match)
{
	let	row;
	let	col;
	let	color;

	color = true;
	for (let [key, data] of match.board)
	{
		data.piece = null;
		data.boostedTargetZones.clear();
		data.dangerZones.clear();
		data.targetZones.clear();
		color = !color;
		match.cursor.set(key);
		col = match.cursor.getCol()
		row = match.cursor.getRow();
		if (row == 2 || row == 7)
			data.piece = new Piece(lib.preset.Bastards, "", key, false);
		else if (row == 1 || row == 8)
		{
			switch (col) 
			{
				case 1: case 8:
					data.piece = new Piece(lib.preset.Minotaurus, "", key, true);
					break;
				case 2: case 7:
					data.piece = new Piece(lib.preset.Jester, "", key, false);
					break ;
				case 3: case 6:
					data.piece = new Piece(lib.preset.Valkirya, "", key, true);
					break ;
				case 4:
					data.piece = new Piece(lib.preset.Champion, "", key, true);
					break ;
				case 5:
					data.piece = new Piece(lib.preset.King, "", key, false);
					break;
				default :
					console.log("bischero");
			}
		}
		if (data.piece)
		{
			if (row == 1 || row == 2)
				data.piece.team = eTeam.White;
			else if (row == 7 || row == 8)
				data.piece.team = eTeam.Black;
		}
		if (color == true)
			data.color == eTeam.White;
		else
			data.color == eTeam.Black;
	}
	match.black.King = "e8"; // aggiornato posizioni re
	match.white.King = "e1"; // aggiornato posizioni re
	dangerUpdateAll(match);
}

/**
 * 
 * @param {Match} match
 * @param {function} rng 
 */
function initRandomBoard(match, rng)
{
	let	rand;

	for (let [key, data] of match.board)
	{
		rand = rng(16);
		data.boostedTargetZones.clear();
		data.dangerZones.clear();
		data.targetZones.clear();
		if (key == "a1" && match.black)
		{
			data.piece = new Piece(lib.preset.King, "", key, false);
			data.piece.team = eTeam.Black;
			match.black.King = key;
			continue ;
		}
		else if (key == "h8" && match.white)
		{
			data.piece = new Piece(lib.preset.King, "", key, false);
			data.piece.team = eTeam.White;
			match.white.King = key;
			continue ;
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
		}
		else if (rand == 14)
		{
			data.piece = new Piece(lib.preset.Minotaurus, "", key, true);
		}
		else
		{
			data.piece = new Piece(lib.preset.Valkirya, "", key, true);
		}
		data.piece.team = match.currentPlayer.team;
		match.endTurn();
	}
	match.forceWhiteTurn();
	dangerUpdateAll(match);
}

module.exports = {init};