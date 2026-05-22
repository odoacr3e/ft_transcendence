<script setup>
    import LoggingForm from '../components/LoggingForm.vue';
</script>

<template>
    <div id="parent" class="min-h-screen flex flex-col">
        <RouterLink to="/" id="button">
            <button class="cursor-pointer"><b>⬅ Home</b></button>
        </RouterLink>
        <div id="wrap" class=" flex-1 max-xl:grid-cols-1">
            <img src="../assets/Burn-Paper.png" alt="Burned Paper" draggable="false" class="max-h-120 absolute rotate-90">
            <div class="z-11">
                <b><h1>Registrati</h1></b>
                <LoggingForm url="/auth" />
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
        background-color: #ffd230;
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

    h1 {
        margin-bottom: 20px;
        justify-self: center;
        font-size: 140%;
    }
</style>