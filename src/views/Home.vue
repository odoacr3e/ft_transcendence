<script setup>
  import MenuHeader from '../components/MenuHeader.vue'
  import MainLogo from '../components/MainLogo.vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from "../stores/auth.st";
  
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
</script>

<template>
  <MainLogo/>
  <div v-if="user">
    <h1 class="z-100 text-4xl text-white absolute">Hi {{user.username}}!</h1>
  </div>
  <MenuHeader/>
</template>

<style scoped>
</style>