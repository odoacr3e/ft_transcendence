import { sendToBackend, setHighlightTrue }	from "../Events/Global";
import { localInfo, localBoard }			from "../Data/Variables";
import { PIECES_HIGHLIGHT } 				from "./piecesHighlights";
import { clearHighlight } 					from "./RenderUtils";
import { requestToBack } 					from "../Events/Movements";

const PIECES_ABILITY = Object.freeze ({
	"King" : moveKing,
	"Champion" : "giorgio",
	"Jester" : moveJester,
	"Valkirya" : "giorgio",
	"Minotaurus" : "giorgio",
	"Bastards" : moveBastard,
	"": error,
})

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

export async function moveBastard()
{
	// console.log("qui");
	if (!localInfo.secondTurn)
	{
		const square = localBoard.get(localInfo.lastClickedId);
		const boostedZones = square.boostedTargetZones.get(localInfo.lastClickedId);
		const result = await sendToBackend(true);
		if (result)
		{
			setHighlightTrue(boostedZones, "boosted", "both");
			localInfo.savedBoostedMap = boostedZones;
			localInfo.secondMove = true;
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
				throw new Error("[bostedMovent]: invalid move");
			else
			{
				localInfo.secondMove = false;
				localInfo.usingAbility = "";
				throw new Error("yippie");
			}
		}
	}
}

export async function moveKing()
{
	console.log("Va bene mavi, la smetto");
}

export async function moveJester()
{
	const square = localBoard.get(localInfo.lastClickedId);
	const boostedZones = square.boostedTargetZones.get(localInfo.lastClickedId);

	localInfo.savedBoostedMap = boostedZones;
	// console.log("entrato");
	if (boostedZones.has(localInfo.clickedId)) 
	{
		// console.log("orcamadonna");		
		const result = await requestToBack(localInfo.lastClickedId, localInfo.clickedId);
		if (!result)
			throw new Error("[abilityMovement.js:moveJester]: invalid move!");
		else {
			clearHighlight();
			localInfo.usingAbility = "";
		}
	}
	else
		throw new Error("[abilityMovement.js:moveJester]: non hai cliccato nelle boosted abbelinou!");
}

function error()
{
	throw new Error("[PIECES_ABILITY]: Qualcuno ha chiamato qualcosa che non esiste eh")
}

export { PIECES_ABILITY }