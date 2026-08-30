import { reactive, computed }	from "vue";
import { localPlayers, MACRO }	from "./Variables";


/** @typedef {{ id: number, author: string, text: string, time: number }} ChatMessages */
/** @type {{ messages: chatMessage[] }} */
export const	chat = reactive({ messages: [] });
let				nextId = 1;

/**
 * @param {string | null} text
 * @param {string | null} author
 * @returns {boolean}
 */
export function pushMessage(text, author = MACRO.SERVER_AUTHOR)
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
		chat.messages.splice(0, chat.messages.length - (MACRO.MAX_MESSAGES - 1));
	return (true);
}

const	teamByName = computed(() => {
	const	map = new Map();

	for (const player of localPlayers.values())
		map.set(player.name, player.team);
	return (map);
});

export function resolveAuthor(author)
{
	if (!author || author === MACRO.SERVER_AUTHOR)
		return ({ kind:"server", team: null });
	return ({ kind: "player", team: teamByName.value.get(author) ?? null });
}

export function clearMessages()
{
	chat.messages.length = 0;
	nextId = 1
}
