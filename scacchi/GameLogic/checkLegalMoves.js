//@ts-check

//SECTION - checkLegalMoves function
/*
	list of exports:
	-	getLegalMoves:	returns an array of valid moves for a player
*/

import { Square } from "../Classes/Chess/chessBoard.js";
import { Player } from "../Classes/Chess/player.js";
import { arrayNamesDoubleMove, enumNames } from "../Macro/enums.js";
import { isDangerous } from "../utils/checkDanger.js";
import { includesOneOf } from "../utils/string.js";

/** @typedef {import("../Classes/Chess/match").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string}} Turn */


/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * @param {Match} match 
 * @param {string} team
 * @returns {Array<Turn>}
 * */
export function getLegalMoves(match, team=match.currentPlayer.team, infoBool=true)
{
	let	targetSquare;
	/** @type {Map<string, Set<string>>} */
	let	legalMovesMap = new Map();
	/** @type {Array<Turn>} */
	let	legalMovesArray = new Array();
	/** @type {Player} */
	let	player;

	for (const [coord, square] of match.board)
	{
		if (square.piece?.team != team)
			continue ;
		for (const targetCoord of square.targetZones)
		{
			targetSquare = match.board.get(targetCoord);
			if (targetSquare.piece?.team == square.piece?.team)
				continue ;
			if (square.piece?.type == enumNames.KING)
			{
				if (isDangerous(match, targetSquare.dangerZones, square.piece?.team))
					continue ;
			}
			if (infoBool == false)//@ts-ignore
				return (false);
			if (legalMovesMap.has(coord) == false)
				legalMovesMap.set(coord, new Set());
			legalMovesMap.get(coord)?.add(targetCoord);
		}
	}
	if (infoBool == false)//@ts-ignore
		return (true);
	//@ts-ignore
	player = match[team];
	for (const [coord, targetSet] of legalMovesMap)
	{// TODO - eventualmente controllo per vedere che il re sia al sicuro dopo la mossa
		for (const targetCoord of targetSet)
			pushChildMoves(match, player, legalMovesArray, {from: coord, to: targetCoord});
	}
	return (legalMovesArray);
}

//SECTION - utils

/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * @param {Match} match 
 * @param {Player} player
 * @param {Array<Turn>} legalMovesArray
 * @param {Move} move
 * @param {boolean} boostBool
 * */
function pushChildMoves(match, player, legalMovesArray, move, boostBool=false)
{
	let	currTurn;
	let	boostedSquare;

	if (boostBool == false)
		currTurn = {move: move, moveBoost: null, boost: "", transform: ""};
	else
		currTurn = {move: null, moveBoost: move, boost: "", transform: ""};
	legalMovesArray.push(currTurn);
	pushAllLegalBoost(match, player, legalMovesArray, currTurn);
	pushAllLegalTransform(match, player, legalMovesArray, currTurn, move.to, match.board.get(move.from));
	if (boostBool == true)
		return ;
	// se puoi fare un boost a partire da li
	boostedSquare = null;
	if (player.boostedPiece != '')
		boostedSquare = match.board.get(player.boostedPiece);
	else
		return ;
	if (!boostedSquare?.piece)
		throw (`pushChildMoves: coord ${player.boostedPiece}, boostedSquare ${boostedSquare} has no piece`);
	if (match.board.get(move.from).boostedTargetZones.size)
	{
		for (let [key, value] of match.board.get(move.from).boostedTargetZones)
		{
			for (let zone of value)
			{
				if (move.from == key || move.to == zone)
					continue ;
				if (includesOneOf(boostedSquare.piece.type, enumNames.CHAMPION, enumNames.MINOTAURUS) && move.to != key)
					continue ;
				currTurn = {move: move, moveBoost: {from: key, to: zone}, boost: "", transform: ""};
				legalMovesArray.push(currTurn);
				pushAllLegalBoost(match, player, legalMovesArray, currTurn, true);
				pushAllLegalTransform(match, player, legalMovesArray, currTurn, zone, boostedSquare);
			}
		}
	}
	else if (boostedSquare.piece.type == enumNames.BASTARDS)
	{
		if (boostedSquare.boostedTargetZones.get(player.boostedPiece)?.has(move.from) != true)
			return ;
		for (const target of boostedSquare.targetZones)
		{
			if (move.from == player.boostedPiece || move.to == target)
				continue ;
			currTurn = {move: move, moveBoost: {from: player.boostedPiece, to: target}, boost: "", transform: ""};
			legalMovesArray.push(currTurn);
			pushAllLegalBoost(match, player, legalMovesArray, currTurn, true);
			pushAllLegalTransform(match, player, legalMovesArray, currTurn, target, boostedSquare);
		}
	}
}

/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * TO OPTIMIZE AI speed, boosts are considered only when:
 * 1)	player has no boosted piece;
 * 2)	only the most expensive boost is considered
 * @param {Match} match 
 * @param {Player} player
 * @param {Array<Turn>} legalMovesArray
 * @param {Turn} currTurn
 * @param {boolean} usedBoostBool
 * */
function pushAllLegalBoost(match, player, legalMovesArray, currTurn, usedBoostBool=false)
{
	/** @type {{coord: string, price: number} | null} */
	let	bestBoost = null;
	let	points;
	let	from;
	let	to;
	let	toPiece;

	from = currTurn.move? currTurn.move.from : currTurn.moveBoost?.from;
	to = currTurn.moveBoost? currTurn.moveBoost.to : currTurn.move?.to;//@ts-ignore
	toPiece = match.board.get(to).piece;
	points = player.nPoints + (toPiece && toPiece.team != player.team ? toPiece?.price : 0); 
	if (points == 0)
		return ;
	for (const [coord, square] of match.board)
	{
		if (!square.piece)
			continue ;
		if (square.piece.team != player.team)
			continue ;
		if (square.piece.price > points)
			continue ;
		if (coord == from)
			continue ;
		if (coord == player.boostedPiece || (coord == to && from == player.boostedPiece))
			continue ;
		if (!bestBoost || square.piece.price > bestBoost.price)
			bestBoost = {coord: coord, price: square.piece.price};
		else if (square.piece.type == enumNames.JESTER && square.piece.moveCount == 0)
		{
			pushOneBoost(coord, legalMovesArray, currTurn);
		}
	}
	if (!bestBoost)
		return ;
	pushOneBoost(bestBoost.coord, legalMovesArray, currTurn);
}

/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * TO OPTIMIZE AI speed, boosts are considered only when:
 * 1)	player has no boosted piece;
 * 2)	only the most expensive boost is considered
 * @param {string} coord
 * @param {Array<Turn>} legalMovesArray
 * @param {Turn} currTurn
 * */
function pushOneBoost(coord, legalMovesArray, currTurn)
{
	let	turnWithBoost;

	turnWithBoost = structuredClone(currTurn);
	if (coord != turnWithBoost.move?.from && coord != turnWithBoost.moveBoost?.from)
		turnWithBoost.boost = coord;
	else if (turnWithBoost.moveBoost)
		turnWithBoost.boost = turnWithBoost.moveBoost.to;
	else //@ts-ignore
		turnWithBoost.boost = turnWithBoost.move.to;
	legalMovesArray.push(turnWithBoost);
}

/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * @param {Match} match 
 * @param {Player} player
 * @param {Array<Turn>} legalMovesArray
 * @param {Turn} currTurn
 * @param {string} destCoord
 * @param {Square} square
 * */
function pushAllLegalTransform(match, player, legalMovesArray, currTurn, destCoord, square)
{
	let	bastardEdgeBool;
	let	turnWithTransform;
	let edgeBool;

	match.cursor.Save();
	match.cursor.set(destCoord);
	if (!square.piece)
		throw ("");
	edgeBool = match.cursor.EdgeCheck(player.team);
	bastardEdgeBool = square.piece.type == enumNames.BASTARDS && edgeBool;
	match.cursor.Restore();
	if (!bastardEdgeBool)
		return ;
	//NOTE - AI prova a transformare solo in champion
	turnWithTransform = structuredClone(currTurn);
	turnWithTransform.transform = enumNames.CHAMPION;
	legalMovesArray.push(turnWithTransform);
	// for (const type of arrayNamesTransform)
	// {
	// 	turnWithTransform = structuredClone(currTurn);
	// 	turnWithTransform.transform = type;
	// 	legalMovesArray.push(turnWithTransform);
	// }
}