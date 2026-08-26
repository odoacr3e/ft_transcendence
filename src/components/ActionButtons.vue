<script setup>
	import { localInfo, localBoard, localPlayers }				from '@/scripts/Data/Variables.js';
	import { useAbility, sendEndTurn, shopAbility, 
			 sendGiveUp, showBoostedMovesHover,
			 showBoostedMovesLeave }							from '@/scripts/Events/utils/GlobalUtils';
	import { computed, ref, watch, nextTick, onBeforeUnmount }	from 'vue'
	import IconHourglass										from '@/components/icons/IconHourglass.vue';
	import IconLightning										from '@/components/icons/IconLightning.vue';
	import IconFlag												from '@/components/icons/IconFlag.vue';
	import IconHandshake										from '@/components/icons/IconHandshake.vue';
	import IconEnergyArrow										from './icons/IconEnergyArrow.vue';

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

	// const priceMessage = computed(() => {
	// 	if (!localInfo.lastClickedId)
	// 		return "...";
	// 	const piece = localBoard.get(localInfo.lastClickedId)?.piece ?? null;
	// 	if (!piece)
	// 		return "...";
	// 	if (piece.isBoostedBool)
	// 		return "This piece is already\nboosted you fool!";
	// 	if (piece.price > (localPlayer.value?.nPoints ?? 0))
	// 		return "AHAH! You're too poor\nto buy that!";
	// 	return "Price: " + piece.price;
	// });
	const canEndTurn = computed(() => myTurn.value && localInfo.secondTurn);
	const canGiveUp = computed(() => myTurn.value || localInfo.secondTurn);

	function requestDraw() {}

	const pending = ref(null);
	const panelEl = ref(null);

	function askGiveUp()	{ pending.value = (pending.value === 'giveup') ? null : 'giveup'; }
	function askDraw()		{ pending.value = (pending.value === 'draw') ? null : 'draw'; }
	function cancelPending()	{ pending.value = null; }

	function onOutsideClick(e) {
		if (panelEl.value && panelEl.value.contains(e.target))
			return;
		cancelPending();
	}

	// chiude la conferma quando si clicca fuori dall'area di conferma
	watch(pending, (val) => {
		if (val)
			nextTick(() => document.addEventListener('click', onOutsideClick));
		else
			document.removeEventListener('click', onOutsideClick);
	});

	onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick));

	function confirmPending() {
		if (pending.value === 'giveup')
			sendGiveUp();
		else if (pending.value === 'draw')
			requestDraw();
		pending.value = null;
	}

	const confirmMessage = computed(() => {
		if (pending.value === 'giveup')
			return "Abbandoni?";
		if (pending.value === 'draw')
			return "Chiedere il pareggio?";
		return "";
	});

	const abilityArmed = computed(() => localInfo.usingAbility !== '' && localBoard.get(localInfo.clickedId)?.useAbilityBool === true);
</script>

<template>
	<div class="wrapper" v-if="localPlayer">
		<div class="top-row">
			<button class="action" 		
				v-bind:class="[
				canUseAbility ? 'on' : 'off',
				abilityArmed ? 'armed bg-orange-500 hover:bg-orange-600'
							 : 'bg-amber-300 hover:bg-orange-400'
				]"
				@click="useAbility()">
				<IconEnergyArrow class="icon"/>
				<b>{{ abilityArmed ? "Ability ON!..." : "Use Ability!"}}</b>
			</button>
		</div>

		<span class="msgs">THEN</span>

		<div class="mid-row">
			<button class="action end-turn bg-blue-500 hover:bg-indigo-500"
				v-bind:class="canEndTurn ? 'on' : 'off'"
				@click="sendEndTurn()">
				<IconHourglass class="icon"/>
				<b>End Turn!</b>
			</button>

			<span class="msgs">OR</span>

			<button class="action bg-emerald-400 hover:bg-emerald-500"
				v-bind:class="canBoost ? 'on' : 'off'"
				@click="shopAbility()"
				@mouseenter="showBoostedMovesHover(localInfo.clickedId)"
				@mouseleave="showBoostedMovesLeave()">
				<IconLightning class="icon"/>
				<b>Boost Piece!</b>
			</button>
		</div>
		
		<div class="bottom-section" ref="panelEl">
			<div class="btm-row">
				<button class="action mini bg-red-400 hover:bg-red-500"
					v-bind:class="canGiveUp ? 'on' : 'off'"
					@click="askGiveUp()">
					<IconFlag class="icon"/>
					<b>Give Up!</b>
				</button>
				<button class="action mini on bg-amber-300 hover:bg-orange-400"
					@click="askDraw()">
					<IconHandshake class="icon"/>
					<b>Chiedi Pareggio</b>
				</button>
			</div>
			<div class="confirm-slot">
				<div class="confirm-col" v-if="pending">
					<span class="confirm-msg">{{ confirmMessage }}</span>
					<div class="confirm-row">
						<button class="action confirm-btn on bg-emerald-400 hover:bg-emerald-500"
							@click="confirmPending()">
							<b>Sì</b>
						</button>
						<button class="action confirm-btn on bg-red-400 hover:bg-red-500"
							@click="cancelPending()">
							<b>No</b>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.wrapper
	{
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		user-select: none;
		z-index: 10;
	}

	.top-row,
	.mid-row
	{
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 12px;
		width: 100%;
		margin: 0 auto;		
	}

	.top-row > .action,
	.mid-row > .action
	{
		flex: 1 1 0;
		min-width: 0;
	}

	.btm-row
	{
		display: flex;
		flex: 1 1 0;
		align-items: stretch;
		justify-content: center;
		gap: 12px;
		width: 60%;
		height: 50%;
		margin: 0 auto;
		margin-top: 10%;
	}

	.msgs
	{
		flex: 0 0 auto;
		align-self: center;
		color: #e5e5e5;
		font-size: .8rem;
		font-weight: 700;
		letter-spacing: .08rem;
	}

	.action
	{
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 12px;
		border-radius: 8px;
		color: #1b1b1b;
		transition: opacity .3s ease-in-out, filter .3s ease-in-out, transform .2s ease-in-out;
	}

	.icon
	{
		flex: 0 0 auto;
		font-size: 1.25em;
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

	.action.on:active
	{
		transform: scale(.96);
		transition-duration: .05s;
	}

	.action.armed
	{
		color: #fff1e6;
		animation: armed-pulse 1.4s ease-out infinite;
	}

	.action.armed .icon { animation: armed-throb .7s ease-in-out infinite alternate; }

	@keyframes armed-pulse
	{
		0%		{ box-shadow: 0 0 0 0 rgba(249, 115, 22, .65); }
		70%		{ box-shadow: 0 0 0 12px rgba(249, 115, 22, 0); }
		100%	{ box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
	}

	@keyframes armed-throb
	{
		from	{ transform: scale(1); }
		to		{ transform: scale(1.2); }
	}

	.action.off
	{
		opacity: .4;
		filter: grayscale(1);
		pointer-events: none;
	}

	.bottom-section
	{
		position: relative;
	}

	.confirm-slot
	{
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 10px;
		z-index: 20;
	}

	.confirm-col
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.confirm-row
	{
		display: flex;
		justify-content: center;
		gap: 12px;
	}

	.confirm-msg
	{
		color: #e5e5e5;
		font-size: .9rem;
		font-weight: 600;
		text-align: center;
	}

	.action.confirm-btn
	{
		padding: 10px 22px;
		border-radius: 12px;
		font-size: 1rem;
	}

	.action.mini
	{
		flex: 0 1 150px;
		gap: 10px;
		padding: 12px;
		border-radius: 8px;
		font-size: .85rem;
	}
</style>