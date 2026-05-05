<script setup>
  import { initLocalMatchState }  from '../scripts/Data/Archi';
  import { onMounted }            from 'vue';
  import ChessBoard               from '../components/ChessBoard.vue';
  import MainLogo                 from '../components/MainLogo.vue';

  onMounted(async () => {
    try{
      await initLocalMatchState();
    } catch (err) {
      console.log(`${err}`);
    }
  })
</script>

<template>
  <MainLogo/>
  <ChessBoard/>
</template>

<style scoped>
</style>