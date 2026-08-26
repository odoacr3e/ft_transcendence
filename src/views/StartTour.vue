<script setup>
	import { ref, onMounted }   from 'vue';
	import { useAuthStore }     from "../stores/auth.st";
    import { useSockStore }     from "../stores/sock.st";
	import { storeToRefs }      from 'pinia';
    import { useRoute } from 'vue-router'
	import { api }      from '@/router/api/client';
    import router       from '@/router/index.js';
    import TournamentBracket from '../components/TournamentBracket.vue';

	const   tournament = ref(null),
            players = ref([]),
			admin = ref(null),
            rounds = ref(null),
			authStore = useAuthStore(),
            sockStore = useSockStore(),
            { user } = storeToRefs(authStore),
			route = useRoute();

	onMounted(async () => {
        try
        {
            tournament.value = (await api.get(`/api/tournaments/${route.params.tournament}`)).data.tournament;
			admin.value = user.value.username === tournament.value?.created_by.username;
			players.value = tournament.value.players;
            rounds.value = (await api.get(`/api/tournament/retriveTournamentMatches`));
            console.log(rounds.value);

			sockStore.socket.on('update_tournament', (resp) => {
                console.log(resp);
                // if (!resp.log) 
                //     rounds.vale = resp.msg;
            });
        }
        catch(err) {console.log(err);}
    });

    async function startGames()
    {
        try{
			const resp = (await sockStore.socket.emitWithAck("start_round", { DEBUG: true }));
            console.log(resp);
            console.log("oky doky start!");
			if (resp.log.msg == "OK")
                router.push({ name: "game" });
		}
		catch(err) {console.log(err);}
    }
</script>

<template>
	<div class="w-full max-w-[80vw] h-full max-h-[90vh] rounded-3xl border border-border-default bg-bg-darker p-6 text-text-default shadow-2xl overflow-hidden transition-all">
        <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-13 m-2 text-form-icon">
                <path fill-rule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clip-rule="evenodd" />
            </svg>
            <h2 class="pl-2 text-4xl">{{ tournament?.name }}</h2>
        </div>
        <hr class="w-full justify-self-start text-text-last">
        <div class="max-w-[80vw] h-full max-h-[75vh] flex my-4 mx-8 p-3 bg-bg-default text-text-default rounded-3xl border border-border-default justify-start overflow-auto">
            <TournamentBracket :players="players"/>
            <button v-if="admin" @click="startGames()" class="absolute bottom-30 right-80 h-fit 
                    self-center transition-opacity w-64 px-8 py-3 m-2 mr-5 text-xl bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button">
                <p>Dai il via ai giochi!</p>
            </button>
        </div>
    </div>
</template>

<style scoped>
</style>