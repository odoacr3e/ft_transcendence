<script setup>
    // import LoggingForm from '../components/LoggingForm.vue';
    import NewLogging from '../components/NewLogging.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
         <RouterLink to="/" id="button">
            <button class="cursor-pointer"><b>⬅ Home</b></button>
        </RouterLink>
        <div id="wrap" class="grow">
            <div class="flex z-2 bg-[#181715] rounded-3xl">
                <div class="p-6 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]">
                    <img :draggable="false" src="../assets/KingSketch.png" alt="">
                </div>
                <div class="p-10 flex-col mt-20 w-lg">
                    <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
                    <h1 class="text-[200%] mb-1 text-white justify-self-center">Benvenuto</h1>
                    <h4 class="text-[100%] mb-8 text-zinc-300 justify-self-center">Accedi al tuo account</h4>
                    <NewLogging url="/auth"/>
                    <div class="m-5 flex flex-row justify-self-center gap-4">
                        <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                        <p class="text-[80%] text-zinc-300 mt-1">oppure</p>
                        <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                    </div>
                    <div class="justify-self-center">
                        <u><a class="text-[80%] text-[#882a2a] cursor-pointer">Registrati</a></u>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #button {
        display: flex;
        position: relative;
        justify-self: left;
        z-index: 12;
        padding: 8px;
        width: 90px;
        margin-left: 20px;
        margin-top: 15px;
        border-radius: 9px;
        color: white;
        background-color: #882a2a;
    }

    #wrap {
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
    }

    h1, h4 {
        font-family: "Copperplate", Times;
    }
</style>