import { nextTick, onBeforeUnmount, onMounted, unref, watch } from "vue";
import { AUDIO_PATHS, debug, MACRO } from "../Data/Variables";


//NOTE - suoni brevi di interfaccia: non troncano quello in corso e non vengono troncati.
const UI_SOUNDS = new Set(["clicked", "badmove", "tap"]);
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
 * @param {string} use
 * @param {boolean} once
 */
export function playAudio(use, once = false)
{
	if (!MACRO.AUDIO)
		return;

	const audio = AUDIO_PATHS[use];
	if (!audio?.path)
		return (console.log(`audio "${use}" non presente nel set ${MACRO.AUDIOSET}`));
	const track = new Audio(audio.path);

	track.volume = Math.min(Math.max(audio.volume ?? 1, 0), 1);
	if (!UI_SOUNDS.has(use))
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
 * Riabilita i suoni spenti da playAudio(use, true) nel set attivo.
 */
export function resetAudioFlags()
{
	for (const audio of Object.values(AUDIO_PATHS))
		audio.playing = true;
}

/**
 * Dice se l'evento arriva da un campo di testo, per proteggere mentre scrivi (chat, input, contenteditable).
 * @param {EventTarget|null} target
 */
export function isTypingTarget(target)
{
	if (!(target instanceof HTMLElement))
		return (false);
	if (target.isContentEditable)
		return (true);
	return (/^(input|textarea|select)$/i.test(target.tagName));
}
