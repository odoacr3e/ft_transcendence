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
})

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
			const movedPiece = localBoard.get(localInfo.clickedId)?.piece;
			if (movedPiece) 
				movedPiece.useAbilityBool = true; // porca madonna maledetta se fai update la flag la perdi grazie al cazzo che ritorna undefined
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

async function moveJesterNValkirya()
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

async function moveMinoNChamp()
{
	console.log(`clickedId: ${localInfo.clickedId}, last: ${localInfo.lastClickedId}`);
	
	if (!localInfo.secondTurn)
	{
		const square = localBoard.get(localInfo.lastClickedId);
		const boostedZones = square.boostedTargetZones.get(localInfo.clickedId);
		const result = await sendToBackend(true);
		if (result)
		{
			setHighlightTrue(boostedZones, "boosted", "both");
			localInfo.savedBoostedMap = boostedZones;
			localInfo.secondMove = true;
			const movedPiece = localBoard.get(localInfo.clickedId)?.piece;
			if (movedPiece) 
				movedPiece.useAbilityBool = true; // porca madonna maledetta se fai update la flag la perdi grazie al cazzo che ritorna undefined
			localInfo.lastClickedId = localInfo.clickedId;
		}
		else
		{
			console.log("[sendToBackend]: Prima mossa non valida");
			return;
		}
	}
	else
	{
		// if (!localInfo.savedBoostedMap.has(localInfo.clickedId)) //onde evitare di aggiornare lasclicked e clicked quando non clicchi nelle caselle boosted
		// 	return;
		boostHlOnClick();
		if (localInfo.savedBoostedMap.has(localInfo.clickedId))
		{
			console.log(`from: ${localInfo.lastClickedId}, to: ${localInfo.clickedId}`);
			const result = await sendToBackend(true);
			if(!result)
				throw new Error("[bostedMovent]: Seconda mossa non valida");
			else
			{
				localInfo.secondMove = false;
				localInfo.usingAbility = "";
			}
		}
	}
}

function error()
{
	throw new Error("[PIECES_ABILITY]: Qualcuno ha chiamato qualcosa che non esiste eh")
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

export { PIECES_ABILITY }