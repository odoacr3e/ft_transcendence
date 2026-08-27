<script setup>
	import { computed, ref, watch, onUnmounted }	from 'vue'
	import IconClock 								from './icons/IconClock.vue';

	const props = defineProps({
		millis: { type: Number, default: 0 },
		go: { type: Boolean, default: false },
		team: {type: String, default: 'black'}
	})

	/*
		Il tempo residuo non viene decrementato a mano: mentre il timer gira si tiene una
		scadenza assoluta e a ogni tick si ricalcola la differenza dall'orologio di sistema.
		Cosi' un tick in ritardo (o una scheda in background, dove il browser strozza i timer)
		non fa perdere secondi: il conteggio si riallinea da solo al tick successivo.
		Quando il timer e' fermo `remaining` resta congelato sull'ultimo valore letto.
	*/
	const	remaining	= ref(props.millis),
			totalSec	= computed(() => Math.ceil(remaining.value / 1000)),
			min			= computed(() => Math.floor(totalSec.value / 60)),
			sec			= computed(() => totalSec.value % 60);
	let		intervalId	= null,
			deadline	= 0;

	const TICK = 250;

	function tick() {
		remaining.value = Math.max(0, deadline - Date.now());
		if (remaining.value === 0)
			stopTimer();
	}

	function startTimer() {
		if (intervalId)
			return;
		deadline = Date.now() + remaining.value;
		intervalId = setInterval(tick, TICK);
	}

	function stopTimer() {
		if (!intervalId)
			return;
		clearInterval(intervalId);
		intervalId = null;
	}

	function pad(num) {
		if (num / 10 < 1) return "0" + num;
		else return num;
	}

	//il back manda un tempo aggiornato: e' lui la verita', si riparte da li'
	watch(() => props.millis, (val) => {
		remaining.value = val;
		if (intervalId)
		{
			stopTimer();
			startTimer();
		}
	});

	watch(() => props.go, (val) => {
		if (val)
			startTimer();
		else
			stopTimer();
	}, { immediate: true });

	onUnmounted(stopTimer);
</script>

<template>
	<div class="rounded-lg text-2xl mr-2 flex items-center gap-2 tabular-nums w-36 h-10 justify-center self-center p-2"
		style="font-weight: 700;"
		:class="{
			'opacity-50': !props.go,
			'bg-bg-darker text-white': props.team === 'black',
			'bg-[#ededed] text-black': props.team === 'white'
		}">
		<IconClock class="clock-icon" fill="currentColor" stroke="none" :paused="!props.go" />
		<p class="justify-self-center self-center">{{ pad(min) }} : {{ pad(sec) }}</p>
	</div>
</template>

<style scoped>

div {
    font-family: 'Inter Variable', sans-serif;
}

.clock-icon
{
	flex: 0 0 auto;
	font-size: .9em;
}

</style>