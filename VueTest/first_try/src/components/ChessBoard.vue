<script setup>
    import { onMounted }	from 'vue';
    import { Board }		from "../scripts/Data/data.js";
    import { movePiece }	from "../scripts/Renderer/render.js";
    import { globalEvents }	from "../scripts/Events/global.js";

	function onDragStart(event, square) {
	  event.dataTransfer.setData('pieceId', `piece-${square.id}`)
	  event.dataTransfer.setData('fromSquareId', square.id)
	}

	function onDrop(event, toSquare) {
	  event.preventDefault()
	  if (toSquare.piece) return  // casa occupata

	  const fromSquareId = event.dataTransfer.getData('fromSquareId')
	  movePiece(fromSquareId, toSquare.id, Board)
	}

    onMounted(() => {
        globalEvents()
    })
</script>

<template>
    <div id="root">
		<div id="board">
			<div v-for="row in Board" class="squareRow">
				<div
					v-for="square in row"
        			:id="square.id"
        			:class="[square.color, 'square']"
        			@drop="onDrop($event, square)"
        			@dragover.prevent>
					<img
						v-if="square.piece"
						class="piece"
						:src="square.piece.img"
						:draggable="true"
						@dragstart="onDragStart($event, square)"/>
					<span v-if="square.highlight" class="highlight"></span>
				</div>
			</div>
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