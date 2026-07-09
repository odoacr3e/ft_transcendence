// @ts-check

//SECTION - moveLogic functions
/*
	list of exports:
	-	updateChessBoard:	given a valid move, it updates the chessBoard.
*/

import {dangerUpdateMoved} from "../utils/dangerUpdate.js";
import {Match} from "../Classes/Chess/match.js";
import {error, Result} from "../handlers/game/utils.js";
import {printSwap} from "../test/render.js";
import { moveCastling } from "./Castling.js";

//FIXME - da mettere alcune funzioni in un utilis

/**
 * 
 * @param {Array<string>} coords
 * @param {Result} result
 * @param {Match} match
 * @param {boolean} boostBool
 */
export function updateChessboard(coords=[], result, match, boostBool)
{
	let	from;
	let	to;

	if (match.currentPlayer.castlingArray.has(coords[0]))
		match.currentPlayer.castlingArray.delete(coords[0]);
	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	if (!from || !to || !from.piece)
	{
		return (error(result, 500, "from | to bug in moveFunction"));
	}
	if (result.usedBoost == true)
	{
		from.piece.isBoostedBool = false;
		match.currentPlayer.boostedPiece = "";
	}
	if (coords[0] == match.currentPlayer.King)
		match.currentPlayer.King = coords[1];
	printSwap(match, coords, from, to);
	if (to.piece && to.piece.team != from.piece.team)
	{
		console.log(`player ${match.currentPlayer.team} + ${to.piece.price}💲`);
		match.currentPlayer.nPoints += to.piece.price;//@ts-ignore
		match[to.piece.team].nPieces -= 1;
		if (to.piece.isBoostedBool == true)//@ts-ignore
			match[to.piece.team].boostedPiece = "";
	}
	match.history.UpdateMoves(match, from, coords, boostBool);
	if (result.specialMoves.CheckSniperMove())
	{
		to.piece = null;
		from.piece.isBoostedBool = false;
		match.currentPlayer.boostedPiece = "";
	}
	else if (result.specialMoves.CheckCastling())
		moveCastling(match, from, to);
	else
	{
		to.piece = from.piece;
		from.piece = null;
		to.piece.pos = coords[1];
		if (to.piece.isBoostedBool)
			match.currentPlayer.boostedPiece = to.piece.pos;
		else if (boostBool)
		{
			match.currentPlayer.boostedPiece = "";
			match.boostPriority.delete(match.currentPlayer.team);
		}
	}
	if (to.piece && to.piece.isMovedBool == false)
		to.piece.isMovedBool = true;
	dangerUpdateMoved(match, coords, true);
	match.moves++;
	return (true);
}