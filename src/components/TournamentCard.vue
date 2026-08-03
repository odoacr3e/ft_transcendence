<script setup>
    import { rework_date } from '../scripts/Helper/CompUtils';
    import { useI18n } from 'vue-i18n';
    
    const   { t } = useI18n(),
            prop = defineProps({
  	    	    tournaments: Array
	        });
</script>

<template>
    <div v-for="games in tournaments" :key="games.id_tournament" class="bg-[#302d2a] p-5 pb-3 rounded-3xl w-fit h-full shrink-0">
        <div class="flex items-center justify-start gap-2">
            <RouterLink :to="{ name: 'open_tournament', params: { tournament: games.id_tournament } }"
                    class="hover:underline">
                    <h2 class="text-2xl">{{ games.name }}</h2>
            </RouterLink>
            <p class="text-[#4e4e4e8c]">|</p>
            <h3 :class="{   'text-green-600' : games.status === 'open',
							'text-gray-300' : games.status === 'ongoing',
							'text-red-500' : games.status === 'closed' }">{{ games.status }}</h3>
        </div>
        <p class="justify-start text-sm text-zinc-300">{{ rework_date(games.created_at) }}</p>
        <div class="my-2 max-w-105 min-w-95">
            <p>{{ t('tournaments.creator') }} 
                <RouterLink :to="{ name: 'user_page', params: { username: games.created_by.username } }"
                        class="hover:underline">
                    {{ games.created_by.username }}
                </RouterLink>
            </p>
            <hr class="w-full text-[#4e4e4e8c] my-2">
            <p>{{ t('common.players') }}:</p>
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