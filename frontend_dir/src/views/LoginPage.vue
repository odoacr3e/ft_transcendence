<script setup>
    import AppHeader from '../components/AppHeader.vue';
    import LoginForm from '../components/LoginForm.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppHeader/>
        <div id="wrap" class="grow">
            <div class="flex z-2 bg-[#181715] rounded-3xl">
                <div class="p-3 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]">
                    <img :draggable="false" src="../assets/KingSketch.png" alt="">
                </div>
                <div class="p-10 flex-col mt-8 w-lg">
                    <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
                    <h1 class="text-[200%] mb-1 text-white justify-self-center">Ben tornato</h1>
                    <h4 class="text-[100%] mb-8 text-zinc-300 justify-self-center">Accedi al tuo account</h4>
                    <LoginForm/>
                    <div class="m-4 flex flex-row justify-self-center gap-4">
                        <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                        <p class="text-[80%] text-zinc-300 mt-1">oppure</p>
                        <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                    </div>
                    <div class="flex flex-col justify-self-center items-center justify-cente">
                        <a href="/auth/google_login" class="cursor-pointer w-full p-3 px-22 flex gap-2
                                text-base bg-zinc-300 rounded-[7px] text-gray-700 hover:bg-linear-to-t from-zinc-300 to-zinc-100">
                                <img src="../assets/google-icon.svg" alt="google-icon" class="size-6">
                                Continua con Google
                        </a>
						<div class="flex gap-2 mt-5 text-[80%] text-zinc-300">
							<p>Non hai ancora un account?</p>
							<RouterLink to="/register">
								<u class=" text-[#882a2a] cursor-pointer hover:text-[#af3d3d] active:text-[#d1aaaa]">Registrati</u>
							</RouterLink>
						</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* #wrap {
        display: grid;
        grid-template-columns: max-content max-content;
        position: relative;
        justify-content: center;
        justify-items: center;
        align-items: center;
        z-index: 10;
        font-size: 110%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        user-select: none;
    } */

    h1, h4 {
        font-family: "Copperplate", Times;
    }
</style>