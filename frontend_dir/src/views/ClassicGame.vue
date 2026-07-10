<script setup>
	import { localMatchState, localInfo, DOMPlayer }	from '@/scripts/Data/Variables';
	import { onMounted, ref, computed }       			from 'vue';
	import PlayerInfo               					from '../components/PlayerInfo.vue';
	import ChessBoard               					from '../components/ChessBoard.vue';
	import AppHeader                					from '../components/AppHeader.vue';
	import router 										from '@/router';

	const ready		= ref(false);
	const style		= ref("1v1");
	const bottomP	= computed(() => DOMPlayer(2)?.team === localInfo.myTeam ? 2 : 1);
	const topP		= computed(() => bottomP.value === 1 ? 2: 1);

	onMounted(async () => {
		try{
			if (!localMatchState) 
			{
				router.push({ name: "playpage"});
				return;
			}
			ready.value = true;
		} catch (err) {
			console.log(`${err}`);
		}
	})
</script>

<template>
  <div class="min-h-screen flex flex-col">
        <AppHeader class="z-11"/>
        <div id="wrap" class="grow">
            <div class="flex z-2 bg-[#181715] rounded-3xl">
                <div class="p-6 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]">
                  <div v-if="ready">
                    <PlayerInfo :p="topP" pos="top"/>
                    <ChessBoard :style="style"/>
                    <PlayerInfo :p="bottomP" pos="bottom"/>
                  </div>
                </div>
                <div class="p-10 flex-col mt-20 w-lg">
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
</style>