<script setup>
	//@ts-nocheck
	import { computed }			from 'vue';
	import { CODEX_RADIUS }	from '@/scripts/Data/PiecesCodex.js';

	const props = defineProps({
		scene:		 { type: Object, default: null },		//CodexPattern, null = griglia vuota
		variant:	 { type: String, default: 'regular' },	//'regular' | 'boosted', stessi colori della board
		resolveIcon: { type: Function, default: () => '' },	//(actor) => src, la risolve il padre
	});

	const SIDE		= CODEX_RADIUS * 2 + 1;
	const UNIT		= 100 / SIDE;
	const uid		= `arrow-${Math.random().toString(36).slice(2, 8)}`;
	const actors	= computed(() => props.scene?.actors ?? []);

	const actorAt = computed(() => {
		const out = new Map();
		for (const a of actors.value)
			out.set(`${a.x},${a.y}`, a);
		return (out);
	})

	// Con questa mi disegno le caselle, prendo le scene che ho prefatto oppure le genero, restituisco una mappa "coords" -> move | capture
	const marks = computed(() => {
		const out = new Map();
		if (!props.scene)
			return (out);
		
		for (const m of props.scene.marks ?? [])
			out.set(`${m.x},${m.y}`, m.kind ?? 'move');

		const pattern = props.scene.pattern;
		if(!pattern)
			return (out)

		const src = actors.value[props.scene.patternFrom ?? 0] ?? { x:0, y:0 };
		const paint = (dirs, kind) => {
			for (const [dx, dy] of dirs ?? [])
			{
				const steps = pattern.slide ? CODEX_RADIUS * 2 : 1;
				for (let s = 1; s <= steps; s++)
				{
					const x = src.x + dx * s;
					const y = src.y + dy * s;
					if (Math.abs(x) > CODEX_RADIUS || Math.abs(y) > CODEX_RADIUS)
						break;
					if (actorAt.value.has(`${x},${y}`))
						break;
					out.set(`${x},${y}`, kind);
				}	
			}
		};

		paint(pattern.dirs, 'move');
		paint(pattern.capture, 'capture');
		return (out);
	});

	const arrowPath = computed(() => {
		const out = new Set();
		for (const a of props.scene?.arrows ?? [])
		{
			const [fx, fy]	= a.from;
			const [tx, ty]	= a.to;
			const dx		= Math.sign(tx - fx);
			const dy		= Math.sign(ty - fy);
			const steps		= Math.max(Math.abs(tx - fx), Math.abs(ty - fy));

			if (steps && (dx === 0 || dy === 0 || Math.abs(tx - fx) === Math.abs(ty - fy)))
				for (let s = 1; s <= steps; s++)
					out.add(`${fx + dx * s},${fy + dy * s}`);
			else
				out.add(`${tx},${ty}`);
		}
		return (out);
	});

	const cells = computed(() => {
		const out = [];
		for (let y = -CODEX_RADIUS; y <= CODEX_RADIUS; y++)
		{
			for (let x = -CODEX_RADIUS; x <= CODEX_RADIUS; x++)
			{
				const key = `${x},${y}`;
				out.push({
					key,
					dark:	(x + y) % 2 !== 0,
					actor:	actorAt.value.get(key) ?? null,
					mark:	arrowPath.value.has(key) ? null : marks.value.get(key) ?? null,
				});
			}
		}
		return (out);
	});

	const px = (v) => (v + CODEX_RADIUS + 0.5) * UNIT;

	const arrows = computed(() => (props.scene?.arrows ?? []).map(a => ({
		x1: px(a.from[0]),
		y1: px(a.from[1]),
		x2: px(a.to[0]),
		y2: px(a.to[1]),
	})));

</script>

<template>
	<div class="move-grid" :class="variant">
		<div v-for="cell in cells" :key="cell.key" class="cell" :class="{ dark: cell.dark }">
			<img v-if="cell.actor" :src="resolveIcon(cell.actor)" alt="" :draggable="false" class="cell-piece">
			<span v-else-if="cell.mark" class="mark" :class="cell.mark"/>
		</div>

		<svg v-if="arrows.length" class="arrows" viewBox="0 0 100 100">
			<defs>
				<marker :id="uid" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
					<path d="M0,0 L4,2 L0,4 Z" fill="var(--mark-color)"/>
				</marker>
			</defs>
			<line v-for="(a, i) in arrows" :key="i"
					:x1="a.x1" :y1="a.y1" :x2="a.x2" :y2="a.y2"
					stroke="var(--mark-color)" stroke-width="2.5" stroke-linecap="round"
					:marker-end="`url(#${uid})`"/>
		</svg>
	</div>
</template>

<style scoped>
	.move-grid
	{
		position: relative;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		width: 100%;
		aspect-ratio: 1;
		border: 1px solid rgba(74, 52, 24, .55);
		--felt: rgb(174, 163, 142, 1);	/* sfondo della griglia */
		--ink: rgba(120, 88, 52, .30);	/* Velo sopra la scacchiera, ti permette di scurirla o schiarirla */
		--mark-color: brown;			/* stesso colore di .highlight sulla board */
		background-color: var(--felt);
	}

	.move-grid.boosted
	{
		--mark-color: rgb(99, 221, 0);	/* stesso colore di .boostedHighlight sulla board */
	}

	.cell
	{
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
	}

	.cell.dark
	{
		background-color: var(--ink);
	}

	.cell-piece
	{
		position: relative;
		z-index: 1;
		width: 88%;
		height: 88%;
		object-fit: contain;
	}

	.mark
	{
		display: block;
		width: 15%;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: var(--mark-color);
	}

	/* convenzione scacchistica: cerchio vuoto = ci arrivo solo mangiando */
	.mark.capture
	{
		width: 62%;
		background-color: transparent;
		border: .18rem solid var(--mark-color);
	}

	.arrows
	{
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
