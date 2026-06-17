// @ts-check
// const { Match } = require("../Classes/Match/match.js");
import { enumInitNames, enumNames, enumSpecialMoves, kingMovements} from "../Macro/enums.js";
import * as Macro from "../Macro/macro.js";
import {bastardChecks} from "./gameUtils.js";

/**@typedef {import("../Classes/Match/match.js").Match} Match*/
/**@typedef {import("../Classes/Match/player.js").Player} Player*/
/**@typedef {import("../Classes/endPoint/result.js").Result} Result*/
/**@typedef {import("../Classes/Pieces/pieces.js").Piece} Piece*/

/**
 * try to move the cursor to dx, dy. return true/false
 * @param {Match} match
 * @param {number} dx 
 * @param {number} dy
 * @param {boolean} clear
 */
let movePiece = (match, dy, dx, clear=false) =>
{
	let newRow = match.cursor.getRow() + dx;
	let newCol = match.cursor.getCol() + dy;

	if (newRow < 1 || newRow > match.board.heigth)
		return false;
	else if (newCol <= 0 || newCol > match.board.width)
		return false;

	if (clear == true)
	{
		let currentSquare = match.board.get(match.cursor.square);
		let zones = currentSquare?.targetZones;

		if (zones != null)
		{
			for (let zone of zones)
			{
				match.board.get(zone)?.dangerZones.delete(match.cursor.square);
			}
			zones.clear();
		}
	}
	match.cursor.setCursor(newRow, newCol);
	return true;
}

/**
 * 
 * @param {Match} match 
 * @param {string | null} pos
 * @param {boolean} updBool
 * @returns 
 */
let DangerUpdate = (match, pos=null, updBool=true) =>
{
	let	piece;
	let	startPos;

	if (pos != null)
		match.cursor.set(pos);
	else
		pos = match.cursor.square;
	startPos = match.cursor.square;
	match.board.ResetTargets(startPos);
	piece = match.board.get(match.cursor.square).piece;
	if (piece == null)
		return (0);
	for (let {dx, dy} of piece.moveArray)
	{
		if (!bastardChecks(match, dx, dy, piece))
		{
			match.board.get(match.cursor.square).dangerZones.add(startPos);
			continue ;
		}
		while (movePiece(match, dy, dx, false))
		{ 
			if (piece.type != enumNames.BASTARDS)
			{
				match.board.AddInfluence(startPos, match.cursor.square);
				match.board.get(match.cursor.square).dangerZones.add(startPos);
			}
			match.board.get(startPos).targetZones.add(match.cursor.square);
			if (piece.moveLongRangeDEBUG == false || match.board.get(match.cursor.square)?.piece != null)
				break ;
		}
		match.cursor.square = startPos;
	}
	if (piece.isBoostedBool == true)
		piece.moveFunction(match);
	castlingUpdate(match, startPos, piece);
	match.board.get(pos).targetZones.delete(pos);
	match.board.get(pos).dangerZones.delete(pos);
	if (updBool == false)
		return (1);
	if (pos != null)
		match.board.updates.add(pos);
	else
		match.board.updates.add(match.cursor.square);
	return (1);
}

/**
 * 
 * @param {Match} match 
 * @param {string} startPos 
 * @param {Piece} piece 
 */
function castlingUpdate(match, startPos, piece)
{
	/** @type {Player} */
	let player;
	let	kingCoord;
	let	kingSquare;

	//@ts-ignore
	player = match[piece.team];
	kingCoord = player.King;
	kingSquare = match.board.get(kingCoord);
	if (piece.type == enumNames.KING && !piece.isMovedBool)
	{
		for (const x of player.castlingArray)
			kingSquare.targetZones.add(x);
	}
	else if (piece.type == enumNames.MINOTAURUS)
	{
		player.castlingArray.delete(startPos);
		if (kingSquare.piece?.isMovedBool || piece.isMovedBool)
			kingSquare.targetZones.delete(startPos);
		else if (match.board.get(startPos).targetZones.has(kingCoord))
		{
			match.board.updates.add(kingCoord);
			player.castlingArray.add(startPos);
			kingSquare.targetZones.add(startPos);		
		}
		else
			kingSquare.targetZones.delete(startPos);
	}
}

/**
 * 
 * @param {Match} match
 * @param {Array<string>} coords
 */
function CheckInfluence(match, coords)
{
	let setInfluence;
	let tmpInfluenceDanger = [];
	let tmpInfluenceTarget = [];

	for (const coord of coords)
	{
		setInfluence = match.board.influenceMap.get(coord);
		if (!setInfluence)
			throw (`dangerDelPiece: invalid coord ${coord}`);
		tmpInfluenceDanger.push(new Set(setInfluence));
		tmpInfluenceTarget.push(new Set(match.board.get(coord).influenceZones));
	}
	checkInfluenceSets(match, coords, tmpInfluenceDanger);
	// checkInfluenceSets(match, coords, tmpInfluenceTarget);
}

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} coords 
 * @param {Array<Set<string>>} influenceSets the set for every coord
 */
function checkInfluenceSets(match, coords, influenceSets)
{
	let	i;

	i = 0;
	for (const set of influenceSets)
	{
		for (const influenceCoord of set)
		{
			DangerUpdate(match, influenceCoord);
			// match.board.ResetInfluence(coords[i]);
		}
		++i;
	}
}

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} selected /* 0 = from, 1 = to
 * @param {Result | null} result
 * @param {boolean} delBool
 */
function dangerUpdateMoved(match, selected=[], result=null, delBool=true)
{
	// return (dangerUpdateAll(match));
	if (selected.length != 2)
		throw ("dangerUpdateMoved must be called with two pieces: from, to");
	// if (delBool == true)
	// 	dangerDelPiece(match, selected[0], selected[1], result);
	// dangerUpPiece(match, selected[1], result);
	// DangerUpdate(match, selected[1]);
	CheckInfluence(match, selected);
	DangerUpdate(match, selected[0]);
	DangerUpdate(match, selected[1]);
}

/**
 * 
 * @param {Match} match 
 */
function dangerUpdateAll(match)
{
	let	temp;
	let usedBoard;

	temp = match.cursor.square;
	usedBoard = match.board;
	for (let [pos, square] of usedBoard)
	{
		square.ClearZones();
	}
	for (let [pos, square] of usedBoard)
	{
		match.cursor.set(pos);
		if (square.piece && square.piece.isBoostedBool)
		{
			square.piece.moveFunction(match);
			continue ;
		}
		DangerUpdate(match);
	}
	match.cursor.set(temp);
}

export {movePiece, DangerUpdate, dangerUpdateAll, dangerUpdateMoved};