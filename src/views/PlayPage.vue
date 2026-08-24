<script setup>
	import { ePlaying, matchMakingOpt }			from '@/scripts/Data/Variables.js';
	import { eRoomType } 						from '@/Common/ENUMS.js';
	import { useAuthStore } 					from '@/stores/auth.st.js';
	import { useSockStore }						from '@/stores/sock.st';
	import { ref, computed, watch, onMounted, onUnmounted }	from 'vue';
	import router								from '@/router';
	import { amIPlaying } 						from '@/scripts/Events/BackLink';
	import { useI18n }          from 'vue-i18n';
    
    const { t } = useI18n();
	const	sockStore = useSockStore();

	const roomType  = ref(null);
	const players   = ref(null);
	const time      = ref(null);
	const waiting   = ref(false);
	const reloading = ref(false);
	let	  alive		= true;

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
			matchType:		players.value,
			roomType:		eRoomType[roomType.value],
			matchSettings:	null
		})
		if (!sockStore.socket)
			return;
		sockStore.socket.emit('find_match', options);
		console.log(useAuthStore().username, " ha appena richiesto un matchmaking!");
		waiting.value = true;
	}

	async function askAmIPlaying()
	{
		if (!sockStore.socket)
			return;

		const playing = await amIPlaying();

		if (!alive)
			return;

		if (playing === ePlaying.YES)
			router.push({ name: "game" });
		else
			console.log("[playPage]: allora non sto already doing playing eh?");
	}

	onMounted(askAmIPlaying);
	onUnmounted(() => { alive = false });
</script>

<template>
    <div class="flex z-2 bg-bg-darker rounded-3xl">
        <div class="px-1 pb-16 flex flex-col items-center w-[40vw]">
    		<img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30">
    		<h1 class="text-[200%] mb-1 text-text-default justify-self-center whitespace-nowrap">{{ t('game.playPgae.title') }}</h1>
			<div class="mb-5 flex flex-row gap-4">
				<!--<hr class="text-text-last self-center w-auto">-->
				<span class="border-b border-border-default h-4 w-60"></span>
				<p class="text-[80%] text-text-second mt-1"></p>
				<span class="border-b border-border-default h-4 w-60"></span>
			</div>
			<div v-if="!waiting" >
				<div class="translate-y-9 pl-18 w-full"> <!-- Pos -->
					<div class="flex flex-col gap-10"> <!-- Layout -->
						<div class="flex flex-row items-center">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 mr-8 shrink-0 text-main-color">
  								<path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
							</svg>
							<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
								<div @click="roomType = roomType === 'PRIVATE'  ? null : 'PRIVATE'"  :class="roomType === 'PRIVATE'  ? 'border-main-color' : 'border-border-default'" class="opt border-2 cursor-pointer">{{ t('game.playPgae.opt.priv') }}</div>
								<div @click="roomType = roomType === 'FRIENDLY' ? null : 'FRIENDLY'" :class="roomType === 'FRIENDLY' ? 'border-main-color' : 'border-border-default'" class="opt border-2 cursor-pointer">{{ t('game.playPgae.opt.friend') }}</div>
								<div @click="roomType = roomType === 'RANKED'   ? null : 'RANKED'"   :class="roomType === 'RANKED'   ? 'border-main-color' : 'border-border-default'" class="opt border-2 cursor-pointer">{{ t('game.playPgae.opt.rank') }}</div>
							</div>
						</div>
						<div class="flex flex-row items-center">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 mr-8 shrink-0 text-main-color">
								<path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
							</svg>
							<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
								<div @click="players = players === '1v1'     ? null : '1v1'"     :class="players === '1v1'     ? 'border-main-color' : 'border-border-default'" class="opt border-2 cursor-pointer">1v1</div>
								<div @click="players = players === '2v2'     ? null : '2v2'"     :class="players === '2v2'     ? 'border-main-color' : 'border-border-default'" class="opt border-2 cursor-pointer">2v2</div>
								<div @click="players = players === '1v1v1v1' ? null : '1v1v1v1'" :class="players === '1v1v1v1' ? 'border-main-color' : 'border-border-default'" class="opt border-2 cursor-pointer">FreeForAll</div>
							</div>
						</div>
						<div class="flex flex-row items-center">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 mr-8 shrink-0 text-main-color">
								<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
							</svg>
							<div class="flex flex-row gap-4 flex-1 justify-center pr-30">
								<div @click="roomType === 'PRIVATE' && (time = time === '15 min' ? null : '15 min')" :class="roomType === 'PRIVATE' ? (time === '15 min' ? 'border-main-color cursor-pointer' : 'border-border-default cursor-pointer') : 'border-border-default opacity-30 cursor-not-allowed'" class="opt border-2 transition-all">15 min</div>
								<div @click="roomType === 'PRIVATE' && (time = time === '10 min' ? null : '10 min')" :class="roomType === 'PRIVATE' ? (time === '10 min' ? 'border-main-color cursor-pointer' : 'border-border-default cursor-pointer') : 'border-border-default opacity-30 cursor-not-allowed'" class="opt border-2 transition-all">10 min</div>
								<div @click="roomType === 'PRIVATE' && (time = time === 'CUSTOM'  ? null : 'CUSTOM')"  :class="roomType === 'PRIVATE' ? (time === 'CUSTOM'  ? 'border-main-color cursor-pointer' : 'border-border-default cursor-pointer') : 'border-border-default opacity-30 cursor-not-allowed'" class="opt border-2 transition-all">Custom</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex justify-center mt-30">
					<button @click="sendPlayRequest()"
							:disabled="!canPlay"
							:class="canPlay ? 'pointer-events-auto grayscale-0' : 'pointer-events-none grayscale'"
							class=	"py-4 px-12 text-3xl text-text-default rounded-2xl transition-all duration-150
									bg-main-color hover:bg-linear-to-t from-main-color to-light-button cursor-pointer">
						{{ t('game.playPgae.play') }}
					</button>
				</div>
			</div>
			<div v-else class="flex flex-col items-center justify-center gap-6 py-20">
				<div class="w-16 h-16 border-4 border-main-color border-t-transparent rounded-full animate-spin"></div>
				<p v-if="!reloading" class="text-text-default text-xl tracking-wide">
					Looking for opponent<span class="dot dot-1">.</span><span class="dot dot-2">.</span><span class="dot dot-3">.</span>
				</p>
				<p v-else class="text-text-default text-xl tracking-wide">
					Reloading game<span class="dot dot-1">.</span><span class="dot dot-2">.</span><span class="dot dot-3">.</span>
				</p>
				<button @click="waiting = false; sockStore.socket?.emit('cancel_match')"
						class="cursor-pointer justify-self-center w-[70%] my-3 p-3 text-base bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button">
						Cancel
				</button>
			</div>
    	</div>
    </div>
</template>

<style scoped>
    h1, h4 { font-family: "Copperplate", Times; }

	@keyframes dot{
		0%, 100%	{ opacity: 0; }
		50%			{ opacity: 1; }
	}

	.dot	{ opacity: 0; animation: dot 1.5s infinite; }
	.dot-1	{ animation-delay: 0s; }
	.dot-2	{ animation-delay: 0.5s; }
	.dot-3	{ animation-delay: 1s; }

	.opt {
		border-radius: 8px;
		padding-block: 8px;
		color: var(--color-text-default);
		font-size: small;
		width: 96px;
		text-align: center;
	}

	.opt:hover { background: var(--color-border-default); }
</style>