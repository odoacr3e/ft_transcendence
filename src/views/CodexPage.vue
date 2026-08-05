<script setup>
    import { ref, onMounted }   from 'vue';
    import { api }  from '../router/api/client';

    const   select = ref(0),
            on = ref(false),
            bool = ref(false),
            database = ref([]);

    onMounted(async () => {
        try{
            const resp = await api.get("/api/pieces");
            if (resp.status == "success")
                database.value = resp.data.pieces;

            console.log(database.value);
        }
        catch(err) {}
    });

</script>

<template>
    <div class="flex z-2 bg-bg-darker rounded-3xl">
        <div class="bg-bg-darker rounded-l-3xl flex flex-col gap-7 justify-center" @click="on = true; bool = false;">
            <span class="text-text-default text-xl my-0">⫘⫘⫘</span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 5;" :class="select == 5 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/pawn.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 4;" :class="select == 4 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/knight.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 3;" :class="select == 3 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/rook.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 2;" :class="select == 2 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/bishop.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 1;" :class="select == 1 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/queen.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 0;" :class="select == 0 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/king.png" alt="" class="size-20"></span>
            <span class="text-text-default text-xl my-0">⫘⫘⫘</span>
        </div>
        <div class="bg-bg-default flex flex-col w-lg relative overflow-hidden">
            <div class="flex flex-col m-9 mb-0.5 relative z-11">
                <h2 class="text-text-default text-4xl font-semibold">{{ database[select]?.name }}</h2>
                <p class="text-text-third italic">"Bianco o Nero" mi chiedono. Ho meglio da fare</p>
                <hr class="w-full justify-self-start text-text-last my-4">
                <p class="text-text-second" @animationend="on = false" :class="on ? 'fade-in' : ''">{{ database[select]?.lore }}</p>
            </div>
            <div class="bg-bg-default mt-auto p-6 justify-center border-t rounded-t-3xl border-border-default overflow-hidden absolute bottom-0 w-full z-12 inset-shadow-bg-darker inset-shadow-2xs">
                <div class="grid transition-all duration-300 ease-in-out" :class="bool ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                    <div class="overflow-hidden">
                        <div class="py-3 pt-1">
                            <h2 class="text-text-default text-2xl font-semibold">Come si muove</h2>
                            <p class="text-text-second">{{ database[select]?.info }}</p>
                        </div>
                        <hr class="w-full justify-self-start text-text-last my-4">
                        <div class="py-3 mb-2">
                            <h2 class="text-text-default text-2xl font-semibold">La sua abilità - {{ database[select]?.abilities.name }}</h2>
                            <p class="text-text-second">{{ database[select]?.abilities.description }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-center" @click="bool = !bool">
                    <svg class="text-text-default self-center size-8 transition-transform duration-200" :class="{ 'rotate-180': !bool }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="text-text-default text-2xl font-semibold">Le sue abilità</h2>
                </div>
            </div>
        </div>
        <div class="bg-bg-darker rounded-r-3xl border-l border-border-default py-7">
            <img :draggable="false" src="../assets/KingSketch.png" alt="" class="mx-3.5 scale-100">
        </div>
    </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 400ms ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 20%;
    transform: translatex(-10px);
  }
  to {
    opacity: 1;
    transform: translatex(0);
  }
}
</style>