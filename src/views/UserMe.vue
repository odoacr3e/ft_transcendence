<script setup>
    import AppHeader from '../components/AppHeader.vue';
    import TagTitle from '../components/TagTitle.vue';
    import FriendList from '../components/FriendList.vue';
    import FriendRequest from '../components/FriendRequest.vue';
    import MatchHistory from '../components/MatchHistory.vue';
    import { ref, onMounted }   from 'vue';
    import { useAuthStore }     from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
    import { authApi }          from '../router/api/auth.api';
    import { asset }            from '../scripts/Helper/CompUtils';

	const friends = ref(null), matches = ref(null), fReq = ref([]);
    const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);

    onMounted(async () => {
        friends.value = await authApi.friendlist();
        matches.value = await authApi.matchlist();

        friends.value.forEach(friendship => {
            if (friendship.friend_status === "pending" && friendship.sender.username !== user.value.username)
                fReq.value.push(friendship);
        });
    });
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppHeader class="z-11"/>
        <div id="wrap" class="grow">
            <div class="flex-row z-2 bg-[#181715] rounded-3xl w-[100vh] h-[80vh]">
                <div class="flex p-2 m-4 bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                    <img :src="user.image ? asset(`${user.image}`) : asset('../assets/default.png')"
                            alt="" class="size-35 rounded-full place-self-start m-5">
                    <div>
                        <h2 class="text-white text-3xl mt-5">{{ user.username }}</h2>
                        <div class="flex gap-3 my-1">
                            <h3 class="text-zinc-300 text-md self-center">{{ user.name }} {{ user.surname }}</h3>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <h4 class="text-zinc-500 text-sm self-center">{{ user.email }}</h4>
                        </div>
                        <TagTitle :title="user?.title" class="mt-1"/>
                        <h4 class="text-zinc-300 text-2xl mt-5">Punti: {{ user.points }}</h4>
                    </div>
                </div>
                <div class="flex m-4">
                    <div class=" m-2 w-full">
                        <div class="w-full p-2 mb-2 h-[35vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                            <h2 class="text-white text-xl m-1">Lista di amici</h2>
                            <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                            <div v-if="friends" :class="friends.length > 3 ? 'max-h-[29vh] overflow-y-auto' : ''">
                                <FriendList :friendlist="friends" :remove-f="true"/>
                            </div>
                        </div>
                        <div class="w-full p-2 h-[15vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                            <h2 class="text-white text-xl m-1">Richieste d'amicizia 
                                <span v-if="fReq.length > 0" class="text-xs absolute rounded-full px-1.25 bg-[#c41c1c]">{{ fReq.length }}</span></h2>
                            <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                            <FriendRequest :friendReq="fReq" :user="user"/>
                        </div>
                    </div>
                    <div class="w-full m-2 p-2 h-auto bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                        <h2 class="text-white text-xl m-1">Cronologia delle partite</h2>
                        <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                        <div v-if="matches" :class="matches.length > 6 ? 'max-h-[50vh] overflow-y-auto' : ''">
                            <MatchHistory :matches="matches"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* #wrap {
        display: grid;
        grid-template-columns: max-content max-content;
        position: relative;
        justify-content: center;
        justify-items: center;
        align-items: center;
        z-index: 10;
        font-size: 110%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        user-select: none;
    } */
</style>