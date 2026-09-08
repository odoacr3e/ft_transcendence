import { updateMatchState, reloadMatchState, 
		 initLocalMatchState }							from "./Archi.js";
import { localInfo,  debug, isMatchLoaded, 
		 getCheckSquares }								from "./Variables.js";
import { stopBlinking, handleErrors, playMoveAudio }	from "./utils/socketListenUtils.js";
import { clearHighlight, setCheckSquare }				from "../Events/utils/HighlightUtils.js";
import { spreadDemocracy, setVictory } 					from "./utils/ArchiUtils.js";
import { pushTurn, reloadHistory } 						from "./History.js";
import { pushMessage } 									from "./ChatBox.js";
import { playAudio } 									from "../Helper/generalUtils.js";
import router 											from "@/router/index.js";

export function listenGameSocket(socket)
{
	socket.on("game", (raw) => {
		debug("[socketgame] ricevuta risposta di tipo:", raw.type, raw);

		if (raw.type === "msg")
			return (pushMessage(raw.msg, raw.author));
		stopBlinking();
		if (raw.log?.status != 200)
			return (handleErrors(raw));
		if (raw.id !== undefined || raw.type === "init")
			return (typeInit(raw));
		if (!raw.type)
			return;

		switch (raw.type)
		{
			case "reload":			typeReload(raw);		break;
			case "giveup":			typeGiveUp(raw);		break;
			case "draw":			typeDraw(raw);			break;
			case "timeout":			typeTimeout(raw);		break;
			case "simulate_boost":	typeSimulateBoost(raw);	break;
			case "history":			typeHistory(raw);		break;
			default:				typeMoveUpdate(raw);	break;
		}
	});
}

function typeInit(raw)
{
	debug("[socket game]: New game trovato!");
	initLocalMatchState(raw);
	playAudio("begin");
	router.replace({name: raw.p3 ? "GameFour" : "game" });
}

function typeGiveUp(raw)
{
	debug("[giveup]: ricevuto giveup");
	const iWon = raw.victory === localInfo.myTeam;
	const iGaveUp = !iWon;

	setVictory(raw.victory, iWon);
	if (iGaveUp)
		playAudio("giveup");
	spreadDemocracy();
}

function typeDraw(raw)
{
	if (raw.victory)
	{
		setVictory(raw.victory);
		spreadDemocracy();
		return;
	}
	if (raw.draw === true && localInfo.drawOffer === 'sent')
		return (playAudio("askdraw"));
	localInfo.drawOffer = (raw.draw === true) ? "received" : null;
	if (localInfo.drawOffer === "received")
		playAudio("recdraw");
}

function typeReload(raw)
{
	if (isMatchLoaded())
	{
		debug("[reload]: state già presente nel mounted");
		return;
	}
	reloadMatchState(raw);
	typeHistory(raw);
	setCheckSquare(getCheckSquares(raw));
}

function typeTimeout(raw)
{
	debug("[socket game -> timeout]: tempo scaduto, victory =", raw.victory);
	if (raw.victory)
		setVictory(raw.victory);
	spreadDemocracy();
}

function typeSimulateBoost(raw)
{
	debug("{socket game [simu_boost]}: payload richiesta simulate boots");
	if (raw.log.status !== 200)
	{
		playAudio("checkboost");
		debug("ma non è possibile");
	}
}

function typeHistory(raw)
{
	debug("{socket game [history]}: ricevuti turni");
	if (Array.isArray(raw.history))
		reloadHistory(raw.history);
	else if (raw.history)
		pushTurn(raw.history);
	else
		debug("{socket game [history]}: nessun turno nel payload", raw);
}

function typeMoveUpdate(raw)
{
	const outcome = updateMatchState(raw);

	if (raw.history)
		pushTurn(raw.history);
	clearHighlight();

	setCheckSquare(getCheckSquares(raw));
	if (localInfo.victory)
		return;
	playMoveAudio(raw, outcome, getCheckSquares(raw));
}

// export function listenGameSocket(socket)
// {
// 	socket.on("game", (raw) => {
// 		debug("{[socket game] ricevuta una riposta} tipo: ", raw.type, "response: ", raw);

// 		if (raw.type === "msg")
// 		{
// 			debug("[socket game] -> [msg]: ricevuto messaggio di gioco", raw);
// 			pushMessage(raw.msg, raw.author);
// 			return;
// 		}
// 		if (localInfo.blinking)
// 		{
// 			localInfo.blinking();
// 			localInfo.blinking = null;
// 		}
// 		if (raw.log?.status != 200)
// 		{
// 			debug("[socket game]: errore -", raw.log?.msg);
// 			const mask = Number(raw.mask);
// 			if (mask & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE))
// 			{
// 				debug("[socket game]: è tempo di blinkare!");
// 				playAudio("check");
// 				if (raw.check != undefined)
// 				{
// 					const threatId = new Set([raw.check.to, raw.check.mid, raw.check.from].filter(Boolean));
// 					localInfo.blinking = blinkSquares(threatId, {interval: 450, delay: 600});
// 					spreadDemocracy();
// 					return;
// 				}
// 			}
// 			return;
// 		}
// 		if (raw.id !== undefined || raw.type === "init")
// 		{
// 			debug("[socket game] ID NEW GAME TROVATO!");
// 			initLocalMatchState(raw);
// 			playAudio("begin");
// 			router.replace( {name: raw.p3 ? "GameFour" : "game"});
// 			return;
// 		}
// 		if (raw.type === "reload")
// 		{
// 			// debug("{socket game [reload]} ricevuto reload. localMatchstate =", localMatchState);
// 			if (!localMatchState)
// 			{
// 				reloadMatchState(raw);
// 				if (Array.isArray(raw.history))
// 					reloadHistory(raw.history);
// 				else if (raw.history)
// 					pushTurn(raw.history);
// 				if ((Number(raw.mask) & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE)) && raw.giorgi0)
// 					setCheckSquare(raw.giorgi0);
// 			}
// 			else
// 				debug("{socket game [reload]}: state già presente nel controllo sul mounted");
// 			return;
// 		}
// 		if (raw.type === "giveup")
// 		{
// 			debug("[socket game] -> [giveup]: ricevuto giveup");
// 			const iWon = raw.victory === localInfo.myTeam;

// 			setVictory(raw.victory, iWon);
// 			if (!iWon)
// 				playAudio("giveup");
// 			spreadDemocracy();
// 			return;
// 		}
// 		if (raw.type === "draw")
// 		{
// 			debug("[socket game] -> [draw]: ricevuto draw");
// 			if (raw.victory)
// 			{
// 				setVictory(raw.victory);
// 				spreadDemocracy();
// 				return;
// 			}
// 			if (localInfo.drawOffer === "sent" && raw.draw === true)
// 			{
// 				debug("inviato")
// 				playAudio("askdraw");
// 				return;
// 			}
// 			localInfo.drawOffer = (raw.draw === true) ? "received" : null;
// 			if (localInfo.drawOffer === "received")
// 			{
// 				debug("ricevuto");
// 				playAudio("recdraw");
// 			}
// 			return;
// 		}
// 		if (raw.type === "timeout")
// 		{
// 			debug("[socket game -> timeout]: tempo scaduto, victory =", raw.victory);
// 			if (raw.victory)
// 				setVictory(raw.victory);
// 			spreadDemocracy();
// 			return;
// 		}
// 		if (raw.type == "simulate_boost")
// 		{
// 			debug("{socket game [simu_boost]}: payload richiesta simulate boots");
// 			if (raw.log.status !== 200)
// 			{
// 				playAudio("checkboost");
// 				debug("ma non è possibile");
// 			}
// 			return;
// 		}
// 		if (raw.type === "history")
// 		{
// 			// debug("{socket game [history]}: ricevuti turni");
// 			if (Array.isArray(raw.history))
// 				reloadHistory(raw.history);
// 			else if (raw.history)
// 				pushTurn(raw.history);
// 			else
// 				debug("{socket game [history]}: nessun turno nel payload", raw);
// 			return;
// 		}
// 		// debug("[socket game]: update match");
// 		if (!raw.type)
// 			return;
// 		const outcome = updateMatchState(raw);
// 		if (raw.history)
// 			pushTurn(raw.history);
// 		clearHighlight();

// 		const inCheck = (Number(raw.mask) & (eSpecialMoves.CHECK | eSpecialMoves.CHECKMATE)) && raw.giorgi0;
// 		setCheckSquare(inCheck ? raw.giorgi0 : null);
// 		if (localInfo.victory)
// 			return;
// 		if (inCheck)
// 		{
// 			debug("[socket game]: re sotto scacco in", raw.giorgi0);
// 			playAudio("check");
// 		}
// 		else if (outcome?.captured)
// 			playAudio("capture");
// 		else if (outcome?.transformed)
// 			playAudio("trans");
// 		else if (outcome?.moved)
// 			playAudio(raw.type === "moveboost" ? "armability" : "move");
// 	});
// }