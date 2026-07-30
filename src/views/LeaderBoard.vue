<script setup>
import TagTitle from '../components/TagTitle.vue';
import { defaultAvatar, handleAvatarError } from '../scripts/Helper/CompUtils';
import { ref, onMounted } from 'vue';
import { useAuthStore } from "../stores/auth.st";
import { storeToRefs }  from 'pinia';
import { api }          from '../router/api/client';

const   lBoard = ref([]),
        top3 = ref(null),
        last7 = ref(null),
        authStore = useAuthStore(),
		{ user } = storeToRefs(authStore),
        top = ref(!lBoard.value?.filter((u) => u.id_user == user.id_user));

    function winRate(win, total) {
        if (!total) { return (0); }
        return (Math.round((win / total) * 100));
    }

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
    <div class="flex flex-col z-2 pb-1 bg-[#181715] rounded-3xl w-[90vh] h-fit text-white">
        <h2 class="text-3xl px-6 py-4 font-semibold self-center">Top 10 giocatori</h2>
        <div class="flex flex-col mx-4 mb-1 p-2 bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
            <div v-if="top3" class="justify-items-center justify-self-center -mb-7">
                <p class="text-zinc-300">{{ top3[0].points }}</p>
                <img class="size-27 rounded-full object-cover" :src="top3[0].image ? `${top3[0].image}` : defaultAvatar" @error="handleAvatarError"/>
                <TagTitle :title="top3[0].title" class="absolute translate-x-102 -translate-y-3"/>
                <RouterLink :to="{ name: 'user_page', params: { username: top3[0].username } }" class="flex items-center gap-2 mt-3">
                    <h3 class="text-xl"><b>1°</b></h3>
                    <p class="hover:underline">{{ top3[0].username }}</p>
                </RouterLink>
                <div class="flex gap-2">
                    <p class="text-green-600">{{ winRate(top3[0].stats.w, top3[0].stats.total) }}%</p>
                    su {{ top3[0].stats.total }}
                </div>
            </div>
            <div class="grid grid-rows-1 grid-cols-2" :class=" top ? '-mt-15' : '-mt-7'">
                <div v-if="top3" class="justify-items-center">
                    <p class="text-zinc-300">{{ top3[1].points }}</p>
                    <img class="size-22 rounded-full object-cover" :src="top3[1].image ? `${top3[1].image}` : defaultAvatar" @error="handleAvatarError"/>
                    <TagTitle :title="top3[1].title" class="absolute translate-x-52 -translate-y-3"/>
                    <RouterLink :to="{ name: 'user_page', params: { username: top3[1].username } }" class="flex items-center gap-2 mt-3">
                        <h3 class="text-xl"><b>2°</b></h3>
                        <p class="hover:underline">{{ top3[1].username }}</p>
                    </RouterLink>
                    <div class="flex gap-2">
                        <p class="text-green-600">{{ winRate(top3[1].stats.w, top3[1].stats.total) }}%</p>
                        su {{ top3[1].stats.total }}
                    </div>
                </div>
                <div v-if="top3" class="justify-items-center">
                    <p class="text-zinc-300">{{ top3[2].points }}</p>
                    <img class="size-22 rounded-full object-cover" :src="top3[2].image ? `${top3[2].image}` : defaultAvatar" @error="handleAvatarError"/>
                    <TagTitle :title="top3[2].title" class="absolute translate-x-52 -translate-y-3"/>
                    <RouterLink :to="{ name: 'user_page', params: { username: top3[2].username } }" class="flex items-center gap-2 mt-3">
                        <h3 class="text-xl"><b>3°</b></h3>
                        <p class="hover:underline">{{ top3[2].username }}</p>
                    </RouterLink>
                    <div class="flex gap-2">
                        <p class="text-green-600">{{ winRate(top3[2].stats.w, top3[2].stats.total) }}%</p>
                        su {{ top3[2].stats.total }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col mt-1">
            <div v-for="(p, index) in last7">
                <div class="flex items-center px-4">
                    <h3 class="ml-3" :class="{'mr-2' : index == 6, 'mr-5' : index != 6 }"><b>{{ index + 4 }}°</b></h3>
                    <div class="flex gap-2 items-center" :class=" top ? 'm-1.5' : 'm-2'">
                        <img class="size-10 rounded-full object-cover" :src="p.image ? `${p.image}` : defaultAvatar" @error="handleAvatarError"/>
                        <RouterLink :to="{ name: 'user_page', params: { username: p.username } }">
                            <p class="text-white hover:underline">{{ p.username }}</p>
                        </RouterLink>
                        <div class="flex items-center gap-1">
                            <TagTitle :title="p.title" class="mt-1"/>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <div class="flex gap-2 text-zinc-300"><p class="text-green-600">{{ winRate(p.stats.w, p.stats.total) }}%</p>su {{ p.stats.total }}</div>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <p class="text-zinc-300 text-sm">ELO: {{ p.points }}</p>
                        </div>
                    </div>
                </div>
                <hr v-if="index != 6" class="w-full justify-self-start text-[#4e4e4e8c]">
            </div>
        </div>
        <div v-if="top" class="mt-1.5">
            <hr class="text-[#4e4e4e8c] border-dashed m-1.5">
            <div class="flex items-center px-4">
                <h3 class="ml-3 mr-2"><b>Tu</b></h3>
                <div class="flex m-2 gap-2 items-center">
                    <img class="size-10 rounded-full object-cover" :src="user.image ? `${user.image}` : defaultAvatar" @error="handleAvatarError"/>
                    <RouterLink :to="{ name: 'user_page', params: { username: user.username } }">
                        <p class="text-white hover:underline">{{ user.username }}</p>
                    </RouterLink>
                    <div class="flex items-center gap-1">
                        <TagTitle :title="user.title" class="mt-1"/>
                        <p class="text-[#4e4e4e8c]">|</p>
                        <!-- <div class="flex gap-2 text-zinc-300"><p class="text-green-600">{{ winRate(user.stats.w, user.stats.total) }}%</p>su {{ user.stats.total }}</div> -->
                        <!-- <p class="text-[#4e4e4e8c]">|</p> -->
                        <p class="text-zinc-300 text-sm">ELO: {{ user.points }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>