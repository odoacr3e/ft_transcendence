<script setup>
    import LinkFooter from './LinkFooter.vue';
</script>
    
<template>
    <div>
        <div class="menu mt-40 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <RouterLink to="/game">
                <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Gioca</h2></b>
            </RouterLink>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <RouterLink to="/4v4_game">
                <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Partite a 4</h2></b>
            </RouterLink>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <RouterLink to="/tournaments">
                <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Tornei</h2></b>
            </RouterLink>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Guarda</h2></b>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <!-- <RouterLink to="/playpage"> -->
                <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Statistiche</h2></b>
            <!-- </RouterLink> -->
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Codex</h2></b>
        </div>
        <LinkFooter/>
    </div>
</template>

<style scoped>

    .menu {
        cursor: pointer;
        position: relative;
        width: 960px;
        right: 0;
        transition: right 0.75s ease, width 0.75s ease, color 0.15s ease-in-out;
    }
    
    .menu:hover {
        right: 100px;
        width: 1100px;
        color: rgba(0, 0, 0, 0.5);
    }

</style>