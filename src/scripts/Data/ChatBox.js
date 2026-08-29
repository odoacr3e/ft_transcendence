import { reactive } 			from "vue";
import { localPlayers, MACRO }	from "./Variables";


/** @typedef {{ id: number, author: string, text: string, time: number }} ChatMessages */
/** @type {{ messages: ChatMessages[] }} */
export const	chat = reactive({ messages: [] });

let				nextId = 1;

/** @type {{ text: string, time: number }} */
export const gameMsg = reactive({ text: "", time: 0 });

/**
 * @param {string | null} text
 * @param {string | null} author
 * @returns {boolean}
 */

export function pushGameMsg(text, author = MACRO.SERVER_AUTHOR)
{
	if (!text)
		return (false);
	chat.messages.push({
		id: nextId++,
		author: author || MACRO.SERVER_AUTHOR,
		text: text,
		time: Date.now(),
	})
	if (chat.messages.length > MACRO.MAX_MESSAGES)
		chat.messages.shift();
	return (true);
}

export function resolveAuthor(author)
{
	if (!author || author === MACRO.SERVER_AUTHOR)
		return ({ kind:"server", team: null });
	const player = [...localPlayers.values()].find((p) => p?.name === author);
	return ({ kind: "player", team: player?.team ?? null });
}

export function clearGameMsgs()
{
	chat.messages.length = 0;
	nextId = 1
}
