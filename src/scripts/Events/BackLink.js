import { localBoard, localInfo }	from "@/scripts/Data/Variables";
// import { updateMatchState }			from "@/scripts/Data/Archi";
// import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";
import { getTarget }				from "./utils/MovementUtils.js";
// import { MACRO } 					from "@/scripts/Data/Variables";
import { useSockStore } from "../../stores/sock.st.js";
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

export async function requestToBack(fromSquare, toSquare, opType)
{
	const sockStore = useSockStore();
	let type;
	if (opType === "showBoost")
		{type = "simulate_boost"; toSquare = "";}
	else if (opType === "giveUp")
		{type = "giveup"; fromSquare = ""; toSquare = ""; }
	else if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endturn"; fromSquare = ""; toSquare = ""; }
	else if (fromSquare && toSquare === null)
		{type = "boost"; toSquare = ""; }
	else if (fromSquare == null && toSquare)
		{type = "trans"; fromSquare = localInfo.goatId; localInfo.goatId = null; }
	else if (fromSquare && toSquare && ((localInfo.secondMove && localInfo.secondTurn) || localBoard.get(fromSquare).useAbilityBool))
		{type = "moveboost";}
	else {type = "move";}
	let	timeout;

	timeout = setTimeout(() => {}, 1000 * 1);
	console.log("req: type: ", type, "from: ", fromSquare, "to: ", toSquare);
		
	return new Promise((resolve) => {
		sockStore.socket.emit("game", { type, from: fromSquare, to: toSquare }, (result) => {
			console.log(`request: type: ${type}, from: ${fromSquare}, to:${toSquare}`)
			clearTimeout(timeout);
			resolve(result?.log?.status === 200);
		});

	});
}

/**
 * Chiede al back se questo client è dentro una partita.
 * Il payload {} serve a far finire l'ack in seconda posizione lato server.
 * @returns {Promise<boolean>}
 */
export async function amIPlaying()
{
	const sockStore = useSockStore();

	if (!sockStore.socket)
		return (false);
	try {
		return (await sockStore.socket.timeout(3000).emitWithAck('amiplaying', {}) === true);
	} catch {
		console.log("[BackLink] -> [amIPlaying]: nessuna risposta dal back");
		return (false);
	}
}

export function reloadMatch()
{
	console.log("chiamata di reload!");
	const sockStore = useSockStore();
	if (!sockStore.socket)
		return (Promise.resolve(false));

	return new Promise((resolve) =>
	{
		let retryId = null;

		const emit = () => {
			console.log("[reload] emit");
			sockStore.socket.emit("game", {
				type: "reload",
				from: sessionStorage.getItem("match:myTeam"),
				to: ""
			});
		};

		const finish = (ok) => {
			clearTimeout(timeout);
			clearInterval(retryId);
			sockStore.socket.off("game", onResponse);
			sockStore.socket.off("connect", start);
			resolve(ok);
		};

		const onResponse = (raw) => {
			if (raw?.type === "reload")
				return finish(raw?.log?.status === 200);
			//le risposte d'errore non hanno type: inutile continuare a riprovare
			if (raw?.log?.status && raw.log.status !== 200)
			{
				console.log("[reload] il back rifiuta:", raw.log.msg);
				return finish(false);
			}
		};

		const start = () => {
			emit();
			retryId = setInterval(emit, 1000);
		};

		const timeout = setTimeout(() => finish(false), 6000);

		sockStore.socket.on("game", onResponse);

		if (sockStore.socket.connected)
			start();
		else
			sockStore.socket.once("connect", start);
	});
}