<script setup>
    import { authApi }		from '../router/api/auth.api';

    const resp = await authApi.friendlist(); //ottengo il json con tutta la lista delle amicizie
</script>

<template>
    <div>

    </div>
</template>

<style scoped>
</style>