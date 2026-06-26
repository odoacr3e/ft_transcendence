<script setup>
import Header from '@/components/Header.vue';
import ChessBoard from '@/components/ChessBoard.vue';
// size degli square = size-14

  import { initLocalMatchState }  from '../scripts/Data/Archi';
  import { onMounted, ref }       from 'vue';

  const ready = ref(false);
  const style = ref("14x14x4");

  onMounted(async () => {
    try{
      await initLocalMatchState(style.value);
      ready.value = true;
    } catch (err) {
      console.log(`${err}`);
    }
  })
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <Header class="z-11"/>
        <div id="wrap" class="grow">
            <div class="flex z-2 bg-[#181715] rounded-3xl">
                <div class="p-6 bg-[#201e1c] rounded-l-3xl border-r border-[#4e4e4e8c]">
                    <ChessBoard :style="style"/>
                </div>
                <div class="p-10 flex-col mt-20 w-lg">
                    <img :draggable="false" src="../assets/CrownIcon.png" alt="" class="w-30 justify-self-center">
                    <h1 class="text-[200%] mb-1 text-white justify-self-center">Ben tornato</h1>
                    <h4 class="text-[100%] mb-8 text-zinc-300 justify-self-center">Accedi al tuo account</h4>
                    
                    <div class="m-5 flex flex-row justify-self-center gap-4">
                        <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                        <p class="text-[80%] text-zinc-300 mt-1">oppure</p>
                        <span class="border-b border-[#4e4e4e8c] h-4 w-40"></span>
                    </div>
                    <div class="justify-self-center">
                        <RouterLink to="/register">
                            <u><a class="text-[80%] text-[#882a2a] cursor-pointer hover:text-[#af3d3d] active:text-[#d1aaaa]">Registrati</a></u>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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