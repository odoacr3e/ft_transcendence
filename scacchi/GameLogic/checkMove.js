//@ts-check

//SECTION - checkMove functions
/*
	list of exports:
	-	checkMove: 			checks the validity of a move.
	-	checkSecondMove:	checks if a second move is possible.
*/

import { error } from "../handlers/game/utils.js";
import { enumNames, eEvents, eMatchPresets } from "../Macro/enums.js";
import { movePiece } from "../utils/dangerUpdate.js";
import { Preset } from "../Classes/Chess/Pieces/preset.js";
import {checkCastling} from "./Castling.js";
import { includesOneOf } from "../utils/string.js";
import { MOVEMENT_MAX } from "../Macro/macro.js";
import { simulation } from "./simulation.js";

/** @typedef {import("../Classes/Chess/match").Match} Match*/
/** @typedef {import("../Classes/Chess/chessBoard.js").Square} Square*/
/** @typedef {import("../Classes/endPoint/result").Result} Result*/
/** @typedef {import("../Classes/Chess/Pieces/pieces.js").Piece} Piece*/

/**
 * checks the validity of a move.
 * @param {Array<String>} coords
 * @param {Result} result
 * @param {Match} match
 * @param {boolean} boostBool
 */
export function checkMove(coords=[], result, match, boostBool)
{
	let	from;
	let	to;
	let	king;

	from = match.board._data.get(coords[0]);
	to = match.board._data.get(coords[1]);
	king = match.board.get(match.currentPlayer.King);
	if (king == null || king.piece == null)
		return (error(result, 500, "backend has lost track of the king, lol"));
	if ( match.moves > MOVEMENT_MAX)
		return (error(result, 403, `The maximum amount of movements is ${MOVEMENT_MAX}`));
	if (from == null || to == null)
		return (error(result, 400, "invalid positions"));
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
		if (match.settings.preset == eMatchPresets.ClassicFourPlayers)
		{
			if (to.piece.team == match.currentPlayer.allie)
				return (error(result, 403, "you can't eat your allie's pieces"));
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
	return (true);
}

/**
 * checks if a second move is possible.
 * used to pass the turn automatically when needed.
 * @param {Match} match 
 * @param {string} to 
 */
export function checkSecondMove(match, to)
{
	let tmp;
	let piece;
	let type;

	if (match.playerNum <= 1)
		return (false);
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

//SECTION - utils

/**
 * 
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
	if (boostBool && from.piece.isBoostedBool == true)
	{
		if (from.piece.type == enumNames.VALKIRYA)
			result.specialMoves.SetSniperMove();
		else if (from.piece.type == enumNames.CHAMPION)
			result.specialMoves.SetChampionBoostUsed();
	}
	if (from.piece.type == enumNames.BASTARDS || match.history.Last().movedPiece == enumNames.BASTARDS)
		return (checkDoubleBastardMove(match, result, coords));
	if (pieceMultipleMoveBool == false && match.moves > 0)
		return (error(result, 403, "Multiple moves not allowed there (tip: is it a moveBoost?"));
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
function checkDoubleBastardMove(match, result, coords)
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
