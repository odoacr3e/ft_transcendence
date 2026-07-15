import { localBoard, localInfo }	from "@/scripts/Data/Variables";
// import { updateMatchState }			from "@/scripts/Data/Archi";
// import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";
import { getTarget }				from "./utils/MovementUtils.js";
// import { MACRO } 					from "@/scripts/Data/Variables";
import { useAuthStore } from "@/stores/auth.st.js";
import { sendEndTurn } from "./utils/GlobalUtils.js";
// import { connect } from "node:http2";
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

export async function requestToBack(fromSquare, toSquare, giveUp)
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
	if (giveUp === "giveUp")
		{type = "giveup"; fromSquare = ""; toSquare = ""; }
	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endturn"; fromSquare = ""; toSquare = ""; }
	else if (fromSquare && toSquare === null)
		{type = "boost"; toSquare = ""; }
	else if (fromSquare == null && toSquare)
		{type = "trans"; fromSquare = localInfo.goatId; localInfo.goatId = null; }
	else if (fromSquare && toSquare && ((localInfo.secondMove && localInfo.secondTurn) || localBoard.get(fromSquare).useAbilityBool))
		{type = "moveboost";}
	else {type = "move";}
	let	timeout;

	timeout = setTimeout(() => 
		{
			// console.log("Il backend è stato liberato");
		}, 1000 * 1);
	return new Promise((resolve) => {
		auth.socket.emit("game", { type, from: fromSquare, to: toSquare }, (result) => {
			console.log(`request: type: ${type}, from: ${fromSquare}, to:${toSquare}`)
			clearTimeout(timeout);
			if (result?.log?.status === 200 && toPiece)
				localInfo.capturedP[toPiece.team === "white" ? "black" : "white"][toPiece.type] += 1;
			resolve(result?.log?.status === 200);
		});

	});
}

// export function reloadMatch()
// {
// 	console.log("Chiamata di reload!");
// 	const auth = useAuthStore();
// 	if (!auth.socket)
// 		return(Promise.resolve(false));
// 	return new Promise((resolve) => 
// 	{
// 		let done = false;
// 		const finish = (ok) => {
// 			if (done)
// 				return;
// 			clearTimeout(timeout);
// 			auth.socket.off('connect', sendReload);
// 			resolve(ok);
// 		}
// 		const timeout = setTimeout(() => finish(false), 8000);

// 		const sendReload = () => {
// 			auth.socket.emit('game', {type: "reload", from: "", to: ""}, (result) => {
// 				finish(result?.log?.status === 200);
// 			});
// 		};

// 		if (auth.socket.connected)
// 			sendReload();
// 		else
// 			auth.socket.once("connect", sendReload);
// 	});
// }

// sta funzione è una ginata colossale
export function reloadMatch()
{
	console.log("Chiamata di reload!");
	const auth = useAuthStore();
	if (!auth.socket)
		return (Promise.resolve(false));

	return new Promise((resolve) =>
	{
		let done = false;
		let retryId = null;

		const finish = (ok) => {
			if (done) return;
			done = true;
			clearTimeout(hardTimeout);
			if (retryId) clearInterval(retryId);
			auth.socket.off("connect", tryReload);
			resolve(ok);
		};

		const tryReload = () => {
			if (done || !auth.socket?.connected) return;
			console.log("[reload] tentativo emit, socket connesso:", auth.socket.connected);
			auth.socket.emit("game", { type: "reload", from: "", to: "" }, (result) => {
				console.log("[reload] ack ricevuto:", result);
				if (result?.log?.status === 200)
					finish(true);
			});
		};

		// timeout di sicurezza complessivo
		const hardTimeout = setTimeout(() => finish(false), 8000);

		// riprova ogni secondo: copre la finestra in cui il backend
		// ha riconnesso il socket ma non ha ancora registrato l'handler "game"
		retryId = setInterval(tryReload, 1000);

		// primo tentativo appena possibile
		if (auth.socket.connected)
			tryReload();
		else
			auth.socket.once("connect", tryReload);
	});
}
