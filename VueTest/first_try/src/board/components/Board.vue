<script setup>
    import { onMounted }        from 'vue';
    import { Board } 		    from "../composable/Data/data.js";
    import { initGamerenderer } from "../composable/Renderer/render.js";
    import { globalEvents } 	from "../composable/Events/global.js";

    onMounted(() => {
        initGamerenderer(Board)
        globalEvents()
    })
</script>

<template>
    <div id="root">
		<div id="board"></div>
	</div>
</template>

<style scoped>
</style>


<!-- body{
	background-color: #302e2b;
}

#board
{
	display: grid;
	grid-template-rows: repeat(8, 75px);
	width: fit-content;
	margin: auto;
	margin-top: 10%;
}

.piece
{
	width: 100%;
	cursor: pointer;
}

.squareRow
{
	display: grid;
	grid-template-columns: repeat(8, 75px);
}

.square
{
	width: 75px;
	height: 75px;
	display: flex;
	align-items: center;
	justify-content: center;
	
}

.white{
	background-color: white;
}

.black{
	background-color: black;
}

.highlight
{
	width: 15px;
	height: 15px;
	display: block;
	margin: auto;
	border-radius: 50%;
	background-color: brown; /* rgba(0, 0, 0, 0.1) */;
} -->