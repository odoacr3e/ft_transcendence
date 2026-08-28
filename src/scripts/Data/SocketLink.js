import { updateMatchState, initLocalMatchState, reloadMatchState }	from "./Archi";
import { localInfo, localMatchState, MACRO, debug}						from "./Variables";
import { clearHighlight, setCheckSquare }							from "../Events/utils/HighlightUtils";
import { eSpecialMoves }											from "@/Common/ENUMS";		
import { blinkSquares } 											from "../Events/utils/GlobalUtils";
import router 														from "@/router";
import { resetLocalVars } 											from "./utils/ArchiUtils";
import { pushTurn, reloadHistory } 									from "./History";
import { pushGameMsg } 												from "./GameMsg";
import { playAudio } from "../Helper/generalUtils";

let audioFlag = false;

export function listenGameSocket(socket)
{
	socket.on("game", (raw) => {
		debug("{[socket game] ricevuta una riposta} tipo: ", raw.type, "response: ", raw);

		if (localInfo.blinking)
		{
			localInfo.blinking();
			localInfo.blinking = null;
		}
		if (raw.log?.status != 200)
		{
			debug("[socket game]: errore -", raw.log?.msg);
			const mask = Number(raw.mask);
			if (mask & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE))
			{
				debug("[socket game]: è tempo di blinkare!");
				playAudio("CHECK");
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
			debug("[socket game] ID NEW GAME TROVATO!");
			initLocalMatchState(raw);
			router.replace( {name: raw.p3 ? "GameFour" : "game"});
			return;
		}
		if (raw.type === "reload")
		{
			// console.log("{socket game [reload]} ricevuto reload. localMatchstate =", localMatchState);
			if (!localMatchState)
			{
				reloadMatchState(raw);
				if (Array.isArray(raw.history))
					reloadHistory(raw.history);
				else if (raw.history)
					pushTurn(raw.history);
				if ((Number(raw.mask) & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE)) && raw.giorgi0)
					setCheckSquare(raw.giorgi0);
			}
			else
				debug("{socket game [reload]}: state già presente nel controllo sul mounted");
			return;
		}
		if (raw.type === "giveup")
		{
			debug("[socket game] -> [giveup]: ricevuto giveup");
			localInfo.victory = raw.victory;
			resetLocalVars();
			return;
		}
		if (raw.type === "draw")
		{
			debug("[socket game] -> [draw]: ricevuto draw");
			if (localInfo.drawOffer === "sent" && raw.draw === true)
			{
				playAudio("askdraw");
				return;
			}
			localInfo.drawOffer = (raw.draw === true) ? "received" : null;
			if (localInfo.drawOffer === "received")
				playAudio("recdraw");
			return
		}
		if (raw.type === "timeout")
		{
			debug("[socket game -> timeout]: tempo scaduto, victory =", raw.victory);
			if (raw.victory)
				localInfo.victory = raw.victory;
			resetLocalVars();
			return;
		}
		if (raw.type == "simulate_boost")
		{
			debug("{socket game [simu_boost]}: payload richiesta simulate boots");
			return;
		}
		if (raw.type === "history")
		{
			// console.log("{socket game [history]}: ricevuti turni");
			if (Array.isArray(raw.history))
				reloadHistory(raw.history);
			else if (raw.history)
				pushTurn(raw.history);
			else
				debug("{socket game [history]}: nessun turno nel payload", raw);
			return;
		}
		// console.log("[socket game]: update match");
		updateMatchState(raw);
		if (raw.history)
			pushTurn(raw.history);
		clearHighlight();
		// playAudio("MOVE");
		const inCheck = (Number(raw.mask) & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE)) && raw.giorgi0;
		setCheckSquare(inCheck ? raw.giorgi0 : null);
		if (inCheck)
		{
			debug("[socket game]: re sotto scacco in", raw.giorgi0);
			playAudio("CHECK");
		}
	});

	socket.on("gameMsg", (raw) => {
		// console.log("{[socket gameMsg]} ricevuto messaggio:", raw);
		pushGameMsg(raw);
	});
}