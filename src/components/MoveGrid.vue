<script setup>
	//@ts-nocheck
	import { computed }						from 'vue';
	import { gridCells, arrowSegments }		from '@/scripts/Helper/codexGrid.js';

	const props = defineProps({
		scene:		 { type: Object, default: null },		//CodexPattern, null = griglia vuota
		variant:	 { type: String, default: 'regular' },	//'regular' | 'boosted', stessi colori della board
		resolveIcon: { type: Function, default: () => '' },	//(actor) => src, la risolve il padre
	});

	//id univoco del marker SVG: due griglie sulla stessa pagina non devono condividerlo
	const uid		= `arrow-${Math.random().toString(36).slice(2, 8)}`;
	const cells		= computed(() => gridCells(props.scene));
	const arrows	= computed(() => arrowSegments(props.scene));
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
