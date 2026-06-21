// @ts-check
import {berserkMode} from "./berserkMode.js";
import {movePiece} from "../../utils/moveUtils.js";
import {isDangerous} from "../../utils/gameUtils.js";
import { enumNames } from "../../Macro/enums.js";
import { checkPieceDanger } from "../../GameLogic/pathFinding.js";

/** @typedef {import("../Match/match.js").Match} Match*/
/** @typedef {import("../Pieces/pieces.js").Piece} Piece*/

/**
 * 
 * @param {*} match 
 * @returns 
 */
let movementChampion = function (match)
{
	let	startPos;
	let	piece;
	let	otherSquare;
	let	menaceFromStartBool;

	startPos = match.cursor.square;
	piece = match.board.get(match.cursor.square)?.piece;
	if (piece == undefined)
		return (0);
	if (piece.pos != startPos)
		throw (`movementChampion: mismatch: startPos ${startPos}, piece.pos ${piece.pos}`);
	for (let {dx, dy} of piece.moveArray)
	{
		match.cursor.square = startPos;
		if (movePiece(match, dx, dy) == false)
			continue ;
		menaceFromStartBool = checkPieceDanger(match, startPos, piece, match.cursor.square, startPos, match.cursor.square, true);
		do
		{
			otherSquare = match.board.get(match.cursor.square);
			if (otherSquare.piece != null && otherSquare.piece.team != piece.team)
				menaceFromStartBool = checkPieceDanger(match, startPos, piece, match.cursor.square, startPos, match.cursor.square, true);
			otherSquare.dangerZones.add(startPos);
			match.board.get(startPos)?.targetZones.add(match.cursor.square);
			match.board.AddInfluence(startPos, match.cursor.square);
			if (!menaceFromStartBool && 
			!isDangerous(match, otherSquare.dangerZones, piece.team) && 
			(otherSquare.piece == null || 
			otherSquare.piece?.team != piece.team))
				berserkMode(startPos, match);
			if (otherSquare.piece != null)
				break ;
		}
		while (movePiece(match, dx, dy, false))
	}
	match.cursor.square = startPos;
	return (1);
}

// /**
//  * 
//  * @param {Match} match 
//  * @param {Piece} piece 
//  * @returns 
//  */
// function champDangerCheck(match, piece)
// {
// 	let	currSquare;
// 	let	otherSquare;

// 	currSquare = match.board.get(match.cursor.square);
// 	if (!isDangerous(match, currSquare.dangerZones, piece.team))
// 		return (true);
// 	//other boosted champions does not menace other champions
// 	for (const otherCoord of currSquare.dangerZones)
// 	{
// 		if (otherCoord == piece.pos)
// 			continue ;
// 		otherSquare = match.board.get(otherCoord);
// 		if (!otherSquare.piece)
// 			throw (`movement Champion: danger zone ${otherCoord} of ${match.cursor.square} empty`);
// 		if (otherSquare.piece.type != enumNames.CHAMPION)
// 			return (false);
// 		if (otherSquare.targetZones.has(match.cursor.square))
// 			return (false);
// 		match.board.AddInfluence(piece.pos, otherCoord);
// 	}
// 	return (true);
// }

export {movementChampion};