<script setup>
    import { ref, onMounted }   from 'vue';
    import { authApi }          from '../router/api/auth.api';
    import { api } from '../router/api/client';

    const   prop = defineProps({
  	    	user: Object
	    }),
            friends = ref(null), state = ref(null);
 
    onMounted(async () => {
        friends.value = await authApi.friendlist();

        if (friends.value.find(x => x === prop.user.username))
            state.value = "Amici";
        else
            state.value = "Manda amicizia";
    });
    
    async function sendRequest()
    {
        if (state.value === "Manda amicizia")
        {
            const resp = await (api.post("/api/friends", { id_friend: prop.user.id_user })).data.new_friend;
            if (resp.friend_status === "pendig")
                state.value = "In attesa...";
        }
    }

    // watch(state.value, (newState) => {
    //     ...
    // })
    
</script>

<template>
    <button class="w-max p-2.5 pl-12 cursor-pointer rounded-md inset-ring justify-self-end-safe"
            v-bind:class="{ 'bg-green-400/10 text-green-500 inset-ring-green-500/20' : state === 'Manda amicizia',
                            'bg-gray-200/10 text-gray-300 inset-ring-gray-300/20' : state === 'In attesa...',
                            'bg-blue-400/10 text-blue-500 inset-ring inset-ring-blue-500/20' : state === 'Amici' }"
            @click="sendRequest()">
        <p>{{ state }}</p>
    </button>

</template>

<style scoped>
</style>