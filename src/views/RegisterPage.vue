<script setup>
    import RegisterForm from '../components/RegisterForm.vue';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
</script>

<template>
    <div class="flex z-2 bg-[#181715] rounded-3xl">
        <div class="p-3 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]">
            <img :draggable="false" src="../assets/KingSketch.png" alt="">
        </div>
        <div class="p-10 flex-col -mt-6 w-lg">
            <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
            <h1 class="text-[200%] mb-1 text-white justify-self-center">{{  t('login.welcome') }}</h1>
            <RegisterForm/>
            <div class="m-5 flex flex-row justify-self-center gap-4">
                <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                <p class="text-[80%] text-zinc-300 mt-1">{{ t('common.or', 2) }}</p>
                <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
            </div>
            <div class="justify-self-center">
                <RouterLink to="/log">
                    <u><a class="text-[80%] text-[#882a2a] cursor-pointer hover:text-[#af3d3d] active:text-[#d1aaaa]">{{ t('header.login') }}</a></u>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
    h1, h4 {
        font-family: "Copperplate", Times;
    }
</style>