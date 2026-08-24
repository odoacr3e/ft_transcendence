<script setup>
	//@ts-nocheck
	import IconEsoteric											from './icons/IconEsoteric.vue';
	import { localBoard, localInfo, IMG_PATHS, localPlayers }	from '@/scripts/Data/Variables.js';
	import { computed, ref, watch }								from 'vue';
	import { PIECES_CODEX }										from '@/scripts/Data/PiecesCodex.js';
	import MoveGrid												from './MoveGrid.vue';

	const piece = ref(null);

	watch(() => localInfo.lastClickedId, (id) => {
		const selected = localBoard.get(id)?.piece;
		if (selected && selected.team === localInfo.myTeam)
		{
			piece.value = selected;
			return;
		}
		const clicked = localBoard.get(localInfo.clickedId)?.piece;
		if (id === null && clicked?.team === localInfo.myTeam)
			piece.value = null;
	});

	const piecePath 	= computed(() => piece.value ? IMG_PATHS[piece.value.team + piece.value.type] : "");
	const entry			= computed(() => piece.value ? PIECES_CODEX[piece.value.type] ?? null : null);
	const tab			= ref('base');
	const shownPattern	= computed(() => tab.value === 'base' ? entry.value?.move : entry.value?.boost);
	const shownText		= computed(() => tab.value === 'base' ? entry.value?.baseText : entry.value?.boostText);
	const localPlayer	= computed(() => [...localPlayers.values()].find(p => p.team === localInfo.myTeam) ?? null);
	const canAfford		= computed(() => (localPlayer.value?.nPoints ?? 0) >= (piece.value?.price ?? 0));

	watch(piece, () => tab.value = 'base');

</script>

<template>
	<div class="wrap m-18 mt-2.5">

		<div class="codex">
			<div class="sep-line mb-5"></div>
			<div class="title">
				<IconEsoteric class="codex-svg"/>
				<h1 class="title-txt">
					<span class="title-top">KING'S</span>
					<span class="title-bottom">CODEX</span>
				</h1>
			</div>

			<div class="metadata mt-6" :class="{ 'is-hidden' : !piece }">
				<div class="mb-8 mt-10">
					<div class="page-head">
						<img v-if="piecePath" :src="piecePath" alt="" :draggable="false" class="piece-icon">
						<h2 class="piece-name">{{ entry?.name ?? piece?.type  }}</h2>
					</div>
					<div class="cost">
						<span v-if="piece?.isBoostedBool">Già Potenziato</span>
						<span v-else>Costo: {{ piece?.price }}</span>
					</div>
				</div>
				<div class="moves">
					<div class="tabs">
						<button type="button" class="tab" :class="{ active: tab === 'base' }" @click="tab = 'base'">Base</button>
						<button type="button" class="tab" :class="{ active: tab === 'boost' }" :disabled="!entry?.boost" @click="tab = 'boost'">Boost</button>
					</div>
					<p class="move-desc">{{ shownText }}</p>
					<MoveGrid :pattern="shownPattern" :icon="piecePath" :variant="tab === 'base' ? 'regular' : 'boosted'"/>
				</div>
			</div>
			
			<div class="sep-line"/>
		</div>
	</div>
</template>

<style scoped>
	.wrap
	{
		user-select: none;
		padding-top: 1.5rem;
		box-sizing: border-box;
		flex: 0 0 auto;
		width: 18rem;
	}

	.title
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .4rem;
	}

	.title-txt
	{
		display: flex;
		flex-direction: column;
		line-height: 1;
		color: #ffffff;
		font-weight: 1000;
		font-size: x-large;
		letter-spacing: .08rem;
		font-family: Arial, Helvetica, sans-serif;
	}

	.title-bottom
	{
		margin-left: 50%;
	}

	.codex
	{
		display: flex;
		flex-direction: column;
	}

	.codex-svg
	{
		flex: 0 0 auto;
		font-size: 6rem;
	}

	.metadata
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		color: #ffffff;
		font-family: Arial, Helvetica, sans-serif;
	}

	.is-hidden
	{
		visibility: hidden;
	}

	.page-head
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .6rem;
	}

	.piece-icon
	{
		--piece-dim: 3rem;

		flex: 0 0 auto;
		width: var(--piece-dim);
		height: var(--piece-dim);
		object-fit: contain;
	}

	.piece-name
	{
		font-size: 1.5rem;
		font-weight: 1000;
		letter-spacing: .12rem;
		line-height: 1;
		text-transform: uppercase;
		margin-top: .5rem;
	}

	.moves
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .5rem;
		width: 11rem;
	}

	.tabs
	{
		display: flex;
		width: 100%;
	}

	.move-desc
	{
		width: 25rem;
		margin-inline: -2rem;
		white-space: pre-line; /**Per considerare i whitespace */
		min-height: 3.5rem;
		font-size: 1rem;
		line-height: 1.35;
		letter-spacing: .02rem;
		opacity: .8;
	}

	.tab
	{
		flex: 1 1 0;
		padding: .35rem 0;
		border: 1px solid currentColor;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: .65rem;
		font-weight: 1000;
		letter-spacing: .12rem;
		text-transform: uppercase;
		cursor: pointer;
		/* opacity: .45;e */
	}

	.tab:first-child
	{
		border-right: 0;
	}

	.tab.active
	{
		opacity: 1;
		background-color: rgba(160, 158, 156, .18);
	}

	.tab:disabled
	{
		/* opacity: .15; */
		cursor: not-allowed;
	}

	.cost
	{
		font-size: 1rem;
		font-weight: 1000;
		letter-spacing: .06rem;
		color: aliceblue;
	}

	.sep-line
	{
		flex: 0 0 auto;
		height: 1px;
		margin-left: -3rem;
		margin-right: -3rem;
		background-color: #423b3b;
	}
</style>
