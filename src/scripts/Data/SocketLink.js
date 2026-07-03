import { socket, MACRO }	from "./Variables";
import { updateMatchState }	from "./Archi";
import { clearHighlight }	from "../Events/utils/HighlightUtils";

socket.on("game"), (result) => {
	if (result.log.status != 200)
	{
		console.log("SocketLink.js:socket.on(): mossa non valida");
		return;
	}
	updateMatchState(result);
	clearHighlight();
	if	(MACRO.AUDIO)
		new Audio("/src/assets/audios/moving.mp3").play();
}