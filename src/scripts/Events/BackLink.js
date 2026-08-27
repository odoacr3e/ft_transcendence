import { ePlaying, localBoard, localInfo, debug}	from "@/scripts/Data/Variables";
import { getTarget }						from "./utils/MovementUtils.js";
// import { MACRO } 						from "@/scripts/Data/Variables";
import { useSockStore } 					from "../../stores/sock.st.js";

export async function sendToBackend(fromId, toId, flag)
{
	const	TargetZone = getTarget(fromId, toId);

	if (fromId && fromId !== toId && TargetZone)
	{
		const promise = await requestToBack(fromId, toId);
		if (promise)
			if (flag)
				return (true);
		else
			if (flag)
				return (false);
	}
}

export async function requestToBack(fromSquare, toSquare, opType)
{
	const sockStore = useSockStore();
	let type;
	if (opType === "showBoost")
		{type = "simulate_boost"; toSquare = "";}
	else if (opType === "history")
		{type = "history"; fromSquare = ""; toSquare = "";}
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
	// console.log("req: type: ", type, "from: ", fromSquare, "to: ", toSquare);
		
	return new Promise((resolve) => {
		sockStore.socket?.emit("game", { type, from: fromSquare, to: toSquare }, (result) => {
			// console.log(`request: type: ${type}, from: ${fromSquare}, to:${toSquare}`)
			clearTimeout(timeout);
			resolve(result?.log?.status === 200);
		});

	});
}

function waitForSocketToBeReady(ms = 5000)
{
	const sockStore = useSockStore();
	if (!sockStore.socket)
		return (Promise.resolve(false));

	if (sockStore.socketReady)
		return (Promise.resolve(true));

	return new Promise((resolve) => {
		const done = (ok) => {
			clearTimeout(timer);
			sockStore.socket.off('ready', onReady);
			resolve(ok);
		}
		const onReady = () => done(true);
		const timer = setTimeout(() => done(false), ms);
		sockStore.socket.once('ready', onReady);
	});
}

/**
 * Chiede al back se questo client è dentro una partita.
 * Il payload {} serve a far finire l'ack in seconda posizione lato server.
 * @returns {Promise<"yes"|"no"|"unknown">}
 */
export async function amIPlaying()
{
	const sockStore = useSockStore();

	if (!sockStore.socket)
		return (ePlaying.UNKNOWN);

	if (!await waitForSocketToBeReady())
	{
		debug("[BackLink] -> [amIPlaying]: socket mai connesso");
		return (ePlaying.UNKNOWN);
	}
	try {
		const resp = await sockStore.socket.timeout(3000).emitWithAck("amiplaying", {});
		return (resp === true ? ePlaying.YES : ePlaying.NO);
	}
	catch {
		debug("[BackLink] -> [amIPlaying]: nessuna risposta dal back");
		return (ePlaying.UNKNOWN);
	}
}

export function reloadMatch()
{
	debug("chiamata di reload!");
	const sockStore = useSockStore();
	if (!sockStore.socket)
		return (Promise.resolve(false));

	return new Promise((resolve) =>
	{
		let retryId = null;
		let done	= false;

		const emit = () => {
			// console.log("[reload] emit");
			sockStore.socket.emit("game", {
				type: "reload",
				from: sessionStorage.getItem("match:myTeam"),
				to: ""
			});
		};

		const finish = (ok) => {
			if (done)
				return;
			done = true;
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
				debug("[reload] il back rifiuta:", raw.log.msg);
				return finish(false);
			}
		};

		const start = () => {
			let tries = 0;
			emit();
			retryId = setInterval(() => {
				if(++tries >= 4)
					return (finish(false));
				emit();
			}, 1000);
		};

		const timeout = setTimeout(() => finish(false), 6000);

		sockStore.socket.on("game", onResponse);

		if (sockStore.socket.connected)
			start();
		else
			sockStore.socket.once("connect", start);
	});
}