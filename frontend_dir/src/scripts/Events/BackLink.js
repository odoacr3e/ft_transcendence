import { localBoard, localInfo }	from "@/scripts/Data/Variables";
// import { updateMatchState }			from "@/scripts/Data/Archi";
// import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";
import { getTarget }				from "./utils/MovementUtils.js";
// import { MACRO } 					from "@/scripts/Data/Variables";
import { useAuthStore } from "@/stores/auth.st.js";
// import { _jsonReviver }				from "../Data/utils/ArchiUtils.js";

export async function sendToBackend(fromId, toId, flag)
{
	// console.log("[sendToBackend]: Entrato in STB");
	
	const	TargetZone = getTarget(fromId, toId);

	if (fromId && fromId !== toId && TargetZone)
	{
		// console.log("[sendToBackend]: Entrato nell'if di STB");
		
		const promise = await requestToBack(fromId, toId);
		if (promise)
		{
			// clearHighlight();
			// if (MACRO.AUDIO)
			// 	new Audio("/src/assets/audios/moving.mp3").play();
			// console.log("[sendToBackend]: Mossa valida!");
			if (flag) { return (true); }
		}
		else
		{
			// console.log("[sendToBackend]: Mossa non valida");
			if (flag) { return (false); }
		}
	}
}

export async function requestToBack(fromSquare, toSquare)
{
	const auth = useAuthStore();
	let type;
	const toPiece = (() => {
			if (fromSquare && toSquare && localBoard.get(toSquare).piece &&
				localBoard.get(toSquare).piece.team !== localBoard.get(fromSquare).piece.team)
				return (localBoard.get(toSquare).piece);
			else
				return null;
		})();

	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endturn"; fromSquare = ""; toSquare = ""; }
	else if (fromSquare && toSquare === null)
		{type = "boost"; toSquare = ""; }
	else if (fromSquare == null && toSquare)
		{type = "trans"; fromSquare = localInfo.goatId; localInfo.goatId = null; }
	else if (fromSquare && toSquare && ((localInfo.secondMove && localInfo.secondTurn) || localBoard.get(fromSquare).useAbilityBool))
		{type = "moveboost";}
	else {type = "move"; }
	let	timeout;

	timeout = setTimeout(() => 
		{
			console.log("Il backend è stato liberato");
		}, 1000 * 1);
	return new Promise((resolve) => {
		auth.socket.emit("game", { type, from: fromSquare, to: toSquare }, (result) => {
			// console.log(`request: type: ${type}, from: ${fromSquare}, to:${toSquare}`)
			clearTimeout(timeout);
			if (result?.log?.status === 200 && toPiece)
				localInfo.capturedP[toPiece.team === "white" ? "black" : "white"][toPiece.type] += 1;
			resolve(result?.log?.status === 200);
		});

	});
}

export function reloadMatch()
{
	const auth = useAuthStore();
	if (!auth.socket)
		return(Promise.resolve(false));
	return new Promise((resolve) => 
	{
		let done = false;
		const timeout = setTimeout(() => { if (!done) {done = true; resolve(false); }}, 5000);
		auth.socket.emit("game", { type: "reload", from: "", to: ""}, (result) => {
			if (done)
				return;
			done = true;
			clearTimeout(timeout);
			resolve(result?.log.status == 200);
		});
	});
}