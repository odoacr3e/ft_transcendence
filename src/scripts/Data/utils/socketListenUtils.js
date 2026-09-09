import { playAudio } 					from "@/scripts/Helper/generalUtils";
import { debug, isCheck, localInfo } 	from "../Variables";
import { blinkSquares } 				from "@/scripts/Events/utils/GlobalUtils";
import { spreadDemocracy }		 		from "./ArchiUtils";

/**
 * Sceglie il suono da associare a una mossa appena arrivata in base ai dati in outcome
 * popolati da altre funzioni di archi.
 *
 * @param	{Object}	raw			Payload della mossa, serve solo per il suo type
 * @param	{{moved: boolean, captured: boolean, transformed: boolean}} outcome
 *									Cosa e' cambiato in board, da updateMatchState()
 * @param	{Set<string>|null} square	Le caselle sotto scacco, null se non c'e' scacco
 * @returns	{void}
 */
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

/**
 * Ferma il lampeggio delle caselle sotto scacco, se ce n'e' uno acceso.
 *
 * localInfo.blinking non contiene le caselle ma la funzione per spegnerle, lasciata li' da
 * blinkSquares(). Chiamarla e poi azzerare il campo e' una tecnica pigra per unire
 * sia flag che funzione in un unica variabile, possibilmente confusionario? SI, 
 * funziona? ASSOLUTAMENTE SI, quindi faccio come voglio
 * 
 * Lo blocco preveentivamente ad ogni update che faccio
 *
 * @returns	{void}
 */
export function stopBlinking()
{
	if (localInfo.blinking !== null)
		localInfo.blinking();
	localInfo.blinking = null;
}

/**
 * Gestisce i payload che il server ha rifiutato, cioe' quelli con log.status diverso da 200.
 *
 * Quasi sempre c'e' solo da stampare il messaggio, altre volte caselle da lampeggiare
 * Le caselle da far lampeggiare sono le tre o due della minaccia, partenza, transito e arrivo,
 * raccolte in un Set che scarta i campi assenti: non tutti i pezzi passano da una casella
 * intermedia.
 *
 * @param	{Object}	raw			Payload rifiutato, con log.msg, la maschera e il campo check
 * @returns	{void}
 */
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