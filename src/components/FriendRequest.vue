<script setup>
    const prop = defineProps({
  	    	friendReq: Array,
            user: Object
	    });

    function asset(path) {
		return new URL(path, import.meta.url).href;
	}
</script>

<template>
    <div v-for="besties in friendReq" class="my-2">
        <div v-if="besties.friend_status === 'pending' && besties.sender.username !== user.username"
            class="w-90 mx-5">
            <div class="grid grid-flow-col justify-between">
                <span class="justify-self-start text-zinc-300 self-center"><</span>
                <RouterLink :to="{ name: 'user_page', params: { username: besties.friend.username } }">
                    <div class="flex my-2 ">
                        <img class="size-13 rounded-full" :src="besties.friend.image ? asset(`${besties.friend.image}`) : asset('../assets/default.png')"/>
                        <span class="rounded-full size-3 absolute ml-9.5 mt-9.5"
                            v-bind:class="{ 'bg-green-500' : true,
                                            'bg-red-500'   : false }"></span>
                        <div class="mx-2">
                            <p class="text-white">{{ besties.friend.username }}</p>
                            <p class="text-zinc-300">Punti: {{ besties.friend.points }}</p>
                        </div>
                        <div class="ml-7 self-center">
                            <span class="p-1 px-1.5 cursor-pointer rounded-md inset-ring justify-self-end-safe bg-green-400/10 text-green-500 inset-ring-green-500/20">V</span>
                            <span class="p-1 px-2 cursor-pointer rounded-md inset-ring justify-self-end-safe bg-red-400/10 text-red-500 inset-ring-red-500/20">X</span>
                        </div>
                    </div>
                </RouterLink>
                <span class="justify-self-end text-zinc-300 self-center">></span>
            </div>
            <hr class="text-[#4e4e4e80] border-dashed">
        </div>
    </div>
</template>

<style scoped>
</style>