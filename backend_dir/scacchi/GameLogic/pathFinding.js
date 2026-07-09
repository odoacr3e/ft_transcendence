//@ts-check

//SECTION - pathFinding functions
/*
	list of exports:
	-	checkPieceDanger:	checks piece danger ignoring a coord
	-	pathFinding:		check if is possible to go from start to dest
*/

import {movePiece} from "../utils/dangerUpdate.js";

/** @typedef {import("../Classes/Chess/match.js").Match} Match*/
/** @typedef {import("../Classes/Chess/Pieces/pieces.js").Piece} Piece*/
/** @typedef {import("../Classes/Chess/chessBoard.js").Square} Square*/

//FIXME - spostare da qualche altra parte
/**
 * checks piece danger ignoring a coord
 * @param {Match} match 
 * @param {string} checkDangerCoord the coord source of danger 
 * @param {Piece} piece the piece to check
 * @param {string} pieceCoord the current piece coord
 * @param {string} ignoreCoord the coord to ignore (usually is the `from` coord)
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
		if (pathFinding(match, dangerCoord, pieceCoord, ignoreCoord, true) != null)
		{
			return (true);
		}
	}
	return (false);
}

//FIXME - refactorizzare (semplificare, tanta roba inutile)
/**
 * check if is possible to go from start to dest
 * @param {Match} match 
 * @param {Square | string} start 
 * @param {string} dest
 * @param {Set<string> | string} ignoredCoords
 * @param {boolean} considerBoostedBool 
 */
export function pathFinding(match, start, dest, ignoredCoords=new Set, considerBoostedBool=false)
{
	let	startArray = new Set;
	let	startCoord;
	let	destCoord;
	let	reverseMove = {dx: 0, dy: 0};
	let	moveData;

	//finds data for start, dest and ignoredCoords
	if (typeof(start) == "string")
	{
		startCoord = start;
		start = match.board.get(start);
	}
	else
		startCoord = start.piece?.pos;
	destCoord = dest;
	if (typeof(ignoredCoords) == "string")
		ignoredCoords = new Set().add(ignoredCoords);
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
		moveData = moveSimulation(match, start.piece, destCoord, startArray, reverseMove, ignoredCoords);
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
 * @param {Piece} startPiece
 * @param {string} start
 * @param {Set<string>} destArray 
 * @param {{dx: number, dy: number}} move
 * @param {Set<string>} ignoredCoords 
 */
function moveSimulation(match, startPiece, start, destArray, move, ignoredCoords=new Set)
{
	let	square;
	let	moveData;

	match.cursor.Save();
	match.cursor.set(start);
	while (movePiece(match, move.dy, move.dx))
	{
		if (ignoredCoords.has(match.cursor.square))
		{
			if (!startPiece.moveLongRangeDEBUG)
				break ;
			continue ;
		}
		if (destArray.has(match.cursor.square))//trovato path valido
		{
			moveData = {from: start, to: match.cursor.square};
			match.cursor.Restore();
			return (moveData);
		}
		square = match.board.get(match.cursor.square);
		if (square.piece || !startPiece.moveLongRangeDEBUG)
			break ;
	}
	match.cursor.Restore();
	return (null);
}
