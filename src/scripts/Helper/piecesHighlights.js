import { localBoard, localInfo }	from "@/scripts/Data/Variables.js"
import { setHighlightTrue }			from "@/scripts/Events/utils/HighlightUtils.js";
import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";

export const PIECES_HIGHLIGHT = Object.freeze ({
	"King" : KingAndBastardsHL,
	"Champion" : ChampAndMinoHL,
	"Jester" : JesterHL,
	"Valkirya" : ValkiryaHL,
	"Minotaurus" : ChampAndMinoHL,
	"Bastards" : KingAndBastardsHL,
});

export function JesterHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	// console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}, team: ${team}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
	{
		setHighlightTrue(regularMoves, "regular", team);
		setHighlightTrue(boostedMoves, "boosted", team);
	}
	else if (regularMoves)
		setHighlightTrue(regularMoves, "regular", team);
	else
		throw Error("[JesterHL]: qualcosa è andato storto");
}

export function ValkiryaHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	// console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
		setHighlightTrue(boostedMoves, "boosted", team);
	else if (regularMoves)
		setHighlightTrue(regularMoves, "regular", team);
	else
		throw Error("[ValkiryaHL]: qualcosa è andato storto");
}

export function KingAndBastardsHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	// console.log(`boosted moves ${boostedMoves.size}, useAbility: ${useAbility}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
	{
		setHighlightTrue(regularMoves, "regular", team);
		setHighlightTrue(boostedMoves, "boosted", "both");
	}
	else if (regularMoves)
		setHighlightTrue(regularMoves, "regular", team);
	else
		throw Error("[KingAndBastardsHL]: qualcosa è andato storto");
}

export function ChampAndMinoHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = new Map(square.boostedTargetZones);
	// console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}, team: ${team}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
	{
		if (!localInfo.secondMove)
		{
			setHighlightTrue(regularMoves, "regular", team);
			boostedMoves.forEach((targetSquares) => {
				setHighlightTrue(targetSquares, "boosted", team);
			});
		}
		else
			setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
	}
	else if (regularMoves)
		setHighlightTrue(regularMoves, "regular", team);
	else
		throw Error("[ChampAndMinoHL]: qualcosa è andato storto");
}
