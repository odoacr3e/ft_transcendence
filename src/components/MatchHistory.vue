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
                <img v-if="game.result === 'Win'" class="size-10 ml-1.5" src="../assets/check.png" alt="">
                <img v-if="game.result === 'Lose'" class="size-8 ml-2.5" src="../assets/cross.png" alt="">
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
            <div v-if="game.tournament" class="ml-auto mr-4 flex gap-2 self-center bg-blue-400/10 inset-ring-blue-500/20 inset-ring p-3 rounded-3xl">
                <img src="../assets/trophy.png" alt="" class="size-6">
                <p class="text-blue-500">Torneo</p>
            </div>
        </div>
        <hr v-if="index !== matches.length - 1" class="text-[#4e4e4e80] border-dashed">
    </div>
</template>

<style scoped>
</style>