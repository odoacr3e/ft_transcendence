import { sendToBackend, setHighlightTrue }	from "../Events/Global";
import { localInfo, localBoard }			from "../Data/Variables";
import { PIECES_HIGHLIGHT } 				from "./piecesHighlights";
import { clearHighlight } 					from "./RenderUtils";

const PIECES_ABILITY = Object.freeze ({
	"King" : moveKing,
	"Champion" : "giorgio",
	"Jester" : "giorgio",
	"Valkirya" : "giorgio",
	"Minotaurus" : "giorgio",
	"Bastards" : moveBastard,
})

export async function boostedMovement()
{
	if (!localInfo.secondTurn)
	{
		const square = localBoard.get(localInfo.lastClickedId);
		const boostedZones = square.boostedTargetZones.get(localInfo.lastClickedId);
		const result = await sendToBackend(true);
		if (result)
		{
			setHighlightTrue(boostedZones, "boosted", "both");
			localInfo.savedBoostedMap = boostedZones;
			localInfo.lastClickedId = localInfo.clickedId;
		}
		else
		{
			console.log("[sendToBackend]: Mossa non valida");
			return;
		}
	}
	else
	{
		boostHlOnClick();
		if (localInfo.savedBoostedMap.has(localInfo.clickedId))
			return;
		else if (localInfo.savedBoostedMap.has(localInfo.lastClickedId) && localBoard.get(localInfo.lastClickedId).targetZones.has(localInfo.clickedId))
		{
			const result = await sendToBackend(true);
			if(!result)
				console.log("[bostedMovent]: invalid move");
			else
				console.log("yippie");
		}
	}
}

export function boostHlOnClick()
{
	if (!localInfo.savedBoostedMap.has(localInfo.clickedId))
	{
		clearHighlight();
		setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
		if (!localBoard.get(localInfo.lastClickedId)?.targetZones.has(localInfo.clickedId))
			localInfo.lastClickedId = localInfo.clickedId;
		return;
	}
	if (localInfo.clickedId === localInfo.lastClickedId) 
	{
		clearHighlight();
		setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
		localBoard.get(localInfo.clickedId).boostedHighlight = true;
		localInfo.lastClickedId = null;
		return;
	}
	const piece = localBoard.get(localInfo.clickedId).piece.type;
	PIECES_HIGHLIGHT[piece](localInfo.clickedId);
	localBoard.get(localInfo.clickedId).boostedHighlight = true;
	localInfo.lastClickedId = localInfo.clickedId;
}

export function moveKing(from, to)
{
	const hasBoost = localBoard.get(from).piece.isBoostedBool;
	const useAbility = localBoard.get(from).piece.useAbilityBool;
	const hasAndUse = hasBoost && useAbility;

	if (!hasAndUse)
		return;

	//logica per applicare il movimento boostato oppure il movimento normale
}

export function moveBastard(from, to)
{
	const hasBoost = localBoard.get(from).piece.isBoostedBool;
	const useAbility = localBoard.get(from).piece.useAbilityBool;
	const hasAndUse = hasBoost && useAbility;

	if (!hasAndUse)
		return;

	//logica per applicare il movimento boostato oppure il movimento normale
}
