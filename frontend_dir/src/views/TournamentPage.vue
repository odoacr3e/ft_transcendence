<script setup>
	import TournamentCard       from '../components/TournamentCard.vue';
	import { ref, onMounted, computed } from 'vue';
	import { useAuthStore } from "../stores/auth.st";
	import { storeToRefs }  from 'pinia';
	import { authApi }      from '../router/api/auth.api';
	import { api }          from '../router/api/client'
	import router from '@/router/index.js';

	const   tournaments = ref([]),
			error = ref(null),
			authStore = useAuthStore(),
			{ user } = storeToRefs(authStore),
			formData = ref({
				name: '',
				id_creator: user.value.id_user,
			});
		   

	onMounted(async () => {
		tournaments.value = await authApi.tournament();
	});

	const openTour = computed(() => tournaments.value.filter((t) => t.status === 'open'));
	const closeTour = computed(() => tournaments.value.filter((t) => t.status === 'close'));

	async function submitFirstForm()
	{
		// if (formData.value.name.includes('%') || formData.value.name.includes('|')) { error.value = true; return; }

		// if (authStore.createTour(formData.value.name))
		// 	router.push({
		// 		name: "open_tournament",
		// 		params: { tournament: resp.data.tournament.id_tournament }
		// 		});
		// else { error.value = true; }
		
		const fd = {};

		fd.name = formData.value.name;
		fd.id_creator = formData.value.id_creator;

		try
		{
		    const resp = await api.post("/api/tournaments", fd);
		    if (resp.status === "success")
		    {
		        router.push({
		        name: "open_tournament",
		        params: { tournament: resp.data.tournament.id_tournament }
		        });
		    }
		    else { error.value = true; }
		}
		catch (err) { error.value = true; }
	}
</script>

<template>
	<div class="flex-row z-2 bg-[#181715] text-white rounded-3xl w-[160vh] h-[85vh]">
		<h2 class="text-4xl m-5 mb-2">Tornei
			<hr class="w-full text-[#4e4e4e8c] my-2">
		</h2>
		<div class="flex m-3">
			<div>
				<div class="p-3 my-2 mb-4 mx-2 w-[120vh] h-[36vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
					<h3 class=" text-2xl m-2 ">In corso...</h3>
					<div v-if="openTour.length" class="flex" :class="openTour.length > 5 ? 'max-w-[155vh] overflow-x-auto' : ''">
						<TournamentCard :tournaments="openTour"/>
					</div>
					<p v-if="!openTour.length" class="flex h-[80%] w-full items-center justify-center text-center">Nessun torneo</p>
				</div>
				<div class="p-3 my-2 mt-4 mx-2 w-[120vh] h-[36vh] bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
					<h3 class=" text-2xl m-2">Conclusi</h3>
					<div v-if="closeTour.length" class="flex" :class="closeTour.length > 2 ? 'max-w-115 overflow-x-auto' : ''">
						<TournamentCard :tournaments="closeTour"/>
					</div>
					<p v-if="!closeTour.length" class="flex h-[80%] w-full items-center justify-center text-center">Nessun torneo</p>
				</div>
			</div>
			<div class="flex flex-col p-3 my-4 w-[40vh] h-[72vh] justify-center">
				<form @submit.prevent="submitFirstForm" method="post" enctype="application/json" class="flex flex-col text-white items-center">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10 m-2 text-[#c7c7c7] transition-colors" :class="{ 'text-red-100': error }">
						<path fill-rule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clip-rule="evenodd" />
					</svg>
					<h3 class="text-xl">Crea un nuovo torneo!</h3>
					<input placeholder="Nome del torneo" size="12" class="text-xl m-1 text-center" type="text" v-model="formData.name"
						:class="{ 'animate-shake': error }" @animationend="error = false">
					<input id="submit" class="cursor-pointer h-fit self-center w-25 p-2 m-2 text-base bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]"
					type="submit" value="Crea">
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
	input:focus {
		outline: 0;
	}
</style>