<script setup>
    import AppHeader            from '../components/AppHeader.vue';
    import TournamentCard       from '../components/TournamentCard.vue';
    import { ref, onMounted, computed }   from 'vue';
    import { authApi }          from '../router/api/auth.api';

    const tournaments = ref([]);

    onMounted(async () => {
        tournaments.value = await authApi.tournament();
    });

    const openTour = computed(() => tournaments.value.filter((t) => t.status === 'open'));
    const closeTour = computed(() => tournaments.value.filter((t) => t.status === 'close'));

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppHeader class="z-11"/>
        <div id="wrap" class="grow">
            <div class="flex-row z-2 bg-[#181715] text-white rounded-3xl w-[160vh] h-[85vh]">
                <h2 class=" text-4xl m-5 mb-2">Tornei
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
                    <div class="flex flex-col p-3 my-4 w-[40vh] h-[72vh] justify-center items-center">
                        <h3>Crea un nuovo torneo!</h3>
                        <p class="text-xl leading-none">+</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>