<script setup>
	import BackGround from  './components/BackGround.vue';
	import AppHeader from   './components/AppHeader.vue';
</script>

<template>
	<BackGround/>
	<div class="min-h-screen flex flex-col">
		<AppHeader class="z-11"/>
		<div id="wrap" class="grow">
			<router-view/>
		</div>
	</div>
				
</template>

<style scoped>
	#wrap {
		display: grid;
		grid-template-columns: max-content max-content;
		position: relative;
		justify-content: center;
		justify-items: center;
		align-items: center;
		z-index: 10;
		font-size: 110%;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		user-select: none;
	}
</style>