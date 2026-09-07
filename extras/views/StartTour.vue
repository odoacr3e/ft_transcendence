<script setup>
	import { ref, onMounted }   from 'vue';
	import { useAuthStore }     from "../stores/auth.st";
    import { useSockStore }     from "../stores/sock.st";
	import { storeToRefs }      from 'pinia';
    import { useRoute } from 'vue-router'
	import { api }      from '@/router/api/client';
    import router       from '@/router/index.js';
    import TournamentBracket from '../components/TournamentBracket.vue';
    import IconTrophy              from '@/components/icons/IconTrophy.vue';

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
            <IconTrophy class="size-13 m-2 text-form-icon"/>
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