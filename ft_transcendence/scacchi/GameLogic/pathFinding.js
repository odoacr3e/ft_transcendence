//@ts-check

import {movePiece, DangerUpdate, dangerUpdateAll, dangerUpdateMoved} from "../utils/moveUtils.js";

/** @typedef {import("../Classes/Match/match.js").Match} Match*/
/** @typedef {import("../Classes/Pieces/pieces.js").Piece} Piece*/
/** @typedef {import("../Classes/ChessBoard/chessBoard.js").Square} Square*/

/**
 * 
 * @param {Match} match 
 * @param {string} checkDangerCoord 
 * @param {Piece} piece 
 * @param {string} pieceCoord
 * @param {string} ignoreCoord 
 * @returns 
 */
export function checkPieceDanger(match, checkDangerCoord, piece, pieceCoord, ignoreCoord)
{
	let	square;
	let	dangerSquare;

	square = match.board.get(checkDangerCoord);
	for (const dangerCoord of square.dangerZones)
	{
		dangerSquare = match.board.get(dangerCoord);
		if (dangerSquare.piece?.team == piece.team)
			continue ;
		if (pathFinding(match, dangerCoord, pieceCoord, ignoreCoord) != null)
		{
			return (true);
		}
	}
	return (false);
}

/**
 * check if is possible to go from start to dest
 * @param {Match} match 
 * @param {Square | string} start 
 * @param {string} dest
 * @param {string} ignoredCoord
 * @param {boolean} considerBoostedBool 
 */
export function pathFinding(match, start, dest, ignoredCoord="", considerBoostedBool=false)
{
	let	startArray = new Set;
	let	startCoord;
	let	destCoord;
	let	reverseMove = {dx: 0, dy: 0};
	let	moveData;

	//finds data for start, dest and ignoredCoord
	if (typeof(start) == "string")
	{
		startCoord = start;
		start = match.board.get(start);
	}
	else
		startCoord = start.piece?.pos;
	destCoord = dest;
	if (!start.piece || !startCoord || !destCoord)
		throw (`pathFinding: invalid parameters`);
	//for optimization, the search will go from dest to start
	//because you have one dest but multiple start (boosted zones)
	startArray.add(startCoord);
	if (considerBoostedBool == true)
	{
		for (const boostStart in start.boostedTargetZones)
			startArray.add(boostStart);
	}
	//reverse movement from dest to start
	for (const move of start.piece.moveArray)
	{
		reverseMove.dx = -move.dx;
		reverseMove.dy = -move.dy;
		//move simulation takes reverted input
		moveData = moveSimulation(match, destCoord, startArray, reverseMove, ignoredCoord);
		if (moveData)
		{//if exist a path, swaps from with to
			let	tmp = moveData.from;
			moveData.to = tmp;
			moveData.from = moveData.to;
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
 * @param {{dx: number, dy: number}} move
 * @param {string} ignoredCoord 
 */
function moveSimulation(match, start, destArray, move, ignoredCoord)
{
	let	square;
	let	moveData;

	match.cursor.Save();
	match.cursor.set(start);
	while (movePiece(match, move.dy, move.dx))
	{
		if (ignoredCoord == match.cursor.square)
			continue ;
		if (destArray.has(match.cursor.square))//trovato path valido
		{
			moveData = {from: start, to: match.cursor.square};
			match.cursor.Restore();
			return (moveData);
		}
		square = match.board.get(match.cursor.square);
		if (square.piece)
			break ;
	}
	match.cursor.Restore();
	return (null);
}
