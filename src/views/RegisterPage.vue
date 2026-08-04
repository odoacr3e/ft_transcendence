<script setup>
    import RegisterForm from '../components/RegisterForm.vue';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
</script>

<template>
    <div class="flex z-2 bg-bg-darker rounded-3xl">
        <div class="p-3 bg-bg-default rounded-l-3xl border-r border-border-default">
            <img :draggable="false" src="../assets/KingSketch.png" alt="">
        </div>
        <div class="p-10 flex-col -mt-6 w-lg">
            <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
            <h1 class="text-[200%] mb-1 text-text-default justify-self-center">{{  t('login.welcome') }}</h1>
            <RegisterForm/>
            <div class="m-5 flex flex-row justify-self-center gap-4">
                <span class="border-b border-border-default h-4 w-40"></span>
                <p class="text-[80%] text-text-second mt-1">{{ t('common.or', 2) }}</p>
                <span class="border-b border-border-default h-4 w-40"></span>
            </div>
            <div class="justify-self-center">
                <RouterLink to="/log">
                    <u><a class="text-[80%] text-main-color cursor-pointer hover:text-light-button active:text-active-button">{{ t('header.login') }}</a></u>
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