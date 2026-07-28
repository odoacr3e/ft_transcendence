//@ts-check

//SECTION - checkLegalMoves function
/*
	list of exports:
	-	getLegalMoves:	returns an array of valid moves for a player
*/

import { Square } from "../Classes/Chess/chessBoard.js";
import { Player } from "../Classes/Chess/player.js";
import { arrayNames, arrayNamesTransform, enumNames } from "../Macro/enums.js";
import { isDangerous } from "../utils/checkDanger.js";

/** @typedef {import("../Classes/Chess/match").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move, moveBoost: Move | null, transform: string, boost: string}} Turn */


/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * @param {Match} match 
 * @param {string} team
 * */
export function getLegalMoves(match, team=match.currentPlayer.team)
{
	let	targetSquare;
	/** @type {Map<string, Set<string>>} */
	let	legalMovesMap = new Map();
	/** @type {Array<Turn>} */
	let	legalMovesArray = new Array();
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
			if (legalMovesMap.has(coord) == false)
				legalMovesMap.set(coord, new Set());
			legalMovesMap.get(coord)?.add(targetCoord);
		}
	}//@ts-ignore
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
 * */
function pushChildMoves(match, player, legalMovesArray, move)
{
	let	currTurn;
	let	boostedSquare;

	currTurn = {move: move, moveBoost: null, boost: "", transform: ""};
	legalMovesArray.push(currTurn);
	pushAllLegalBoost(match, player, legalMovesArray, currTurn);
	pushAllLegalTransform(match, player, legalMovesArray, currTurn, move.to, match.board.get(move.from));
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
				currTurn = {move: move, moveBoost: {from: key, to: zone}, boost: "", transform: ""};
				legalMovesArray.push(currTurn);
				pushAllLegalBoost(match, player, legalMovesArray, currTurn);
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
			currTurn = {move: move, moveBoost: {from: player.boostedPiece, to: target}, boost: "", transform: ""};
			legalMovesArray.push(currTurn);
			pushAllLegalBoost(match, player, legalMovesArray, currTurn);
			pushAllLegalTransform(match, player, legalMovesArray, currTurn, target, boostedSquare);
		}
	}
}

/**
 * returns an array of valid moves for a player.
 * the array elements are formatted as: {from: coord, to: coord}.
 * @param {Match} match 
 * @param {Player} player
 * @param {Array<Turn>} legalMovesArray
 * @param {Turn} currTurn
 * */
function pushAllLegalBoost(match, player, legalMovesArray, currTurn)
{
	let	turnWithBoost;

	if (player.nPoints == 0)
		return ;
	for (const [coord, square] of match.board)
	{
		if (!square.piece)
			continue ;
		if (square.piece.team != player.team)
			continue ;
		if (square.piece.price > player.nPoints)
			continue ;
		turnWithBoost = structuredClone(currTurn);
		turnWithBoost.boost = coord;
		legalMovesArray.push(turnWithBoost);
	}
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

	match.cursor.Save();
	match.cursor.set(destCoord);
	if (!square.piece)
		throw ("");
	bastardEdgeBool = square.piece.type == enumNames.BASTARDS && match.cursor.EdgeCheck(player.team);
	match.cursor.Restore();
	if (!bastardEdgeBool)
		return ;
	for (const type of arrayNamesTransform)
	{
		turnWithTransform = structuredClone(currTurn);
		turnWithTransform.transform = type;
		legalMovesArray.push(turnWithTransform);
	}
}

// giorgi0:
// {
// 	white: "e1" | null,
// 	black: "e1" | null,
// 	red: "e1" | null,
// 	blue: "e1" | null,
// 	yellow: "e1" | null,
// 	green: "e1" | null,
// }

// function minMax(match, ai, legalMovesArray, depth, team)
// {

// }