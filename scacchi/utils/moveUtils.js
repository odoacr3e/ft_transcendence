// @ts-check
// const { Match } = require("../Classes/Chess/match.js");
import { enumInitNames, enumNames, enumSpecialMoves, kingMovements} from "../Macro/enums.js";
import * as Macro from "../Macro/macro.js";
import {bastardChecks} from "./gameUtils.js";

/**@typedef {import("../Classes/Chess/match.js").Match} Match*/
/**@typedef {import("../Classes/Chess/player.js").Player} Player*/
/**@typedef {import("../Classes/endPoint/result.js").Result} Result*/
/**@typedef {import("../Classes/Pieces/pieces.js").Piece} Piece*/

/**
 * try to move the cursor to dx, dy. return true/false
 * @param {Match} match
 * @param {number} dx 
 * @param {number} dy
 */
let movePiece = (match, dy, dx) =>
{
	let newRow = match.cursor.getRow() + dx;
	let newCol = match.cursor.getCol() + dy;
	let	oldCursor = match.cursor.square;

	if (newRow < 1 || newRow > match.board.heigth)
		return false;
	else if (newCol <= 0 || newCol > match.board.width)
		return false;
	match.cursor.setCursor(newRow, newCol);
	if (match.board.get(match.cursor.square).wallBool == true)
	{
		match.cursor.set(oldCursor);
		return false;
	}
	return true;
}

/**
 * 
 * @param {Match} match 
 * @param {string | null} pos
 * @param {boolean} ignoreBoostChampsBool
 * @param {boolean} castlingBool
 * @returns 
 */
let DangerUpdate = (match, pos=null, ignoreBoostChampsBool=true, castlingBool=false) =>
{
	let	piece;
	let	startPos;

	match.cursor.Save();
	if (pos != null)
		match.cursor.set(pos);
	else
		pos = match.cursor.square;
	match.board.updates.add(pos);
	startPos = match.cursor.square;
	match.board.ResetTargets(startPos);
	piece = match.board.get(match.cursor.square).piece;
	if (piece == null)
		return (match.cursor.Restore());
	for (let {dx, dy} of piece.moveArray)
	{
		if (piece.type == enumNames.BASTARDS)
		{
			bastardChecks(match, dx, dy, piece);
			continue ;
		}
		while (movePiece(match, dy, dx))
		{ 
			match.board.AddInfluence(startPos, match.cursor.square);
			match.board.get(match.cursor.square).dangerZones.add(startPos);
			match.board.get(startPos).targetZones.add(match.cursor.square);
			if (piece.moveLongRangeDEBUG == false || match.board.get(match.cursor.square)?.piece != null || match.board.get(match.cursor.square)?.wallBool)
				break ;
		}
		match.cursor.square = startPos;
	}
	match.cursor.set(pos);
	match.board.get(pos).targetZones.delete(pos);
	match.board.get(pos).dangerZones.delete(pos);
	if (ignoreBoostChampsBool && piece.type == enumNames.CHAMPION && piece.isBoostedBool)
		return (match.cursor.Restore());
	if (piece.isBoostedBool == true)
		piece.moveFunction(match);
	castlingUpdate(match, startPos, piece, castlingBool);
	match.board.get(pos).targetZones.delete(pos);
	match.board.get(pos).dangerZones.delete(pos);
	return (match.cursor.Restore());
}

/**
 * 
 * @param {Match} match 
 * @param {string} startPos 
 * @param {Piece} piece 
 * @param {boolean} castlingBool
 */
function castlingUpdate(match, startPos, piece, castlingBool)
{
	/** @type {Player} */
	let player;
	let	kingCoord;
	let	kingSquare;
	let	minoSquare;

	//@ts-ignore
	player = match[piece.team];
	kingCoord = player.King;
	kingSquare = match.board.get(kingCoord);
	if (piece.type == enumNames.KING && !piece.isMovedBool)
	{
		for (const x of player.castlingArray)
			kingSquare.targetZones.add(x);
	}
	else if (castlingBool == false)
		return ;
	else if (piece.type == enumNames.MINOTAURUS && !piece.isMovedBool)
	{
		player.castlingArray.delete(startPos);
		minoSquare = match.board.get(startPos); 
		if (minoSquare.targetZones.has(kingCoord) == false || 
			kingSquare.piece?.isMovedBool || piece.isMovedBool)
		{
			if (kingSquare.targetZones.has(startPos))
				match.board.updates.add(kingCoord);
			kingSquare.targetZones.delete(startPos);
			return ;
		}
		if (kingSquare.targetZones.has(startPos) == false)
			match.board.updates.add(kingCoord);
		player.castlingArray.add(startPos);
		kingSquare.targetZones.add(startPos);	
	}
}

/**
 * 
 * @param {Match} match
 * @param {Array<string>} coords
 * @param {boolean} castlingBool
 */
function CheckInfluence(match, coords, castlingBool)
{
	let setInfluence;
	let tmpInfluenceDanger = [];

	for (const coord of coords)
	{
		setInfluence = match.board.influenceMap.get(coord);
		if (!setInfluence)
			throw (`dangerDelPiece: invalid coord ${coord}`);
		tmpInfluenceDanger.push(new Set(setInfluence));
	}
	checkInfluenceSets(match, coords, tmpInfluenceDanger, castlingBool);
}

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} coords 
 * @param {Array<Set<string>>} influenceSets the set for every coord
 * @param {boolean} castlingBool
 */
function checkInfluenceSets(match, coords, influenceSets, castlingBool)
{
	let	i;

	i = 0;
	for (const set of influenceSets)
	{
		for (const influenceCoord of set)
		{
			DangerUpdate(match, influenceCoord, true, castlingBool);
		}
		++i;
	}
}

/**
 * 
 * @param {Match} match 
 * @param {Array<string>} selected /* 0 = from, 1 = to
 * @param {boolean} castlingBool
 */
function dangerUpdateMoved(match, selected=[], castlingBool=false)
{
	if (selected.length != 2)
		throw ("dangerUpdateMoved must be called with two pieces: from, to"); 
	CheckInfluence(match, selected, castlingBool);
	DangerUpdate(match, selected[0], true, castlingBool);
	DangerUpdate(match, selected[1], true, castlingBool);
	updateBoostedChampions(match, selected);
}

/**
 * if they need an update, it is done in boost order
 * @param {Match} match
 * @param {Array<string>} coords
 */
function updateBoostedChampions(match, coords)
{
	let arr;
	let	piece;
	let	needUpdateBool;
	let	boostedChampsCoords;

	arr = match.GetBoostedPieceCoords(true, true);
	if (!arr)
		return ;
	boostedChampsCoords = [];
	//check if at least one boosted champion needs a refresh
	needUpdateBool = false;
	for (const x of arr)
	{
		piece = match.board.get(x).piece;
		if (!piece && x == coords[0])
			piece = match.board.get(coords[1]).piece;
		if (!piece)
			throw (`updateBoostedChampions: piece in ${x} does not exist`);
		if (piece.type != enumNames.CHAMPION || piece.isBoostedBool == false)
			continue ;
		boostedChampsCoords.push(x);
		if (match.board.updates.has(x) == true)
			needUpdateBool = true;
	}
	if (needUpdateBool == false && boostedChampsCoords.length < 2)
		return ;
	//resets all one of them
	for (const x of boostedChampsCoords)
	{
		DangerUpdate(match, x);
	}
	//recalculate them in boost order
	for (const x of boostedChampsCoords)
	{
		DangerUpdate(match, x, false);
	}
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