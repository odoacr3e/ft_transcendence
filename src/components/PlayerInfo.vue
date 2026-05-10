<script setup>
	import { DOMPlayer, localBoard, localInfo }	from '@/scripts/Data/Variables';
	import { useAbility }			from '@/scripts/Events/Global'
	import { IMG_PATHS }			from '@/scripts/Helper/Constants';
	import { computed }				from 'vue';

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
		<img src="../assets/default.png" alt="User Icon" class="size-18.75"
			v-bind:class="{'rounded-tl-md':up, 'rounded-bl-md':down}">
		<div>
			<b><h1>{{ player.name }}</h1></b>
			<h2>Points: {{ player.nPoints }}</h2>
		</div>
		<button class="bg-amber-300 h-full p-2 mt-4.25 rounded-2xl flex gap-1 relative left-5 text-sm 
						transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-orange-400"
				v-bind:class="{ 'grayscale pointer-events-none':(!playing || !Piece || !Piece.isBoostedBool),
					'cursor-pointer grayscale-0 pointer-events-auto':(playing && Piece && Piece.isBoostedBool) }"
			@click="useAbility()" v-if="playing">
			<img src="../assets/boost.png" alt="" class="size-5">
			<b>Use Ability!</b>
		</button>
		<button class="bg-blue-500 h-full p-2 mt-4.25 rounded-2xl flex gap-1 relative left-7 text-sm"
			v-bind:class="{'transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 cursor-pointer':playing,
							'grayscale pointer-events-none':!playing }"
			@click="" v-if="endT && playing">
			<img src="../assets/clock.png" alt="" class="size-5">
			<b>End Turn</b>
		</button>
		<img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" class="size-18.75 relative select-none"
			v-bind:class="{'drop-shadow-custom left-24.5':playing, 'left-85':!playing}">
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
</style>