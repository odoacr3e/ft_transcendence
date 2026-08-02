<script setup>
    import { ref } from 'vue';
    import { rework_date } from '../scripts/Helper/CompUtils';

    const prop = defineProps({
  	    	matches: Array,
	    });

    const selectedT = ref(null);

    const openTournamentPopup = (game) => {
        selectedT.value = game;
    };

    const closeTournamentPopup = () => {
        selectedT.value = null;
    };
</script>

<template>
    <div v-for="(game, index) in matches.slice().reverse()" :key="game.id_usermatch" class="ml-2">
        <div class="flex my-3.25 w-full">
            <div class="size-13 rounded-full items-center inline-flex text-lg"
                v-bind:class="{ 'bg-bg-win text-text-win-open' : game.result === 'Win',
                                'bg-bg-lose text-text-lose-closed' : game.result === 'Lose',
                                'bg-bg-draw text-text-default' : game.result === 'Draw', }">   
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 ml-3">
                    <path v-if="game.result === 'Win'" stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    <path v-if="game.result === 'Lose'" stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    <path v-if="game.result === 'Draw'" stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            </div>
            <div class="text-text-default mx-2 w-[35%]">
                <div class="flex gap-1">
                    <p>VS.</p>
                    <RouterLink :to="{ name: 'user_page', params: { username: game.opponent } }"
                            class="hover:underline">
                        <p v-if="game.opponent && game.opponent.length > 11">
                            {{ game.opponent.slice(0, 10) + "..." }}</p>
                        <p v-if="game.opponent && game.opponent.length <= 11">
                            {{ game.opponent }}</p>
                    </RouterLink>
                </div>
                <p class="text-sm text-text-second">{{ rework_date(game.date) }}</p>
            </div>
            <p class="self-center translate-x-3 text-xl"
                :class="{ 'text-text-win-open' : game.result === 'Win', 'text-text-lose-closed' : game.result === 'Lose', 'text-text-default' : game.result === 'Draw' }">{{ game.result }}</p>
            <div v-if="game.tournament" @click="openTournamentPopup(game)" class="flex gap-2 text-text-tour-friend ml-auto mr-4 self-center bg-bg-tour-friend inset-ring-inset-tour-friend inset-ring p-3 rounded-3xl cursor-pointer transition hover:bg-hover-tour">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
                <p class="uppercase tracking-widest text-sm">Torneo</p>
            </div>
        </div>
        <hr v-if="index !== matches.length - 1" class="text-text-last border-dashed w-full">
    </div>

    <div v-if="selectedT" class="fixed inset-0 z-25 flex items-center justify-center bg-bg-blur backdrop-blur-xs px-4" @click.self="closeTournamentPopup">
        <div class="w-full max-w-md rounded-3xl border border-border-default bg-bg-default p-6 text-text-default shadow-2xl">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm uppercase tracking-widest text-text-tour-friend">Torneo</p>
                    <div class="flex items-center justify-start gap-2 mt-1">
                        <RouterLink to="/tournaments" class="hover:underline">
                            <h3 class="text-2xl">{{ selectedT.tournament.name }}</h3>
                        </RouterLink>
                        <p class="text-text-last">|</p>
                        <h4 :class="{	'text-text-win-open' : selectedT.tournament.status === 'open',
										'text-text-draw-await' : selectedT.tournament.status === 'ongoing',
										'text-text-lose-closed' : selectedT.tournament.status === 'closed' }">
                            {{ selectedT.tournament.status }}
                        </h4>
                    </div>
                    <hr class="w-[138%] justify-self-start text-text-last my-1">
                    <p class="text-sm text-text-second ml-1">Creato il {{ rework_date(selectedT.tournament.created_at) }} da 
                        <RouterLink :to="{ name: 'user_page', params: { username: selectedT.tournament.creator.username } }" class="hover:underline">
                            {{ selectedT.tournament.creator.username }}
                        </RouterLink>
                    </p>
                </div>
                <button type="button" class="text-2xl leading-none text-text-third hover:text-text-default" @click="closeTournamentPopup">&times;</button>
            </div>
            <div class="mt-6 mb-3 flex gap-2 justify-self-center">
                <p v-if="selectedT.result == 'Win'" class="text-text-win-open">{{ selectedT.result }}</p>
                <p v-if="selectedT.result == 'Lose'" class="text-text-lose-closed">{{ selectedT.result }}</p>
                <RouterLink :to="{ name: 'user_page', params: { username: selectedT.player } }" class="hover:underline">
                    <p v-if="selectedT.player && selectedT.player.length > 11">
                        {{ selectedT.player.slice(0, 10) + "..." }}</p>
                    <p v-if="selectedT.player && selectedT.player.length <= 11">
                        {{ selectedT.player }}</p>
                </RouterLink>
                <p>VS.</p>
                <RouterLink :to="{ name: 'user_page', params: { username: selectedT.opponent } }" class="hover:underline">
                    <p v-if="selectedT.opponent && selectedT.opponent.length > 11">
                        {{ selectedT.opponent.slice(0, 10) + "..." }}</p>
                    <p v-if="selectedT.opponent && selectedT.opponent.length <= 11">
                        {{ selectedT.opponent }}</p>
                </RouterLink>
                <p v-if="selectedT.result == 'Lose'" class="text-text-win-open">Win</p>
                <p v-if="selectedT.result == 'Win'" class="text-text-lose-closed">Lose</p>
            </div>
            <div class="flex justify-self-center text-sm gap-5 text-text-second">
                <p>{{ rework_date(selectedT.date) }}</p>
                <p>Round: {{ selectedT.tournament.round }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>