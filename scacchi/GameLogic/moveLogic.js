// @ts-check
const {eEvents, enumNames, eTeam} = require("../Macro/enums.js");
const {MOVEMENT_MAX, CHESSBOARD_H} = require("../Macro/macro.js");
const {copyBoard} = require("../lib/lib.js").Chess;
const {movePiece, dangerUpdateAll} =	require("../utils/moveUtils.js");
const {isDangerous} = require("../utils/gameUtils.js");
const {Match} = require("../Classes/Vault/match.js");
const {Preset} = require("../Classes/Pieces/preset.js");
const {error, Result} = require("../handlers/game/utils.js");
const {Square} = require("../Classes/ChessBoard/chessBoard.js");
const {printSwap, boardStringify} = require("../test/render.js");

//FIXME - da mettere alcune funzioni in un utilis

/**
 * 
 * @param {Match} match 
 * @param {string} to 
 */
function checkSecondMove(match, to)
{
	let tmp;
	let piece;
	let type;

	tmp = match.cursor.square;
	match.cursor.set(to);
	type = match.board.get(to)?.piece?.type;
	for (let {dx, dy} of new Preset(enumNames.KING).movement)
	{
		if (movePiece(match, dy, dx))
		{
			piece = match.board.get(match.cursor.square)?.piece;
			if (piece?.type == enumNames.BASTARDS && piece.isBoostedBool == true)
			{
				match.cursor.set(tmp);
				return true;
			}
		}
		match.cursor.set(to);
	}
	match.cursor.set(tmp);
	if ((type == enumNames.CHAMPION || type == enumNames.MINOTAURUS || type == enumNames.BASTARDS) && match.board.get(to)?.piece?.isBoostedBool == true)
		return true;
	return false;
}

/**
 * 
 * @param {Array<String>} coords
 * @param {Result} result
 * @param {Match} match
 * @param {boolean} boostBool
 */
function checkMove(coords=[], result, match, boostBool)
{
	let	from;
	let	to;
	let	king;

	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	king = match.board.get(match.currentPlayer.King);
	if (king == null || king.piece == null)
		return (error(result, 500, "backend has lost track of the king, lol"));
	if ( match.moves > MOVEMENT_MAX)
		return (error(result, 403, `The maximum amount of movements is ${MOVEMENT_MAX}`));
	if (from == null || to == null)
		return (error(result, 403, "invalid positions"));
	if (from.piece == null)
		return (error(result, 403, "Square is empty"));
	if (to.piece)
	{
		if (to.piece.team == from.piece.team)
			return (error(result, 403, "you can't eat your team mates"));
	}
	if (from.piece?.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	if (!checkBooster(match, result, from, coords, boostBool))
		return (false);
	// if (checkCastling(match, to, from))
	// 	return (true);
	if (!from.targetZones.has(coords[1]))
		return (error(result, 403, "destination not in piece targetZone"));
	if (isDangerous(match, king.dangerZones, king.piece.team) && !simulation(coords, match))
		return (error(result, 403, "Your king is in danger"));
	if (!simulation(coords, match))
		return (error(result, 403, "this would put your king in danger"));
	return (true);
}

/**
 * 
 * @param {Array<string>} coords
 * @param {Result} result
 * @param {Match} match
 * @param {boolean} boostBool
 */
function updateChessboard(coords=[], result, match, boostBool)
{
	let	from;
	let	to;

	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	if (!from || !to || !from.piece)
	{
		return (error(result, 500, "from | to bug in moveFunction"));
	}
	if (coords[0] == match.currentPlayer.King)
		match.currentPlayer.King = coords[1];
	printSwap(coords, from, to);
	if (to.piece)
	{
		console.log(`player ${match.currentPlayer.team} + ${to.piece.price}💲`);
		match.currentPlayer.nPoints += to.piece.price;
	}
	match.history.UpdateMoves(match, from, coords);
	if (from.piece.type == enumNames.VALKIRYA && result.usedBoost == true)
	{
		to.piece = null;
		from.piece.isBoostedBool = false;
		match.currentPlayer.boostedPiece = "";
	}
	else
	{
		to.piece = from.piece;
		from.piece = null;
		to.piece.pos = coords[1];
		if (to.piece.isBoostedBool)
			match.currentPlayer.boostedPiece = to.piece.pos;
		else if (boostBool)
			match.currentPlayer.boostedPiece = "";
	}
	if (to.piece && to.piece.isMovedBool == false)
		to.piece.isMovedBool = true;
	// trasfiguration(match, to);
	match.moves++;
	match.history.finalBoard = boardStringify(match);
	dangerUpdateAll(match);
	return (true);
}

//SECTION - move utils

/**
 * 
 * FIXME - da aggiungere check per valchiria: vuole usare boost?
 * @param {Match} match
 * @param {Result} result 
 * @param {Square} from 
 * @param {Array<string>} coords
 * @param {boolean} boostBool
 * @returns {boolean}
 */
function checkBooster(match, result, from, coords, boostBool) // FIXME - da aggiungere check per valchiria: vuole usare boost?
{
	let	pieceMultipleMoveBool;
	let	boostedTargetZones;

	if (!from.piece)
		return (error(result, 500, "unexpected piece error"));
	if (boostBool == false)
		pieceMultipleMoveBool = false;
	else if (match.history.Last().to == coords[0])
		pieceMultipleMoveBool = true;
	else
		pieceMultipleMoveBool = false;
	if (pieceMultipleMoveBool == true && match.history.Last().type != eEvents.Move)
		return (error(result, 500, "match History is messed up"));
	if (from.piece.type == enumNames.BASTARDS || match.history.Last().movedPiece == enumNames.BASTARDS)
		return (doubleBastardsCheck(match, result, coords));
	if (pieceMultipleMoveBool == false && match.moves > 0)
		return (error(result, 403, "Multiple moves not allowed there"));
	if (pieceMultipleMoveBool == false && from.targetZones.has(coords[1]))
		return (true);
	if (from.piece.isBoostedBool == false || boostBool == false)
		return (error(result, 403, `illegal move`));
	if (pieceMultipleMoveBool == true && from.piece.multipleMovesBool == false)
		return (error(result, 403, `piece ${from.piece.type} can move once`));
	if (pieceMultipleMoveBool == false)
		boostedTargetZones = from.boostedTargetZones;
	else
		boostedTargetZones = match.history.Last().pieceBoosterTargetZones;
	if (!boostedTargetZones)
		return (error(result, 403, `that piece can't do any bonus move`));
	boostedTargetZones = boostedTargetZones?.get(coords[0]);
	if (!boostedTargetZones)
		return (error(result, 403, `you can't move from there ;-(`));
	if (boostedTargetZones.has(coords[1]) == false)
		return (error(result, 403, `that piece can't do that move`));
	from.targetZones.add(coords[1]);
	if (from.piece.type != enumNames.VALKIRYA)
	{
		from.piece.isBoostedBool = false;
		match.currentPlayer.boostedPiece = "";
	}
	result.usedBoost = true;
	return (true);
}

/**
 * 
 * @param {Match} match
 * @param {Result} result 
 * @param {Array<string>} coords
 * @returns {boolean}
 */
function doubleBastardsCheck(match, result, coords)
{
	let from;
	let to;
	let	bastard;
	let	bastardSquare;
	let	other;
	let last;
	let	presetBastard;
	let	tmpCursor;

	if (match.moves == 0)
		return (true);
	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	last = match.history.Last();
	tmpCursor = match.cursor.square;
	if (!from || !to || !from.piece)
		return (error(result, 500, "Something went wrong while searching for the position"));
	if (from.piece?.type == enumNames.BASTARDS && from.piece?.isBoostedBool == true)
	{
		bastard = coords[0];
		other = last.from;
		bastardSquare = from;
	}
	else if (last.movedPiece == enumNames.BASTARDS && last.isBoostedBool)
	{
		bastard = last.from;
		other = coords[0];
		bastardSquare = match.board.get(match.history.Last().to);
	}
	else
		return (error(result, 403, "Try boosting the bastard first"));
	if (!bastardSquare || !bastardSquare.piece)
		return (error(result, 500, "match History is messed up"));
	presetBastard = new Preset(enumNames.BASTARDS);
	for (let {dx, dy} of presetBastard.movement)
	{
		match.cursor.set(bastard);
		if (!movePiece(match, dy, dx))
			continue ;
		if (match.cursor.square == other)
		{
			result.usedBoost = true;
			bastardSquare.piece.isBoostedBool = false;
			from.piece.isBoostedBool = false;
			match.cursor.set(tmpCursor);
			return true;
		}
	}
	match.cursor.set(tmpCursor);
	return (error(result, 403, "To use the bastard boost, the pieces must be near"));
}

/**
 * 
 * @param {Array<String>} coords
 * @param {Match} match
 * @returns 
 */
function simulation(coords, match)
{
	let tmp;
	let	from;
	let	to;
	let	king;

	tmp = copyBoard(match.board);
	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	king = match.board.get(match.currentPlayer.King);
	if (!from || !to || !king)
		return (false); // FIXME error 500 : impossibile
	to.piece = from.piece;
	from.piece = null;
	if (coords[0] == match.currentPlayer.King)
		king = to;
	dangerUpdateAll(match);
	if (isDangerous(match, king.dangerZones, king.piece?.team))
	{
		copyBoard(tmp, match.board);
		dangerUpdateAll(match);
		return (false);
	}
	copyBoard(tmp, match.board);
	dangerUpdateAll(match);
	return (true);
}

/**
 * 
 * @param {Match} match
 * @param {Square} to
 */
function trasfiguration(match, to)
{
	let	team;
	let	tmp;
	let row;
	let  col;

	if (!to.piece)
		throw ("transiguration: to has no piece");
	if (to.piece.type != enumNames.BASTARDS)
		return ;
	team = to.piece.team;
	tmp = match.cursor.square;
	match.cursor.set(to.piece.pos);
	row = match.cursor.getRow();
	col = match.cursor.getCol();
	// if (((team == eTeam.White || team == eTeam.Blue) && col == CHESSBOARD_H))
		
}

module.exports = { checkMove, updateChessboard, checkSecondMove };