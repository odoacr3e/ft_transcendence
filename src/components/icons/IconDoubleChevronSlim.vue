<script setup>
	import { useId } from 'vue';
	defineProps({
		outline:	{ type: String, default: '#f59e0b' },	// bordo esterno
		from:		{ type: String, default: '#fbbf24' },	// inizio sfumatura
		to:			{ type: String, default: '#fde047' }	// fine sfumatura
	});

	const gradId = useId();
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
		fill="none" aria-hidden="true" focusable="false">
		<defs>
			<linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" :stop-color="from"/>
				<stop offset="50%" :stop-color="to"/>
				<stop offset="100%" :stop-color="from"/>
			</linearGradient>
		</defs>
		<g stroke-linecap="round" stroke-linejoin="round">
			<path d="M6 3.5 10.5 12 6 20.5M14 3.5 18.5 12 14 20.5"
				:stroke="outline" stroke-width="4"/>
			<path d="M6 3.5 10.5 12 6 20.5M14 3.5 18.5 12 14 20.5"
				:stroke="`url(#${gradId})`" stroke-width="2.2"/>
		</g>
	</svg>
</template>
