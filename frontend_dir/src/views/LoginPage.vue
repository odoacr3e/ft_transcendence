<script setup>
    import LoginForm from '../components/LoginForm.vue';
</script>

<template>
    <div class="flex z-2 bg-bg-darker rounded-3xl">
        <div class="p-3 bg-bg-default rounded-l-3xl border-r border-border-second">
            <img :draggable="false" src="../assets/KingSketch.png" alt="">
        </div>
        <div class="p-10 flex-col mt-8 w-lg">
            <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
            <h1 class="text-[200%] mb-1 text-text-default justify-self-center">Ben tornato</h1>
            <h4 class="text-[100%] mb-8 text-text-second justify-self-center">Accedi al tuo account</h4>
            <LoginForm/>
            <div class="m-4 flex flex-row justify-self-center gap-4">
                <span class="border-b border-border-second h-4 w-40"></span>
                <p class="text-[80%] text-text-second mt-1">oppure</p>
                <span class="border-b border-border-second h-4 w-40"></span>
            </div>
            <div class="flex flex-col justify-self-center items-center justify-cente">
                <a href="/auth/google_login" class="cursor-pointer w-full p-3 px-22 flex gap-2
                        text-base bg-zinc-300 rounded-[7px] text-gray-700 hover:bg-linear-to-t from-zinc-300 to-zinc-100">
                        <img src="../assets/google-icon.svg" alt="google-icon" class="size-6">
                        Continua con Google
                </a>
				<div class="flex gap-2 mt-5 text-[80%] text-text-second">
					<p>Non hai ancora un account?</p>
					<RouterLink to="/register">
						<u class=" text-main-color cursor-pointer hover:text-light-button active:text-active-button">Registrati</u>
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