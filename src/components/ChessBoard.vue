<script setup>
	import { DOMBoard, localInfo, localPlayers, IMG_PATHS, localBoard }	from '@/scripts/Data/Variables';
	import { shopAbility,upgradeBastard }		from '@/scripts/Events/utils/GlobalUtils';
	import { onMounted, computed, ref }			from 'vue';
	import { onDragStart, onDrop }				from '@/scripts/Events/Movements';
	import { getSquareColor } 					from '@/scripts/Helper/RenderUtils';
	import { globalEvents }						from '@/scripts/Events/Global';

	const HIDDEN = new Set( ["a14", "b14", "c14", "a13", "b13", "c13", "a12", "b12", "c12",
					 "l14", "m14", "n14", "l13", "m13", "n13", "l12", "m12", "n12",
					 "a3", "b3", "c3", "a2", "b2", "c2", "a1", "b1", "c1",
					 "l3", "m3", "n3", "l2", "m2", "n2", "l1", "m1", "n1"] );

	const domBoardComputed = computed(() => DOMBoard());
	const prop = defineProps({
  	    	style: String
	    });
    onMounted(() => {
        globalEvents();
    });

	const currP = ref(localPlayers.values().find(p => p.isPlaying === true)),
		dragOver = ref(null);
</script>

<template>
    <div id="root">
		<div v-if="localInfo.goatId" id="overlay" v-bind:class="{ 'opacity-60 pointer-events-auto':localInfo.goatId }"></div>
        <div id="board" oncontextmenu="return false;" v-bind:class="{ 'boardTwo' : style === '1v1', 'boardFour' : style === '14x14x4'}">
            <div v-for="row in domBoardComputed" :key="row[0]?.id" class="grid" v-bind:class="{ 'rowTwo' : style === '1v1', 'rowFour' : style === '14x14x4'}">
                <div
                    v-for="square in row"
                    :key="square.id"
                    :id="square.id"
                    :class="[getSquareColor(square.id), 
							'square',
							{ 'opacity-0 hidden': style === '14x14x4' && HIDDEN.has(square.id) },
							{'outline-4 outline-[#e2dac5c5] -outline-offset-4': dragOver === square.id},
							{'selectedBstW': getSquareColor(square.id) == 'white' && (square.boostedHighlight && square.piece)},
							{'selectedBstB': getSquareColor(square.id) == 'black' && (square.boostedHighlight && square.piece)},
							{'selectedW': getSquareColor(square.id) == 'white' && (square.selected || square.highlight && square.piece)},
							{'selectedB': getSquareColor(square.id) == 'black' && (square.selected || square.highlight && square.piece)}]"
					v-bind:class="{ 'w-18.75 h-18.75' : style === '1v1', 'w-13 h-13' : style === '14x14x4'}"
                    @drop="onDrop($event, square); dragOver = null"
                    @dragover.prevent="dragOver = square.id;">
					<p	class="absolute"
						v-if="(parseInt(square.id.substring(1)) === 1) || 
						  	  (style === '14x14x4' && parseInt(square.id.substring(1)) === 4 &&
							  ['a', 'b', 'c', 'l', 'm', 'n'].includes(square.id.charAt(0)))"
						v-bind:class="{ 'ml-15 mt-13' : style === '1v1',
										'ml-10.25 mt-9 text-xs' : style === '14x14x4',
										'text-[#1b0000]': getSquareColor(square.id) == 'white' && !square.selected, 
										'text-white	': getSquareColor(square.id) == 'black' && !square.selected,
										'text-[#801a12]' : getSquareColor(square.id) == 'white' && square.selected,
										'text-[#bb4232]' : getSquareColor(square.id) == 'black' && square.selected }">
						<b>{{ square.id.charAt(0) }}</b>
					</p>
                    <img
                        v-if="square.piece"
                        class="piece"
						v-bind:class="{ 'boosted-aura':square.piece.isBoostedBool }"
                        :src="IMG_PATHS[square.piece.team + square.piece.type]"
                        :draggable="true"
                        @dragstart="onDragStart($event, square)"/>
					<p 	class="absolute" 
					   	v-if="(square.id.charAt(0) == 'a') ||
						 	  (style === '14x14x4' && square.id.charAt(0) == 'd' && 
							  (parseInt(square.id.substring(1)) < 4 || parseInt(square.id.substring(1)) > 11))"
						v-bind:class="{ 'mr-15 mb-13' : style === '1v1',
										'mr-10.25 mb-9.5 text-xs' : style === '14x14x4',
										'ml-1.5' : parseInt(square.id.substring(1)) > 9,
										'text-[#1b0000]':getSquareColor(square.id) == 'white' && !square.selected, 
										'text-white':getSquareColor(square.id) == 'black' && !square.selected,
										'text-[#801a12]' : getSquareColor(square.id) == 'white' && square.selected,
										'text-[#bb4232]' : getSquareColor(square.id) == 'black' && square.selected }">
						<b>{{square.id.substring(1)}}</b>
					</p>
                    <span v-if="square.highlight && !square.piece" class="highlight"
						  v-bind:class="{'w-3.75 h-3.75': style === '1v1', 'w-2.5 h-2.5': style === '14x14x4'}"></span>
                    <span v-if="square.boostedHighlight && !square.piece" class="boostedHighlight"
						  v-bind:class="{'w-3.75 h-3.75': style === '1v1', 'w-2.5 h-2.5': style === '14x14x4'}"></span>
                </div>
            </div>
			<div v-if="localInfo.goatId" id="choseMenu" class="flex absolute pointer-events-none size-75 z-14 gap-0.5 p-1.5 
					border-2 border-[#1b0000] rounded-md bg-[#fafafa] max-h-[10%]">
				<button @click="upgradeBastard('Champion')" class="rounded-md p-1 hover:bg-[#a52a2a]">
					<img :src="IMG_PATHS[currP.team + 'Champion']" alt="Champion" :draggable="false">
				</button>
				<button @click="upgradeBastard('Jester')" class="rounded-md p-1 hover:bg-[#a52a2a]">
					<img :src="IMG_PATHS[currP.team + 'Jester']" alt="Jester" :draggable="false">
				</button>
				<button @click="upgradeBastard('Minotaurus')" class="rounded-md p-1 hover:bg-[#a52a2a]">
					<img :src="IMG_PATHS[currP.team + 'Minotaurus']" alt="Minotaurus" :draggable="false">
				</button>
				<button @click="upgradeBastard('Valkirya')" class="rounded-md p-1 hover:bg-[#a52a2a]">
					<img :src="IMG_PATHS[currP.team + 'Valkirya']" alt="Valkirya" :draggable="false">
				</button>
			</div>
        </div>
		<!-- <div id="shop">
			<img src="../assets/Frame1.png" alt="" class="shrink-0 size-35 absolute bottom-[80%] z-12">
			<button class="side-button bg-amber-300 text-sm p-2.5 rounded-2xl cursor-pointer z-13 w-45"
					@click="shopAbility()">
					<b>Boost your Pieces!</b><br>
					<p style="white-space: pre-line"><i>{{ localInfo.priceSelected }}</i></p>
			</button>
		</div> -->
    </div>
</template>

<style scoped>
	div#overlay {
		opacity: 0.4;                    /* fisso, la transizione la gestisci con v-if */
		background: rgba(0, 0, 0, 0.35);
		inset: 0;
		position: fixed;
		z-index: 14;                     /* sotto al menu */
		pointer-events: auto;            /* blocca i click sotto */
		transition: opacity 0.2s ease;
}

	#shop {
		position: absolute;
		display: flex;
		flex-flow: column;
		align-items: center;
		margin-left: 5px;
		z-index: 13;
		top: 50%;
	    left: calc(50% + 300px + 16px); /* bordo destro board + gap */
	    transform: translateY(-50%); /* centrato verticalmente rispetto alla board */
	}

	#board
	{
		display: grid;
		width: fit-content;
		margin: auto;
	}

	.boardTwo {
		grid-template-rows: repeat(8, 75px);
	}

	.boardFour {
		grid-template-rows: repeat(14, 52px);
	}

	.piece
	{
		width: 100%;
		cursor: -webkit-grab;
    	user-select: none;
	}

	.piece.dragging {
		cursor: -webkit-grabbing;
	}

	.rowTwo {
		grid-template-columns: repeat(8, 75px);
	}

	.rowFour {
		grid-template-columns: repeat(14, 52px);
	}

	.square
	{
		border-collapse: collapse;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}

	.white{
		background-color: white;
	}

	.black{
		background-color: rgb(27, 0, 0);
	}

	.highlight
	{
		display: block;
		margin: auto;
		border-radius: 50%;
		background-color: brown;
	}

	.boostedHighlight
	{
		display: block;
		margin: auto;
		border-radius: 50%;
		background-color: rgb(99, 221, 0);
	}

	.selectedB
	{
		background-color: rgb(128, 26, 18);
	}

	.selectedW
	{
		background-color: rgb(187, 66, 50);
	}

	.selectedBstB
	{
		background-color: rgb(173, 187, 50);
	}

	.selectedBstW
	{
		background-color: rgb(9, 214, 19);
	}

	.boosted-aura{
		animation: auraPulse 0.4s ease-in-out infinite;
	}

	@keyframes auraPulse
	{
		0%, 100%
		{
			filter:
				drop-shadow(0 0 2px #FFD700)
				drop-shadow(0 0 6px #FFA500)
				drop-shadow(0 0 12px #FF8C00);
		}
		50%
    	{
    	    filter:
    	        drop-shadow(0 0 4px #FFD700)
    	        drop-shadow(0 0 10px #FFA500)
    	        drop-shadow(0 0 20px #FF4500)
    	}
	}
</style>