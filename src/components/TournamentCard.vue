<script setup>
    import { rework_date } from '../scripts/Helper/CompUtils';
    import { useI18n } from 'vue-i18n';
    
    const   { t } = useI18n(),
            prop = defineProps({
  	    	    tournaments: Array
	        });

    function checkPage(n) {
        if (n === 8)    { return ("start_tournament"); }
        else            { return ("open_tournament"); }
    }
</script>

<template>
    <div v-for="games in tournaments" :key="games.id_tournament" class="bg-bg-second p-5 pb-3 rounded-3xl w-fit h-full shrink-0">
        <div class="flex items-center justify-start gap-2">
            <RouterLink :to="{ name: checkPage(games?.players?.length), params: { tournament: games.id_tournament } }"
                    class="hover:underline">
                    <h2 class="text-2xl">{{ games.name }}</h2>
            </RouterLink>
            <p class="text-text-last">|</p>
            <h3 :class="{   'text-text-win-open' : games.status === 'open',
							'text-text-draw-await' : games.status === 'ongoing',
							'text-text-lose-closed' : games.status === 'closed' }">{{ games.status }}</h3>
        </div>
        <p class="justify-start text-sm text-text-second">{{ rework_date(games.created_at) }}</p>
        <div class="my-2 max-w-105 min-w-95">
            <p>{{ t('tournaments.creator') }} 
                <RouterLink :to="{ name: 'user_page', params: { username: games.created_by.username } }"
                        class="hover:underline">
                    {{ games.created_by.username }}
                </RouterLink>
            </p>
            <hr class="w-full text-text-last my-2">
            <p>{{ t('common.players') }}:</p>
            <div class="grid grid-cols-2 text-sm text-text-second">
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