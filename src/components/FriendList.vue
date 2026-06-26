<script setup>
    import router from '@/router/index.js';
    import TagTitle from '../components/TagTitle.vue';
    import { api } from '../router/api/client';

    const prop = defineProps({
  	    	friendlist: Array,
            removeF: Boolean
	    });

    function asset(path) {
		return new URL(path, import.meta.url).href;
	}

    async function removeFriend(id_user)
    {
        await api.delete("/api/friends", { id_friend: id_user });
        router.go(0);
    }

    //TODO - 
    // alla pagina /username? accanto agli amici mettere [add friend] se non si e' gia amici
    // push ad una pagina intermedia con la lista degli utenti dove avviene un fetch con la querry '/?username=${username}'
</script>

<template>
    <div v-for="besties in friendlist" class="my-2">
        <div v-if="besties.friend_status !== 'pending'">
            <button @click="removeFriend(besties.friend.id_user)" class=" z-12 text-md absolute text-red-500 -mt-1 ml-54 cursor-pointer"
                v-if="removeF">x</button>
            <RouterLink :to="{ name: 'user_page', params: { username: besties.friend.username } }">
                <div class="flex my-2">
                    <img class="size-13 rounded-full" :src="besties.friend.image ? asset(`${besties.friend.image}`) : asset('../assets/default.png')"/>
                    <span class="rounded-full size-3 absolute ml-9.5 mt-9.5"
                        v-bind:class="{ 'bg-green-500' : true,
                                        'bg-red-500' : false }"></span>
                    <div class="mx-2">
                        <p class="text-white">{{ besties.friend.username }}</p>
                        <div class="flex items-center gap-1">
                            <TagTitle :title="besties.friend.title" class="mt-1"/>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <p class="text-zinc-300">Punti: {{ besties.friend.points }}</p>
                        </div>
                    </div>
                </div>
            </RouterLink>
            <hr class="text-[#4e4e4e80] border-dashed">
        </div>
    </div>
</template>

<style scoped>
</style>