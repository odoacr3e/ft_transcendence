<script setup>
	import BackGround from './components/BackGround.vue';
	import AppHeader from './components/AppHeader.vue';
	import LinkFooter from './components/LinkFooter.vue';
	import { useAuthStore } from './stores/auth.st.js';
	import { storeToRefs }	from 'pinia';
	import { useRoute } from 'vue-router'
	import { watch, onMounted, onUnmounted } from 'vue'
	import { playAudio } from './scripts/Helper/generalUtils.js';

	const	route = useRoute();

	function useTheme() {
		const authStore = useAuthStore();
		const { user } = storeToRefs(authStore);
 		watch( () => user.value?.preferences?.name, (newTheme) => {
				document.documentElement.setAttribute('data-theme', newTheme ?? 'default');
				localStorage.setItem('data-theme', newTheme ?? 'default');
			},
			{ immediate: true }
		);
	}

	useTheme();

	//NOTE - un solo listener in capture su tutto il documento suona il tap su ogni bottone
	//dell'app: scatta scendendo verso il bottone, prima che un @click.stop dei componenti
	//possa fermare l'evento. Le voci di menu sono router-link, cioe' <a>, per questo sono
	//nel selettore. data-no-tap su un elemento o su un suo contenitore lo zittisce.
	function tap(event)
	{
		if (event.target?.closest?.("button, a, [role='button']") && !event.target.closest("[data-no-tap]"))
			playAudio("tap");
	}

	onMounted(() => document.addEventListener("click", tap, true));
	onUnmounted(() => document.removeEventListener("click", tap, true));
</script>

<template>
	<BackGround/>
	<div class="min-h-screen flex flex-col overflow-hidden">
		<AppHeader/>
		<div class="grow wrap" :class="{ 'other' : route.name !== 'home', 'home lg:grid lg:justify-between max-lg:justify-center max-lg:flex' : route.name === 'home' }">
			<router-view/>
		</div>
	</div>
	<LinkFooter class="z-11 justify-self-center"/>
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
		grid-template-columns: 1fr 1fr;
	}

	.other {
		display: flex;
		justify-content: center;
		margin-top: -10px;
	}
</style>