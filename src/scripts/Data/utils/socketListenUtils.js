import { playAudio } 					from "@/scripts/Helper/generalUtils";
import { debug, isCheck, localInfo } 	from "../Variables";
import { blinkSquares } 				from "@/scripts/Events/utils/GlobalUtils";
import { spreadDemocracy }		 		from "./ArchiUtils";

export function playMoveAudio(raw, outcome, square)
{
	if (square)
		playAudio("check");
	else if (outcome?.captured)
		playAudio("capture");
	else if (outcome?.transformed)
		playAudio("trans");
	else if (outcome?.moved)
		playAudio(raw.type === "moveboost" ? "armability" : "move");
}

export function stopBlinking()
{
	if (localInfo.blinking !== null)
		localInfo.blinking();
	localInfo.blinking = null;
}

export function handleErrors(raw)
{
	debug("[socketgame]: errore -", raw.log?.msg);
	if (!isCheck(raw))
		return;

	debug("[socket game]: è tempo di blinkare!");
	playAudio("check");
	if (raw.check === undefined)
		return;

	const threatId = new Set([raw.check.to, raw.check.mid, raw.check.from].filter(Boolean));
	localInfo.blinking = blinkSquares(threatId, {interval: 450, delay: 600});
	spreadDemocracy();
}