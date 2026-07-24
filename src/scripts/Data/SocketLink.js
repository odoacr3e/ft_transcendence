import { updateMatchState, initLocalMatchState, reloadMatchState }	from "./Archi";
import { clearHighlight }											from "../Events/utils/HighlightUtils";
import { localInfo, localMatchState, MACRO }									from "./Variables";
import router 														from "@/router";			

export function listenGameSocket(socket)
{
	socket.on("game", (raw) => {
		console.log("{[socket game] ricevuta una riposta} tipo: ", raw.type, "response: ", raw);
		if (raw.log?.status != 200)
		{
			console.log("[socket game]: errore -", raw.log?.msg);
			console.log("response: ", raw);	
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