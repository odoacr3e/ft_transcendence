<script setup>
	import { localInfo, localBoard, localPlayers }				from '@/scripts/Data/Variables.js';
	import { useAbility, sendEndTurn, shopAbility, 
			 sendGiveUp, showBoostedMovesHover,
			 showBoostedMovesLeave }							from '@/scripts/Events/utils/GlobalUtils';
	import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'

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

	const priceMessage = computed(() => {
		if (!localInfo.lastClickedId)
			return "...";
		const piece = localBoard.get(localInfo.lastClickedId)?.piece ?? null;
		if (!piece)
			return "...";
		if (piece.isBoostedBool)
			return "This piece is already\nboosted you fool!";
		if (piece.price > (localPlayer.value?.nPoints ?? 0))
			return "AHAH! You're too poor\nto buy that!";
		return "Price: " + piece.price;
	});
	const canEndTurn = computed(() => myTurn.value && localInfo.secondTurn);
	const canGiveUp = computed(() => myTurn.value || localInfo.secondTurn);

	function requestDraw() {}

	// null | 'giveup' | 'draw' : azione in attesa di conferma
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
</script>

<template>
	<div class="wrapper" v-if="localPlayer">
		<div class="column">
			<button class="action bg-amber-300 hover:bg-orange-400"
				v-bind:class="canUseAbility ? 'on' : 'off'"
				@click="useAbility()">
				<img src="../assets/boost.png" alt="" :draggable="false" class="size-5">
				<b>Use Ability!</b>
			</button>
			<button class="action bg-emerald-400 hover:bg-emerald-500 flex-col gap-0!"
				v-bind:class="canBoost ? 'on' : 'off'"
				@click="shopAbility()"
				@mouseenter="showBoostedMovesHover(localInfo.clickedId)"
				@mouseleave="showBoostedMovesLeave(localInfo.clickedId)">
				<b>Boost your Piece!</b>
				<p style="white-space: pre-line" class="text-xs"><i>{{ priceMessage }}</i></p>
			</button>
			<button class="action bg-blue-500 hover:bg-indigo-500"
				v-bind:class="canEndTurn ? 'on' : 'off'"
				@click="sendEndTurn()">
				<img src="../assets/endturn.png" alt="" :draggable="false" class="size-5">
				<b>End Turn!</b>
			</button>
		</div>
		<div class="bottom-section" ref="panelEl">
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
			<div class="bottom-bar">
				<button class="action mini bg-red-400 hover:bg-red-500"
					v-bind:class="canGiveUp ? 'on' : 'off'"
					@click="askGiveUp()">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
					</svg>
					<b>Give Up!</b>
				</button>
				<button class="action mini on bg-amber-300 hover:bg-orange-400"
					@click="askDraw()">
					<b>Chiedi Pareggio</b>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.wrapper
	{
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		height: 100%;
		user-select: none;
		z-index: 10;
	}

	.column
	{
		flex: 1;
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

	.bottom-section
	{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 190px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 60px;
		z-index: 10;
	}

	.bottom-bar
	{
		display: flex;
		align-items: stretch;
		gap: 8px;
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
		flex: 1;
		gap: 3px;
		padding: 6px;
		border-radius: 8px;
		font-size: .7rem;
	}
</style>