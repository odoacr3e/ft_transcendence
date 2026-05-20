import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { updateMatchState }		from "@/scripts/Data/Archi";
import { clearHighlight }			from "@/scripts/Helper/RenderUtils";

export async function sendToBackend(flag)
{
	let		TargetZone;
	const	lastClickedId = localInfo.lastClickedId,
			clickedId = localInfo.clickedId,
			pMoving = localBoard.get(lastClickedId).piece ? localBoard.get(lastClickedId).piece : null,
			boostedZones = localBoard.get(lastClickedId).boostedTargetZones.get(lastClickedId);

	if (pMoving?.useAbilityBool && boostedZones.has(clickedId) &&
		((pMoving?.type !== ("Bastards" || "King" || "Minotaurus")) || (pMoving?.type === "Minotaurus" && localInfo.secondMove)))
		TargetZone = boostedZones.has(clickedId);
	else
	{
		TargetZone = localBoard.get(lastClickedId).targetZones.has(clickedId);
			if (pMoving.type !== ("Bastards" || "King") && !localInfo.secondMove && !boostedZones.has(clickedId))
				localInfo.usingAbility = "";
	}

	if (lastClickedId && lastClickedId !== clickedId && TargetZone)
	{
		const promise = await requestToBack(localInfo.lastClickedId, localInfo.clickedId)
		if (promise)
		{
			clearHighlight();
			if (flag) { return (true); }
		}
		else
		{
			console.log("[sendToBackend]: Mossa non valida");
			if (flag) { return (false); }
		}
	}
}

// {type = "endTurn"; url = "BastardMove.json" }
export async function requestToBack(fromSquare, toSquare)
{
	let type, url;

	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endTurn"; url = "move.json" }
	else if (fromSquare && toSquare === null)
		{type = "boost"; url = "move.json" }
	else if (fromSquare && toSquare && localInfo.usingAbility !== "")
		{type = "boostMove"; url = "move.json" }
	else {type = "move"; url = "move.json" }

	try
	{
		const response = await fetch(url, {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ type: type, from: fromSquare, to: toSquare }),
		});

		if (!response.ok) throw new Error(`Impossibile caricare /move.json: ${response.status}`);

		const match = await response.json();

		updateMatchState(match);
		return true;
	}
	catch (err)
	{
		console.error(err);
		return false;
	}
}
