//@ts-check

//SECTION - checkLegalMoves function
/*
	list of exports:
	-	getLegalMoves:	returns an array of valid moves for a player
*/

import { Square } from "../Classes/Chess/chessBoard.js";
import { Player } from "../Classes/Chess/player.js";
import { enumNames } from "../Macro/enums.js";
import { isDangerous } from "../utils/checkDanger.js";
import { isOneOf } from "../utils/string.js";
import { render } from "../test/render.js";
import fs, { truncate } from "fs";
import { simulation } from "./simulation.js";

/** @typedef {import("../Classes/Chess/match").Match} Match*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string, canEat?: boolean, attacker?: number, eaten?: number}} Turn */


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
	/** @type {Map<string, Set<string>>} */
	let	legalMovesEatMap = new Map();
	/** @type {Map<string, Set<string>>} */
	let	legalBoostedMovesMap = new Map();
	/** @type {Map<string, Set<string>>} */
	let	legalBoostedMovesEatMap = new Map();
	/** @type {Array<Turn>} */
	let	legalMovesArray = new Array();
	/** @type {Player} */
	let	player;
	let tmp;
	let	tmpMap;

	for (const [coord, square] of match.board)
	{
		tmp = structuredClone(square.targetZones);
		if (square.piece?.team != team)
			continue ;
		for (const targetCoord of tmp)
		{
			targetSquare = match.board.get(targetCoord);
			if (targetSquare.piece?.team == square.piece?.team)
				continue ;
			if (square.piece?.type == enumNames.KING)
			{
				if (isDangerous(match, targetSquare.dangerZones, square.piece?.team))
					continue ;
			}
			if (infoBool == false)
			{
				if (square.piece.type != enumNames.KING)//@ts-ignore
					return false;
				else
				{
					let currTeam = match.currentPlayer.team;
					match.endTurn();
					if (targetSquare.piece && targetSquare.piece?.team == match.board.get(coord).piece?.team)
						continue ;
					if (simulation([coord, targetCoord], match) == true)
					{
						while (currTeam != match.currentPlayer.team)
							match.endTurn();//@ts-ignore
						return false;
					}
					while (currTeam != match.currentPlayer.team)
						match.endTurn();
				}
			}
			if (targetSquare.piece)
			{
				if (legalMovesEatMap.has(coord) == false)
					legalMovesEatMap.set(coord, new Set());
				legalMovesEatMap.get(coord)?.add(targetCoord);//@ts-ignore
				legalMovesArray.canEat = true;
			}
			else
			{
				if (legalMovesMap.has(coord) == false)
					legalMovesMap.set(coord, new Set());
				legalMovesMap.get(coord)?.add(targetCoord);
			}
		}
		for (const [startCoord, targets] of square.boostedTargetZones)
		{
			if (startCoord != coord || square.piece.type == enumNames.BASTARDS)
				break ;
			for (const target of targets)
			{
				targetSquare = match.board.get(target);
				if (targetSquare.piece?.team == square.piece?.team)
					continue ;
				if (infoBool == false)//@ts-ignore
					return false;
				if (targetSquare.piece)
				{
					tmpMap = legalBoostedMovesEatMap;//@ts-ignore
					legalMovesArray.canEat = true;
				}
				else
					tmpMap = legalBoostedMovesMap;
				if (tmpMap.has(coord) == false)
					tmpMap.set(coord, new Set());
				tmpMap.get(coord)?.add(target);
			}
		}
	}
	if (infoBool == false)//@ts-ignore
		return (true);
	//@ts-ignore
	player = match[team];
	for (const [coord, targetSet] of legalMovesEatMap)
	{
		for (const targetCoord of targetSet)
			pushChildMoves(match, player, legalMovesArray, {from: coord, to: targetCoord}, false, true);
	}
	for (const [coord, targetSet] of legalMovesMap)
	{
		for (const targetCoord of targetSet)
			pushChildMoves(match, player, legalMovesArray, {from: coord, to: targetCoord});
	}
	for (const [coord, targetSet] of legalBoostedMovesEatMap)
	{
		for (const targetCoord of targetSet)
			pushChildMoves(match, player, legalMovesArray, {from: coord, to: targetCoord}, true, false);
	}
	for (const [coord, targetSet] of legalBoostedMovesMap)
	{
		for (const targetCoord of targetSet)
			pushChildMoves(match, player, legalMovesArray, {from: coord, to: targetCoord}, true);
	}
	legalMovesArray.sort(optimizeSort);
	// render(match);
	//fs.rmSync("TEST");
	//fs.writeFileSync("TEST", JSON.stringify(legalMovesArray, null, 2));
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
 * @param {boolean} eatBool
 * */
function pushChildMoves(match, player, legalMovesArray, move, boostBool=false, eatBool=false)
{
	let	currTurn;
	let	boostedSquare;

	if (boostBool == false)
		currTurn = {move: move, moveBoost: null, boost: "", transform: "", canEat: eatBool};
	else
		currTurn = {move: null, moveBoost: move, boost: "", transform: "", canEat: eatBool};
	addTransform(match, player, legalMovesArray, currTurn, move.to, match.board.get(move.from));
	formatMVV(match, currTurn);
	legalMovesArray.push(currTurn);
	if (currTurn.transform)
		return ;
	pushAllLegalBoost(match, player, legalMovesArray, currTurn);
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
				if (isOneOf(boostedSquare.piece.type, enumNames.CHAMPION, enumNames.MINOTAURUS) && move.to != key)
					continue ;
				currTurn = {move: move, moveBoost: {from: key, to: zone}, boost: "", transform: ""};
				legalMovesArray.push(currTurn);
				pushAllLegalBoost(match, player, legalMovesArray, currTurn, true);
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
		}
	}
}

/**
 * 
 * @param {Match} match 
 * @param {Turn} currTurn 
 */
function formatMVV(match, currTurn)
{
	let tmp;
	let tmp2;

	if (!currTurn.canEat)
			return ;
	if (!currTurn.move && currTurn.moveBoost)
	{
		currTurn.attacker = match.board.get(currTurn.moveBoost.from).piece?.price;
		currTurn.eaten = match.board.get(currTurn.moveBoost.to).piece?.price;
	}
	else if (currTurn.move && !currTurn.moveBoost)
	{
		currTurn.attacker = match.board.get(currTurn.move.from).piece?.price;
		currTurn.eaten = match.board.get(currTurn.move.to).piece?.price;
	}
	else if (currTurn.move && currTurn.moveBoost)
	{
		if (currTurn.move.to != currTurn.moveBoost.from)
			return ;
		tmp = match.board.get(currTurn.move.to).piece;
		tmp2 = match.board.get(currTurn.moveBoost.to).piece;
		currTurn.attacker = match.board.get(currTurn.move.from).piece?.price;
		currTurn.eaten = 0;
		if (tmp2) //@ts-ignore
			currTurn.eaten += match.board.get(currTurn.moveBoost.to).piece?.price;
		if (tmp) //@ts-ignore
			currTurn.eaten += match.board.get(currTurn.move.to).piece?.price;
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
		if (coord == to)//@ts-ignore
			toPiece = match.board.get(from).piece;
		else
			toPiece = square.piece;
		if (!toPiece)
			continue ;
		if (toPiece.team != player.team)
			continue ;
		if (toPiece.price > points)
			continue ;
		if (coord == from)
			continue ;
		if (coord == player.boostedPiece || (coord == to && from == player.boostedPiece))
			continue ;
		if (!bestBoost || toPiece.price > bestBoost.price)
			bestBoost = {coord: coord, price: toPiece.price};
		else if (toPiece.type == enumNames.JESTER && toPiece.moveCount == 0)
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
function addTransform(match, player, legalMovesArray, currTurn, destCoord, square)
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
		return false;
	//NOTE - AI prova a transformare solo in champion
	//turnWithTransform = structuredClone(currTurn);
	//turnWithTransform.transform = enumNames.CHAMPION;
	currTurn.transform = enumNames.CHAMPION;
	//legalMovesArray.push(turnWithTransform);
	return true;
	// for (const type of arrayNamesTransform)
	// {
	// 	turnWithTransform = structuredClone(currTurn);
	// 	turnWithTransform.transform = type;
	// 	legalMovesArray.push(turnWithTransform);
	// }
}

/**
 * 
 * @param {Turn} turn1 
 * @param {Turn} turn2 
 */
function optimizeSort(turn1, turn2)
{
	if (!turn1.attacker && !turn2.attacker)
		return 0;
	else if (!turn1.attacker)
		return 1;
	else if (!turn2.attacker)
		return -1;
    return (turn2.eaten - turn2.attacker) - (turn1.eaten - turn1.attacker);
}
