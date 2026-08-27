import { CODEX_RADIUS } from "@/scripts/Data/PiecesCodex.js";

/*
	Geometria della griglia del codex: matematica pura su coordinate, senza Vue.
	Una scena descrive un pezzo al centro (0,0) e cio' che gli sta intorno; qui si traduce
	in caselle da disegnare e frecce da tracciare.

	Le coordinate vanno da -CODEX_RADIUS a +CODEX_RADIUS su entrambi gli assi e viaggiano
	come chiavi stringa "x,y", perche' servono come chiavi di Map/Set e come :key nel v-for.
*/

/** Lato della griglia in caselle. ATTENZIONE: il CSS di MoveGrid.vue ha un repeat(5, 1fr) che deve restare allineato. */
export const SIDE = CODEX_RADIUS * 2 + 1;

/** Lato di una casella in percentuale del viewBox SVG (0-100). */
export const UNIT = 100 / SIDE;

/** @typedef {{ x: number, y: number, role?: string, type?: string }} Actor */

const key = (x, y) => `${x},${y}`;

/** Centro di una casella nel viewBox SVG, per farci partire e arrivare le frecce. */
export const px = (v) => (v + CODEX_RADIUS + 0.5) * UNIT;

const inside = (x, y) => Math.abs(x) <= CODEX_RADIUS && Math.abs(y) <= CODEX_RADIUS;

/**
 * I pezzi della scena, indicizzati per casella.
 * @param {*} scene
 * @returns {Map<string, Actor>}
 */
export function actorMap(scene)
{
	const out = new Map();

	for (const a of scene?.actors ?? [])
		out.set(key(a.x, a.y), a);
	return (out);
}

/**
 * Le caselle marcate: quelle scritte a mano nella scena piu' quelle generate dal pattern.
 * Un pattern si espande in linea finche' non esce dalla griglia o non incontra un pezzo.
 * @param {*} scene
 * @param {Map<string, Actor>} [actors]
 * @returns {Map<string, 'move'|'capture'>}
 */
export function markMap(scene, actors = actorMap(scene))
{
	const out = new Map();

	if (!scene)
		return (out);

	for (const m of scene.marks ?? [])
		out.set(key(m.x, m.y), m.kind ?? "move");

	const pattern = scene.pattern;
	if (!pattern)
		return (out);

	const src	= (scene.actors ?? [])[scene.patternFrom ?? 0] ?? { x: 0, y: 0 };
	const steps	= pattern.slide ? CODEX_RADIUS * 2 : 1;

	const paint = (dirs, kind) => {
		for (const [dx, dy] of dirs ?? [])
		{
			for (let s = 1; s <= steps; s++)
			{
				const x = src.x + dx * s;
				const y = src.y + dy * s;

				if (!inside(x, y) || actors.has(key(x, y)))
					break;
				out.set(key(x, y), kind);
			}
		}
	};

	paint(pattern.dirs, "move");
	paint(pattern.capture, "capture");
	return (out);
}

/**
 * Le caselle attraversate da una freccia: li' il marcatore non va disegnato, ci passa gia' la linea.
 * Se il tragitto non e' rettilineo (ne' ortogonale ne' diagonale) si segna solo l'arrivo.
 * @param {*} scene
 * @returns {Set<string>}
 */
export function arrowPath(scene)
{
	const out = new Set();

	for (const a of scene?.arrows ?? [])
	{
		const [fx, fy]	= a.from;
		const [tx, ty]	= a.to;
		const dx		= Math.sign(tx - fx);
		const dy		= Math.sign(ty - fy);
		const steps		= Math.max(Math.abs(tx - fx), Math.abs(ty - fy));
		const straight	= dx === 0 || dy === 0 || Math.abs(tx - fx) === Math.abs(ty - fy);

		if (steps && straight)
			for (let s = 1; s <= steps; s++)
				out.add(key(fx + dx * s, fy + dy * s));
		else
			out.add(key(tx, ty));
	}
	return (out);
}

/**
 * Le caselle da disegnare, in ordine di lettura (dall'alto a sinistra).
 * @param {*} scene
 * @returns {Array<{key: string, dark: boolean, actor: Actor|null, mark: string|null}>}
 */
export function gridCells(scene)
{
	const actors	= actorMap(scene);
	const marks		= markMap(scene, actors);
	const arrows	= arrowPath(scene);
	const out		= [];

	for (let y = -CODEX_RADIUS; y <= CODEX_RADIUS; y++)
	{
		for (let x = -CODEX_RADIUS; x <= CODEX_RADIUS; x++)
		{
			const k = key(x, y);

			out.push({
				key:	k,
				dark:	(x + y) % 2 !== 0,
				actor:	actors.get(k) ?? null,
				mark:	arrows.has(k) ? null : marks.get(k) ?? null,
			});
		}
	}
	return (out);
}

/**
 * Le frecce gia' convertite in coordinate del viewBox SVG.
 * @param {*} scene
 * @returns {Array<{x1: number, y1: number, x2: number, y2: number}>}
 */
export function arrowSegments(scene)
{
	return ((scene?.arrows ?? []).map(a => ({
		x1: px(a.from[0]),
		y1: px(a.from[1]),
		x2: px(a.to[0]),
		y2: px(a.to[1]),
	})));
}
