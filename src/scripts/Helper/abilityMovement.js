import { localInfo, localBoard }	from "../Data/Variables.js";
import { setHighlightTrue }			from "../Events/utils/HighlightUtils.js";
import { PIECES_HIGHLIGHT } 		from "./piecesHighlights.js";
import { clearHighlight } 			from "./RenderUtils.js";
import { sendToBackend }			from "../Events/BackLink.js";

const PIECES_ABILITY = Object.freeze ({
	"King" : moveKing,
	"Champion" : "giorgio",
	"Jester" : moveJesternValkirya,
	"Valkirya" : moveJesternValkirya,
	"Minotaurus" : "giorgio",
	"Bastards" : moveBastard,
	"": error,
})

function boostHlOnClick()
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

async function moveBastard()
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
			}
		}
	}
}

async function moveKing()
{
	console.log("Va bene mavi, la smetto");
}

async function moveJesternValkirya()
{
	const square = localBoard.get(localInfo.lastClickedId);
	const boostedZones = square.boostedTargetZones.get(localInfo.lastClickedId);

	localInfo.savedBoostedMap = boostedZones;
	const result = await sendToBackend(true);
	if (!result)
		throw new Error("[abilityMovement.js:moveJester]: invalid move!");
	else
	{
		clearHighlight();
		localInfo.usingAbility = "";
	}
}

function error()
{
	throw new Error("[PIECES_ABILITY]: Qualcuno ha chiamato qualcosa che non esiste eh")
}

export { PIECES_ABILITY }