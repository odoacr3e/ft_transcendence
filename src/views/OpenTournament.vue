<script setup>
    import { defaultAvatar, handleAvatarError } from '../scripts/Helper/CompUtils';
    import { ref, onMounted }   from 'vue';
    import { useAuthStore }     from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
    import { useRoute } from 'vue-router'
    import { authApi }  from '../router/api/auth.api';
    import { api }      from '@/router/api/client';

    const   tournament = ref(null),
            friends = ref(null),
            invites = ref([]),
            players = ref([]),
            searchUser = ref(""),
            searchList = ref(null),
			admin = ref(null),
            authStore = useAuthStore(),
            { user } = storeToRefs(authStore),
            route = useRoute()

    onMounted(async () => {
        try
        {
            friends.value = await authApi.friendlist();
            tournament.value = (await api.get(`/api/tournaments/${route.params.tournament}`)).data.tournament;

			admin.value = user.value.username === tournament.value?.created_by.username;
			players.value = tournament.value.players;

			authStore.socket.on("join_tournament", async ({resp}) => {
				if (resp.log)
					tournament.value = (await api.get(`/api/tournaments/${route.params.tournament}`)).data.tournament;
			});
        }
        catch(err) {}
    });

    function findUser(list, id_user) { return list.find(u => u.id_user === id_user); }

    async function search()
    {
        const username = searchUser.value.trim();
		if (!username) { searchList.value = null; return; }
        try {
            const temp= (await api.get(`/api/users/?username=${username}`)).data.users;
            if (!temp)
                searchList.value = null;
            searchList.value  = temp.filter((u) => u.username !== user.value?.username);
        }
        catch { searchList.value = null; }
    }

    function addToArry(user) {
	    if (findUser(players.value, user.id_user)) return;

	    const existing = findUser(invites.value, user.id_user);
	    if (existing)
	        invites.value.splice(invites.value.indexOf(existing), 1);
	    else if (invites.value.length < 7)
	        invites.value.push(user);
	}

    async function inviteUsers()
    {
        try
        {
            for (const u of invites.value.values())
            {
                await api.post("/api/notifications", 
                    {	title: "Invito ad un torneo",
                        description: ` ti ha invitato a partecipare al torneo ${tournament.value?.name}|${authStore.tourInfo.pwd}%${tournament.value.id_tournament}`,
                        id_receiver: u.id_user });
            }
        }
        catch(err) { console.log(err); }
    }

	async function startTour() {
		authStore.socket.emit('start_round');
	}
</script>

<template>
    <div class="w-full max-w-350 h-full max-h-190 rounded-3xl translate-y-7 border border-border-default bg-bg-default p-6 text-text-default shadow-2xl overflow-hidden transition-all">
        <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-13 m-2 text-form-icon">
                <path fill-rule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clip-rule="evenodd" />
            </svg>
            <h2 class="pl-2 text-4xl">{{ tournament?.name }}</h2>
        </div>
        <hr class="w-full justify-self-start text-text-last">
        <div class="flex">
            <div v-if="admin" class="border-r border-border-default">
                <div class="p-2 pr-5 mt-2 items-center w-[60vh]">
                    <h2 class="text-2xl ml-4">Invita i tuoi amici</h2>
                    <div class="p-8 grid grid-cols-4 gap-6 w-full" :class="friends?.length > 5 ? 'max-h-[25vh] overflow-y-auto' : ''">
                        <div v-for="u in friends" class="grid grid-cols-1 w-fit cursor-pointer" @click="addToArry(u.friend)" :title="u.friend.username">
                            <img :src="u.friend.image ? `${u.friend.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
                                alt="" class="size-22 rounded-t-md place-self-center object-cover bg-linear-to-t from-main-color to-bg-default">
                            <div class="py-2 grid grid-cols-1 border-border-default border-b-2 border-x-2 rounded-b-md w-full justify-items-center"
                                :class="{   'bg-bg-second' : findUser(invites, u.friend.id_user),
                                            'bg-bg-darker' : !findUser(invites, u.friend.id_user),
											'bg-bg-accept' : findUser(players, u.friend.id_user) }"> <!--FIXME - bg-accept qua non funziona...-->
                                <h3 class="text-text-default text-sm" v-if="u.friend.username.length > 8">{{ u.friend.username.slice(0, 7) + "..."}}</h3>
                                <h3 class="text-text-default text-sm" v-if="u.friend.username.length <= 8">{{ u.friend.username }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-2 pr-5 mt-1 items-center w-[60vh]">
                    <div class="flex">
                        <h2 class="text-2xl ml-4 my-1">Cerca altri utenti:</h2>
                        <form @submit.prevent="search()">
                            <input v-model="searchUser" type="search" name="searchBar" placeholder="Cerca" autocomplete="off"
                                class="justify-self-center h-10 pl-3 text-text-default border-b border-border-default" value="searchUser">
                        </form>
                    </div>
                    <div v-if="searchList" class="p-8 grid grid-cols-4 gap-6 w-full" :class="friends?.length > 5 ? 'max-h-[35vh] overflow-y-auto' : ''">
                        <div v-for="u in searchList" class="grid grid-cols-1 w-fit cursor-pointer" @click="addToArry(u)" :title="u.username">
                            <img :src="u.image ? `${u.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
                                alt="" class="size-22 rounded-t-md place-self-center object-cover bg-linear-to-t from-main-color to-bg-default">
                            <div class="py-2 grid grid-cols-1 border-border-default border-b-2 border-x-2 rounded-b-md w-full justify-items-center"
                                :class="{   'bg-bg-second' : findUser(invites, u.id_user),
                                            'bg-bg-darker' : !findUser(invites, u.id_user),
											'bg-bg-accept' : findUser(players, u.id_user) }">
                                <h3 class="text-text-default text-sm" v-if="u.username.length > 8">{{ u.username.slice(0, 7) + "..."}}</h3>
                                <h3 class="text-text-default text-sm" v-if="u.username.length <= 8">{{ u.username }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="my-4 mx-8 h-[68vh] w-full bg-bg-darker text-text-default rounded-3xl border border-border-default">
                <div class="p-4">
                    <div>
                        <div class="flex justify-between">
                            <h2 class="m-3" :class="{ 'text-3xl' : !admin, 'text-2xl' : admin }">
								Giocatori:     ({{ players.length }}/8)</h2>
                            <form v-if="admin" @submit.prevent="startTour()" method="post" enctype="application/json" class="text-text-default items-center">
                                <input id="submit" class="h-fit self-center transition-opacity w-fit p-3 m-2 mr-5 text-base bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button"
                                        type="submit" value="Inizia il torneo!" :class="{ 'opacity-100 duration-250 cursor-pointer pointer-events-auto' : players.length === 8, 'pointer-events-none opacity-0' : players.length < 8 }">
                            </form>
                        </div>
                        <div class="grid grid-cols-2 grid-rows-1" 
                            :class="{   'grid-rows-4' : players.length == 8 || players.length == 7, 
										'grid-rows-3' : players.length == 6 || players.length == 5, 
                                        'grid-rows-2' : players.length == 4 || players.length == 3 }">
                            <div v-for="p in players" class="flex m-3 items-center" :class="{ 'justify-center' : !admin }">
                                    <img :src="p.image ? `${p.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
                                        alt="" class="rounded-full object-cover mx-2" :class="{ 'size-25' : !admin, 'size-15' : admin }">
                                    <div :class="{ 'text-2xl mx-2' : !admin, 'text-md' : admin }">
                                        <p>{{ p.username }}</p>
                                        <p v-if="p.username != tournament.created_by.username">Pronto!</p>
                                        <p v-if="p.username == tournament.created_by.username">Admin</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="admin">
                        <div class="flex justify-between">
                            <h2 class="text-2xl m-3">Invitati:</h2>
                            <button @click="inviteUsers()" class="h-fit self-center transition-opacity w-25 p-2 m-2 mr-5 text-base bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button">
                                <p>Invita!</p>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 grid-rows-4">
                            <div v-for="p in invites" class="flex m-3 items-center">
                                    <img :src="p.image ? `${p.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
                                        alt="" class="size-15 rounded-full object-cover mx-2">
                                    <div>
                                        <p>{{ p.username }}</p>
                                        <p>...</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input:focus {
    outline: 0;
}
input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    cursor: pointer;
    background-image: url(" ### Inline SVG of Choice ### ");
}

input::-webkit-calendar-picker-indicator {
	display: none !important;
}
</style>