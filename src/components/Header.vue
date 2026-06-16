<script setup>
	import { storeToRefs } from 'pinia';
	import { useAuthStore } from "../stores/auth.st";
	import { useRouter }	from 'vue-router';
	import { ref } from 'vue';
	const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);
	const	bool = ref(false),
			router = useRouter();

	function asset(path) {
		return new URL(path, import.meta.url).href;
	}

	async function submitForm() {
        const authStore = useAuthStore();
		await authStore.logout();
		router.push('/log');
	}
</script>

<template>
	<div class="grid grid-cols-2 z-10 w-lvw h-15 bg-[#201e1c] border-b border-[#181715e8]">
		<RouterLink to="/" id="button" class="w-fit">
			<div class="flex justify-self-start">
				<img src="../assets/CrownIcon.png" alt="" class="place-self-center size-15 ml-3">
				<h1 class="text-white text-4xl place-self-center">ChessZ</h1>
			</div>
		</RouterLink>
		<div class="flex justify-self-end place-self-center mr-1" v-if="user">
			<div class="place-self-center relative">
				<div v-if="false">
					<span class="absolute inline-flex ml-5.5 h-3 w-3 animate-ping rounded-full bg-[#c41c1c] opacity-75"></span>
					<span class="absolute justify-self-end ml-5.5 size-3 rounded-full bg-[#c41c1c]"></span>
				</div>
				<img src="../assets/bell.png" alt="" class="mr-3 size-9 place-self-center">
			</div>
			<div>
				<button class="flex cursor-pointer" @click="{bool = !bool;}">
					<h2 class="text-white text-lg place-self-center mr-3">{{ user.username }}</h2>
					<img :src="user.image ? asset(`${user.image}`) : asset('../assets/default.png')"
						alt="" class="size-12 rounded-full place-self-center">
				</button>
				<div class="mt-1.25 p-2 absolute pointer-events-auto bg-[#181715] origin-top align-bottom border border-[#181715e8] w-52.5 transition-all ease-out"
					v-bind:class="{'scale-y-0 pointer-events-none border-0': !bool, 'scale-y-100 pointer-events-auto': bool}">
					<RouterLink to="/me" id="button">
						<p class="text-white">Profilo</p>
					</RouterLink>
					<hr>
					<button @click="submitForm()" class="cursor-pointer text-[#f1f5f7]">Logout</button>
				</div>
			</div>
		</div>
		<div v-if="user === null" class="justify-self-end place-self-center">
		<RouterLink to="/log" class="flex mr-3">
            <button class="flex cursor-pointer w-25 justify-center p-2 text-base bg-[#882a2a] rounded-[7px] text-white 
                            hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]">Accedi</button>
        </RouterLink>
		</div>
	</div>
</template>

<style scoped>
	h1 {
		font-family: "Copperplate", Times;
	}
</style>