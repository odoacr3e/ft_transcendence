<script setup>
    import { useAuthStore } from "../stores/auth.st";

    const authStore = useAuthStore(),
          prop = defineProps({
  	    	user_id: Number
	    });
</script>

<template>
    <span class="rounded-full absolute size-3 ml-9.5 mt-9.5"
            v-bind:class="{ 'bg-green-500' : authStore.isUserOnline(prop.user_id) ,
                            'bg-red-500' : !authStore.isUserOnline(prop.user_id) }"></span>
</template>

<style scoped>
</style>