//@ts-check

import { checkKingDanger } from "../../../../utils/checkDanger.js";

/** @typedef {import("../../match.js").Match} Match*/
/** @typedef {import("../../AI.js").AI<null>} AI*/
/** @typedef {{from: string, to: string}} Move */
/** @typedef {{move: Move | null, moveBoost: Move | null, transform: string, boost: string}} Turn */

/**
 * 
 * @param {Match} match 
 * @param {AI} ai 
 * @param {Array<Turn>} turns 
 */
export function AI_first_eval(match, ai, turns)
{
	let	nextPlayer;
	let	boostedPiece;
	let	otherBoostedPiece;
	let	score;
	let	lastTurn;
	let	square;
	let	price;

	nextPlayer = match.NextPlayer();
	//1)	differenza punti
	score = (match.currentPlayer.nPoints - nextPlayer.nPoints) * 10;
	boostedPiece = match.board._data.get(match.currentPlayer.boostedPiece);
	otherBoostedPiece = match.board._data.get(nextPlayer.boostedPiece);
	//2)	PIU valore pezzo boostato nostro
	if (boostedPiece && boostedPiece.piece)
		score += boostedPiece.piece.price * 4;
	//3)	MENO valore pezzo boostato avversario
	if (otherBoostedPiece && otherBoostedPiece.piece)
		score -= otherBoostedPiece.piece.price * 4;
	lastTurn = turns[turns.length - 2];
	if (lastTurn?.move)
	{
		square = match.board.get(lastTurn.move.to);
		score -= square.targetZones.size;
		for (const coord of square.dangerZones)
		{
			if (match.board.get(coord).piece?.team != square.piece?.team)
				score += 1;
			else
				score -= 1;
		}
	}
	return (score);
}