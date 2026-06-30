<script setup>
    import statusOnline from './statusOnline.vue';
    import { asset, acceptRequest, rejectRequest } from '../scripts/Helper/CompUtils';
    import { computed, ref } from 'vue';
    const prop = defineProps({
  	    	friendReq: Array,
            user: Object
	    });
    const men_index = ref(0);
    const reqFriendlist = computed(() => prop.friendReq.filter((b) => b.friend_status === 'pending' && b.sender.username !== prop.user.username));
    const currentRequest = computed(() => reqFriendlist.value[men_index.value] ?? null);

    const goPrev = () => {
        if (men_index.value > 0) {
            men_index.value--;
        }
    };

    const goNext = () => {
        if (men_index.value < reqFriendlist.value.length - 1) {
            men_index.value++;
        }
    };
</script>

<template>
    <div class="my-2 w-90 mx-5">
        <div class="grid grid-flow-col justify-between">
            <button @click="goPrev"
                :disabled="!currentRequest || men_index === 0"
                class="justify-self-start text-zinc-300 self-center"><</button>

                <div v-if="currentRequest" class="flex my-2">
                    <RouterLink :to="{ name: 'user_page', params: { username: currentRequest.friend.username } }" class="flex">
                        <img class="size-13 rounded-full" :src="currentRequest.friend.image ? asset(`${currentRequest.friend.image}`) : asset('../assets/default.png')"/>
                        <statusOnline :user_id="currentRequest.friend.id_user"/>
                        <div class="mx-2">
                            <p class="text-white">{{ currentRequest.friend.username }}</p>
                            <p class="text-zinc-300">Punti: {{ currentRequest.friend.points }}</p>
                        </div>
                    </RouterLink>
                    <div class="ml-7 self-center">
                        <button @click="acceptRequest(currentRequest.friend.id_user)"
                            class="p-1.25 px-2 cursor-pointer justify-self-end-safe rounded-l-md inset-ring 
                                bg-green-400/10 text-green-500 inset-ring-green-500/20">V</button>
                        <button @click="rejectRequest(currentRequest.friend.id_user)"
                            class="p-1.25 px-2 cursor-pointer justify-self-end-safe rounded-r-md inset-ring 
                                bg-red-400/10 text-red-500 inset-ring-red-500/20">X</button>
                    </div>
                </div>

            <button @click="goNext"
                :disabled="!currentRequest || men_index >= reqFriendlist.length - 1"
                class="justify-self-end text-zinc-300 self-center">></button>
        </div>
    </div>
</template>

<style scoped>
</style>