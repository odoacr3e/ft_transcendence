<script setup>
    import { asset, acceptRequest, rejectRequest } from '../scripts/Helper/CompUtils';

    const prop = defineProps({
  	    	friendReq: Array,
            user: Object
	    });

</script>

<template>
    <div v-for="besties in friendReq" class="my-2">
        <div v-if="besties.friend_status === 'pending' && besties.sender.username !== user.username"
            class="w-90 mx-5">
            <div class="grid grid-flow-col justify-between">
                <span class="justify-self-start text-zinc-300 self-center"><</span>
                    <div class="flex my-2 ">
                        <RouterLink :to="{ name: 'user_page', params: { username: besties.friend.username } }" class="flex">
                            <img class="size-13 rounded-full" :src="besties.friend.image ? asset(`${besties.friend.image}`) : asset('../assets/default.png')"/>
                            <span class="rounded-full size-3 absolute ml-9.5 mt-9.5"
                                v-bind:class="{ 'bg-green-500' : true,
                                                'bg-red-500'   : false }"></span>
                            <div class="mx-2">
                                <p class="text-white">{{ besties.friend.username }}</p>
                                <p class="text-zinc-300">Punti: {{ besties.friend.points }}</p>
                            </div>
                        </RouterLink>
                        <div class="ml-7 self-center">
                            <button @click="acceptRequest(besties.friend.id_user)"
                                class="p-1.25 px-2 cursor-pointer justify-self-end-safe rounded-l-md inset-ring 
                                    bg-green-400/10 text-green-500 inset-ring-green-500/20">V</button>
                            <button @click="rejectRequest(besties.friend.id_user)"
                                class="p-1.25 px-2 cursor-pointer justify-self-end-safe rounded-r-md inset-ring 
                                    bg-red-400/10 text-red-500 inset-ring-red-500/20">X</button>
                        </div>
                    </div>
                <span class="justify-self-end text-zinc-300 self-center">></span>
            </div>
            <hr class="text-[#4e4e4e80] border-dashed">
        </div>
    </div>
</template>

<style scoped>
</style>