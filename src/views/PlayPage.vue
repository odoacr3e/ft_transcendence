<script setup>
	import AppHeader					from '../components/AppHeader.vue';
	import { matchMakingOpt }			from '@/scripts/Data/Variables.js';
	import { eRoomType, eMatchPresets }	from '../../../Common/ENUMS.js'
	import { useAuthStore } 			from '@/stores/auth.st.js';
	import { ref, computed, watch }		from 'vue';

	const auth     = useAuthStore();

	const roomType = ref(null);
	const players  = ref(null);
	const time     = ref(null);
	const waiting  = ref(true);

	const canPlay = computed(() => {
		if (!roomType.value || !players.value)
			return false;
		if (roomType.value === 'PRIVATE') 
			return time.value !== null;
		return true;
	});

	watch(roomType, (val) => { if (val !== 'PRIVATE') time.value = null; });

	function sendPlayRequest()
	{
		const options = new matchMakingOpt({
			matchType:		eMatchPresets[players.value],
			roomType:		eRoomType[roomType.value],
			matchSettings:	null
		})
		if (!auth.socket)
			return;
		auth.socket.emit('find_match', options);
		waiting.value = true;
	}

	// auth.socket?.on('match_found', (data) => {
	// 	waiting.value = false;
	// 	//--> qui poi ci spostiamo su /game una volta creata la stanza
	// })

</script>

<template>
	
	<div class="min-h-screen flex flex-col">
    	<AppHeader class="z-11"/>
    	<div id="wrap" class="grow">
    	    <div class="flex z-2 bg-[#181715] rounded-3xl">
    	        <div class="p-6 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]"></div>
    	        <div class="px-1 pb-16 flex flex-col items-center w-[40vw]">
    				<img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30">
    				<h1 class="text-[200%] mb-1 text-white justify-self-center whitespace-nowrap">Choose your fate</h1>
					<div class="mb-5 flex flex-row gap-4">
						<span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
						<p class="text-[80%] text-zinc-300 mt-1"></p>
						<span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
					</div>
					<div v-if="!waiting">
						<div class="translate-y-9 pl-20 w-full"> <!-- Pos -->
							<div class="flex flex-col gap-10"> <!-- Layout -->
								<div class="flex flex-row items-center">
									<div class="w-20 shrink-0 flex items-center">
										<img src="../assets/chessboard.png" class="w-18 -ml-4 -translate-y-4">
									</div>
									<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
										<div @click="roomType = roomType === 'PRIVATE'  ? null : 'PRIVATE'"  :class="roomType === 'PRIVATE'  ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">PRIVATE</div>
										<div @click="roomType = roomType === 'FRIENDLY' ? null : 'FRIENDLY'" :class="roomType === 'FRIENDLY' ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">FRIENDLY</div>
										<div @click="roomType = roomType === 'RANKED'   ? null : 'RANKED'"   :class="roomType === 'RANKED'   ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">RANKED</div>
									</div>
								</div>
								<div class="flex flex-row items-center">
									<div class="w-20 shrink-0 flex items-center">
									<img src="../assets/people.png" class="w-18 translate-y-1">
									</div>
									<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
										<div @click="players = players === '1v1'     ? null : '1v1'"     :class="players === '1v1'     ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">1v1</div>
										<div @click="players = players === '2v2'     ? null : '2v2'"     :class="players === '2v2'     ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">2v2</div>
										<div @click="players = players === '1v1v1v1' ? null : '1v1v1v1'" :class="players === '1v1v1v1' ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">FreeForAll</div>
									</div>
								</div>
								<div class="flex flex-row items-center">
									<div class="w-20 shrink-0 flex items-center">
										<img src="../assets/clock.png" class="w-18">
									</div>
									<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
										<div @click="roomType === 'PRIVATE' && (time = time === '15 min' ? null : '15 min')" :class="roomType === 'PRIVATE' ? (time === '15 min' ? 'border-yellow-400 cursor-pointer' : 'border-[#4e4e4e8c] cursor-pointer') : 'border-[#4e4e4e8c] opacity-30 cursor-not-allowed'" class="border rounded-lg py-2 text-white text-sm w-24 text-center transition-opacity hover:bg-[#2e2c2a]">15 min</div>
										<div @click="roomType === 'PRIVATE' && (time = time === '10 min' ? null : '10 min')" :class="roomType === 'PRIVATE' ? (time === '10 min' ? 'border-yellow-400 cursor-pointer' : 'border-[#4e4e4e8c] cursor-pointer') : 'border-[#4e4e4e8c] opacity-30 cursor-not-allowed'" class="border rounded-lg py-2 text-white text-sm w-24 text-center transition-opacity hover:bg-[#2e2c2a]">10 min</div>
										<div @click="roomType === 'PRIVATE' && (time = time === 'CUSTOM'  ? null : 'CUSTOM')"  :class="roomType === 'PRIVATE' ? (time === 'CUSTOM'  ? 'border-yellow-400 cursor-pointer' : 'border-[#4e4e4e8c] cursor-pointer') : 'border-[#4e4e4e8c] opacity-30 cursor-not-allowed'" class="border rounded-lg py-2 text-white text-sm w-24 text-center transition-opacity hover:bg-[#2e2c2a]">CUSTOM</div>
									</div>
								</div>
							</div>
						</div>
						<div class="flex justify-center mt-30">
							<button @click="sendPlayRequest()"
									:disabled="!canPlay"
									:class="canPlay ? 'bg-yellow-400 shadow-yellow-400/30 hover:bg-yellow-300 hover:shadow-yellow-300/50 active:scale-95 cursor-pointer' : 'bg-zinc-600 shadow-zinc-600/30 cursor-not-allowed opacity-50'"
									class="px-16 py-4 text-2xl font-bold tracking-widest text-black rounded-2xl shadow-lg transition-all duration-150">
								PLAY
							</button>
						</div>
					</div>
					<div v-else class="flex flex-col items-center justify-center gap-6 py-20">
						<div class="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
						<p class="text-white text-xl tracking-widest">
							Looking for opponent<span class="dot dot-1">.</span><span class="dot dot-2">.</span><span class="dot dot-3">.</span>
						</p>
						<button @click="waiting = false; auth.socket?.emit('cancel_match')"
								class="text-zinc-400 text-sm hover:text-white cursor-pointer transition-colors border-black border-5 rounded-full p-2 bg-red">
								Cancel
						</button>
					</div>
        		</div>
        	</div>
    	</div>
	</div>
</template>

<style scoped>
  #wrap {
        display: grid;
        grid-template-columns: max-content max-content;
        position: relative;
        justify-content: center;
        justify-items: center;
        align-items: center;
        z-index: 10;
        font-size: 110%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        user-select: none;
    }

    h1, h4 {
        font-family: "Copperplate", Times;
    }

	@keyframes dot{
		0%, 100%	{ opacity: 0; }
		50%			{ opacity: 1; }
	}

	.dot	{ opacity: 0; animation: dot 1.5s infinite; }
	.dot-1	{ animation-delay: 0s;		}
	.dot-2	{ animation-delay: 0.5s;	}
	.dot-3	{ animation-delay: 1s; 		}
</style>