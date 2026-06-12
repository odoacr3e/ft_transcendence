<script setup>
    import Header from '../components/Header.vue';
    import TagTitle from '../components/TagTitle.vue';
    import FriendList from '../components/FriendList.vue';
    import { useAuthStore } from "../stores/auth.st";
    import { storeToRefs } from 'pinia';
	const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);

    function asset(path) {
		return new URL(path, import.meta.url).href;
	}
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <Header class="z-11"/>
        <div id="wrap" class="grow">
            <div class="flex-row z-2 bg-[#181715] rounded-3xl w-[80vh] h-[80vh]">
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
                    <div class="w-[50%] m-2 p-2 h-[50vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                        <h2 class="text-white text-xl m-1">Lista di amici:</h2>
                        <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                        <FriendList/> <!-- WIP -->
                    </div>
                    <div class="w-full m-2 p-2 h-auto bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                        <h2 class="text-white text-xl m-1">Cronologia delle partite:</h2>
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