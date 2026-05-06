import { localBoard } from "../Data/Variables"
import { setHighlighTrue } from "../Events/Global";

const PIECES_HIGHLIGHT = Object.freeze ({
	// "King" : KingHL,
	// "Champion" : ChampionHL,
	"Jester" : JesterHL,
	// "Valkirya" : ValkiryaHL,
	// "Minotaurus" : MinotaurusHL,
	// "Bastards" : BastardsHL,
})

export function JesterHL(squareId)
{
	const square = localBoard.get(squareId);
	const useAbility = square.piece.useAbility && square.piece.isBoostedBool;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}`);
	

	if (useAbility)
	{
		console.log("entrato");
		
		setHighlighTrue(regularMoves, "regular");
		setHighlighTrue(boostedMoves, "boosted");
	}
	else
		setHighlighTrue(regularMoves, "regular");
}

export { PIECES_HIGHLIGHT }