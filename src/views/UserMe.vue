<script setup>
    import TagTitle         from '../components/TagTitle.vue';
    import FriendList       from '../components/FriendList.vue';
    import MatchHistory     from '../components/MatchHistory.vue';
    import FriendRequest    from '../components/FriendRequest.vue';
    import { ref, onMounted }   from 'vue';
    import { defaultAvatar, handleAvatarError }    from '../scripts/Helper/CompUtils';
    import { useAuthStore }     from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
    import { authApi }          from '../router/api/auth.api';

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
    <div class="flex-row z-2 bg-bg-darker rounded-3xl w-[100vh] h-[80vh]">
        <div class="flex p-2 m-4 bg-bg-default rounded-3xl border border-border-default">
                <img :src="user.image ? `${user.image}` : defaultAvatar" @error="handleAvatarError"
                    alt="" class="size-35 rounded-full place-self-start m-5 object-cover">
            <div>
                <h2 class="text-text-default text-3xl mt-5">{{ user.username }}</h2>
                <div class="flex gap-3 my-1">
                    <h3 class="text-text-second text-md self-center">{{ user.name }} {{ user.surname }}</h3>
                    <p class="text-text-last">|</p>
                    <h4 class="text-text-third text-sm self-center">{{ user.email }}</h4>
                </div>
                <TagTitle :title="user?.title" class="mt-1"/>
                <h4 class="text-text-second text-2xl mt-5">ELO: {{ user.points }}</h4>
            </div>
        </div>
        <div class="flex m-4">
            <div class=" m-2 w-full">
                <div class="w-full p-2 mb-2 h-[35vh] bg-bg-default rounded-3xl border border-border-default">
                    <h2 class="text-text-default text-xl m-1">Lista di amici</h2>
                    <hr class="w-full justify-self-start text-text-last">
                    <div v-if="friends" :class="friends.length > 3 ? 'max-h-[29vh] overflow-y-auto' : ''">
                        <FriendList :friendlist="friends" :remove-f="true"/>
                    </div>
                </div>
                <div class="w-full p-2 h-[15vh] bg-bg-default rounded-3xl border border-border-default">
                    <h2 class="text-text-default text-xl m-1">Richieste d'amicizia 
                        <span v-if="fReq.length > 0" class="text-xs absolute rounded-full px-1.25 bg-notif-on">{{ fReq.length }}</span></h2>
                    <hr class="w-full justify-self-start text-text-last">
                    <FriendRequest :friendReq="fReq" :user="user"/>
                </div>
            </div>
            <div class="w-full m-2 p-2 h-auto bg-bg-default rounded-3xl border border-border-default">
                <h2 class="text-text-default text-xl m-1">Cronologia delle partite</h2>
                <hr class="w-full justify-self-start text-text-last">
                <div v-if="matches" class="flex gap-3 m-2 text-sm text-text-default justify-self-center">
                    <div class="flex gap-2">
                        <p>Vittorie:</p>
                        <p class="text-text-win-open">{{ matches.stats.w }}</p>
                    </div>
                    <p class="text-text-last">|</p>
                    <div class="flex gap-2">
                        <p>Patte:</p>
                        <p class="text-text-draw-await">{{ matches.stats.d }}</p>
                    </div>
                    <p class="text-text-last">|</p>
                    <div class="flex gap-2">
                        <p>Sconfitte:</p>
                        <p class="text-text-lose-closed">{{ matches.stats.l }}</p>
                    </div>
                    <p class="text-text-last">|</p>
                    <div class="flex gap-2">
                        <p>Partite:</p>
                        <p>{{ matches.stats.total }}</p>
                    </div>
                </div>
                <hr class="w-full justify-self-start text-text-last">
                <div v-if="matches" :class="matches.matches.length > 4 ? 'max-h-[40vh] overflow-y-auto' : ''">
                    <MatchHistory :matches="matches.matches"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>