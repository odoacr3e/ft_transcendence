<script setup>
    import { rework_date } from '../scripts/Helper/CompUtils';

    const prop = defineProps({
  	    	tournaments: Array
	    });
</script>

<template>
    <div v-for="games in tournaments" class="bg-[#4e4e4e8c] p-5 pb-3 rounded-3xl w-min-fit">
        <div class="flex items-center justify-start gap-2">
            <h2 class="text-2xl">{{ games.name }}</h2>
            <p class="text-[#4e4e4e8c]">|</p>
            <h3 :class="{ 'text-green-600' : games.status === 'open' }">{{ games.status }}</h3>
        </div>
        <p class="justify-start text-sm text-zinc-300">{{ rework_date(games.created_at) }}</p>
        <div class="mt-4 mb-2">
            <p>Creatore del torneo: 
                <RouterLink :to="{ name: 'user_page', params: { username: games.created_by.username } }"
                        class="hover:underline">
                    {{ games.created_by.username }}
                </RouterLink>
            </p>
            <hr class="w-full text-[#4e4e4e8c] my-2">
            <p>Giocatori:</p>
            <div class="grid grid-cols-2 text-sm text-zinc-300">
                <p v-for="(player, index) in games.players" :key="index">
                    <RouterLink :to="{ name: 'user_page', params: { username: player.username } }"
                        class="hover:underline">
                        <p v-if="index < 8">{{ player.username }}<p v-if="index == 8 && games.player.lenght > 8">...</p></p>
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>