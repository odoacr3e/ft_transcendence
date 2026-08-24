<script setup>
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

	const marks = computed(() => {
		const out = new Map();
		if (!props.scene)
			return (out);
		
	})
</script>

<template>
	<div class="move-grid" :class="variant">
		<div v-for="cell in cells" :key="cell.key" class="cell" :class="{ dark: cell.dark }">
			<img v-if="cell.center && icon" :src="icon" alt="" :draggable="false" class="cell-piece">
			<span v-else-if="cell.mark" class="mark" :class="cell.mark"/>
		</div>
	</div>
</template>

<style scoped>
	.move-grid
	{
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		width: 100%;
		aspect-ratio: 1;
		border: 1px solid rgba(74, 52, 24, .55);
		--ink: rgba(74, 52, 24, .18);
		--mark-color: brown;			/* stesso colore di .highlight sulla board */
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
</style>
