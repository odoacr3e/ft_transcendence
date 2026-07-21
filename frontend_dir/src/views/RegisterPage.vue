<script setup>
    import RegisterForm from '../components/RegisterForm.vue';
</script>

<template>
    <div class="flex z-2 bg-[#181715] rounded-3xl">
        <div class="p-6 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]">
            <img :draggable="false" src="../assets/KingSketch.png" alt="">
        </div>
        <div class="p-10 flex-col w-lg">
            <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
            <h1 class="text-[200%] mb-1 text-white justify-self-center">Benvenuto!</h1>
            <RegisterForm/>
            <div class="m-5 flex flex-row justify-self-center gap-4">
                <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                <p class="text-[80%] text-zinc-300 mt-1">oppure</p>
                <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
            </div>
            <div class="justify-self-center">
                <RouterLink to="/log">
                    <u><a class="text-[80%] text-[#882a2a] cursor-pointer hover:text-[#af3d3d] active:text-[#d1aaaa]">Accedi</a></u>
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