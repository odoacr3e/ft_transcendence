<script setup>
	import { DOMBoard, getSquareColor }	from '@/scripts/Global/Variables';
	import { onMounted, computed }		from 'vue';
	import { onDragStart, onDrop }		from '@/scripts/Events/Movements';
	import { globalEvents } 			from '@/scripts/Events/Global';
	import { IMG_PATHS }				from '@/scripts/Helper/Constants';

	const domBoardComputed = computed(() => DOMBoard());

    onMounted(() => {
        globalEvents()
    })
</script>

<template>
    <div id="root">
        <div id="board" oncontextmenu="return false;">
            <div v-for="row in domBoardComputed" :key="row[0].id" class="squareRow">
                <div
                    v-for="square in row"
                    :key="square.id"
                    :id="square.id"
                    :class="[getSquareColor(square.id), 'square']"
                    @drop="onDrop($event, square)"
                    @dragover.prevent>
                    <img
                        v-if="square.piece"
                        class="piece"
                        :src="IMG_PATHS[square.piece.team + square.piece.type]"
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
		background-color: brown;
	}
</style>