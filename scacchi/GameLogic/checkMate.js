// @ts-check
import { Chess } from "../lib/lib.js";
import {Result} from "../Classes/endPoint/result.js";
const {preset} = Chess;
import {enumNames} from "../Macro/enums.js";
import {Match} from "../Classes/Match/match.js";
import {isDangerous} from "../utils/gameUtils.js";
import { movePiece } from "../utils/moveUtils.js";
import { Square } from "../Classes/ChessBoard/chessBoard.js";

/**
 * 
 * @param {Match} match
 * @param {string} kingSquare 
 * @param {string} enemySquare 
 */
function getDirection(match, kingSquare, enemySquare)
{
	let rowK, rowE, diffRow;
	let colK, colE, diffCol;

	match.cursor.square = kingSquare;
	rowK = match.cursor.getRow();
	colK = match.cursor.getCol();
	match.cursor.square = enemySquare;
	rowE = match.cursor.getRow();
	colE = match.cursor.getCol();
	diffRow = rowK - rowE;
	diffCol = colK - colE;
	if (diffRow != 0)
		diffRow /= Math.abs(diffRow);
	if (diffCol != 0)
		diffCol /= Math.abs(diffCol);
	return ({diffRow, diffCol});
}

/**
 * Checks if a piece that is menacing the king can be eaten
 * @param {Match} match
 * @param {string} kingSquare 
 * @param {string} enemySquareString 
 * @returns {boolean} 
 */
function isStoppable(match, kingSquare, enemySquareString)
{
	let	square;
	let	enemySquare;

	enemySquare = match.board.get(enemySquareString);
	if (!enemySquare)
		throw ("given to isStoppable an invalid position");//FIXME - Ale: errore grave, dare 500
	if (enemySquare.piece?.type == enumNames.JESTER || 
	enemySquare.piece?.type == enumNames.BASTARDS || 
	(enemySquare.piece?.type == enumNames.VALKIRYA && 
	enemySquare.piece?.isBoostedBool == true) ||
	match.board.get(kingSquare)?.targetZones.has(enemySquareString))
		return false;
	let dir = getDirection(match, kingSquare, enemySquareString);
	match.cursor.setCursor(match.cursor.getRow() + dir.diffRow, match.cursor.getCol() + dir.diffCol);
	while (match.board.get(match.cursor.square)?.piece?.type != enumNames.KING)
	{
		square = match.board.get(match.cursor.square);
		if (!square || !square.dangerZones)
			continue ;
		for (let x of square.dangerZones)
		{
			if (match.board.get(x)?.piece?.team == match.board.get(kingSquare)?.piece?.team)
				return true;
		}
		match.cursor.setCursor(match.cursor.getRow() + dir.diffRow, match.cursor.getCol() + dir.diffCol);
	}
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {string} startPos 
 * @param {string} target 
 * @returns 
 */
function canEat(match, startPos, target)
{
	match.cursor.set(startPos);
	match.cursor.setCol(match.cursor.getCol() - 1);
	if (match.cursor.square != target)
	{
		match.cursor.setCol(match.cursor.getCol() + 2);
		if (match.cursor.square != target)
		{
			match.cursor.set(startPos);
			return true;
		}
	}
	match.cursor.set(startPos);
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {Set<string>} threat 
 */
function doubleSave(match, threat)
{
	let arr = Array.from(threat);
	let	square1;
	let	square2;

	square1 = match.board.get(arr[0]);
	if (!square1)
		return false;
	square2 = match.board.get(arr[1]);
	if (!square2)
		return false;
	for (let x of square1.dangerZones)
	{
		if (square2.dangerZones.has(x) && match.board.get(x)?.piece?.team != square1.piece?.team && match.board.get(x)?.piece?.isBoostedBool && 
		(match.board.get(x)?.piece?.type == enumNames.MINOTAURUS || match.board.get(x)?.piece?.type == enumNames.CHAMPION))
		{
			let threat = match.board.get(x);
			if (threat == undefined)
				return false;
			for (let [key, value] of threat.boostedTargetZones)
			{
				if ((key == arr[0] && value.has(arr[1])) || (key == arr[1] && value.has(arr[0])))
					return true;
			}
		}
		else if (match.board.get(x)?.piece?.team != square1.piece?.team && 
		match.board.get(x)?.piece?.isBoostedBool && match.board.get(x)?.piece?.type == enumNames.BASTARDS)
		{
			let startPos = x;
			if (canEat(match, x, arr[1]))
			{
				match.cursor.set(x);
				for (let {dx, dy} of preset.Champion.movement)
				{
					match.cursor.setCursor(match.cursor.getRow() + dx, match.cursor.getCol() + dy)
					if (match.board.get(match.cursor.square)?.piece?.team != square1.piece?.team && match.board.get(match.cursor.square)?.targetZones.has(arr[1]))
						return true;
					match.cursor.set(startPos);
				}
			}
		}
		else if (match.board.get(x)?.piece?.team != square1.piece?.team)
		{
			let startPos = x;
			match.cursor.set(x);
			for (let {dx, dy} of preset.Champion.movement)
			{
				if (!movePiece(match, dy, dx))
				{
					match.cursor.set(x);
					continue ;
				}
				if (match.board.get(match.cursor.square)?.piece?.team != square1.piece?.team && match.board.get(match.cursor.square)?.targetZones.has(arr[1]) && (
					match.board.get(match.cursor.square)?.piece?.type == enumNames.BASTARDS && match.board.get(match.cursor.square)?.piece?.isBoostedBool == true && canEat(match, match.cursor.square, arr[0])))
					return true;
				match.cursor.set(startPos);
			}
		}
	}
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {string} kingCoord
 */
function CheckMateCheck(match, kingCoord)
{
	let threat = new Set;
	let kingSquare;
	let enemySquare;
	let enemyCoord;
	let team;

	kingSquare = match.board.get(kingCoord);
	if (!kingSquare)
		throw (`missing king for team `);
	team = kingSquare.piece?.team;
	if (!isDangerous(match, kingSquare.dangerZones, team))
		return false;
	for (let x of kingSquare.targetZones)//king can dodge?
	{
		if (!isDangerous(match, match.board.get(x).dangerZones, team) && match.board.get(x).piece == null)
			return false;
	}
	for (let x of kingSquare.dangerZones)
	{
		if (match.board.get(x).piece?.team != team)
		{
			enemySquare = x;
			threat.add(enemySquare);
		}
	}
	if (threat.size == 2 && doubleSave(match, threat))
		return true;
	if (threat.size >= 2)
		return true;
	if (!enemySquare) // ts-check stuff
		return false;
	enemyCoord = enemySquare;
	enemySquare = match.board.get(enemySquare);
	let enemySet = enemySquare.dangerZones;
	// if (!enemySet) // ts-check stuff
	// 	return false;
	// if (enemySet.has(enemySquare) && enemySet.has(kingCoord))
	// 	enemySet.delete(enemySquare);
	// if (isDangerous(match, enemySet, team) && enemySet.has(kingCoord))
	// 	enemySet?.delete(kingCoord);
	if (isDangerous(match, enemySet, enemySquare.piece?.team))
		// return false;
		return (cantMovePiece(match, enemyCoord, enemySquare, kingCoord));
	if (isStoppable(match, kingCoord, enemyCoord))
		return false;
	return true;
}

/**
 * 
 * @param {Match} match 
 * @param {Result | null} result
 * @param {boolean} lostBool
 */
function checkMateCheckAll(match, result, lostBool=false)
{
	if (match.playerNum == 4)
	{
		let tmp = match.currentPlayer;

		tmp = match[tmp.next];
		while (tmp != match.currentPlayer)
		{
			// @ts-ignore
			if (CheckMateCheck(match, match[match.currentPlayer.next].King))
			{
				if (lostBool == false)
					return (match.CheckMate(result), true);
				else
					return (match.PlayerLost(result, tmp), true);
			}
			tmp = match[tmp.next];
		}
	}
	// @ts-ignore
	else if (CheckMateCheck(match, match[match.currentPlayer.next].King))
		return (match.CheckMate(result), true);
	return (false);
}

/**
 * if I eat the piece that is menacing the king, 
 * a new king menace will arise?
 * @param {Match} match 
 * @param {string} enemyCoord 
 * @param {Square} enemySquare 
 * @param {string} kingCoord
 */
function cantMovePiece(match, enemyCoord, enemySquare, kingCoord)
{
	let	guardianSquare;
	let	guardianPiece;
	let	threatSquare;
	let	threatPiece;
	let	canReachKing;
	let	ignoredSquares;

	ignoredSquares = new Set(enemyCoord);
	for (const kingGuardianCoord of enemySquare.dangerZones)
	{
		guardianSquare = match.board.get(kingGuardianCoord);
		guardianPiece = guardianSquare.piece; 
		if (!guardianPiece)
			throw ("checkMate, cantMovePiece: guardian piece undefined");
		//checking every guardian danger zone
		for (const threatCoord of guardianSquare.dangerZones)
		{
			threatSquare = match.board.get(threatCoord);
			threatPiece = threatSquare.piece;
			if (!threatPiece)
				throw ("checkMate, cantMovePiece: threat piece undefined");
			if (threatPiece.team == guardianPiece.team)
				continue ;
			if (threatPiece.type == enumNames.JESTER)//it jumps over pieces anyway
				continue ;
			if (threatPiece.moveLongRangeDEBUG == false)//guardian not important 
				continue ;
			canReachKing = pathFinding(match, threatSquare, kingCoord, ignoredSquares, true);
			if (canReachKing != null)
				return (true);
		}
	}
	return (false);
}

/**
 * check if is possible to go from start to dest
 * @param {Match} match 
 * @param {Square | string} start 
 * @param {Square | string} dest
 * @param {Set<string>} ignoredCoords
 * @param {boolean} considerBoostedBool 
 */
function pathFinding(match, start, dest, ignoredCoords=new Set, considerBoostedBool=false)
{
	let	startArray = new Set;
	let	destCoord;
	let	reverseMove = {dx: 0, dy: 0};
	let	moveData;

	//for optimization, the search will go from dest to start
	//because you have one dest but multiple start (boosted zones)
	if (typeof(start) == "string")
		start = match.board.get(start);
	if (typeof(dest) == "string")
		dest = match.board.get(dest);
	if (!start.piece || !dest.piece)
		throw (`pathFinding: invalid start ${start.piece} /dest ${dest.piece}`);
	startArray.add(start.piece.pos);
	destCoord = dest.piece.pos;
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
		moveData = moveSimulation(match, destCoord, startArray, reverseMove, ignoredCoords);
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
 * @param {Set<string>} ignoredCoords 
 */
function moveSimulation(match, start, destArray, move, ignoredCoords=new Set)
{
	let	square;
	let	moveData;

	match.cursor.Save();
	while (movePiece(match, move.dy, move.dx))
	{
		if (ignoredCoords.has(match.cursor.square))
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

export {CheckMateCheck, checkMateCheckAll, getDirection};