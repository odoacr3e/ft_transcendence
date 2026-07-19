<script setup>
	import { DOMPlayer, localBoard, localInfo, IMG_PATHS }	from '@/scripts/Data/Variables';
	import { useAbility, sendEndTurn }						from '@/scripts/Events/utils/GlobalUtils';
	import { computed }										from 'vue';
	import	TimerClock										from "./TimerClock.vue"
	import	CapturedPieces									from "./CapturedPieces.vue"

	const prop = defineProps({
  		p: Number,
		pos: {type: String, default: 'bottom'}
	});
	const	player	= computed(() => DOMPlayer(prop.p)),
			playing	= computed(() => player.value.isPlaying),
			up		= prop.pos === 'top',
			down	= prop.pos === 'bottom',
			endT	= computed(() => localInfo.secondTurn);

	const nameSize = computed(() => {
		const len = player.value.name?.length ?? 0;
		if (len <= 12)	{ return 'x-large'; }
		if (len <= 18)	{ return 'large'; }
		if (len <= 24)	{ return 'medium'; }
		return 'small';
	});

	const Piece = computed(() => {
		if (!localInfo.clickedId) { return null; }
		return localBoard.get(localInfo.clickedId)?.piece ?? null;
	});
</script>

<template>
	<div class="wrap"
		v-bind:class="{'rounded-t-md mb-1':up, 'rounded-b-md mt-1':down}">

		<img src="../assets/default.png" alt="User Icon" :draggable="false" class="size-18.75 shrink-0 stretch 0"
			v-bind:class="{'rounded-tl-md':up, 'rounded-bl-md':down}">

		<div class="shrink-0">
			<b><h1 class="max-w-56 overflow-hidden text-ellipsis whitespace-nowrap"
					:style="{ fontSize: nameSize }">{{ player.name }}</h1></b>
			<div class="flex">
				<h2>Points: {{ player.nPoints }}</h2>
				<p class="text-[#4e4e4e8c] mx-2">|</p>
				<CapturedPieces :player="player"/>
			</div>
		</div>
		<!-- <div class="grow flex items-center justify-start gap-2 pr-2">
			<button class="bg-amber-300 text-sm
							transition delay-50 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-orange-400"
					v-bind:class="{ 'grayscale pointer-events-none':(!playing || !Piece || !Piece.isBoostedBool || Piece.team !== player.team || localInfo.secondTurn),
						'cursor-pointer grayscale-0 pointer-events-auto':(playing && Piece && Piece.isBoostedBool && (Piece.team === player.team) && !localInfo.secondTurn) }"
				@click="useAbility()" v-if="playing && localInfo.hasBoost">
				<img src="../assets/boost.png" alt="" :draggable="false" class="size-5">
				<b>Use Ability!</b>
			</button>
			<button class="bg-blue-500 text-sm
						transition delay-50 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500 cursor-pointer"
				@click="sendEndTurn()" v-if="endT && playing">
				<img src="../assets/endturn.png" alt="" :draggable="false" class="size-5">
				<b>End Turn</b>
			</button>
		</div> -->
		<!-- <img :src="IMG_PATHS[player.team + 'King']" alt="TeamKing" :draggable="false" class="size-18.75 shrink-0"
			v-bind:class="{'drop-shadow-custom':playing }"> -->
		<TimerClock :millis="player.time" :go="playing" :team="player.team" class="ml-auto"/>
	</div>
</template>

<style scoped>
	.wrap {
		display: flex;
		flex-direction: row;
		z-index: 10;
		position: relative;
		background-color: #2c2c2c;
		align-self: center;
		width: 600px;
		user-select: none;
	}

	h1 {
		color: white;
		padding: 3px;
		padding-left: 8px;
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