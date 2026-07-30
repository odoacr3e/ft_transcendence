<script setup>
	import BackGround from './components/BackGround.vue';
	import AppHeader from './components/AppHeader.vue';
	import { useRoute } from 'vue-router'

	const route = useRoute();
</script>

<template>
	<BackGround/>
	<div class="min-h-screen flex flex-col overflow-hidden">
		<AppHeader class="z-11"/>
		<div class="grow wrap" :class="{ 'other' : route.name !== 'home', 'home' : route.name === 'home' }">
			<router-view/>
		</div>
	</div>	
</template>

<style scoped>
	.wrap{
		position: relative;
		align-items: center;
		z-index: 10;
		font-size: 110%;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		user-select: none;
	}

	.home {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-content: space-between;
	}

	.other {
		display: flex;
		justify-content: center;
	}
</style>