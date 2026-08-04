import { ePlaying, localBoard, localInfo }	from "@/scripts/Data/Variables";
import { getTarget }				from "./utils/MovementUtils.js";
import { useAuthStore }				from "@/stores/auth.st.js";
import { Socket } from "socket.io-client";

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
	const auth = useAuthStore();
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
		auth.socket.emit("game", { type, from: fromSquare, to: toSquare }, (result) => {
			console.log(`request: type: ${type}, from: ${fromSquare}, to:${toSquare}`)
			clearTimeout(timeout);
			resolve(result?.log?.status === 200);
		});

	});
}

function waitForSocketToBeReady(ms = 5000)
{
	const auth = useAuthStore();
	if (!auth.socket)
		return;

	if (auth.socket.connected)
		return (Promise.resolve(true));

	return new Promise((resolve) => {
		const done = (ok) => {
			clearTimeout(timer);
			auth.socket.off('ready', onReady);
			resolve(ok);
		}
		const onReady = () => done(true);
		const timer = setTimeout(() => done(false), ms);
		auth.socket.once('ready', onReady);
	});
}

/**
 * Chiede al back se questo client è dentro una partita.
 * Il payload {} serve a far finire l'ack in seconda posizione lato server.
 * @returns {Promise<"yes"|"no"|"unknown">}
 */
export async function amIPlaying()
{
	const auth = useAuthStore();

	if (!auth.socket)
		return (ePlaying.UNKNOWN);
	
	if (!await waitForSocketToBeReady())
	{
		console.log("[BackLink] -> [amIPlaying]: socket mai connesso");
		return (ePlaying.UNKNOWN);
	}
	try {
		const resp = await auth.socket.timeout(3000).emitWithAck("amiplaying", {});
		return (resp === true ? ePlaying.YES : ePlaying.NO);
	}
	catch {
		console.log("[BackLink] -> [amIPlaying]: nessuna risposta dal back");
		return (ePlaying.UNKNOWN);
	}
}

export function reloadMatch()
{
	console.log("chiamata di reload!");
	const auth = useAuthStore();
	if (!auth.socket)
		return (Promise.resolve(false));

	return new Promise((resolve) =>
	{
		let retryId = null;
		let done	= false;

		const emit = () => {
			console.log("[reload] emit");
			auth.socket.emit("game", {
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
			auth.socket.off("game", onResponse);
			auth.socket.off("connect", start);
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
			let tries = 0;
			emit();
			retryId = setInterval(() => {
				if(++tries >= 4)
					return (finish(false));
				emit();
			}, 1000);
		};

		const timeout = setTimeout(() => finish(false), 6000);

		auth.socket.on("game", onResponse);

		if (auth.socket.connected)
			start();
		else
			auth.socket.once("connect", start);
	});
}