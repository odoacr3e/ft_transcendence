import { updateMatchState, initLocalMatchState, reloadMatchState }	from "./Archi";
import { localInfo, localMatchState, MACRO }						from "./Variables";
import { clearHighlight, setCheckSquare }							from "../Events/utils/HighlightUtils";
import { eSpecialMoves }											from "@/Common/ENUMS";		
import { blinkSquares } 											from "../Events/utils/GlobalUtils";
import router 														from "@/router";
import { resetLocalVars } 											from "./utils/ArchiUtils";

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
					localInfo.blinking = blinkSquares(threatId, {interval: 450, delay: 600});
					resetLocalVars();
					return;
				}
			}
			return;
		}
		if (raw.id !== undefined)
		{
			console.log("[socket game] ID NEW GAME TROVATO!");
			initLocalMatchState(raw);
			router.replace( {name: raw.p3 ? "GameFour" : "game"});
			return;
		}
		if (raw.type === "reload")
		{
			console.log("{socket game [reload]} ricevuto reload. localMatchstate =", localMatchState);
			if (!localMatchState)
			{
				reloadMatchState(raw);
				if ((Number(raw.mask) & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE)) && raw.giorgi0)
					setCheckSquare(raw.giorgi0);
			}
			else
				console.log("{socket game [reload]}:state già presente nel controllo sul mounted");
			return;
		}
		if (raw.type === "giveup")
		{
			console.log("[socket game] -> [giveup]: ricevuto giveup");
			localInfo.victory = raw.victory;
			resetLocalVars();
			return;
		}
		if (raw.type === "timeout")
		{
			console.log("[socket game] -> [timeout]: tempo scaduto, victory =", raw.victory);
			if (raw.victory)
				localInfo.victory = raw.victory;
			resetLocalVars();
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
		const inCheck = (Number(raw.mask) & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE)) && raw.giorgi0;
		setCheckSquare(inCheck ? raw.giorgi0 : null);
		if (inCheck)
		{
			console.log("[socket game]: re sotto scacco in", raw.giorgi0);
			if (MACRO.AUDIO)
				new Audio("/src/assets/audios/tette.mp3").play();
		}
	});
}