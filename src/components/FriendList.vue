<script setup>
    import { asset, rejectRequest } from '../scripts/Helper/CompUtils';
    import TagTitle from '../components/TagTitle.vue';

    const prop = defineProps({
  	    	friendlist: Array,
            removeF: Boolean
	    });

    //TODO - 
    // push ad una pagina intermedia con la lista degli utenti dove avviene un fetch con la querry '/?username=${username}'
</script>

<template>
    <div v-for="besties in friendlist" class="my-2">
        <div v-if="besties.friend_status !== 'pending'">
            <RouterLink :to="{ name: 'user_page', params: { username: besties.friend.username } }">
                <div class="flex my-2 ml-2">
                    <img class="size-13 rounded-full" :src="besties.friend.image ? asset(`${besties.friend.image}`) : asset('../assets/default.png')"/>
                    <span class="rounded-full size-3 absolute ml-9.5 mt-9.5"
                        v-bind:class="{ 'bg-green-500' : false,
                                        'bg-red-500' : true }"></span>
                    <div class="mx-2">
                        <p class="text-white">{{ besties.friend.username }}</p>
                        <div class="flex items-center gap-1">
                            <TagTitle :title="besties.friend.title" class="mt-1"/>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <p class="text-zinc-300">Punti: {{ besties.friend.points }}</p>
                        </div>
                    </div>
                    <button @click="rejectRequest(besties.friend.id_user)" v-if="removeF"
                                class="h-[80%] p-1.25 px-2 ml-[10%] cursor-pointer self-center rounded-md inset-ring text-sm
                                    bg-red-400/10 text-red-500 inset-ring-red-500/20">Elimina amicizia</button>
                </div>
            </RouterLink>
            <hr class="text-[#4e4e4e80] border-dashed">
        </div>
    </div>
</template>

<style scoped>
</style>