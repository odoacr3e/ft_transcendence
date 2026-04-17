<script setup>
    import Footer from './Footer.vue'
</script>
    
<template>
    <div id="wrap">
        <b><h1 class="text-5xl mt-3 ml-2 mb-5">ChessZ</h1></b>
        <div>
            <b><h2 class="text-3xl my-3 ml-2">Gioca</h2></b>
        </div>
		<div>
            <b><h2 class="text-3xl my-3 ml-2">Tornei</h2></b>
        </div>
		<div>
            <b><h2 class="text-3xl my-3 ml-2">Guarda</h2></b>
        </div>
		<div>
            <b><h2 class="text-3xl my-3 ml-2">Statistiche</h2></b>
        </div>
        <div>
            <b><h2 class="text-3xl my-3 ml-2">Codex</h2></b>
        </div>
        <Footer/>
    </div>

</template>

<style scoped>
    #wrap {
        display: flex;
        flex-direction: column;
        color: white;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        min-height: 100vh;
        width: 220px;
        background-image: linear-gradient(-50deg, red 10%, black 65%);
    }	

</style>