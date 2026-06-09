// @ts-check
import {eEvents, enumNames, arrayNames, enumSpecialMoves, eTeam} from "../Macro/enums.js";
import {MOVEMENT_MAX, CHESSBOARD_H, CHESSBOARD_W} from "../Macro/macro.js";
import { Chess } from "../lib/lib.js";
const {copyBoard} = Chess;
import {movePiece, DangerUpdate, dangerUpdateAll, dangerUpdateMoved} from "../utils/moveUtils.js";
import {isDangerous} from "../utils/gameUtils.js";
import {Match} from "../Classes/Match/match.js";
import {Preset} from "../Classes/Pieces/preset.js";
import {clientBoard, error, Result} from "../handlers/game/utils.js";
import {Square} from "../Classes/ChessBoard/chessBoard.js";
import {printSwap, boardStringify} from "../test/render.js";
import {checkCastling, getPieces} from "./Castling.js";
import { Piece } from "../Classes/Pieces/pieces.js";
import { Cursor } from "../Classes/Match/cursor.js";
import { includesOneOf } from "../utils/string.js";
import {endTurn} from "../handlers/game/endTurn.js";

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
	let OtherBastards;

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
	if (from.piece.type == enumNames.BASTARDS)
		result.specialMoves.SetBastardMove();
	if (to.piece?.type == enumNames.BASTARDS)
		result.specialMoves.SetEatenBastard();
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
	if (!simulation(coords, match, result))
	{
		result.specialMoves.SetKingDanger();
		return (error(result, 403, "this would put your king in danger"));
	}
	// if (checkDoubleMoveMate(match, coords, result) == false)
	// 	return (false);
	return (true);
}

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} coords 
 * @param {Result} result
 * @param {boolean} checkBool
 */
function checkDoubleMoveMate(match, coords, result, checkBool=true)
{
	let	OtherPiece;
	let	pieceData;

	OtherPiece = match.GetOBoostedPieceCoords();
	let	theKING = match.currentPlayer.King;
	if (coords.length >= 2 && coords[0] == theKING)
		theKING = coords[1];
	if (OtherPiece == null)
		return (false);
	for (const coords of OtherPiece)
	{
		pieceData = match.board.get(coords).piece;
		if (!pieceData)
			throw ("checkDoubleMoveMate: cannot find boosted piece");
		if (pieceData.type == enumNames.MINOTAURUS && checkBool == false)
			boostMinoUpdates(match, coords);
		else if (pieceData.type == enumNames.BASTARDS && checkBool == true)
		{	
			if (!boostBastardsUpdates(match, coords, theKING, result))
				return (true);
		}
		else
			continue ;
	}
	return (false);
}

/**
 * 
 * @param {Match} match 
 * @param {string} coords 
 * @param {string} theKING
 * @param {Result} result
 * @returns 
 */
function boostBastardsUpdates(match, coords, theKING, result)
{
	let boosts = match.board.get(coords).boostedTargetZones.get(coords);
	if (boosts == undefined || boosts.size == 0)
			return (true);
	for (const squareCoord of boosts)
	{
		let	square = match.board.get(squareCoord);
		if (!square.piece)
			throw ("DEBUG error 1");
		match.cursor.Save();
		for (const moves of square.piece.moveArray)
		{
			match.cursor.set(squareCoord);
			while (movePiece(match, moves.dy, moves.dx))
			{
				let piece;
				let squareBastard = "";
				piece = match.board.get(match.cursor.square).piece;
				if (match.cursor.square == theKING)
					return (error(result, 403, "boost bastard and his gang would threaten king"));
				if (!piece)
				{
					if (!square.piece.moveLongRangeDEBUG)
						break ;
					else
						continue ;
				}
				if (piece.isBoostedBool == true && piece.type == enumNames.BASTARDS && piece.team == square.piece.team)
				{
					squareBastard = match.cursor.square;
					if (movePiece(match, moves.dy, moves.dx) == false)
						break ;
					if (match.cursor.square == theKING)
						return (error(result, 403, "boost bastard and his gang would threaten king"));
					if (match.board.get(squareBastard).targetZones.has(match.cursor.square) && 
					match.board.get(squareBastard).targetZones.size <= 1)
						break ;
					if (piece.isMovedBool)
					{
						if (!square.piece.moveLongRangeDEBUG)
							break ;
						else
						{
							match.cursor.square = squareBastard;
							continue ;
						}
					}
					squareBastard = match.cursor.square;
					if (movePiece(match, moves.dy, moves.dx) == false)
						break ;
					if (match.cursor.square == theKING)
						return (error(result, 403, "boost bastard and his gang would threaten king"));
					if (match.board.get(squareBastard).targetZones.has(match.cursor.square) && 
					match.board.get(squareBastard).targetZones.size <= 2)
						break ;
				}
				else
					break ;
			}
			match.cursor.Restore();
		}
		match.cursor.Restore();
	}
	match.cursor.Restore();
	return (true);
}

/**
 * 
 * @param {Match} match
 * @param {string} coords
 */
function boostMinoUpdates(match, coords)
{
	for (const target of match.board.get(coords).targetZones)
		match.board.get(target).dangerZones.delete(coords);
	for (const [key, target] of match.board.get(coords).boostedTargetZones)
	{
		for (const second of target)
		{
			match.board.get(second).dangerZones.delete(coords);
		}
	}
	DangerUpdate(match, coords);
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
	printSwap(match, coords, from, to);
	if (to.piece && to.piece.team != from.piece.team)
	{
		console.log(`player ${match.currentPlayer.team} + ${to.piece.price}💲`);
		match.currentPlayer.nPoints += to.piece.price;
		if (to.piece.isBoostedBool == true)//@ts-ignore
			match[to.piece.team].boostedPiece = "";
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
	boostedPieceUpdates(match, coords);
	checkDoubleMoveMate(match, [], result, false);
	match.moves++;
	dangerUpdateMoved(match, coords, result);
	return (true);
}

//SECTION - move utils

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} coords 
 */
function boostedPieceUpdates(match, coords)
{
	let	boostPieceSquare;
	let	boostPieceCoord;
	let	diff;

	if (coords.length != 2)
		throw ("boostedPIeceUpdates: coords size error");
	if (!match.currentPlayer.boostedPiece)
		return ;
	if (coords.at(0) == match.currentPlayer.boostedPiece)
	{
		match.currentPlayer.boostedPiece = coords[1];
		return ;
	}
	boostPieceCoord = match.currentPlayer.boostedPiece;
	boostPieceSquare = match.board.get(boostPieceCoord);
	if (!boostPieceSquare.piece)
		throw ("boostedPIeceUpdates: backend has lost track of boosted piece");
	if (boostPieceSquare.piece.type != enumNames.BASTARDS)
		return ;
	diff = match.cursor.Diff(coords[1], boostPieceCoord);
	if (Math.abs(diff.col) < 2 && Math.abs(diff.row) < 2)
		DangerUpdate(match, boostPieceCoord);
}

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
	match.board.updates.add(kpos);
	match.board.updates.add(mpos);
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
	match.currentPlayer.castlingArray.clear();
	pieces.king.isMovedBool = true;
	pieces.mino.isMovedBool = true;
	DangerUpdate(match, pieces.mino.pos);
	DangerUpdate(match, pieces.king.pos);
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
	if (pieceMultipleMoveBool == true)
	{
		if (!includesOneOf(match.history.Last().type, eEvents.Move, eEvents.MoveBoost))
			return (error(result, 500, "match History is messed up"));
	}
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
	let	bastardNewCoord;
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
	if (last.to == coords[0])
		return (error(result, 403, "Bastards can't move two times"));
	if (from.piece?.type == enumNames.BASTARDS && from.piece?.isBoostedBool == true)
	{
		bastard = coords[0];
		bastardNewCoord = coords[1];
		other = last.from;
		bastardSquare = from;
	}
	else if (last.movedPiece == enumNames.BASTARDS && last.isBoostedBool)
	{
		bastard = last.from;
		bastardNewCoord = last.to;
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
			match.board.updates.add(bastardNewCoord);
			return true;
		}
	}
	match.cursor.set(tmpCursor);
	return (error(result, 403, "To use the bastard boost, the pieces must be near"));
}

/**
 * 
 * @param {Match} match 
 * @param {Square} square
 * @param {string} pos
 */
function RefreshChampion(match, square, pos)
{
	for (const zone of square.targetZones)
		match.board.get(zone).dangerZones.delete(pos)
	for (const [key, value] of square.boostedTargetZones)
	{
		for (const coord of value)
			match.board.get(coord).dangerZones.delete(pos)
		match.board.get(key).dangerZones.delete(pos)
	}
	DangerUpdate(match, pos);
}

/**
 * 
 * @param {Array<String>} coords
 * @param {Match} match
 * @param {Result} result
 * @returns 
 */
function simulation(coords, match, result)
{
	let tmp = null;
	let	from;
	let	to;
	let	king;
	let	dangerBool;
	let boosted;

	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	king = match.board.get(match.currentPlayer.King);
	if (!from || !to || !king)
		return (false); // FIXME error 500 : impossibile
	if (to.piece)
		tmp = to.piece.Copy();
	to.piece = from.piece;
	from.piece = null;
	if (coords[0] == match.currentPlayer.King)
		king = to;
	dangerUpdateMoved(match, coords, result);
	dangerBool = isDangerous(match, king.dangerZones, king.piece?.team);
	if (!dangerBool)
		dangerBool = checkDoubleMoveMate(match, coords, result);
	from.piece = to.piece;
	to.piece = tmp;
	dangerUpdateMoved(match, [coords[1], coords[0]], result);
	boosted = match.GetOBoostedPieceCoords();
	if (!boosted)
		return (!dangerBool);
	for (const p of boosted)
	{
		if (match.board.get(p).piece?.type == enumNames.CHAMPION && match.board.updates.has(p))
			RefreshChampion(match, match.board.get(p), p);
	}
	// DangerUpdate(match, coords[0]);
	return (!dangerBool);
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
	match.history.UpdateTransform(match, square, coord, newType);
	endTurn(match, false);
	result.status = 200;
	result.msg = "OK";
	//@ts-ignore
	result.board = clientBoard(match);
	return (result);
}

export { checkMove, updateChessboard, checkSecondMove, transfiguration};