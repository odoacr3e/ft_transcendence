import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { updateMatchState }			from "@/scripts/Data/Archi";
import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";
import { getTarget }				from "./utils/MovementUtils.js";
import { MACRO } 					from "@/scripts/Data/Variables";

export async function sendToBackend(fromId, toId, flag)
{
	const	TargetZone = getTarget(fromId, toId);

	if (fromId && fromId !== toId && TargetZone)
	{
		const promise = await requestToBack(fromId, toId);
		if (promise)
		{
			clearHighlight();
			if (MACRO.AUDIO)
				new Audio("/src/assets/audios/moving.mp3").play();
			if (flag) { return (true); }
		}
		else
		{
			console.log("[sendToBackend]: Mossa non valida");
			if (flag) { return (false); }
		}
	}
}

export async function requestToBack(fromSquare, toSquare)
{
	let type;
	const toPiece = (() => {
			if (fromSquare && toSquare && localBoard.get(toSquare).piece &&
				localBoard.get(toSquare).piece.team !== localBoard.get(fromSquare).piece.team)
				return (localBoard.get(toSquare).piece);
			else
				return null;
		})();

	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endTurn"; fromSquare = ""; toSquare = ""; }
	else if (fromSquare && toSquare === null)
		{type = "boost"; toSquare = ""; }
	else if (fromSquare == null && toSquare)
		{type = "trans"; fromSquare = localInfo.goatId; localInfo.goatId = null; }
	else if (fromSquare && toSquare && ((localInfo.secondMove && localInfo.secondTurn) || localBoard.get(fromSquare).useAbilityBool))
		{type = "moveBoost";}
	else {type = "move"; }

	try
	{
		const response = await fetch("/api/game", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ type: type, from: fromSquare, to: toSquare }),
		});

		if (!response.ok) throw new Error(`Impossibile caricare /move.json: ${response.status}`);

		const match = await response.json();

		updateMatchState(match);
		if (toPiece)
			localInfo.capturedP[toPiece.team === "white" ? "black" : "white"][toPiece.type] += 1;
		return true;
	}
	catch (err)
	{
		console.error(err);
		return false;
	}
}