import { setHighlightTrue, clearHighlight }	from "../Events/utils/HighlightUtils.js";
import { localInfo, localBoard }			from "../Data/Variables.js";
import { PIECES_HIGHLIGHT } 				from "./piecesHighlights.js";
import { sendToBackend }					from "../Events/BackLink.js";

const PIECES_ABILITY = Object.freeze ({
	"King" : moveKing,
	"Champion" : moveMinoNChamp,
	"Jester" : moveJesterNValkirya,
	"Valkirya" : moveJesterNValkirya,
	"Minotaurus" : moveMinoNChamp,
	"Bastards" : moveBastard,
	"": error,
});

async function moveBastard(fromId, toId, flag)
{
	if (!localInfo.secondTurn)
	{
		const square = localBoard.get(fromId);
		const boostedZones = square.boostedTargetZones.get(fromId);
		const result = await sendToBackend(fromId, toId, true);
		if (result)
		{
			setHighlightTrue(boostedZones, "boosted", "both");
			localInfo.savedBoostedMap = boostedZones;
			localInfo.secondMove = true;
			localBoard.get(fromId).useAbilityBool = false;
			if (flag === "click")
				localInfo.lastClickedId = toId;
		}
		else
		{
			console.log("[sendToBackend]: Mossa non valida");
			return;
		}
	}
	else
	{
		if (flag === "click")
			boostHlOnClick();
		if (localInfo.savedBoostedMap.has(toId) && flag === "click")
			return;
		else if (localInfo.savedBoostedMap.has(fromId) && localBoard.get(fromId).targetZones.has(toId))
		{
			const result = await sendToBackend(fromId, toId, true);
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

async function moveJesterNValkirya(fromId, toId)
{
	const square = localBoard.get(fromId);
	const boostedZones = square.boostedTargetZones.get(fromId);

	localInfo.savedBoostedMap = boostedZones;
	const result = await sendToBackend(fromId, toId, true);
	if (!result)
		throw new Error("[abilityMovement.js:moveJester]: invalid move!");
	else
	{
		localBoard.get(fromId).useAbilityBool = false;
		clearHighlight();
		localInfo.usingAbility = "";
	}
}

async function moveMinoNChamp(fromId, toId, flag)
{
	if (!localInfo.secondMove)
	{
		const square = localBoard.get(fromId);
		const boostedZones = square.boostedTargetZones.get(toId);
		const result = await sendToBackend(fromId, toId, true);
		if (result)
		{
			setHighlightTrue(boostedZones, "boosted", "both");
			localInfo.savedBoostedMap = boostedZones;
			localInfo.secondMove = true;
			localBoard.get(toId).useAbilityBool = true;
			localBoard.get(fromId).useAbilityBool = false;
			if (flag === "click")
				localInfo.lastClickedId = toId;
		}
		else
		{
			console.log("[sendToBackend]: Prima mossa non valida");
			return;
		}
	}
	else
	{
		// if (!localInfo.savedBoostedMap.has(toId)) //onde evitare di aggiornare lasclicked e clicked quando non clicchi nelle caselle boosted
		// 	return;
		if (flag === "click")
			boostHlOnClick();
		if (localInfo.savedBoostedMap.has(toId))
		{
			console.log(`from: ${fromId}, to: ${toId}`);
			const result = await sendToBackend(fromId, toId, true);
			if(!result)
				throw new Error("[bostedMovent]: Seconda mossa non valida");
			else
			{
				localBoard.get(fromId).useAbilityBool = false;
				localInfo.secondMove = false;
				localInfo.usingAbility = "";
			}
		}
	}
}

function error()
{
	throw new Error("[PIECES_ABILITY]: Qualcuno ha chiamato qualcosa che non esiste eh");
}

function boostHlOnClick()
{
	if (!localInfo.savedBoostedMap.has(localInfo.clickedId))
	{
		clearHighlight();
		setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
		if (["Bastards","King"].includes(localInfo.usingAbility))
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
	// Queste righe erano troppo specifiche per la mossa del pedone.
	// dovrebbe valere anche per il re forse(?), boh, comunque l'avevo hardcodata troppo yayyyyyyy
	if (["Bastards","King"].includes(localInfo.usingAbility))
	{
		const piece = localBoard.get(localInfo.clickedId).piece.type;
		PIECES_HIGHLIGHT[piece](localInfo.clickedId);
		localBoard.get(localInfo.clickedId).boostedHighlight = true;
		localInfo.lastClickedId = localInfo.clickedId;
	}
}

export { PIECES_ABILITY };