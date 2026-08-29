import { reactive } from "vue";

/*
	Ultimo messaggio ricevuto dal back sull'evento `gameMsg`.
	Il payload è una stringa nuda (websocket/utils.js -> gameMessage),
	ma normalizzo anche {msg: "..."} perché è il formato usato da `aiMsg`.
*/

/** @type {{ text: string, time: number }} */
export const gameMsg = reactive({ text: "", time: 0 });

/**
 * @param {string | null} text
 * @returns {boolean}
 */
export function pushGameMsg(text)
{
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
