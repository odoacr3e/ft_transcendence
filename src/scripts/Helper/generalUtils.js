import { nextTick, onBeforeUnmount, onMounted, unref, watch } from "vue";
import { CLASSICAUDIOPATH, debug, LOLAUDIOPATH, MACRO } from "../Data/Variables";


const EXCLUSIVE = new Set(["giveup", "lost", "victory", "draw"]);
let currentTrack = null;
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
export function playAudio(use, once = false)
{
	let audioData;

	if (!MACRO.AUDIO)
		return;
	if (MACRO.AUDIOSET === "CLASSIC")
		audioData = CLASSICAUDIOPATH;
	else if (MACRO.AUDIOSET === "LOL")
		audioData = LOLAUDIOPATH;
	else
		return;

	const audio = audioData[use];
	const track = new Audio(audio.path);

	track.volume = audio.volume ?? 1;
	if (EXCLUSIVE.has(use))
	{
		if (currentTrack)
		{
			currentTrack.pause();
			currentTrack.currentTime = 0;
		}
		currentTrack = track;
		track.addEventListener("ended", () => {
			if (currentTrack === track)
				currentTrack = null;
		})
	}

	track.play().catch(e => debug(`audio "${use}" fallito:`, e));

	if (once)
		audio.playing = false;
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
			audio.playing = true;
}
