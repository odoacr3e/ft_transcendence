<script setup>
	import { computed }		from 'vue';
	import { DOMPlayer }	from '@/scripts/Data/Variables';
	import { IMG_PATHS }	from '@/scripts/Helper/Constants';
	import { useAbility }	from '@/scripts/Events/Global'

	const prop = defineProps({
  		p: Number
	})
	const	player = computed(() => DOMPlayer(prop.p));
	const	playing = computed(() => player.value.isPlaying);	
	const	up = prop.p === 2 ? true : false,
			down = prop.p === 1 ? true : false;

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
		<button class="bg-amber-300 h-full p-3 mt-3.25 rounded-2xl flex gap-1 relative left-5 cursor-pointer
						transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-orange-400"
			@click="useAbility()" v-if="playing">
			<img src="../assets/boost.png" alt="" class="size-6">
			<b>Use Ability!</b>
		</button>
		<button class="bg-blue-500 h-full p-3 mt-3.25 rounded-2xl flex gap-1 relative left-9 cursor-pointer
				 transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500"
			@click="" v-if="playing">
			<img src="../assets/clock.png" alt="" class="size-6">
			<b>End Turn</b>
		</button>
		<img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" class="size-18.75 relative select-none"
			v-bind:class="{'drop-shadow-custom left-12.75':playing, 'left-85':!playing}">
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