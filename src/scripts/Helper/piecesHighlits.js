import { setHighlighTrue }	from "@/scripts/Events/Global";
import { clearHighlight }	from "./RenderUtils";
import { localBoard }		from "@/scripts/Data/Variables"

const PIECES_HIGHLIGHT = Object.freeze ({
	"King" : KingAndBastardsHL,
	"Champion" : ChampAndMinoHL,
	"Jester" : JesterHL,
	"Valkirya" : ValkiryaHL,
	"Minotaurus" : ChampAndMinoHL,
	"Bastards" : KingAndBastardsHL,
})

export function JesterHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.piece.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}, team: ${team}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
	{
		setHighlighTrue(regularMoves, "regular", team);
		setHighlighTrue(boostedMoves, "boosted", team);
	}
	else if (regularMoves)
		setHighlighTrue(regularMoves, "regular", team);
	else
		throw Error("[JesterHL]: qualcosa è andato storto");
}

export function ValkiryaHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.piece.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
		setHighlighTrue(boostedMoves, "boosted", team);
	else if (regularMoves)
		setHighlighTrue(regularMoves, "regular", team);
	else
		throw Error("[ValkiryaHL]: qualcosa è andato storto");
}

export function KingAndBastardsHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.piece.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = square.boostedTargetZones.get(squareId);
	console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
	{
		setHighlighTrue(regularMoves, "regular", team);
		setHighlighTrue(boostedMoves, "boosted", "both");
	}
	else if (regularMoves)
		setHighlighTrue(regularMoves, "regular", team);
	else
		throw Error("[KingAndBastardsHL]: qualcosa è andato storto");
}

export function ChampAndMinoHL(squareId)
{
	if (!squareId && localBoard.has(squareId))
		return;
	const square = localBoard.get(squareId);
	const useAbility = square.piece.useAbilityBool && square.piece.isBoostedBool;
	const team = square.piece.team;
	const regularMoves = square.targetZones;
	const boostedMoves = new Map(square.boostedTargetZones);
	console.log(`boosted moves ${boostedMoves}, useAbility: ${useAbility}, team: ${team}`);
	
	clearHighlight();
	if (useAbility && boostedMoves)
	{
		setHighlighTrue(regularMoves, "regular", team);
		boostedMoves.forEach((targetSquares, sourceSquare) => {
			setHighlighTrue(targetSquares, "boosted", team);
		});
	}
	else if (regularMoves)
		setHighlighTrue(regularMoves, "regular", team);
	else
		throw Error("[ChampAndMinoHL]: qualcosa è andato storto");
}

export { PIECES_HIGHLIGHT }