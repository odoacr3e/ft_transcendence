<script setup>
	import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

	const props = defineProps({
		Millis: { type: Number, default: 0 },
		Go: { type: Boolean, default: false }
	})

	const	countDown = ref(props.Millis * +1),
			min = computed(() => Math.floor(countDown.value / 60000)),
			sec = computed(() => Math.floor((countDown.value % 60000) / 1000))
	let		timeoutId = null,
			firstTurn = true,
			running = false;  // flag esplicito

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

	watch(() => props.Millis, (val) => {
		countDown.value = val;
		if (running) {
			stopTimer();
			countDownTimer();
		}
	});

	watch(() => props.Go, (val) => {
		if (val) { if (!running) { running = true; countDownTimer(); } }
		else { if (running) { running = false; stopTimer(); }}
	});

	onMounted(() => {
		if (firstTurn) { firstTurn = false; return; }
		if (props.Go) { running = true; countDownTimer(); }
	});

	onUnmounted(() => {
		running = false;
		stopTimer();
	});
</script>

<template>
	<div class="bg-[#181715] rounded-lg border border-[#4e4e4e8c] text-2xl mr-2 w-fit flex h-fit self-center p-2 text-white"
		:class="{'border-[#f1e8e89a] drop-shadow-custom': props.Go}">
		<p class="justify-self-center self-center">{{ pad(min) }} : {{ pad(sec) }}</p>
	</div>
</template>

<style scoped>
</style>