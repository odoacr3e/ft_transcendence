<script setup>
	import { localInfo, localBoard, localPlayers }				from '@/scripts/Data/Variables.js';
	import { useAbility, sendEndTurn, shopAbility, sendGiveUp }	from '@/scripts/Events/utils/GlobalUtils';
	import { computed } 										from 'vue'

	const localPlayer	= computed(() => [...localPlayers.values()].find(p => p.team === localInfo.myTeam) ?? null);
	const myTurn		= computed(() => localPlayer.value?.isPlaying === true);
	const Piece = computed(() => {
		if (!localInfo.clickedId)
			return null;
		return ( localBoard.get(localInfo.clickedId)?.piece ?? null);
	})
	const canUseAbility = computed(() => myTurn.value && Piece.value 
										&& Piece.value.isBoostedBool
										&& Piece.value.team === localInfo.myTeam
										&& !localInfo.secondTurn);

	const canBoost = computed(() => myTurn.value && Piece.value
									&& !Piece.value.isBoostedBool
									&& localPlayer.value?.nPoints >= Piece.value?.price
									&& localInfo.secondTurn);
	const canEndTurn = computed(() => myTurn.value && localInfo.secondTurn);
	const canGiveUp = computed(() => myTurn.value)
</script>

<template>
	<div class="column" v-if="localPlayer">
		<button class="action bg-amber-300 hover:bg-orange-400"
			v-bind:class="canUseAbility ? 'on' : 'off'"
			@click="useAbility()">
			<img src="../assets/boost.png" alt="" :draggable="false" class="size-5">
			<b>Use Ability!</b>
		</button>
		<button class="action bg-emerald-400 hover:bg-emerald-500 flex-col !gap-0"
			v-bind:class="canBoost ? 'on' : 'off'"
			@click="shopAbility()">
			<b>Boost your Piece!</b>
			<p style="white-space: pre-line" class="text-xs"><i>{{ localInfo.priceSelected }}</i></p>
		</button>
		<button class="action bg-blue-500 hover:bg-indigo-500"
			v-bind:class="canEndTurn ? 'on' : 'off'"
			@click="sendEndTurn()">
			<img src="../assets/endturn.png" alt="" :draggable="false" class="size-5">
			<b>End Turn!</b>
		</button>
		<button class="action bg-grey-500 hover:bg-indigo-100"
			v-bind:class="canGiveUp ? 'true' : 'false'"
			@click="sendGiveUp()">
			<b>Give Up!</b>
		</button>
	</div>
</template>

<style scoped>
	.column
	{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		gap: 16px;
		width: 190px;
		user-select: none;
		z-index: 10;
	}

	.action
	{
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 12px;
		border-radius: 16px;
		color: #1b1b1b;
		transition: opacity .3s ease-in-out, filter .3s ease-in-out, transform .2s ease-in-out;
	}

	.action.on
	{
		opacity: 1;
		filter: grayscale(0);
		cursor: pointer;
		pointer-events: auto;
	}

	.action.on:hover{
		transform: translateY(-2px) scale(1.05);
	}

	.action.off
	{
		opacity: .4;
		filter: grayscale(1);
		pointer-events: none;
	}
</style>