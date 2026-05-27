<script setup>
  import { initLocalMatchState }  from '../scripts/Data/Archi';
  import { onMounted, ref }       from 'vue';
  import ChessBoard               from '../components/ChessBoard.vue';
  import PlayerInfo               from '../components/PlayerInfo.vue';

  const ready = ref(false);

  onMounted(async () => {
    try{
      await initLocalMatchState();
      ready.value = true;
    } catch (err) {
      console.log(`${err}`);
    }
  })
</script>

<template>
  <!-- <MainLogo/> -->
  <div v-if="ready" class="mt-30">
    <PlayerInfo :p="2"/>
    <ChessBoard/>
    <PlayerInfo :p="1"/>
  </div>
</template>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    min-width: fit-content;
    max-width: auto;
    max-height: auto;
  }
</style>