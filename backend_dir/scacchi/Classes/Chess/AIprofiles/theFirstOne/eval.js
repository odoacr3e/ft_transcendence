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
	//4)	PIU quanto minaccio il re avversario
	if (checkKingDanger(match, nextPlayer.team))
		score += match.board.get(nextPlayer.King).dangerZones.size * 10;
	return (score);
}
