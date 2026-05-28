// @ts-check
const {eEvents, enumNames, arrayNames, enumSpecialMoves} = require("../Macro/enums.js");
const {MOVEMENT_MAX, CHESSBOARD_H, CHESSBOARD_W} = require("../Macro/macro.js");
const {copyBoard} = require("../lib/lib.js").Chess;
const {movePiece, DangerUpdate, dangerUpdateAll, dangerUpdateMoved} =	require("../utils/moveUtils.js");
const {isDangerous} = require("../utils/gameUtils.js");
const {Match} = require("../Classes/Match/match.js");
const {Preset} = require("../Classes/Pieces/preset.js");
const {error, Result} = require("../handlers/game/utils.js");
const {Square} = require("../Classes/ChessBoard/chessBoard.js");
const {printSwap, boardStringify} = require("../test/render.js");
const {checkCastling, getPieces} = require("./Castling.js");
const { Piece } = require("../Classes/Pieces/pieces.js");
const { Cursor } = require("../Classes/Match/cursor.js");
const { includesOneOf } = require("../utils/string.js");

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
	if (from.piece?.team != match.currentPlayer.team)
		return (error(result, 403, `it's ${match.currentPlayer.team} turn`));
	if (to.piece)
	{
		if (to.piece.team == from.piece.team)
		{
			if (checkCastling(match, result, to, from))
				return (true);
			return (error(result, 403, "you can't eat your team mates"));
		}
	}
	if (!checkBooster(match, result, from, coords, boostBool))
		return (false);
	if (!from.targetZones.has(coords[1]))
		return (error(result, 403, "destination not in piece targetZone"));
	// if (isDangerous(match, king.dangerZones, king.piece.team) && !simulation(coords, match))
	// 	return (error(result, 403, "Your king is in danger"));
	if (!simulation(coords, match))
	{
		result.specialMoves.SetKingDanger();
		return (error(result, 403, "this would put your king in danger"));
	}
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
	if (to.piece && to.piece.team != from.piece.team)
	{
		console.log(`player ${match.currentPlayer.team} + ${to.piece.price}💲`);
		match.currentPlayer.nPoints += to.piece.price;
	}
	match.history.UpdateMoves(match, from, coords);
	if (from.piece.type == enumNames.VALKIRYA && result.usedBoost == true && from.piece.isBoostedBool == true)
	{
		to.piece = null;
		from.piece.isBoostedBool = false;
		match.currentPlayer.boostedPiece = "";
	}
	else if (result.specialMoves.CheckCastling())
		moveCastling(match, from, to);
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
	match.moves++;
	match.history.finalBoard = boardStringify(match);
	dangerUpdateMoved(match, coords, result);
	return (true);
}

//SECTION - move utils

/**
 * 
 * @param {Match} match 
 * @param {Square} from 
 * @param {Square} to 
 */
function moveCastling(match, from, to)
{
	let pieces = getPieces(match, from, to);
	let kpos;
	let mpos;

	kpos = pieces?.king.pos;
	mpos = pieces?.mino.pos;
	match.cursor.Save();
	if (pieces == null)
		throw ("moveCastling: we have lost our pieces coords, sorry");
	match.cursor.set(pieces.king.pos);
	for (let i = 0; movePiece(match, pieces.dir.diffCol, pieces.dir.diffRow); ++i)
	{
		if (match.cursor.square == pieces.mino.pos || i == 1)
			break;
	}
	let square1 = match.board.get(match.cursor.square);
	if (square1)
	{
		pieces.king.pos = match.cursor.square;
		square1.piece = pieces.king;
	}
	// @ts-ignore
	let square2 = match.board.get(kpos);
	if (square2)
		square2.piece = null;
	movePiece(match, -pieces.dir.diffCol, -pieces.dir.diffRow);
	let square3 = match.board.get(match.cursor.square);
	if (square3)
	{
		pieces.mino.pos = match.cursor.square;
		square3.piece = pieces.mino;
	}
	// @ts-ignore
	let square4 = match.board.get(mpos);
	if (square4)
		square4.piece = null;
	if (square1.piece)
		match.currentPlayer.King = square1.piece.pos;
	else
		throw ("moveCastling: backend has lost the king");
	match.cursor.Restore();

}

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
		result.specialMoves.SetSniperMove();
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

	tmp = copyBoard(match.board._data);
	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	king = match.board.get(match.currentPlayer.King);
	if (!from || !to || !king)
		return (false); // FIXME error 500 : impossibile
	to.piece = from.piece;
	from.piece = null;
	if (coords[0] == match.currentPlayer.King)
		king = to;
	dangerUpdateMoved(match, coords);
	if (isDangerous(match, king.dangerZones, king.piece?.team))
	{
		copyBoard(tmp, match.board._data);
		dangerUpdateMoved(match, coords);
		DangerUpdate(match, coords[0]);
		return (false);
	}
	copyBoard(tmp, match.board._data);
	dangerUpdateMoved(match, coords);
	DangerUpdate(match, coords[0]);
	return (true);
}

/**
 * 
 * @param {Match} match 
 * @param {Result} result 
 * @param {Piece} piece
 * @param {string} newType
 */
function CheckTransfiguration(match, result, piece, newType)
{
	if (match.moves == 0)
		return (error(result, 403, `you should move before transform`));
	if (piece.type != enumNames.BASTARDS)
		return (error(result, 403, `currently, boosting pieces different by
		${enumNames.BASTARDS} is not allowed. However, this may be a cool idea.
		you should tell the developers to think about it.
		Maybe you should stop cheating too, if it possible`));
	if (match.cursor.EdgeCheck(match.currentPlayer.team) == false)
		return (error(result, 403, `you must be on a edge to transform`));
	if (!includesOneOf(newType, arrayNames))
		return (error(result, 403, `${newType} not in array "${arrayNames}"`));
	if (match.history.Last().to != piece.pos)
		return (error(result, 403, `That's too late to boost that bastard.`));
	if (newType == enumNames.KING)
		return (error(result, 403, `You can't create a new king.`));
	return (true);
}

/**
 * 
 * @param {Match} match
 * @param {Result} result
 * @param {string} coord
 * @param {string} newType
 */
function transfiguration(match, result, coord, newType)
{
	let	square;
	let	isBoostedBool;

	square = match.board.get(coord);
	if (!square || !square.piece)
		return (error(result, 400, `invalid coord ${coord}`), result);
	if (CheckTransfiguration(match, result, square.piece, newType) == false)
		return (result);
	isBoostedBool = square.piece.isBoostedBool;
	square.piece = new Piece(newType, square.piece.pos, square.piece.team);
	square.piece.isBoostedBool = isBoostedBool;
	DangerUpdate(match, coord);
	match.endTurn();
	result.status = 200;
	result.msg = "OK";
	return (result);
}

module.exports = { checkMove, updateChessboard, checkSecondMove, transfiguration};