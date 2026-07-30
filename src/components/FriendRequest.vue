<script setup>
    import { defaultAvatar, handleAvatarError, acceptRequest, rejectRequest } from '../scripts/Helper/CompUtils';
    import { computed, ref } from 'vue';
    const prop = defineProps({
  	    	friendReq: Array,
            user: Object
	    });
    let     men_index = ref(0);
    const   currentRequest = computed(() => prop.friendReq[men_index.value] ?? null);

    const goPrev = () => {
        if (men_index.value > 0)
            men_index.value--;
        else
            men_index.value = prop.friendReq.length - 1;
    };

    const goNext = () => {
        if (men_index.value < prop.friendReq.length - 1)
            men_index.value++;
        else
            men_index.value = 0;
    };
</script>

<template>
    <div class="my-2 w-90 mx-5">
        <div v-if="currentRequest" class="grid grid-flow-col">
            <button @click="goPrev" v-bind:class="{'hidden' : friendReq.length <= 1, 'inline' : friendReq.length > 1 }"
                :disabled="!currentRequest"
                class="justify-self-start text-zinc-300 self-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

                <div class="flex my-2 justify-self-center">
                    <RouterLink :to="{ name: 'user_page', params: { username: currentRequest.friend.username } }" class="flex">
                        <img class="size-13 rounded-full object-cover" :src="currentRequest.friend.image ? `${currentRequest.friend.image}` : defaultAvatar" @error="handleAvatarError"/>
                        <div class="mx-2">
                            <p class="text-white" v-if="currentRequest.friend.username.length > 12">
                                {{ currentRequest.friend.username.slice(0, 11) + "..." }}</p>
                            <p class="text-white" v-if="currentRequest.friend.username.length <= 12">
                                {{ currentRequest.friend.username }}</p>
                            <p class="text-zinc-300 text-sm">ELO: {{ currentRequest.friend.points }}</p>
                        </div>
                    </RouterLink>
                    <div class="ml-7 self-center">
                        <button @click="acceptRequest(currentRequest.friend.id_user)"
                            class="p-1.25 cursor-pointer justify-self-end-safe rounded-l-md inset-ring 
                                bg-green-400/10 text-green-500 inset-ring-green-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </button>
                        <button @click="rejectRequest(currentRequest.friend.id_user)"
                            class="p-1.25 cursor-pointer justify-self-end-safe rounded-r-md inset-ring 
                                bg-red-400/10 text-red-500 inset-ring-red-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

            <button @click="goNext" v-bind:class="{'hidden' : friendReq.length <= 1, 'inline' : friendReq.length > 1 }"
                :disabled="!currentRequest"
                class="justify-self-end text-zinc-300 self-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>

            </button>
        </div>
        <div v-if="!currentRequest" class="flex justify-center">
            <p class="text-white self-center mt-5">Nessuna richiesta in attesa</p>
        </div>
    </div>
</template>

<style scoped>
</style>