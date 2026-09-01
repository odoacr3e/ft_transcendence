<script setup>
	import { localInfo, startLocalMatchState }	from '@/scripts/Data/Variables';
	import { clearMatchStorage }				from '@/scripts/Data/Archi';
	import { computed, ref, watch }				from 'vue'
	import router								from '@/router';
	import winImg								from '@/assets/CrownIcon.png';
	import loseImg								from '@/assets/bell.png';
	import drawImg								from '@/assets/people.png';
import { playAudio } from '@/scripts/Helper/generalUtils';

	const dismissed = ref(false);

	const victory = computed(() => localInfo.victory);
	const outcome = computed(() => {
		if (!victory.value)
			return null;
		if (victory.value === 'draw')
		{
			playAudio("checkmate");
			return 'draw';
		}
		return (victory.value === localInfo.myTeam ? 'win' : 'lose');
	});

	const showOverlay = computed(() => outcome.value !== null && !dismissed.value);
	const showReopen = computed(() => outcome.value !== null && dismissed.value);

	const content = computed(() => ({
		win: { img: winImg, title: 'You Win!', cls:'text-emerald-400'},
		lose: { img: loseImg, title: 'You Lose!', cls:'text-red-400'},
		draw: { img: drawImg, title: 'Draw!', cls:'text-amber-300'},
	}[outcome.value] ?? { img: '', title: '', cls: ''}));

	watch(victory, (v) => {
		if (v) 
			return;
		dismissed.value = false;
		clearMatchStorage()
	});

	function leaveMatch() {
		clearMatchStorage();
		localInfo.victory = null;
		startLocalMatchState(null);
	}

	function playAgain() { leaveMatch(); router.replace({name: 'playpage'}); }
	function goHome() { leaveMatch(); router.push({name: 'home'}); }
	function watchBoard() { dismissed.value = true; }
	function reopen() { dismissed.value = false; }
</script>

<template>
	<div v-if="showOverlay"
		class="absolute inset-0 z-20 flex flex-col items-center justify-center
			gap-6 backdrop-blur-sm bg-black/50 select-none">
		<img :src="content.img" alt="" :draggable="false" class="w-40 h-40 object-contain drop-shadow-xl">	
		<h2 class="text-3xl font-bold" :class="content.cls">{{ content.title }}</h2>

		<div class="flex flex-col gap-3 w-56">
			<button @click="playAgain"
					class="py-3 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-[#1b1b1b] font-bold
						transition hover:-translate-y-0.5">
				Gioca Ancora
			</button>
			<button @click="watchBoard"
					class="py-3 rounded-xl bg-blue-500 hover:bg-indigo-500 text-white font-bold
						transition hover:translate-y-0.5">
				Guarda la Scacchiera
			</button>
			<button @click="goHome"
					class="py-3 rounded-xl bg-neutral-600 hover:bg-neutral-500 text-white font-bold
						transition hover:-translate-y-0.5">
				Torna alla Home
			</button>
		</div>
	</div>

	<button v-if="showReopen" @click="reopen"
			class="absolute top-2 right-2 z-20 px-3 py-2 rounded-lg text-sm font-bold
				bg-black/60 text-white hover:bg-black/80 transition select-none">
		Fine Partita ↩
	</button>
</template>