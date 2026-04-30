<script setup>
  import { onMounted }            from 'vue';
  import MainLogo                 from '../components/MainLogo.vue';
  import BackGround               from '../components/BackGround.vue';
  import ChessBoard               from '../components/ChessBoard.vue';
  import { initLocalMatchState }  from '../scripts/Data/Game';

  onMounted(async () => {
    try{
      await initLocalMatchState();
    } catch (err) {
      console.log(`${err}`);
    }
  })
</script>

<template>
  <BackGround/>
  <MainLogo/>
  <ChessBoard/>
</template>

<style scoped>
</style>