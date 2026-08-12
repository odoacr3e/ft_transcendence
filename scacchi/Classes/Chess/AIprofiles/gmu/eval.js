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
export function AI_gmu_eval(match, ai, turns)
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
	score = (match.currentPlayer.nPoints - nextPlayer.nPoints) * 5;
	boostedPiece = match.board._data.get(match.currentPlayer.boostedPiece);
	otherBoostedPiece = match.board._data.get(nextPlayer.boostedPiece);
	//2)	PIU valore pezzo boostato nostro
	if (boostedPiece && boostedPiece.piece)
		score += boostedPiece.piece.price * 7;
	//3)	MENO valore pezzo boostato avversario
	if (otherBoostedPiece && otherBoostedPiece.piece)
		score -= otherBoostedPiece.piece.price * 7;
	//4)	PIU quanto minaccio il re avversario
	if (checkKingDanger(match, nextPlayer.team))
	for (const dangerCoord of match.board.get(nextPlayer.King).dangerZones)
	{
		square = match.board.get(dangerCoord);
		if (!square.piece || square.piece.team == match.currentPlayer.team)
			continue ;
		score += 75;
	}
	lastTurn = turns[turns.length - 2];
	if (lastTurn?.boost)
	{
		price = match.board.get(lastTurn.boost).piece?.price;
		price = price? price : 0;
		score -= 4 * price;
		for (const [key, boostTarget] of match.board.get(lastTurn.boost).boostedTargetZones)
			score += boostTarget.size;
	}
	return (score);
}