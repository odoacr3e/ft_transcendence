<script setup>
	defineProps({
		stroke: { type: String, default: 'currentColor' }
	});
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"
		stroke-width="2.5" :stroke="stroke" aria-hidden="true" focusable="false">
		<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
	</svg>
</template>
