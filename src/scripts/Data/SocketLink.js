import { updateMatchState, initLocalMatchState, reloadMatchState }	from "./Archi";
import { clearHighlight }											from "../Events/utils/HighlightUtils";
import { localMatchState, MACRO }									from "./Variables";
import router 														from "@/router";			

export function listenGameSocket(socket)
{
	socket.on("game", (raw) => {
		console.log("[socket game] ricevuto:", raw.type, "victory:", raw.victory);
		if (raw.log?.status != 200)
		{
			console.log("[socket]: errore -", raw.log?.msg);
			console.log("response: ", raw);	
			return;
		}
		if (raw.id !== undefined)
		{
			console.log("ID NEW GAME TROVATO!");
			initLocalMatchState(raw);
			router.push( {name: raw.p3 ? "GameFour" : "game"});
			return;
		}
		if (raw.type === "reload")
		{
			console.log("[reload] entrato. localMatchstate =", localMatchState);
			if (!localMatchState)
			{
				reloadMatchState(raw);
				console.log("Renderizzo game reloadato");
				router.push({ name: "game" });
			}
			else
				console.log("[reload]: Fallimento ricezione");
			return;
		}
		console.log("response type", raw.type);
		console.log("response: ", raw);
		if (raw.ignoreBoard || raw.type == "simulate_boost")
			return;
		updateMatchState(raw);
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/moving.mp3").play();
	});
}