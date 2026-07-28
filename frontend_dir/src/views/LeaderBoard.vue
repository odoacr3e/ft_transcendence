<script setup>
import TagTitle from '../components/TagTitle.vue';
import { defaultAvatar, handleAvatarError } from '../scripts/Helper/CompUtils';
import { ref, onMounted } from 'vue';
import { api }          from '../router/api/client';

const   lBoard = ref(null),
        top3 = ref(null),
        last7 = ref(null);

onMounted(async () => {
    try {
        lBoard.value = (await api.get("api/users/leaderboard")).data.list;
        lBoard.value.sort((a, b) => b.points - a.points);

        top3.value = lBoard.value.slice(0, 3);
        last7.value = lBoard.value.slice(3, 10);
    }
    catch (err) { console.log(err); }
});
</script>

<template>
    <div class="flex flex-col z-2 bg-[#181715] rounded-3xl w-[90vh] h-[90vh] text-white">
        <h2 class="text-3xl px-6 py-4 font-semibold self-center">Top 10 giocatori</h2>
        <div class="flex flex-col mx-4 mt-0 mb-1 p-2 bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
            <div v-if="top3" class="justify-items-center justify-self-center -mb-7">
                <p class="text-zinc-300">{{ top3[0].points }}</p>
                <img class="size-27 rounded-full object-cover" :src="top3[0].image ? `${top3[0].image}` : defaultAvatar" @error="handleAvatarError"/>
                <TagTitle :title="top3[0].title" class="absolute translate-x-102 -translate-y-3"/>
                <RouterLink :to="{ name: 'user_page', params: { username: top3[0].username } }" class="flex justify-items-center">
                    <p class="hover:underline mt-3" v-if="top3[0].username.length <= 15">
                        {{ top3[0].username }}</p>
                    <p class= "hover:underline mt-3" v-if="top3[0].username.length > 15">
                        {{ top3[0].username.slice(0, 14) + "..." }}</p>
                </RouterLink>
                <h3 class="text-xl"><b>1°</b></h3>
            </div>
            <div class="grid grid-rows-1 grid-cols-2 -mt-7">
                <div v-if="top3" class="justify-items-center">
                    <p class="text-zinc-300">{{ top3[1].points }}</p>
                    <img class="size-22 rounded-full object-cover" :src="top3[1].image ? `${top3[1].image}` : defaultAvatar" @error="handleAvatarError"/>
                    <TagTitle :title="top3[1].title" class="absolute translate-x-52 -translate-y-3"/>
                    <RouterLink :to="{ name: 'user_page', params: { username: top3[1].username } }" class="flex justify-items-center">
                        <p class="text-white hover:underline mt-3" v-if="top3[1].username.length <= 15">
                            {{ top3[1].username }}</p>
                        <p class="text-white hover:underline mt-3" v-if="top3[1].username.length > 15">
                            {{ top3[1].username.slice(0, 14) + "..." }}</p>
                    </RouterLink>
                    <h3 class="text-lg"><b>2°</b></h3>
                </div>
                <div v-if="top3" class="justify-items-center">
                    <p class="text-zinc-300">{{ top3[2].points }}</p>
                    <img class="size-22 rounded-full object-cover" :src="top3[2].image ? `${top3[2].image}` : defaultAvatar" @error="handleAvatarError"/>
                    <TagTitle :title="top3[2].title" class="absolute translate-x-52 -translate-y-3"/>
                    <RouterLink :to="{ name: 'user_page', params: { username: top3[2].username } }" class="flex justify-items-center">
                        <p class="text-white hover:underline mt-3" v-if="top3[2].username.length <= 15">
                            {{ top3[2].username }}</p>
                        <p class="text-white hover:underline mt-3" v-if="top3[2].username.length > 15">
                            {{ top3[2].username.slice(0, 14) + "..." }}</p>
                    </RouterLink>
                    <h3 class="text-lg"><b>3°</b></h3>
                </div>
            </div>
        </div>
        <div class="flex flex-col mt-1">
            <div v-for="(p, index) in last7">
                <div class="flex items-center px-4">
                    <h3 class="ml-3" :class="{'mr-2' : index == 6, 'mr-5' : index != 6 }"><b>{{ index + 4 }}°</b></h3>
                    <div class="flex m-2 gap-2 items-center">
                        <img class="size-10 rounded-full object-cover" :src="p.image ? `${p.image}` : defaultAvatar" @error="handleAvatarError"/>
                        <RouterLink :to="{ name: 'user_page', params: { username: p.username } }">
                            <p class="text-white hover:underline" v-if="p.username.length <= 15">
                                {{ p.username }}</p>
                            <p class="text-white hover:underline" v-if="p.username.length > 15">
                                {{ p.username.slice(0, 14) + "..." }}</p>
                        </RouterLink>
                        <div class="flex items-center gap-1">
                            <TagTitle :title="p.title" class="mt-1"/>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <p class="text-zinc-300 text-sm">ELO: {{ p.points }}</p>
                        </div>
                    </div>
                </div>
                <hr v-if="index != 6" class="w-full justify-self-start text-[#4e4e4e8c]">
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>