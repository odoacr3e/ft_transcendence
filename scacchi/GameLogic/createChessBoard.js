//@ts-check
const {Piece} = require("../lib/lib.js").Chess;
const {eTeam, enumNames, enumInitNames} = require("../lib/lib.js").Enums;
const {dangerUpdateAll} =	require("../utils/moveUtils.js");
const {Match} = require("../Classes/Match/match.js");

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

	match.Reset();
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

	match.Reset();
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
	let	blackPos;

	match.Reset();
	for (let [key, data] of match.board)
	{
		rand = rng(16);
		data.boostedTargetZones.clear();
		data.dangerZones.clear();
		data.targetZones.clear();
		if (rand <= 10)
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
	match.board.get("a1").piece = new Piece(enumNames.KING, "a1", eTeam.White);
	match.white.King = "a1";
	match.cursor.setCursor(match.board.width, match.board.heigth);
	match.cursor.setRow(match.board.heigth);
	match.cursor.setCol(match.board.width);
	blackPos = match.cursor.square;
	match.board.get(blackPos).piece = new Piece(enumNames.KING, blackPos, eTeam.Black);
	match.black.King = blackPos;
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
			//@ts-ignore
			match[team].King = pos;
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

	upper = (match.board.heigth / 2);
	left = (match.board.width / 4);
	right = match.board.width - left;
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

module.exports = {initSavedBoard, initRandomBoard, initClassicBoard};