<script setup>
	import { computed }		from 'vue';
	import { DOMPlayer }	from '@/scripts/Data/Variables.js';
	import { IMG_PATHS }	from '@/scripts/Helper/Constants';

	const prop = defineProps({
  		p: Number
	})
	const	player = computed(() => DOMPlayer(prop.p));
	const	playing = computed(() => player.value.isPlaying);	
	const	up = prop.p === 2 ? true : false,
			down = prop.p === 1 ? true : false;
	
</script>

<template>
	<div v-if="prop.p === 2" class="wrap rounded-t-md mb-1">
		<img src="../assets/default.png" alt="User Icon" class="size-18.75 rounded-tl-md">
		<div>
			<b><h1>{{ player.name }}</h1></b>
			<h2>Points: {{ player.points }}</h2>
		</div>
		<img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" class="size-18.75 relative left-89"
			v-bind:class="{'drop-shadow-custom':playing}">
	</div>

	<div v-if="prop.p === 1" class="wrap rounded-b-md mt-1">
		<img src="../assets/default.png" alt="User Icon" class="size-18.75 rounded-bl-md">
		<div>
			<b><h1>{{ player.name }}</h1></b>
			<h2>Points: {{ player.points }}</h2>
		</div>
		<img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" class="size-18.75 relative left-89"
			v-bind:class="{'drop-shadow-custom':playing}">
	</div>

	<!--<div class="wrap"
		v-bind:class="{'rounded-t-md mb-1':up, 'rounded-b-md mt-1':down}">
		<img src="../assets/default.png" alt="User Icon" class="size-18.75"
			v-bind:class="{'rounded-tl-md':up, 'rounded-bl-md':down}">
		<div>
			<b><h1>{{ player.name }}</h1></b>
			<h2>Points: {{ player.points }}</h2>
		</div>
		<img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" class="size-18.75 right-0"
			v-bind:class="{'drop-shadow-custom':playing}">
	</div>-->
</template>

<style scoped>
	.wrap {
		display: flex;
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