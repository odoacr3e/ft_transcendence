import { updateMatchState }	from "@/scripts/Data/Archi";
import { clearHighlight }	from "@/scripts/Events/utils/HighlightUtils.js";
import { localInfo }		from "@/scripts/Data/Variables";
import { getTarget }		from "./utils/MovementUtils.js"

export async function sendToBackend(flag)
{
	const	TargetZone = getTarget(localInfo.lastClickedId, localInfo.clickedId);

	if (localInfo.lastClickedId && localInfo.lastClickedId !== localInfo.clickedId && TargetZone)
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
// {type = "endTurn"; url = "ValkiryaMove.json" }
// {type = "endTurn"; url = "ValkiryaBMove.json" }
export async function requestToBack(fromSquare, toSquare)
{
	let type, url;

	// MOVE GENERICA
	// if (fromSquare === null && toSquare === null && localInfo.secondTurn)
	// 	{type = "endTurn"; url = "move.json" }
	// else if (fromSquare && toSquare === null)
	// 	{type = "boost"; url = "move.json" }
	// else if (fromSquare && toSquare && localInfo.usingAbility !== "")
	// 	{type = "boostMove"; url = "move.json" }
	// else {type = "move"; url = "move.json" }

	// MOVE MINOTAURUS
	// if (fromSquare === null && toSquare === null && localInfo.secondTurn)
	// 	{type = "endTurn"; url = "MinoMove.json" }
	// else if (fromSquare && toSquare === null)
	// 	{type = "boost"; url = "MinoMove.json" }
	// else if (fromSquare && toSquare && localInfo.usingAbility !== "")
	// 	{type = "boostMove"; url = "MinoMove.json" }
	// else {type = "move"; url = "MinoMove.json" }

	// MOVE BASTARD
	// if (fromSquare === null && toSquare === null && localInfo.secondTurn)
	// 	{type = "endTurn"; url = "BastardMove.json" }
	// else if (fromSquare && toSquare === null)
	// 	{type = "boost"; url = "BastardMove.json" }
	// else if (fromSquare && toSquare && localInfo.usingAbility !== "")
	// 	{type = "boostMove"; url = "BastardMove.json" }
	// else {type = "move"; url = "BastardMove.json" }

	// MOVE VALKIRYA
	// if (fromSquare === null && toSquare === null && localInfo.secondTurn)
	// 	{type = "endTurn"; url = "ValkiryaBMove.json" }
	// else if (fromSquare && toSquare === null)
	// 	{type = "boost"; url = "ValkiryaBMove.json" }
	// else if (fromSquare && toSquare && localInfo.usingAbility !== "")
	// 	{type = "boostMove"; url = "ValkiryaBMove.json" }
	// else {type = "move"; url = "ValkiryaBMove.json" }

	// MOVE CHAMPION
	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endTurn"; fromSquare = ""; toSquare = ""; }
	else if (fromSquare && toSquare === null)
		{type = "boost"; toSquare = ""; }
	else if (fromSquare == null && toSquare)
		{type = "trans"; fromSquare = localInfo.goatId; localInfo.goatId = null; }
	else if (fromSquare && toSquare && localInfo.usingAbility !== "")
		{type = "moveBoost";} //--> quel bastardo di ale mi ha fatto riscrivere sto type 8 volte perchè mi dimenticavo le maiuscole nonostante loro convertano le maiuscole in minuscole
	else {type = "move"; }

	try
	{
		const response = await fetch("http://localhost:8080/api/game", {
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




// 	let		TargetZone;
// 	const	lastClickedId = localInfo.lastClickedId,
// 			clickedId = localInfo.clickedId,
// 			pMoving = localBoard.get(lastClickedId).piece ? localBoard.get(lastClickedId).piece : null,
// 			boostedZones = localBoard.get(lastClickedId).boostedTargetZones.get(lastClickedId);

// 	if (pMoving?.useAbilityBool && boostedZones.has(clickedId) &&
// 		((pMoving?.type !== ("Bastards" || "King" || "Minotaurus")) || (pMoving?.type === "Minotaurus" && localInfo.secondMove)))
// 		TargetZone = boostedZones.has(clickedId);
// 	else
// 	{
// 		TargetZone = localBoard.get(lastClickedId).targetZones.has(clickedId);
// 			if (pMoving.type !== ("Bastards" || "King") && !localInfo.secondMove && !boostedZones.has(clickedId))
// 				localInfo.usingAbility = "";
// 	}
