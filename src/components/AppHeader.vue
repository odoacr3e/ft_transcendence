<script setup>
	import { ref, onMounted }	from 'vue';
	import { useAuthStore }		from "../stores/auth.st";
	import { storeToRefs }		from 'pinia';
	import { useRouter }		from 'vue-router';
	import { asset }			from '../scripts/Helper/CompUtils';
	import { api }				from '../router/api/client';

	defineOptions({ inheritAttrs: false });

	const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);
	const	bool = ref(false),
			router = useRouter(),
			db = ref([]),
			searchUser = ref("");

	async function submitForm() {
        const authStore = useAuthStore();
		await authStore.logout();
		router.push('/log');
	}

	function goToUser() {
		const username = searchUser.value.trim();
		if (!username) { return; }
		searchUser.value = "";
		if (db.value.find(x => x.username === username))
			router.push(`/${encodeURIComponent(username)}`);
		else
			router.push(`/users/${encodeURIComponent(username)}`);
	}

	onMounted(async () => {
		db.value = (await api.get("/api/users")).data.users;
    });

</script>

<template>
	<datalist id="users">
		<!-- idk e' l'unico modo che ho trovato per far in modo che dopo il click sull'option questo non ricompaia -->
		<RouterLink to="/">
			<option v-for="user in db" :key="user.username" :value="user.username"></option> <!-- la key va messa per permettere a vue di indicizzare i contenuti così da midificare il DOM solo per le cose che sono cambiate --> 
		</RouterLink>
	</datalist>

	<div class="grid grid-cols-3 z-11 w-lvw h-15 bg-[#201e1c] border-b border-[#181715e8] justify-center" v-bind="$attrs">
		<RouterLink to="/" id="button" class="w-fit">
			<div class="flex justify-self-start">
				<img src="../assets/CrownIcon.png" alt="" class="place-self-center size-15 ml-3">
				<h1 class="text-white text-4xl place-self-center">ChessZ</h1>
			</div>
		</RouterLink>
		<div class="flex bg-[#302d2a] w-[150%] justify-self-center rounded-4xl h-11 self-center content-center border border-[#4e4e4e8c]">
			<img src="../assets/search.png" alt="" class="size-7 self-center ml-3">
			<form @submit.prevent="goToUser">
				<input v-model="searchUser" type="search" name="searchBar" id="searchBar" placeholder="Cerca" autocomplete="off"
					class="justify-self-center rounded-4xl h-10 w-235 pl-3 text-white"
					:list="searchUser ? 'users' : null">
			</form>
		</div>
		<div class="flex justify-self-end place-self-center" v-if="user">
			<div class="place-self-center relative">
				<div v-if="false">
					<span class="absolute inline-flex ml-5.5 h-3 w-3 animate-ping rounded-full bg-[#c41c1c] opacity-75"></span>
					<span class="absolute justify-self-end ml-5.5 size-3 rounded-full bg-[#c41c1c]"></span>
				</div>
				<img src="../assets/bell.png" alt="" class="mr-3 size-9 place-self-center">
			</div>
			<div class="relative w-fit">
				<button class="flex cursor-pointer mr-1" @click="bool = !bool">
					<h2 class="text-white text-lg place-self-center mr-3">{{ user.username }}</h2>
					<img :src="user.image ? asset(`${user.image}`) : asset('../assets/default.png')"
						alt="" class="size-12 rounded-full place-self-center">
				</button>
				<div class="mt-1.25 p-2 absolute right-0 pointer-events-auto bg-[#181715] origin-top align-bottom border border-[#181715e8] min-w-full transition-all ease-out"
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

	input:focus {
		outline: 0;
	}

	input[type="search"]::-webkit-search-cancel-button {
	    -webkit-appearance: none;
	    cursor: pointer;
	    background-image: url(" ### Inline SVG of Choice ### ");
	}
	input::-webkit-calendar-picker-indicator {
		display: none !important;
	}
</style>