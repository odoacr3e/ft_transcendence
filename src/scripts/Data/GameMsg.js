import { reactive } from "vue";

/*
	Ultimo messaggio ricevuto dal back sull'evento `gameMsg`.
	Il payload è una stringa nuda (websocket/utils.js -> gameMessage),
	ma normalizzo anche {msg: "..."} perché è il formato usato da `aiMsg`.
*/

/** @type {{ text: string, time: number }} */
export const gameMsg = reactive({ text: "", time: 0 });

/**
 * @param {*} raw
 * @returns {boolean}
 */
export function pushGameMsg(raw)
{
	const text = normalizeMsg(raw);

	if (!text)
		return (false);
	gameMsg.text = text;
	gameMsg.time = Date.now();
	return (true);
}

export function clearGameMsgs()
{
	gameMsg.text = "";
	gameMsg.time = 0;
}

/**
 * @param {*} raw
 * @returns {string}
 */
function normalizeMsg(raw)
{
	if (typeof raw === "string")
		return (raw.trim());
	if (raw && typeof raw === "object" && typeof raw.msg === "string")
		return (raw.msg.trim());
	return (console.warn("[GameMsg]: messaggio scartato, payload non valido", raw), "");
}
