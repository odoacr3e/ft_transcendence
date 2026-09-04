<script setup>
	import TournamentCard       from '../components/TournamentCard.vue';
	import { ref, onMounted, computed } from 'vue';
	import { useAuthStore } from "../stores/auth.st";
	import { useTourStore } from "../stores/tour.st";
	import { storeToRefs }  from 'pinia';
	import { useI18n }		from 'vue-i18n';
	import { taskApi }      from '../router/api/task.api';
	import router from '@/router/index.js';
	import IconTrophy              from '@/components/icons/IconTrophy.vue';
	
    const	{ t } = useI18n(),
			tournaments = ref([]),
			error = ref(null),
			authStore = useAuthStore(),
			tourStore = useTourStore(),
			{ user } = storeToRefs(authStore),
			formData = ref({
				name: '',
				id_creator: user.value.id_user,
			});
		   

	onMounted(async () => {
		try {
			tournaments.value = await taskApi.tournament();
		}
		catch{}
	});

	const openTour = computed(() => tournaments.value.filter((t) => t.status === 'open' || t.status === 'ongoing' ));
	const closeTour = computed(() => tournaments.value.filter((t) => t.status === 'closed'));

	async function submitFirstForm()
	{
		if (!formData.value.name.length || formData.value.name.includes('%') || formData.value.name.includes('|')) { error.value = true; return; }

		const resp = await tourStore.createTour(formData.value.name);
		if (resp)
			router.push({
				name: "open_tournament",
				params: { tournament: tourStore.id }
				});
		else { error.value = true; }
	}
</script>

<template>
	<div class="flex-row z-2 bg-bg-darker text-text-default rounded-3xl w-[160vh] h-[85vh]">
		<h2 class="text-4xl m-5 mb-2">{{ t('common.tournament', 2) }}
			<hr class="w-full text-text-last my-2">
		</h2>
		<div class="flex m-3">
			<div>
				<div class="p-3 my-2 mb-4 mx-2 w-[120vh] h-[36vh] bg-bg-default rounded-3xl border border-border-default">
					<h3 class=" text-2xl m-2 ">{{ t('tournaments.ongoing') }}</h3>
					<div v-if="openTour.length"  class="flex gap-4 h-65"
						:class="openTour.length > 2 ? 'overflow-x-scroll snap-x snap-mandatory scroll-smooth pb-2 scrollbar-custom' : ''">
						<TournamentCard :tournaments="openTour"/>
					</div>
					<p v-if="!openTour.length" class="flex h-[80%] w-full items-center justify-center text-center">{{ t('tournaments.noTour') }}</p>
				</div>
				<div class="p-3 my-2 mt-4 mx-2 w-[120vh] h-[36vh] bg-bg-default rounded-3xl border border-border-default">
					<h3 class=" text-2xl m-2">{{ t('tournaments.closed') }}</h3>
					<div v-if="closeTour.length" class="flex gap-4 h-65"
						:class="closeTour.length > 2 ? 'overflow-x-scroll snap-x snap-mandatory scroll-smooth pb-2 scrollbar-custom' : ''">
						<TournamentCard :tournaments="closeTour"/>
					</div>
					<p v-if="!closeTour.length" class="flex h-[80%] w-full items-center justify-center text-center">{{ t('tournaments.noTour') }}</p>
				</div>
			</div>
			<div class="flex flex-col p-3 my-4 w-[40vh] h-[72vh] justify-center">
				<form @submit.prevent="submitFirstForm" method="post" enctype="application/json" class="flex flex-col text-text-default items-center">
					<IconTrophy class="size-10 m-2 text-form-icon transition-colors" :class="{ 'text-text-error': error }"/>
					<h3 class="text-xl">{{ t('tournaments.newTour') }}</h3>
					<input :placeholder="t('tournaments.placeholder')" size="12" class="text-xl m-1 text-center w-50 border-b border-border-default" type="text" v-model="formData.name"
						:class="{ 'animate-shake': error }" @animationend="error = false">
					<input id="submit" class="cursor-pointer h-fit self-center w-25 p-2 m-2 text-base bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button"
					type="submit" :value="t('tournaments.button')">
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