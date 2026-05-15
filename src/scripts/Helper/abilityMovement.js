import { sendToBackend, setHighlightTrue }	from "../Events/Global";
import { localInfo, localBoard }			from "../Data/Variables";
import { PIECES_HIGHLIGHT } 				from "./piecesHighlights";
import { clearHighlight } 					from "./RenderUtils";
import { requestToBack } 					from "../Events/Movements";

const PIECES_ABILITY = Object.freeze ({
	"King" : moveKing,
	"Champion" : "giorgio",
	"Jester" : "giorgio",
	"Valkirya" : "giorgio",
	"Minotaurus" : "giorgio",
	"Bastards" : moveBastard,
})

export async function boostedMovement(event, clickedId, lastClickedId)
{
	if (!localInfo.secondTurn)
	{
		const square = localBoard.get(lastClickedId);
		const boostedZones = square.boostedTargetZones.get(lastClickedId);
		const result = await requestToBack(lastClickedId, clickedId);
		if (result)
		{
			clearHighlight();
			setHighlightTrue(boostedZones, "boosted", "both");
			localInfo.savedBoostedMap = boostedZones;
			localInfo.secondTurn = true;
			localInfo.lastClickedId = clickedId;
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
		if (localInfo.savedBoostedMap.has(clickedId))
			return;
		else if (localBoard.savedBoostedMap.has(lastClickedId) && localBoard.get(clickedId).targetZones.has(localInfo.clickedId))
			sendToBackend(localInfo.lastClickedId, localInfo.clickedId);
	}
}

export function boostHlOnClick()
{
	if (!localInfo.savedBoostedMap.has(localInfo.clickedId))
	{
		console.log("giorgio");
		clearHighlight();
		setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
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
