import { nextTick, onBeforeUnmount, onMounted, unref, watch } from "vue";

/*
	Chiude un popup quando si clicca fuori dalla sua area (e, se richiesto, con Escape).
	Sostituisce le tre implementazioni a mano che vivevano in ChessBoard, ActionButtons e AppHeader.

	`target` decide cosa conta come "dentro":
	-	un ref a un elemento	-> dentro = l'elemento contiene il click;
	-	un selettore CSS	-> dentro = il click è partito da un elemento che lo soddisfa
							   (serve a ChessBoard, dove i badge di boost sono tanti e sparsi).

	`when` è il ref che dice se il popup è aperto: finché è falsy nessun listener resta attaccato.
	Il listener viene agganciato dopo un nextTick, altrimenti il click che apre il popup lo richiude subito.
	Se `when` non c'è, i listener stanno su per tutta la vita del componente.
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
