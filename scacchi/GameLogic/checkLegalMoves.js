//@ts-check

//SECTION - checkLegalMoves function
/*
	list of exports:
	-	getLegalMoves:	returns an array of valid moves for a player
*/

import { enumNames } from "../Macro/enums.js";
import { isDangerous } from "../utils/checkDanger.js";

/** @typedef {import("../Classes/Chess/match").Match} Match*/

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
	/** @type {Array<{from: string, to: string}>} */
	let	legalMovesArray = new Array();

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
	}
	for (const [coord, targetSet] of legalMovesMap)
	{// TODO - eventualmente controllo per vedere che il re sia al sicuro dopo la mossa
		for (const targetCoord of targetSet)
			legalMovesArray.push({from: coord, to: targetCoord});
	}
	return (legalMovesArray);
}
