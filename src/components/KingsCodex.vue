<script setup>
	import IconEsoteric							from './icons/IconEsoteric.vue';
	import { localBoard, localInfo, IMG_PATHS }	from '@/scripts/Data/Variables.js';
	import { computed, ref, watch }				from 'vue';

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
	})
	const piecePath = computed(() => piece.value ? IMG_PATHS[piece.value.team + piece.value.type] : "");

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
			<!-- <div class="sep-line mt-5"></div> -->
			<div class="metadata mt-20" :class="{ 'is-hidden': !piecePath }">
				<div class="icon-slot">
					<img v-if="piecePath" :src="piecePath" alt="" :draggable="false" class="metadata-icon">
				</div>
				<div class="metadata-info">
					<span>{{ piece?.type }}</span>
					<span>{{ piece?.price }}</span>
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
		margin-left: -1.5rem;
		gap: .4rem;
	}

	.title-txt
	{
		display: flex;
		flex-direction: column;
		line-height: 1;
		color: #e5e5e5;
		font-weight: 1000;
		font-size: xx-large;
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

	.icon-slot
	{
		flex: 0 0 auto;
		width: 5rem;
		height: 5rem;
	}

	.metadata-icon
	{
		width: 90%;
		height: 90%;
	}

	.is-hidden{
		visibility: hidden;
	}
	
	.metadata
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .75rem;
		aspect-ratio: 426 / 240;
		background-image: url('@/assets/scroll.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.metadata-info
	{
		display: flex;
		flex-direction: column;
		gap: .35rem;
		min-width: 0;
		font-size: .8rem;
		color: #4a3418;
		font-weight: 1000;
		letter-spacing: .08rem;
		font-family: Arial, Helvetica, sans-serif;
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