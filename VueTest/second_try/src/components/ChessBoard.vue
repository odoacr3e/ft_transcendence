<script setup>
    import { onMounted }	from 'vue';
    import { Board }		from "../scripts/Data/Board.js";
</script>

<template>
    <div id="root">
		<div id="board">
			<!-- <div v-for="row in Board">
				<div
					v-for="square in row"
        			:id="square.id"
        			:class="[square.color, 'square']"
				</div>
			</div> -->
		</div>
	</div>
</template>

<style scoped>
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
		background-color: rgb(27, 0, 0);
	}

	.highlight
	{
		width: 15px;
		height: 15px;
		display: block;
		margin: auto;
		border-radius: 50%;
		background-color: brown; /* rgba(0, 0, 0, 0.1) */;
	}
</style>