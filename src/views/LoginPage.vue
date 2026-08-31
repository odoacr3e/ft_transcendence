<script setup>
    import LoginForm from '../components/LoginForm.vue';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
</script>

<template>
    <div class="flex z-2 bg-bg-darker max-md:overflow-y-scroll md:rounded-3xl">
        <div class="p-3 bg-bg-default rounded-l-3xl border-r border-border-default max-lg:hidden">
            <img :draggable="false" src="../assets/KingSketch.png" alt="">
        </div>
        <div class="flex-col justify-center
                    max-md:h-screen max-md:w-screen max-md:pt-15 max-md:px-5
                    md:mt-8 md:w-lg md:p-10">
            <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="justify-self-center max-md:size-22 md:size-30">
            <h1 class="text-text-default justify-self-center text-[200%] md:mb-1">{{ t('login.wellback') }}</h1>
            <h4 class="text-text-second justify-self-center max-md:text-[100%] max-md:mb-6 md:text-[110%] md:mb-8">{{ t('login.loginAcc') }}</h4>
            <LoginForm/>
            <div class="flex flex-row justify-self-center max-md:gap-2 max-md:m-2 md:gap-4 md:m-4">
                <span class="border-b border-border-default max-md:h-3.5 max-md:w-[36.5vw] md:h-4 md:w-40"></span>
                <p class="max-md:text-[70%] md:text-[80%] text-text-second mt-1">{{ t('common.or', 2) }}</p>
                <span class="border-b border-border-default max-md:h-3.5 max-md:w-[36.5vw] md:h-4 md:w-40"></span>
            </div>
            <div class="flex flex-col justify-self-center items-center">
                <a href="/auth/google_login" class="flex cursor-pointer bg-zinc-300 rounded-[7px] text-gray-700 hover:bg-linear-to-t from-zinc-300 to-zinc-100 justify-center
                        max-md:w-[80vw] max-md:min-w-50 max-md:text-sm max-md:p-3 max-md:px-0 max-md:gap-2 max-md:whitespace-nowrap
                        md:w-full md:text-base md:p-3 md:px-22 md:gap-2">
                        <img src="../assets/google-icon.svg" alt="google-icon" class="max-md:size-5 md:size-6">
                        <p>{{ t('login.google') }}</p>
                </a>
				<div class="flex gap-2 mt-5 max-md:text-[70%] md:text-[80%] text-text-second">
					<p>{{ t('login.missingAcc') }}</p>
					<RouterLink to="/register">
						<u class="text-main-color cursor-pointer hover:text-light-button active:text-active-button">{{ t('login.signIn') }}</u>
					</RouterLink>
				</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    h1, h4 {
        font-family: "Copperplate", Times;
    }
</style>