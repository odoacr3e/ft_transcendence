<script setup>
	import { DOMPlayer, localInfo }	from '@/scripts/Data/Variables';
	import { defaultAvatar, handleAvatarError }	from '../scripts/Helper/CompUtils';
	import { computed }							from 'vue';
	import	TimerClock							from "./TimerClock.vue"
	import	CapturedPieces						from "./CapturedPieces.vue"

	const prop = defineProps({
  		p: Number,
		pos: {type: String, default: 'bottom'}
	});
	const	player	= computed(() => DOMPlayer(prop.p)),
			playing	= computed(() => player.value.isPlaying),
			running	= computed(() => playing.value && localInfo.matchStarted && !localInfo.victory),
			up		= prop.pos === 'top',
			down	= prop.pos === 'bottom';

	const nameSize = computed(() => {
		const len = Math.max(
			DOMPlayer(1)?.name?.length ?? 0,
			DOMPlayer(2)?.name?.length ?? 0
		);
		if (len <= 12)	{ return 'x-large'; }
		if (len <= 18)	{ return 'large'; }
		if (len <= 24)	{ return 'medium'; }
		return 'small';
	});

</script>

<template>
	<div class="wrap"
		v-bind:class="{'rounded-t-md mb-1':up, 'rounded-b-md mt-1':down, 'is-turn':playing}">

		<img :src="player.image ? `${player.image}` : defaultAvatar" @error="handleAvatarError"
			alt="User Icon" :draggable="false" class="rounded-full object-cover size-18.75 shrink-0 stretch 0 dim"
			v-bind:class="{ 'dim-off':!playing }">

		<div class="shrink-0 dim" v-bind:class="{'dim-off':!playing}">
			<b><h1 class="max-w-56 overflow-hidden text-ellipsis whitespace-nowrap"
					:style="{ fontSize: nameSize }">{{ player.name }}</h1></b>
			<div class="flex">
				<h2>Points: {{ player.nPoints }}</h2>
				<p class="text-text-last mx-2">|</p>
				<CapturedPieces :player="player"/>
			</div>
		</div>
		<TimerClock :millis="player.time" :go="running" :team="player.team" class="ml-auto"/>
	</div>
</template>

<style scoped>
	.wrap {
		--frame-thickness: 5px;
		--frame-dark: #1b0000;
		--frame-mid: #801a12;
		--frame-light: #bb4232;
		--frame-glint: #fff1e6;
		--frame-speed: 4s;
		display: flex;
		flex-direction: row;
		z-index: 10;
		position: relative;
		background-color: #2c2c2c;
		align-self: center;
		width: 600px;
		user-select: none;
		padding: 1.5%;
	}

	@property --angle {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	/* .wrap::before,
	.wrap::after
	{
		content: "";
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		padding: var(--frame-thickness);
		border-radius: inherit;
		z-index: 11;
		pointer-events: none;
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask-composite: exclude;
	}

	.wrap::before
	{
		background: linear-gradient(135deg,
			var(--frame-dark) 0%, var(--frame-mid) 18%, var(--frame-light) 32%,
			var(--frame-dark) 50%, var(--frame-light) 68%,
			var(--frame-mid) 82%, var(--frame-dark) 100%);
		filter: grayscale(.75) brightness(.45);
		transition: filter .4s ease, box-shadow .4s ease;
	}

	.wrap::after
	{
		background: conic-gradient(from var(--angle),
			transparent 0deg, transparent 265deg,
			rgba(255, 241, 230, 0) 285deg, var(--frame-glint) 305deg,
			rgba(255, 241, 230, 0) 325deg, transparent 340deg, transparent 360deg);
		animation: frame-spin var(--frame-speed) linear infinite;
		opacity: 0;
		transition: opacity .4s ease;
	} */

	.wrap.is-turn::before
	{
		filter: none;
		box-shadow: inset 0 0 12px 3px rgba(0, 0, 0, .6),
					inset 0 0 22px 6px rgba(255, 178, 148, .55);
	}
	.wrap.is-turn::after { opacity: 1; }

	@keyframes frame-spin { to { --angle: 360deg; } }

	.dim {
		transition: opacity .4s ease;
	}
	.dim-off {
		opacity: .4;
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