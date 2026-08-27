<script setup>
	//@ts-nocheck
	import IconEsoteric											from './icons/IconEsoteric.vue';
	import { localBoard, localInfo, IMG_PATHS }	from '@/scripts/Data/Variables.js';
	import { computed, ref, watch }								from 'vue';
	import { PIECES_CODEX }										from '@/scripts/Data/PiecesCodex.js';
	import MoveGrid												from './MoveGrid.vue';
	import IconCoins											from './icons/IconCoins.vue';

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
	const shownText		= computed(() => tab.value === 'base' ? entry.value?.baseText : entry.value?.boostText);
	const shownScenes	= computed(() => {
		if (!entry.value)
			return ([]);

		const scenes = tab.value === 'base' ? entry.value.baseScenes : entry.value.boostScenes;
		if (scenes?.length)
			return (scenes);

		const pattern = tab.value === 'base' ? entry.value.move : entry.value.boost;
		if (!pattern)
			return ([]);
		return ([{
			actors:	[ { x:0, y:0, role: 'self' } ],
			pattern,
		}])
	});

	const enemyTeam		= computed(() => piece.value?.team === 'black' ? 'white' : 'black');
	const iconFor		= (actor) => {
		const team = actor.role === 'enemy' ? enemyTeam.value : piece.value?.team;
		const type = actor.type ?? piece.value?.type;
		return IMG_PATHS[team + type] ?? '';
	}

	watch(piece, () => tab.value = 'base');


</script>

<template>
	<div class="wrap">

		<div class="codex">
			<div class="title">
				<IconEsoteric class="codex-svg"/>
				<h1 class="title-txt">
					<span class="title-top">KING'S</span>
					<span class="title-bottom">CODEX</span>
				</h1>
			</div>
			<hr class="sep-line mt-1.5">

			<div class="metadata" :class="{ 'is-hidden' : !piece }">
				<div class="mb-8 mt-10">
					<div class="page-head">
						<img v-if="piecePath" :src="piecePath" alt="" :draggable="false" class="piece-icon">
						<div class="head-info">
							<h2 class="font-[1000] transform: uppercase">{{ entry?.name ?? piece?.type  }}</h2>
							<span class="text-lg flex flex-row items-center gap-2">
								<IconCoins/> {{ piece?.price }}
							</span>
						</div>
					</div>
				</div>
				<div class="moves">
					<div class="tabs">
						<button type="button" class="tab" :class="{ active: tab === 'base' }" @click="tab = 'base'">Base</button>
						<button type="button" class="tab" :class="{ active: tab === 'boost' }" :disabled="!entry?.boost && !entry?.boostScenes?.length" @click="tab = 'boost'">Boost</button>
					</div>
					<p class="move-desc">{{ shownText }}</p>
					<div class="scenes">
						<figure v-for="(scene, i) in shownScenes" :key="i" class="scene">
							<MoveGrid :scene="scene" :variant="tab === 'base' ? 'regular' : 'boosted'" :resolve-icon="iconFor"/>
							<figcaption v-if="scene.caption" class="scene-cap">{{ scene.caption }}</figcaption>
						</figure>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.wrap
	{
		user-select: none;
		box-sizing: border-box;
		flex: 0 0 auto;
		width: 25rem;
		margin-top: 1rem;
		padding-right: 3rem;
		padding-left: 3rem;
		/* margin: 2rem; */
	}

	.title
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .8rem;
		zoom: .88;
		padding-top: 1rem;
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
		gap: .8rem;
	}

	.head-info
	{
		display: flex;
		flex-direction: column;
		gap: .8rem;
		margin-top: 1rem;
		color: #ffffff;
		font-weight: 700;
		font-size: x-large;
		letter-spacing: .08rem;
		line-height: 1;
		font-family: Arial, Helvetica, sans-serif;
		text-transform: uppercase;
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
		gap: .1rem;
		zoom: .88;
	}

	.piece-icon
	{
		--piece-dim: 6rem;

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
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .5rem;
		width: 18rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.tabs
	{
		display: flex;
		width: 100%;
	}

	.move-desc
	{
		position: relative;
		padding: .9rem 1.1rem;
		width: 25rem;
		margin-inline: -2rem;
		white-space: pre-line; /**Per considerare i whitespace nel testo che scrivo*/
		min-height: 3.5rem;
		font-size: 1rem;
		line-height: 1.35;
		letter-spacing: .02rem;
		opacity: .8;
	}

	.moves::before
	{
		content: '';
		position: absolute;
		width: 3.5rem;
		height: 25rem;
		border: 1px solid rgb(66, 59, 59, 1);
		pointer-events: none;
		top: .9rem;
		left: -2.5rem;
		border-right: none;
		/* border-bottom: none; */
		z-index: 0;
	}

	.moves::after
	{
		content: '';
		position: absolute;
		width: 3.5rem;
		height: 25rem;
		border: 1px solid rgb(66, 59, 59, 1);
		pointer-events: none;
		top: .9rem;
		right: -2.5rem;
		/* border-top: none; */
		border-left: none;
		z-index: 0;
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

	.scenes
	{
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		gap: .6rem;
		width: 18.6rem;
		margin-inline: -3.8rem;
	}

	.scene
	{
		flex: 0 0 8.8rem;
		min-width: 0;
	}

	.scene-cap
	{
		margin-top: .35rem;
		font-size: .7rem;
		line-height: 1.25;
		opacity: .75;
		text-align: center;
	}

	.sep-line
	{
		margin-left: -1rem;
		margin-right: -1rem;
		color: rgb(66, 59, 59, 1);
	}
</style>
