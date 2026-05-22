// @ts-check
const {Piece, copyBoard} = require("../../lib/lib.js").Chess;
const {initBoard} = require("../../Classes/ChessBoard/chessBoard.js");
const {eTeam, enumNames, enumInitNames} = require("../../lib/lib.js").Enums;
const {dangerUpdateAll} =	require("../../utils/moveUtils.js");
const {Match} = require("../../Classes/Match/match.js");
const {clientBoard, Result} = require("./utils.js");
const {initRng} = require("../../utils/random.js");
const { Cursor } = require("../../Classes/Match/cursor.js");

/**
 * The Map board is added to result to be sent to the client. Steps:
 * 1) the property board is added to the result object
 * 2) JSON does not support Map. So we convert the Map board to an Object
 * @param {Match} match
 * @param {number | null} seed seed to start
 * @param {string | null} boardString seed to start
 * @returns 
 */
function init(match, seed=null, boardString=null)
{
	let	result;
	let	rng;

	if (boardString && boardString.indexOf("|") == -1)
		boardString = null;
	if (seed == null)
		seed = Math.floor(Math.random() * (1 << 30));
	result = new Result();
	rng = initRng(seed);
	match.board = initBoard();
	if (boardString != null)
		initSavedBoard(match, boardString);
	else if (seed == 0)
		initClassicBoard(match);
	else
		initRandomBoard(match, rng);
	// @ts-ignore
	result.status = 200;
	// @ts-ignore
	result.board = clientBoard(match.board);
	return (result);
}

/**
 * 
 * @param {Match} match 
 * @param {string} boardStr 
 */
function initSavedBoard(match, boardStr)
{
	let	rows;
	let	i;
	let	indexSep;//|C|B... |= sep >> indexSep = 2
	let	curr;

	match.cursor.Save();
	rows = boardStr.split("\n");
	rows.pop();
	match.cursor.set(`a${rows.length}`);
	i = 0;
	do
	{
		match.cursor.setCol(1);
		do
		{// |C|B|...
			if (rows[i]?.at(0) == "|") // @ts-ignore
				rows[i] = rows[i]?.slice(1);// C|B|...
			indexSep = rows[i]?.indexOf("|");
			if (indexSep != undefined && indexSep != -1)
			{
				curr = rows[i]?.slice(0, indexSep);// curr = C
				//@ts-ignore
				rows[i] = rows[i]?.slice(indexSep + 1);// next = B|...
				console.log(curr, match.cursor.square);
				assignPieceByType(match, curr);
			}
		}
		while (match.cursor.moveCol(1))
		++i;
	}
	while (match.cursor.moveRow(-1))
	dangerUpdateAll(match);
	match.cursor.Restore();
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
			data.piece = new Piece(enumNames.BASTARDS, key);
		else if (row == 1 || row == 8)
		{
			switch (col) 
			{
				case 1: case 8:
					data.piece = new Piece(enumNames.MINOTAURUS, key);
					break;
				case 2: case 7:
					data.piece = new Piece(enumNames.JESTER, key);
					break ;
				case 3: case 6:
					data.piece = new Piece(enumNames.VALKIRYA, key);
					break ;
				case 4:
					data.piece = new Piece(enumNames.CHAMPION, key);
					break ;
				case 5:
					data.piece = new Piece(enumNames.KING, key);
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
	match.black.King = "e8";
	match.white.King = "e1";
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
			data.piece = new Piece(enumNames.KING, key);
			data.piece.team = eTeam.Black;
			match.black.King = key;
			continue ;
		}
		else if (key == "h8" && match.white)
		{
			data.piece = new Piece(enumNames.KING, key);
			data.piece.team = eTeam.White;
			match.white.King = key;
			continue ;
		}
		else if (rand <= 10)
			continue ;
		else if (rand == 11)
			data.piece = new Piece(enumNames.BASTARDS, key);
		else if (rand == 12)
		{
			data.piece = new Piece(enumNames.CHAMPION, key);
		}
		else if (rand == 13)
		{
			data.piece = new Piece(enumNames.JESTER, key);
		}
		else if (rand == 14)
		{
			data.piece = new Piece(enumNames.MINOTAURUS, key);
		}
		else
		{
			data.piece = new Piece(enumNames.VALKIRYA, key);
		}
		data.piece.team = match.currentPlayer.team;
		match.endTurn();
	}
	match.forceWhiteTurn();
	dangerUpdateAll(match);
}

//SECTION - utils

/**
 * 
 * @param {Match} match 
 * @param {string} curr 
 */
function assignPieceByType(match, curr)
{
	let	pos;
	let	team;
	let	square;

	if (!curr || curr == " ")
		return ;
	pos = match.cursor.square;
	team = getTeamByCoord(match);
	square = match.board.get(pos);
	if (!square)
		throw ("init: invalid coord");
	if (curr.at(0) == "+")
		curr = curr.slice(1);
	switch (curr)
	{
		case (enumInitNames.BASTARDS) :
			square.piece = new Piece(enumNames.BASTARDS, pos, team);
			break ;
		case (enumInitNames.CHAMPION) :
			square.piece = new Piece(enumNames.CHAMPION, pos, team);
			break ;
		case (enumInitNames.GHOUL) :
			square.piece = new Piece(enumNames.GHOUL, pos, team);
			break ;
		case (enumInitNames.JESTER) :
			square.piece = new Piece(enumNames.JESTER, pos, team);
			break ;
		case (enumInitNames.KING) :
			square.piece = new Piece(enumNames.KING, pos, team);
			break ;
		case (enumInitNames.MAGE) :
			square.piece = new Piece(enumNames.MAGE, pos, team);
			break ;
		case (enumInitNames.MINOTAURUS) :
			square.piece = new Piece(enumNames.MINOTAURUS, pos, team);
			break ;
		case (enumInitNames.VALKIRYA) :
			square.piece = new Piece(enumNames.VALKIRYA, pos, team);
			break ;
		default:
			throw ("init: unrecognized piece");
	}
}

/**
 * 
 * @param {Match} match
 */
function getTeamByCoord(match)
{
	let	upper;
	let	left;
	let	right;

	upper = (match.sizeBoard.h / 2);
	left = (match.sizeBoard.w / 4);
	right = match.sizeBoard.w - left;
	if (match.playerNum == 2)
	{
		if (match.cursor.getRow() <= upper)
			return (eTeam.Black);
		return (eTeam.White);
	}
	if (match.playerNum == 4)
	{
		if (match.cursor.getCol() <= left)
			return (eTeam.Blue);
		else if (match.cursor.getCol() > right)
			return (eTeam.Green);
		else if (match.cursor.getRow() <= upper)
			return (eTeam.Yellow);
		else
			return (eTeam.Red);
	}
	else
		throw (`init: invalid number of player: ${match.playerNum}`);
}

module.exports = {init};