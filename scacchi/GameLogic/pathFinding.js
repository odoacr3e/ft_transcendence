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
		moveData = moveSimulation(match, destCoord, startArray, startCoord, reverseMove, startSquare.piece, ignoredCoord, blockCoord);
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
 */
function moveSimulation(match, start, destArray, destCoord, move, piece, ignoredCoord, blockCoord)
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
		if (blockCoord == match.cursor.square)//square that will be occupied
		{
			if (destArray.size == 1 || !secondMoveSimulation(match, destArray, piece, destCoord, ignoredCoord, blockCoord)) 
				break ;
			moveData = {from: destCoord, mid: match.cursor.square, to: start};
			match.cursor.set(tmpCursor);
			return (moveData);
		}
		if (ignoredCoord == match.cursor.square)//square no longer occupied
		{
			if (piece.moveLongRangeDEBUG == false)
				break ;
			continue ;
		}
		if (destArray.has(match.cursor.square))//found valid path
		{
			tmpCursor2 = match.cursor.square;
			if (destArray.size != 1 && !secondMoveSimulation(match, destArray, piece, destCoord, "", blockCoord))
				//break ;
				continue ;
			//if dest has been reached in two moves, mid is set
			moveData = {from: destCoord, mid: destCoord == tmpCursor2 ? "": tmpCursor2, to: start};
			match.cursor.set(tmpCursor);
			return (moveData);
		}
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
 */
function secondMoveSimulation(match, destArray, piece, start, ignoredCoord, blockCoord)
{
	let	currCursor;
	let	path;
	let	eatenPiece;
	let	block;

	currCursor = match.cursor.square;
	if (currCursor == start)
		return (true);
	if (!blockCoord)
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