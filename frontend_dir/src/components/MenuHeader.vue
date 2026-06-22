<script setup>
    import LinkFooter from './LinkFooter.vue';
</script>
    
<template>
    <div id="wrap">
        <div class="menu mt-40 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <RouterLink to="/game">
                <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Gioca</h2></b>
            </RouterLink>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <RouterLink to="/4v4_game">
                <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Tornei</h2></b>
            </RouterLink>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Guarda</h2></b>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Statistiche</h2></b>
        </div>
        <div class="menu mt-5 relative flex place-items-center">
            <img class="absolute" src="../assets/sword2.png">
            <b><h2 class="relative text-4xl my-3 ml-2 pl-25 z-0">Codex</h2></b>
        </div>
        <LinkFooter/>
    </div>

</template>

<style scoped>
    #wrap {
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-self: right;
        align-items: start;
        color: rgb(0, 0, 0);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        min-height: 100vh;
        width: 350px;
        padding-right: 50px;
        z-index: 100;
    }

    #button {
        padding: 6px;
        padding-left: 20px;
        padding-right: 20px;
        margin: 20px;
        margin-right: -20px;
        background-color: brown;
        border-radius: 20px;
        font-size: large;
        cursor: pointer;
        align-self: end;
        transition: color 0.15s ease-in-out;
        border-width: 2px;
        border-color: rgb(0, 0, 0);
    }

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

<!-- .menu {
        width: 960px;
        animation-duration: 0.5s;
        animation-name: AnimationStop;
    }

    .menu:has(h2:hover)
    {
        animation-name: AnimationInit;
        color: rgb(0, 0, 0, 0.5);
        right: 100px;
        width: 1100px;
    }

    .menu:has(img:hover)
    {
        animation-name: AnimationInit;
        right: 100px;
        width: 1100px;
    }

    @keyframes AnimationInit {
        0%   { right:0px; width: 960px }
        100% { right:100px; width: 1100px }
    }

    @keyframes AnimationStop {
        0%   { right:100px; width: 1100px }
        100% { right:0px; width: 960px }
    } -->