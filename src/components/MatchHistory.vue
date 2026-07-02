<script setup>
    const prop = defineProps({
  	    	matches: Array
	    });
</script>

<template>
    <div v-for="(game, index) in matches" :key="game.id_usermatch" class="ml-2">
        <div class="flex my-3.25 ml-2 w-full">
            <div class="size-13 rounded-full items-center inline-flex text-lg"
                v-bind:class="{ 'bg-green-50/90 text-green-600' : game.result === 'Win',
                                'bg-red-50/90 text-red-500' : game.result === 'Lose' }">   
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 ml-3">
                    <path v-if="game.result === 'Win'" stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    <path v-if="game.result === 'Lose'" stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
            <div class="text-white mx-2 w-[20vh]">
                <div class="flex gap-1">
                    <p>VS.</p>
                    <RouterLink :to="{ name: 'user_page', params: { username: game.opponent } }"
                            class="hover:underline">
                        {{ game.opponent }}
                    </RouterLink>
                </div>
                <p v-bind:class="{ 'text-green-600' : game.result === 'Win', 'text-red-500' : game.result === 'Lose' }">
                    {{ game.result }}</p>
            </div>
            <div v-if="game.tournament" class="text-blue-500 ml-auto mr-4 flex gap-2 self-center bg-blue-400/10 inset-ring-blue-500/20 inset-ring p-3 rounded-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
                <p>Torneo</p>
            </div>
        </div>
        <hr v-if="index !== matches.length - 1" class="text-[#4e4e4e80] border-dashed">
    </div>
</template>

<style scoped>
</style>