<script setup>
    import TagTitle from '../components/TagTitle.vue';
    import FriendList from '../components/FriendList.vue';
    import StatusOnline from '../components/StatusOnline.vue';
    import FriendButton from '../components/FriendButton.vue';
    import MatchHistory from '../components/MatchHistory.vue';
    import { defaultAvatar, handleAvatarError }    from '../scripts/Helper/CompUtils';
    import { useAuthStore } from "../stores/auth.st";
    import { storeToRefs }  from 'pinia';
    import { ref, watch }   from 'vue';
    import { api }          from '../router/api/client';

    const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);
    const prop = defineProps({
  	    	username: String
	    });
	const friends = ref(null), matches = ref(null), otherUser = ref(null);

    async function loadUserData(username) {
        if (!username) {
            otherUser.value = null;
            friends.value = null;
            matches.value = null;
            return;
        }

        otherUser.value = (await api.get(`/api/users/username/${username}`)).data.user;
        friends.value = (await api.get(`/api/friends/${otherUser.value.id_user}`)).data.friendship;
        matches.value = (await api.get(`/api/matchesHistory/user/${otherUser.value.id_user}`)).data.matches;
    }

    watch(
        () => prop.username,
        (username) => {
            loadUserData(username);
        },
        { immediate: true }
    );

</script>

<template>
    <div v-if="otherUser" class="flex-row z-2 bg-[#181715] rounded-3xl w-[100vh] h-[80vh]">
        <div class="flex p-2 m-4 bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
            <img :src="otherUser.image ? `${otherUser.image}` : defaultAvatar" @error="handleAvatarError"
                    alt="" class="size-35 rounded-full place-self-start m-5 object-cover">
            <StatusOnline v-if="user.id_user === otherUser.id_user || friends?.find((frie) => frie.friend.id_user === user.id_user && frie.friend_status !== 'pending')"
                :user_id="otherUser.id_user" class="size-6 ml-31 mt-31"/>
            <div>
                <div class="w-150 grid grid-cols-2 items-center mt-5">
                    <h2 class="text-white text-3xl">{{ otherUser.username }}</h2>
                    <FriendButton :user="otherUser" v-if="otherUser.username !== user.username"/>
                </div>
                <h3 class="text-zinc-300 my-1 text-md self-center">{{ otherUser.name }} {{ otherUser.surname }}</h3>
                <TagTitle :title="otherUser?.title" class="mt-1"/>
                <h4 class="mt-5 text-zinc-300 text-2xl justify-self-start">ELO: {{ otherUser.points }}</h4>
            </div>
        </div>
        <div class="flex m-4">
            <div class="w-[60%] m-2 p-2 h-[50vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                <h2 class="text-white text-xl m-1">Lista di amici</h2>
                <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                <div v-if="friends" class="my-2" :class="friends.length > 5 ? 'max-h-[43vh] overflow-y-auto' : ''">
                    <FriendList :friendlist="friends" :remove-f="false"/>
                </div>
            </div>
            <div class="w-full m-2 p-2 h-auto bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                <h2 class="text-white text-xl m-1">Cronologia delle partite</h2>
                <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                <div v-if="matches?.stats" class="flex gap-3 m-2 text-sm text-white justify-self-center">
                    <div class="flex gap-2">
                        <p>Vittorie:</p>
                        <p class="text-green-600">{{ matches.stats.w }}</p>
                    </div>
                    <p class="text-[#4e4e4e8c]">|</p>
                    <div class="flex gap-2">
                        <p>Patte:</p>
                        <p class="text-gray-300">{{ matches.stats.d }}</p>
                    </div>
                    <p class="text-[#4e4e4e8c]">|</p>
                    <div class="flex gap-2">
                        <p>Sconfitte:</p>
                        <p class="text-red-500">{{ matches.stats.l }}</p>
                    </div>
                    <p class="text-[#4e4e4e8c]">|</p>
                    <div class="flex gap-2">
                        <p>N. partite:</p>
                        <p>{{ matches.stats.total }}</p>
                    </div>
                </div>
                <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                <div v-if="matches" :class="matches.matches.length > 4 ? 'max-h-[40vh] overflow-y-auto' : ''">
                    <MatchHistory :matches="matches.matches"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>