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
    import { useI18n }      from 'vue-i18n';
    import { api }          from '../router/api/client';

    const   { t } = useI18n(),
            authStore = useAuthStore(),
	        { user } = storeToRefs(authStore),
            prop = defineProps({
  	    	    username: String
	        }),
	        friends = ref(null), matches = ref(null), otherUser = ref(null);

    async function loadUserData(username) {
        if (!username) {
            otherUser.value = null;
            friends.value = null;
            matches.value = null;
            return;
        }

        try{
            otherUser.value = (await api.get(`/api/users/username/${username}`)).data.user;
            friends.value = (await api.get(`/api/friends/${otherUser.value.id_user}`)).data.friendship;
            matches.value = (await api.get(`/api/matchesHistory/user/${otherUser.value.id_user}`)).data.matches;
        }
        catch{}
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
    <div v-if="otherUser" class="flex-row z-2 bg-bg-darker rounded-3xl w-[100vh] h-[80vh]">
        <div class="flex p-2 m-4 bg-bg-default rounded-3xl border border-border-default">
            <img :src="otherUser.image ? `${otherUser.image}` : defaultAvatar" @error="handleAvatarError"
                    alt="" class="size-35 rounded-full place-self-start m-5 object-cover">
            <StatusOnline v-if="user.id_user === otherUser.id_user || friends?.find((frie) => frie.friend.id_user === user.id_user && frie.friend_status !== 'pending')"
                :user_id="otherUser.id_user" class="size-6 ml-31 mt-31"/>
            <div>
                <div class="w-150 grid grid-cols-2 items-center mt-5">
                    <h2 class="text-text-default text-3xl">{{ otherUser.username }}</h2>
                    <FriendButton :user="otherUser" v-if="otherUser.username !== user.username"/>
                </div>
                <h3 class="text-text-second text-md -mt-0.5 self-center">{{ otherUser.name }} {{ otherUser.surname }}</h3>
                <TagTitle :title="otherUser?.title" class="mt-1"/>
                <h4 class="mt-5 text-text-second text-2xl justify-self-start">ELO: {{ otherUser.points }}</h4>
            </div>
        </div>
        <div class="flex m-4">
            <div class="w-[60%] m-2 p-2 h-[50vh] bg-bg-default rounded-3xl border border-border-default">
                <h2 class="text-text-default text-xl m-1">{{ t('userPage.friendList') }}</h2>
                <hr class="w-full justify-self-start text-text-last">
                <div v-if="friends" :class="friends.length > 5 ? 'max-h-[44.5vh] overflow-y-auto' : ''">
                    <FriendList :friendlist="friends" :remove-f="false"/>
                </div>
            </div>
            <div class="w-full m-2 p-2 h-[50vh] bg-bg-default rounded-3xl border border-border-default">
                <h2 class="text-text-default text-xl m-1">{{ t('userPage.matchHistory') }}</h2>
                <hr class="w-full justify-self-start text-text-last">
                <div v-if="matches?.stats" class="flex gap-2 m-2 text-sm text-text-default justify-self-center">
                    <div class="flex gap-2">
                        <p>{{ t('common.win', 2) }}:</p>
                        <p class="text-text-win-open">{{ matches.stats.w }}</p>
                    </div>
                    <p class="text-text-last">|</p>
                    <div class="flex gap-2">
                        <p>{{ t('common.draw', 2) }}:</p>
                        <p class="text-text-draw-await">{{ matches.stats.d }}</p>
                    </div>
                    <p class="text-text-last">|</p>
                    <div class="flex gap-2">
                        <p>{{ t('common.lose', 2) }}:</p>
                        <p class="text-text-lose-closed">{{ matches.stats.l }}</p>
                    </div>
                    <p class="text-text-last">|</p>
                    <div class="flex gap-2">
                        <p>{{ t('common.game', 2) }}:</p>
                        <p>{{ matches.stats.total }}</p>
                    </div>
                </div>
                <hr class="w-full justify-self-start text-text-last">
                <div v-if="matches" :class="matches.matches.length > 4 ? 'max-h-[40.5vh] overflow-y-auto' : ''">
                    <MatchHistory :matches="matches.matches"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>