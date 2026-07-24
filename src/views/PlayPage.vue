<script setup>
	import AppHeader							from '../components/AppHeader.vue';
	import { matchMakingOpt }					from '@/scripts/Data/Variables.js';
	import { eRoomType, eMatchPresets } 		from '@/Common/ENUMS.js';
	import { useAuthStore } 					from '@/stores/auth.st.js';
	import { ref, computed, watch, onMounted }	from 'vue';
	import router								from '@/router';

	const auth      = useAuthStore();

	const roomType  = ref(null);
	const players   = ref(null);
	const time      = ref(null);
	const waiting   = ref(false);

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
		console.log(useAuthStore().username, " ha appena richiesto un matchmaking!");
		waiting.value = true;
	}

	async function askAmIPlaying() 
	{
		if (!auth.socket)
			return;
		const playing = await auth.socket.emitWithAck('amiplaying');
		if (playing)
			router.push({ name: "game" });
	}

	onMounted(askAmIPlaying);
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
						<span class="border-b border-[#4e4e4e8c] h-4 w-60"></span>
						<p class="text-[80%] text-zinc-300 mt-1"></p>
						<span class="border-b border-[#4e4e4e8c] h-4 w-60"></span>
					</div>
					<div v-if="!waiting" >
						<div class="translate-y-9 pl-18 w-full"> <!-- Pos -->
							<div class="flex flex-col gap-10"> <!-- Layout -->
								<div class="flex flex-row items-center">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 mr-8 shrink-0 text-[#882a2a]">
  										<path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
									</svg>
									<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
										<div @click="roomType = roomType === 'PRIVATE'  ? null : 'PRIVATE'"  :class="roomType === 'PRIVATE'  ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">PRIVATE</div>
										<div @click="roomType = roomType === 'FRIENDLY' ? null : 'FRIENDLY'" :class="roomType === 'FRIENDLY' ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">FRIENDLY</div>
										<div @click="roomType = roomType === 'RANKED'   ? null : 'RANKED'"   :class="roomType === 'RANKED'   ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">RANKED</div>
									</div>
								</div>
								<div class="flex flex-row items-center">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 mr-8 shrink-0 text-[#882a2a]">
										<path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
									</svg>
									<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
										<div @click="players = players === '1v1'     ? null : '1v1'"     :class="players === '1v1'     ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">1v1</div>
										<div @click="players = players === '2v2'     ? null : '2v2'"     :class="players === '2v2'     ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">2v2</div>
										<div @click="players = players === '1v1v1v1' ? null : '1v1v1v1'" :class="players === '1v1v1v1' ? 'border-yellow-400' : 'border-[#4e4e4e8c]'" class="border rounded-lg py-2 text-white text-sm cursor-pointer hover:bg-[#2e2c2a] w-24 text-center">FreeForAll</div>
									</div>
								</div>
								<div class="flex flex-row items-center">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 mr-8 shrink-0 text-[#882a2a]">
										<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
									</svg>
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
									:class="canPlay ? 'bg-[#882a2a] shadow-red-400/30 hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d] active:scale-95 cursor-pointer' : 'bg-zinc-600 shadow-zinc-600/30 cursor-not-allowed opacity-50'"
									class="px-16 py-4 text-2xl font-bold tracking-widest text-black rounded-2xl shadow-lg transition-all duration-150">
								PLAY
							</button>
						</div>
					</div>
					<div v-else class="flex flex-col items-center justify-center gap-6 py-20">
						<div class="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
						<p v-if="!reloading" class="text-white text-xl tracking-widest">
							Looking for opponent<span class="dot dot-1">.</span><span class="dot dot-2">.</span><span class="dot dot-3">.</span>
						</p>
						<p v-else class="text-white text-xl tracking-widest">
							Reloading game<span class="dot dot-1">.</span><span class="dot dot-2">.</span><span class="dot dot-3">.</span>
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
  /* #wrap {
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
    } */

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