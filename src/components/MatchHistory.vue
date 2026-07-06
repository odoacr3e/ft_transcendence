<script setup>
    const prop = defineProps({
  	    	matches: Array,
            stats: Object
	    });

    function rework_date(old_date)
    {
        if (!old_date)
            return '';

        const date = String(old_date).slice(0, 10);
        const [year, month, day] = date.split('-');

        if (!year || !month || !day)
            return String(old_date);

        return `${day}/${month}/${year}`;
    }
</script>

<template>
    <div v-if="stats" class="flex gap-3 m-2 text-white justify-self-center">
        <div class="flex gap-2">
            <p>Vittorie:</p>
            <p class="text-green-600">{{ stats.w }}</p>
        </div>
        <p class="text-[#4e4e4e8c]">|</p>
        <div class="flex gap-2">
            <p>Patte:</p>
            <p class="text-gray-300">{{ stats.d }}</p>
        </div>
        <p class="text-[#4e4e4e8c]">|</p>
        <div class="flex gap-2">
            <p>Sconfitte:</p>
            <p class="text-red-500">{{ stats.l }}</p>
        </div>
        <p class="text-[#4e4e4e8c]">|</p>
        <div class="flex gap-2">
            <p>N. partite:</p>
            <p>{{ stats.total }}</p>
        </div>
    </div>
    <hr class="w-full justify-self-start text-[#4e4e4e8c]">
    <div v-for="(game, index) in matches" :key="game.id_usermatch" class="ml-2">
        <div class="flex my-3.25 ml-2 w-full">
            <div class="size-13 rounded-full items-center inline-flex text-lg"
                v-bind:class="{ 'bg-green-50/90 text-green-600' : game.result === 'Win',
                                'bg-red-50/90 text-red-500' : game.result === 'Lose',
                                'bg-gray-300/90 text-white' : game.result === 'Draw', }">   
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 ml-3">
                    <path v-if="game.result === 'Win'" stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    <path v-if="game.result === 'Lose'" stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    <path v-if="game.result === 'Draw'" stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            </div>
            <div class="text-white mx-2 w-fit">
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
                <p class="text-sm text-zinc-300">{{ rework_date(game.date) }}</p>
            </div>
            <p class="self-center translate-x-3 text-xl"
                :class="{ 'text-green-600' : game.result === 'Win', 'text-red-500' : game.result === 'Lose', 'text-white' : game.result === 'Draw' }">{{ game.result }}</p>
            <div v-if="game.tournament" class="text-blue-200 ml-auto mr-4 flex gap-2 self-center bg-blue-400/10 inset-ring-blue-500/20 inset-ring p-3 rounded-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
                <p>Torneo</p>
            </div>
            <div v-if="game.tournament" class="flex gap-2.5 absolute items-center rounded-xl border px-5 py-4
                    inset-ring border-blue-800/10 bg-[#252b33]/80 text-blue-200 inset-ring-blue-500/20
                    translate-x-8.5 -translate-y-80 animate-card">
                <h2>Torneo "{{ game.tournament.name }}"</h2>
            </div>
        </div>
        <hr v-if="index !== matches.length - 1" class="text-[#4e4e4e80] border-dashed">
    </div>
</template>

<style scoped>
</style>