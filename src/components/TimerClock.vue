<script setup>
	import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

	const props = defineProps({
		millis: { type: Number, default: 0 },
		go: { type: Boolean, default: false },
		team: {type: String, default: 'black'}
	})

	const	countDown = ref(props.millis * +1),
			min = computed(() => Math.floor(countDown.value / 60000)),
			sec = computed(() => Math.floor((countDown.value % 60000) / 1000))
	let		timeoutId = null,
			firstTurn = true,
			running = false;

	function stopTimer() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	function countDownTimer() {
		if (countDown.value > 0 && running) {
			timeoutId = setTimeout(() => {
				countDown.value -= 1000;
				timeoutId = null;
				countDownTimer();
			}, 1000)
		}
	}

	function pad(num) {
		if (num / 10 < 1) return "0" + num;
		else return num;
	}

	watch(() => props.millis, (val) => {
		countDown.value = val;
		if (running) {
			stopTimer();
			countDownTimer();
		}
	});

	watch(() => props.go, (val) => {
		if (val) { if (!running) { running = true; countDownTimer(); } }
		else { if (running) { running = false; stopTimer(); }}
	});

	onMounted(() => {
		if (firstTurn) { firstTurn = false; return; }
		if (props.go) { running = true; countDownTimer(); }
	});

	onUnmounted(() => {
		running = false;
		stopTimer();
	});
</script>

<template>
	<div class="rounded-lg text-2xl mr-2 flex tabular-nums w-28 h-10 justify-center self-center p-2"
		style="font-weight: 700;"
		:class="{
			'opacity-50': !props.go,
			'bg-[#181715] text-white': props.team === 'black',
			'bg-[#ededed] text-black': props.team === 'white'
		}">
		<p class="justify-self-center self-center">{{ pad(min) }} : {{ pad(sec) }}</p>
	</div>
</template>

<style scoped>

div {
    font-family: 'Inter Variable', sans-serif;
}

</style>