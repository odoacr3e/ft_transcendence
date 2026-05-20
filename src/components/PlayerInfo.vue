<script setup>
	import { DOMPlayer, localBoard, localInfo, IMG_PATHS }	from '@/scripts/Data/Variables';
	import { useAbility, sendEndTurn }			from '@/scripts/Events/Global'
	import { computed }							from 'vue';

	const prop = defineProps({
  		p: Number
	})
	const	player = computed(() => DOMPlayer(prop.p)),
			playing = computed(() => player.value.isPlaying),
			up = prop.p === 2 ? true : false,
			down = prop.p === 1 ? true : false,
			endT = computed(() => localInfo.secondTurn);

	const Piece = computed(() => {
		if (!localInfo.clickedId) { return null; }
		return localBoard.get(localInfo.clickedId)?.piece ?? null;
	});


</script>

<template>
	<div class="wrap"
		v-bind:class="{'rounded-t-md mb-1':up, 'rounded-b-md mt-1':down}">

		<img src="../assets/default.png" alt="User Icon" :draggable="false" class="size-18.75 shrink-0"
			v-bind:class="{'rounded-tl-md':up, 'rounded-bl-md':down}">

		<div class="shrink-0">
			<b><h1 class="max-w-44 overflow-hidden text-ellipsis">{{ player.name }}</h1></b>
			<h2>Points: {{ player.nPoints }}</h2>
		</div>
		<div class="grow flex items-center justify-start gap-2 pr-2">
			<button class="bg-amber-300 text-sm
							transition delay-50 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-orange-400"
					v-bind:class="{ 'grayscale pointer-events-none':(!playing || !Piece || !Piece.isBoostedBool || Piece.team !== player.team),
						'cursor-pointer grayscale-0 pointer-events-auto':(playing && Piece && Piece.isBoostedBool && (Piece.team === player.team)) }"
				@click="useAbility()" v-if="playing && localInfo.hasBoost">
				<img src="../assets/boost.png" alt="" :draggable="false" class="size-5">
				<b>Use Ability!</b>
			</button>
			<button class="bg-blue-500 text-sm
						transition delay-50 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500 cursor-pointer"
				@click="sendEndTurn()" v-if="endT && playing">
				<img src="../assets/clock.png" alt="" :draggable="false" class="size-5">
				<b>End Turn</b>
			</button>
		</div>
		<img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" :draggable="false" class="size-18.75 shrink-0"
			v-bind:class="{'drop-shadow-custom':playing }">
	</div>
</template>

<style scoped>
	.wrap {
		display: flex;
		flex-direction: row;
		z-index: 10;
		position: relative;
		background-color: #e9dbdb34;
		align-self: center;
		width: 600px;
		user-select: none;
	}

	h1 {
		color: white;
		padding: 3px;
		padding-left: 8px;
		font-size: x-large;
	}

	h2 {
		color: white;
		font-size: large;
		padding-left: 8px;
	}

	button {
		display: flex;
		position: relative;
		gap: 4px;
		height: 55%;
		padding: 10px;
		margin-left: 5px;
		border-radius: 16px;
	}
</style>