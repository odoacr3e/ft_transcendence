<script setup>
    import Header from '../components/Header.vue';
    import TagTitle from '../components/TagTitle.vue';
    import FriendList from '../components/FriendList.vue';
    import FriendButton from '../components/FriendButton.vue';
    import { useAuthStore }     from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
    import { ref, watch }   from 'vue';
    import { api } from '../router/api/client'

    const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);
    const prop = defineProps({
  	    	username: String
	    });
	const friends = ref(null), otherUser = ref(null);

    function asset(path) {
		return new URL(path, import.meta.url).href;
	}

    async function loadUserData(username) {
        if (!username) {
            otherUser.value = null;
            friends.value = null;
            return;
        }

        otherUser.value = (await api.get(`/api/users/username/${username}`)).data.user;
        friends.value = (await api.get(`/api/friends/${otherUser.value.id_user}`)).data.friendship; // api/friends/:id
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
    <div class="min-h-screen flex flex-col">
        <Header class="z-15" />
        <div id="wrap" class="grow">
            <div v-if="otherUser" class="flex-row z-2 bg-[#181715] rounded-3xl w-[100vh] h-[80vh]">
                <div class="flex p-2 m-4 bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                    <img :src="otherUser.image ? asset(`${otherUser.image}`) : asset('../assets/default.png')"
                            alt="" class="size-35 rounded-full place-self-start m-5">
                    <div>
                        <div class="w-150 grid grid-cols-2 items-center mt-5">
                            <h2 class="text-white text-3xl">{{ otherUser.username }}</h2>
                            <FriendButton :user="otherUser" v-if="otherUser.username !== user.username"/>
                        </div>
                        <h3 class="text-zinc-300 my-1 text-md self-center">{{ otherUser.name }} {{ otherUser.surname }}</h3>
                        <TagTitle :title="otherUser?.title" class="mt-1"/>
                        <h4 class="mt-5 text-zinc-300 text-2xl justify-self-start">Punti: {{ otherUser.points }}</h4>
                    </div>
                </div>
                <div class="flex m-4">
                    <div class="w-[60%] m-2 p-2 h-[50vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                        <h2 class="text-white text-xl m-1">Lista di amici</h2>
                        <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                        <FriendList v-if="friends" :friendlist="friends" :remove-f="false"/>
                    </div>
                    <div class="w-full m-2 p-2 h-auto bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                        <h2 class="text-white text-xl m-1">Cronologia delle partite</h2>
                        <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #wrap {
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
    }
</style>