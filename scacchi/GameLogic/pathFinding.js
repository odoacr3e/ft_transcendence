//@ts-check

import {eEvents, enumNames, arrayNames, enumSpecialMoves, eTeam} from "../Macro/enums.js";
import {movePiece} from "../utils/moveUtils.js";

/** @typedef {import("../Classes/Match/match.js").Match} Match */
/** @typedef {import("../Classes/Pieces/pieces.js").Piece} Piece */

/**
 * 
 * @param {Match} match 
 * @param {string} checkDangerCoord 
 * @param {Piece} piece 
 * @param {string} pieceCoord
 * @param {string} ignoreCoord 
 * @param {string} blockCoord 
 * @param {boolean} resetMenace
 * @returns 
 */
export function checkPieceDanger(match, checkDangerCoord, piece, pieceCoord, ignoreCoord, blockCoord="", resetMenace=false)
{
	let	square;
	let	dangerSquare;

	if (blockCoord == piece.pos)
		blockCoord = "";
	square = match.board.get(checkDangerCoord);
	for (const dangerCoord of square.dangerZones)
	{
		dangerSquare = match.board.get(dangerCoord);
		if (dangerSquare.piece?.team == piece.team || dangerCoord == blockCoord)
			continue ;
		if (pathFinding(match, dangerCoord, pieceCoord, ignoreCoord, blockCoord) != null)
		{
			if (resetMenace)
				match.lastMenace = {from: "", mid: "", to: ""};
			return (true);
		}
	}
	return (false);
}

/**
 * check if is possible to go from start to dest
 * @param {Match} match 
 * @param {string} startCoord
 * @param {string} destCoord
 * @param {string} ignoredCoord
 * @param {string} blockCoord
 * @param {boolean} considerBoostedBool 
 */
export function pathFinding(match, startCoord, destCoord, ignoredCoord="", blockCoord="", considerBoostedBool=true)
{
	let	startArray = new Set;
	let	startSquare;
	let	reverseMove = {dx: 0, dy: 0};
	let	moveData;

	//finds data for start, dest and ignoredCoords
	startSquare = match.board.get(startCoord);
	if (!startCoord || !destCoord)
		throw (`pathFinding: invalid parameters`);
	if (!startSquare.piece)
		startSquare = match.board.get(ignoredCoord);
	if (!startSquare.piece)
		throw (`pathFinding: invalid piece`);
	//for optimization, the search will go from dest to start
	//because you have one dest but multiple start (boosted zones)
	if (startCoord == destCoord)
		return ({from: startCoord, mid: "", to: destCoord});
	startArray.add(startCoord);
	if (considerBoostedBool == true)
	{
		for (const [boostStart] of startSquare.boostedTargetZones)
			startArray.add(boostStart);
	}
	//reverse movement from dest to start
	for (const move of startSquare.piece.moveArray)
	{
		reverseMove.dx = -move.dx;
		reverseMove.dy = -move.dy;
		//move simulation takes reverted input
		moveData = moveSimulation(match, destCoord, startArray, startCoord, reverseMove, startSquare.piece, ignoredCoord, blockCoord, considerBoostedBool);
		if (moveData)
		{
			match.lastMenace = moveData;
			return (moveData);
		}
	}
	return (null);
}

/**
 * 
 * @param {Match} match 
 * @param {string} start
 * @param {Set<string>} destArray 
 * @param {String} destCoord
 * @param {{dx: number, dy: number}} move
 * @param {Piece} piece
 * @param {string} ignoredCoord
 * @param {string} blockCoord
 * @param {boolean} considerBoostedBool
 */
function moveSimulation(match, start, destArray, destCoord, move, piece, ignoredCoord, blockCoord, considerBoostedBool)
{
	let	square;
	let	moveData;
	let	tmpCursor;
	let	tmpCursor2;
	let	isBoostedValkirya;

	isBoostedValkirya = (piece.type == enumNames.VALKIRYA && piece.isBoostedBool == true)? 1: 0;
	tmpCursor = match.cursor.square;
	match.cursor.set(start);
	while (movePiece(match, move.dy, move.dx))
	{
		if (match.cursor.square == "g:")
			console.log("...");
		//square that will be occupied
		if (blockCoord == match.cursor.square)
		{
			if (destArray.size == 1 || !secondMoveSimulation(match, destArray, piece, destCoord, ignoredCoord, blockCoord, considerBoostedBool)) 
				break ;
			moveData = {from: destCoord, mid: match.cursor.square, to: start};
			match.cursor.set(tmpCursor);
			return (moveData);
		}
		//square no longer occupied
		if (ignoredCoord == match.cursor.square)
		{
			if (piece.moveLongRangeDEBUG == false)
				break ;
			continue ;
		}
		//found valid path
		if (destArray.has(match.cursor.square))
		{
			tmpCursor2 = match.cursor.square;
			if (destArray.size != 1 && !secondMoveSimulation(match, destArray, piece, destCoord, "", blockCoord, considerBoostedBool, ignoredCoord))
			{
				if (match.board.get(match.cursor.square).piece)
					break ;
				continue;
			}
			//if dest has been reached in two moves, mid is set
			moveData = {from: destCoord, mid: destCoord == tmpCursor2 ? "": tmpCursor2, to: start};
			match.cursor.set(tmpCursor);
			return (moveData);
		}
		//check ignoredCoord old target zones only for boosted champions
		moveData = boostChampNewBoost(match, destCoord, start, piece, ignoredCoord, blockCoord, considerBoostedBool, tmpCursor);
		if (moveData)
			return (moveData);
		square = match.board.get(match.cursor.square);
		if ((square.piece || piece.moveLongRangeDEBUG == false) && !isBoostedValkirya--)
			break ;
	}
	match.cursor.set(tmpCursor);
	return (null);
}

/**
 * 
 * @param {Match} match 
 * @param {Set<string>} destArray 
 * @param {Piece} piece
 * @param {string} start
 * @param {string} ignoredCoord
 * @param {string} blockCoord
 * @param {boolean} considerBoostedBool
 * @param {string} movedPieceCoord
 */
function secondMoveSimulation(match, destArray, piece, start, ignoredCoord, blockCoord, considerBoostedBool, movedPieceCoord=ignoredCoord)
{
	let	currCursor;
	let	path;
	let	eatenPiece;
	let	block;

	currCursor = match.cursor.square;
	if (currCursor == start)
		return (true);
	if (!blockCoord || !considerBoostedBool)
		return (false);
	//if that position is in danger for champion, stop
	if (piece.type == enumNames.CHAMPION && piece.isBoostedBool)
	{
		path = checkPieceDanger(match, currCursor, piece, currCursor, ignoredCoord);
		match.cursor.set(currCursor);
		if (path)
			return (false);
		//also considered from danger zones
		if (ignoredCoord)
		{
			path = checkPieceDanger(match, ignoredCoord, piece, currCursor, ignoredCoord);
			match.cursor.set(currCursor);
			if (path)
				return (false);
		}
		if (blockCoord && blockCoord != currCursor)
		{
			path = pathFinding(match, blockCoord, match.cursor.square, movedPieceCoord, "", false);
			match.cursor.set(currCursor);
			if (path)
				return (false);
		}
	}//minotaurus needs to eat something
	else if (piece.type == enumNames.MINOTAURUS && piece.isBoostedBool)
	{
		eatenPiece = match.board.get(currCursor).piece;
		if (currCursor != blockCoord && (!eatenPiece || piece.team == eatenPiece.team))
			return (false);
	}
	block = destArray.size > 1? blockCoord : ""; 
	path = pathFinding(match, start, currCursor, ignoredCoord, block, false);
	match.cursor.set(currCursor);
	if (!path)
		return (false);
	return (true);
}

/**
 * this function consider ignoredSquare targets for boosted champs
 * @param {Match} match 
 * @param {string} start
 * @param {string} dest
 * @param {Piece} piece 
 * @param {string} ignoredCoord 
 * @param {string} blockCoord
 * @param {boolean} considerBoostedBool 
 * @param {string} tmpCursor
 * @returns {{from: string, mid: string, to: string} | null}
 */
function boostChampNewBoost(match, start, dest, piece, ignoredCoord, blockCoord, considerBoostedBool, tmpCursor)
{
	let	currSquare;
	let	dangerPiece;
	let	tmpCursor2;
	let	path;

	if (!blockCoord || !considerBoostedBool)
		return (null);
	if (piece.type != enumNames.CHAMPION || piece.isBoostedBool == null)
		return (null);
	currSquare = match.board.get(match.cursor.square);
	if (currSquare.dangerZones.has(ignoredCoord) == false)
		return (null);
	//checking if pieces different by ignored are menacing current position
	for (const dangerCoord of currSquare.dangerZones)
	{
		if (dangerCoord == ignoredCoord)
			continue ;
		dangerPiece = match.board.get(dangerCoord).piece;
		if (!dangerPiece)
			throw (`boostChampsNewBoost: invalid piece in ${dangerCoord}`);
		if (dangerPiece.team == piece.team)
			continue ;
		return (null);
	}
	tmpCursor2 = match.cursor.square;
	//if the piece that has move can still menace from blockCoord, skip
	path = pathFinding(match, blockCoord, match.cursor.square, ignoredCoord, "", false);
	match.cursor.square = tmpCursor2;
	if (path)
		return (null);
	//if the menacing piece can end its movement, the path is found
	path = pathFinding(match, start, match.cursor.square, ignoredCoord, blockCoord, false);
	match.cursor.square = tmpCursor2;
	if (!path)
		return (null);
	//path is found
	path.mid = path.to;
	path.to = dest;
	match.cursor.square = tmpCursor;
	return (path);
}
