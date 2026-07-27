import { updateMatchState, initLocalMatchState, reloadMatchState }	from "./Archi";
import { localInfo, localMatchState, MACRO }						from "./Variables";
import { clearHighlight }											from "../Events/utils/HighlightUtils";
import { eSpecialMoves }											from "@/Common/ENUMS";		
import { blinkSquares } 											from "../Events/utils/GlobalUtils";
import router 														from "@/router";

export function listenGameSocket(socket)
{
	socket.on("game", (raw) => {
		console.log("{[socket game] ricevuta una riposta} tipo: ", raw.type, "response: ", raw);

		if (localInfo.blinking)
		{
			localInfo.blinking();
			localInfo.blinking = null;
		}
		if (raw.log?.status != 200)
		{
			console.log("[socket game]: errore -", raw.log?.msg);
			const mask = Number(raw.mask);
			if (mask & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE))
			{
				console.log("[socket game]: è tempo di blinkare!");
				if (MACRO.AUDIO)
					new Audio("/src/assets/audios/tette.mp3").play();
				if (raw.check != undefined)
				{
					const threatId = new Set([raw.check.to, raw.check.mid, raw.check.from].filter(Boolean));
					localInfo.blinking = blinkSquares(threatId, {interval: 650, delay: 650});
					return;
				}
			}
			return;
		}
		if (raw.id !== undefined)
		{
			console.log("[socket game] ID NEW GAME TROVATO!");
			initLocalMatchState(raw);
			router.push( {name: raw.p3 ? "GameFour" : "game"});
			return;
		}
		if (raw.type === "reload")
		{
			console.log("{socket game [reload]} ricevuto reload. localMatchstate =", localMatchState);
			if (!localMatchState)
			{
				reloadMatchState(raw);
				console.log("{socket game [reload]} Renderizzo game reloadato");
				router.push({ name: "game" });
			}
			else
				console.log("{socket game [reload]}: Fallimento ricezione");
			return;
		}
		if (raw.type === "giveup")
		{
			console.log("[socket game] -> [giveup]: ricevuto giveup");
			localInfo.victory = raw.victory;
			return;
		}
		if (raw.type == "simulate_boost")
		{
			console.log("{socket game [simu_boost]} payload richiesta simulate boots");
			return;
		}
		console.log("[socket game]: update match");
		updateMatchState(raw);
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/moving.mp3").play();
	});
}

					// versione del blink pre astrazione
					// let i = 0;
					// for (let id of threatId)
					// {
					// 	setTimeout(() => {
					// 		// console.log("id: ", id);
					// 		let toggles = 0;
					// 		const square = localBoard.get(id);
					// 		if (!square)
					// 			return;
					// 		square.selected = true;
					// 		const periodicHighlight = setInterval(() => {
					// 			square.selected = !square.selected;
					// 			if (++toggles >= 6)
					// 			{
					// 				clearInterval(periodicHighlight);
					// 				square.selected = false;
					// 			}
					// 		}, 650);
					// 	}, i * 650);
					// 	i++;
					// }