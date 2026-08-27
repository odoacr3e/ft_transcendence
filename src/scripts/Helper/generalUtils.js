import { nextTick, onBeforeUnmount, onMounted, unref, watch } from "vue";
import { CLASSICAUDIOPATH, debug, LOLAUDIOPATH, MACRO } from "../Data/Variables";

/*
	Chiude un popup quando si clicca fuori dalla sua area (e, se richiesto, con Escape)
*/
/**
 * @param {import('vue').Ref<HTMLElement|null>|string}	target
 * @param {(event: Event) => void}						onOutside
 * @param {{ when?: import('vue').Ref<*>, escape?: boolean }} [options]
 */
export function useClickOutside(target, onOutside, { when = null, escape = false } = {})
{
	function isInside(event)
	{
		if (typeof target === "string")
			return (!!event.target?.closest?.(target));

		const el = unref(target);
		return (!!el && el.contains(event.target));
	}

	function onClick(event)
	{
		if (!isInside(event))
			onOutside(event);
	}

	function onKeydown(event)
	{
		if (event.key === "Escape")
			onOutside(event);
	}

	function start()
	{
		document.addEventListener("click", onClick);
		if (escape)
			document.addEventListener("keydown", onKeydown);
	}

	function stop()
	{
		document.removeEventListener("click", onClick);
		document.removeEventListener("keydown", onKeydown);
	}

	if (when)
		watch(when, (val) => { if (val) nextTick(start); else stop(); });
	else
		onMounted(start);

	onBeforeUnmount(stop);

	return ({ start, stop });
}

/**
 * @param {"CLASSIC"|"LOL"|null} which
 * @param {string} use
 */
export function playAudio(use, flag = false)
{
	let audioData;

	if (MACRO.AUDIOSET === "CLASSIC")
		audioData = CLASSICAUDIOPATH;
	else if (MACRO.AUDIOSET === "LOL")
		audioData = LOLAUDIOPATH;
	else
		return;

	const audio = audioData[use];
	if (!audio)
		return;

	if (!audio.flag && audio.path)
			new Audio(audio.path).play().catch(e => debug(`audio "${use}" fallito:`, e));
	if (flag)
		audio.flag = true;
}

/**
 * @param {"CLASSIC"|"LOL"|null} which
 */
export function resetAudioFlags(which = null)
{
	const sets = [];

	if (which !== "LOL")
		sets.push(CLASSICAUDIOPATH);
	if (which !== "CLASSIC")
		sets.push(LOLAUDIOPATH);

	for (const audioData of sets)
		for (const audio of Object.values(audioData))
			audio.flag = false;
}
