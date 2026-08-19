<script setup>
	import { computed, nextTick, ref, watch }		from 'vue';
	import { localHistory }							from '@/scripts/Data/History';
	import { mainAction, turnDuration, turnLabel }	from "@/scripts/Helper/Historyutils.js"
	import { IMG_PATHS }							from '@/scripts/Data/Variables';
	
	//@ts-ignore
	const emit = defineEmits(['select']);

	const scroller = ref(null), 
					 lastTurn = computed(() => localHistory.length ? localHistory[localHistory.length - 1].turn : -1);
	const iconOf = (turn) => {
		const action = mainAction(turn);
		return (action?.piece ? IMG_PATHS[turn.team + action.piece] : null);
	}

	watch(() => localHistory.length, async () => {
		await nextTick();
		if (scroller.value)
			scroller.value.scrollTop
	})
</script>