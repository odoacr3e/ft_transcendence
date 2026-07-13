import { updateMatchState, initLocalMatchState }	from "./Archi";
import { clearHighlight }							from "../Events/utils/HighlightUtils";
import { MACRO }									from "./Variables";
import router 										from "@/router";			

export function assignGameSocket(socket)
{
	socket.on("game", (raw) => {
		console.log("response: ", raw);
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
		updateMatchState(raw);
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/moving.mp3").play();
	});
}