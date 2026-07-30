<script setup>
	import { ref, onMounted, onBeforeUnmount }	from 'vue';
	import { rework_date, defaultAvatar, handleAvatarError }	from '../scripts/Helper/CompUtils';
	import { useAuthStore }	from "../stores/auth.st";
	import { storeToRefs }	from 'pinia';
	import { useRouter }	from 'vue-router';
	import { api }			from '../router/api/client';

	defineOptions({ inheritAttrs: false });

	const authStore = useAuthStore();
	const { user } = storeToRefs(authStore);
	const	p_bool = ref(false),
			n_bool = ref(false),
			popUp = ref(false),
			tourOpen = ref(null),
			router = useRouter(),
			db = ref([]),
			searchUser = ref(""),
			p_dropdown = ref(null),
			n_dropdown = ref(null);

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

	function handleClickOutside(e) {
		if (p_dropdown.value && !p_dropdown.value.contains(e.target))
			p_bool.value = false;

		if (n_dropdown.value && !n_dropdown.value.contains(e.target))
			n_bool.value = false;
	}

	async function readMsg(msg)
	{
		if (msg.status === "not_read")
		{
			msg.status = 'read';
			try
			{ await api.patch("/api/notifications", { id_notification: Number(msg.id_notification) }); }
			catch(err) { console.log(err); }
		}
	}

	async function fetchTour(msg) {
		try
        {
            tourOpen.value = (await api.get(`/api/tournaments/${msg.description.slice(msg.description.indexOf('%') + 1)}`)).data.tournament;
			if (!tourOpen.value) { tourOpen.value = null; }
        }
        catch(err) { tourOpen.value = null; }
		tourOpen.value.msg = msg;
	}

	async function accpetInvite() {
		// authStore.socket.emit("join_tournament", 
		// 	{ tournament_pwd: tourOpen.value.msg.description.slice(tourOpen.value.msg.description.indexOf('|') + 1, tourOpen.value.msg.description.indexOf('%')) }, 
		// 	(resp) => { 
		// 		if (resp.log)
		// 			closePopup();
		// 			router.push(`/tournament/${tourOpen.value.id_tournament}`);
		// 	});

		//solo per test
		try {
			await api.post("/api/tournaments/addPlayers", {id_tournament: tourOpen.value.id_tournament, id_users: [user.value.id_user]});
		}
		catch(err) { console.log(err); }
		closePopup();
		router.push(`/tournament/${tourOpen.value.id_tournament}`);
	}

	async function rejectInvite() {
		console.log("Per ora e' inutile :)");
	}

	const closePopup = () => { popUp.value = false; };

	onMounted(async () => {
		try {
			if (user.value)
				db.value = (await api.get("/api/users")).data.users;
		} catch (error) { console.log("user non loggato, impossibile fare fetch su db");}
		document.addEventListener('click', handleClickOutside);
    });

	onBeforeUnmount(() => { document.removeEventListener('click', handleClickOutside); });
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
				<img src="../assets/CrownIcon.png" alt="" class="place-self-center size-15 ml-3" :draggable="false">
				<h1 class="text-white text-4xl place-self-center">ChessZ</h1>
			</div>
		</RouterLink>
		<div class="flex bg-[#302d2a] w-[150%] justify-self-center rounded-4xl h-11 self-center content-center border border-[#4e4e4e8c] overflow-hidden">
			<img src="../assets/search.png" alt="" class="size-7 self-center ml-3" :draggable="false">
			<form @submit.prevent="goToUser">
				<input v-model="searchUser" type="search" name="searchBar" id="searchBar" placeholder="Cerca" autocomplete="off"
					class="justify-self-center rounded-4xl h-10 w-235 pl-3 text-white"
					:list="searchUser ? 'users' : null">
			</form>
		</div>
		<div class="flex justify-self-end place-self-center" v-if="user">
			<div class="place-self-center relative" ref="n_dropdown">
				<button
					class="flex items-center cursor-pointer mr-1"
					@click="n_bool = !n_bool"
					:aria-expanded="n_bool"
					aria-haspopup="true">
					<div v-if="authStore.msgRecevied && Array.from(authStore.msgRecevied).find(m => m.status === 'not_read') !== undefined">
						<span class="absolute inline-flex translate-x-5.5 -translate-y-3.5 size-3 animate-ping rounded-full bg-[#c41c1c] opacity-75"></span>
						<span class="absolute justify-self-end translate-x-5.5 -translate-y-3.5 size-3 rounded-full bg-[#c41c1c]"></span>
					</div>
					<img src="../assets/bell.png" alt="" class="mr-4 size-9 place-self-center" :draggable="false">
				</button>
				<Transition
					class="origin-top-right -translate-x-62 translate-y-1.5"
					enter-active-class="transition ease-out duration-150"
					enter-from-class="opacity-0 scale-70"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition ease-in duration-100"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-70">
					<div v-if="n_bool" class="mt-1.25 px-2 absolute bg-[#181715] border border-[#181715e8] w-76.5"
						:class="authStore.msgRecevied.size > 3 ? 'w-79 max-h-[40vh] overflow-y-auto' : ''">
						<div v-if="authStore.msgRecevied" v-for="m in [...authStore.msgRecevied].reverse()"
							class="bg-[#201e1c] p-2 my-2 rounded-sm text-white">
							<div class="flex gap-2 pb-1 items-center">
								<span class="py-1 block size-2 rounded-full"
									:class="{	'bg-[#c41c1c]' : m.status === 'not_read',
												'bg-zinc-500' : m.status === 'read' }"/>
								<h3 class="text-md">{{ m.title }}</h3>
								<p class="text-[#4e4e4e8c]">|</p>
								<p class="text-xs text-zinc-500">{{ rework_date(m.creation_date) }}</p>
							</div>
							<hr class="w-full justify-self-start text-[#4e4e4e8c]">
							<div class="items-end">
								<RouterLink v-if="m.description[0] === ' ' && m.description.includes('amicizia')" :to="{ name: 'user_page', params: { username: m.sender.username } }"
									@click="readMsg(m)">
									<div v-if="m.description[0] === ' '" class="flex gap-1 text-zinc-300 text-sm pt-2.5 pb-1">
										<p class="hover:underline">{{ m.sender.username }} {{ m.description }}</p>
									</div>
								</RouterLink>

								<div v-if="m.description[0] === ' ' && m.description.includes('torneo')"
									@click="readMsg(m); fetchTour(m); n_bool = false; popUp = true;" class="cursor-pointer">
									<div v-if="m.description[0] === ' '" class="flex gap-1 text-zinc-300 text-sm pt-2.5 pb-1">
										<p class="hover:underline">{{ m.sender.username }} {{ m.description.slice(0, m.description.indexOf('|')) }}</p>
									</div>
								</div>

								<div v-if="m.description[0] !== ' '">
									<p class="text-zinc-300 text-sm pt-2.5 pb-1">{{ m.description }}</p>
									<div class="ml-auto -mt-3.5 flex gap-1 h-fit w-fit" v-if="m.sender">
										<p class="text-xs text-zinc-500">
											da</p>
										<RouterLink :to="{ name: 'user_page', params: { username: m.sender.username } }">
											<p class="text-xs text-zinc-500 hover:underline" v-if="m.sender.username.length <= 10">
												{{ m.sender.username }}</p>
											<p class="text-xs text-zinc-500 hover:underline" v-if="m.sender.username.length > 10">
												{{ m.sender.username.slice(0, 9) + "..." }}</p>
										</RouterLink>
									</div>
								</div>
							</div>
						</div>
						<div v-if="!authStore.msgRecevied.size" class="flex p-2 my-2 rounded-sm text-white">
							<p class="mx-auto">Nessuna notifica</p>
						</div>
					</div>	
				</Transition>
			</div>

			<div class="relative w-fit" ref="p_dropdown">
				<button
					class="flex items-center cursor-pointer mr-1"
					@click="p_bool = !p_bool"
					:aria-expanded="p_bool"
					aria-haspopup="true">
					<h2 class="text-white text-lg place-self-center mr-2">{{ user.username }}</h2>
					<img
						:src="user.image ? `${user.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
						class="size-12 rounded-full place-self-center mr-1 object-cover">
					<svg
						class="size-4 text-white transition-transform duration-200"
						:class="{ 'rotate-180': p_bool }"
						viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<Transition
					class="origin-top-right"
					enter-active-class="transition ease-out duration-150"
					enter-from-class="opacity-0 scale-70"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition ease-in duration-100"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-70">
					<div v-if="p_bool" class="mt-1.25 p-2 absolute right-0 bg-[#181715] origin-top border border-[#181715e8] min-w-full">
						<RouterLink to="/me" @click="p_bool = false">
							<p class="text-white hover:underline">Profilo</p>
						</RouterLink>
						<hr class="w-full justify-self-start text-[#4e4e4e8c]">
						<RouterLink to="/me/edit" @click="p_bool = false">
							<p class="text-white hover:underline">Impostazioni</p>
						</RouterLink>
						<hr class="w-full justify-self-start text-[#4e4e4e8c]">
						<button @click="submitForm(); p_bool = false" class="cursor-pointer text-[#f1f5f7] hover:underline">
							Logout
						</button>
					</div>
				</Transition>
			</div>
		</div>
 
		<div v-if="user === null" class="justify-self-end place-self-center">
			<RouterLink to="/log" class="flex mr-3">
				<button class="flex cursor-pointer w-25 justify-center p-2 text-base bg-[#882a2a] rounded-[7px] text-white
								hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]">Accedi</button>
			</RouterLink>
		</div>
	</div>

	<div v-if="popUp && tourOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs px-4" @click.self="closePopup()">
        <div class="w-full max-w-md rounded-3xl border border-[#4e4e4e8c] bg-[#201e1c] p-6 text-white shadow-2xl">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm uppercase tracking-widest text-blue-200">Torneo</p>
                    <div class="flex items-center justify-start gap-2 mt-1">
                        <RouterLink to="/tournaments" class="hover:underline">
                            <h3 class="text-2xl">{{ tourOpen.name }}</h3>
                        </RouterLink>
                        <p class="text-[#4e4e4e8c]">|</p>
                        <h4 :class="{	'text-green-600' : tourOpen.status === 'open',
										'text-gray-300' : tourOpen.status === 'ongoing',
										'text-red-500' : tourOpen.status === 'closed' }">
							{{ tourOpen.status }}
						</h4>
                    </div>
                    <hr class="w-[192%] justify-self-start text-[#4e4e4e8c] my-1">
                    <p class="text-sm text-zinc-300 ml-1">Creato il {{ rework_date(tourOpen.created_at) }} da 
                        <RouterLink :to="{ name: 'user_page', params: { username: tourOpen.created_by.username } }" class="hover:underline">
                            {{ tourOpen.created_by.username }}
                        </RouterLink>
                    </p>
                </div>
                <button type="button" class="text-2xl leading-none text-zinc-500 hover:text-white" @click="closePopup()">&times;</button>
            </div>
            <div class="mt-6 mb-3 flex flex-col gap-2 justify-self-center items-center text-center">
                <p>Sei stato invitato al torneo <b>{{ tourOpen.name }}</b> creato da {{ tourOpen.created_by.username }}.<br>Vuoi partecipare?</p>
				<div v-if="tourOpen.status == 'open'" class="flex gap-10 w-max justify-self-end-safe pt-5">
					<button class="cursor-pointer rounded-md inset-ring text-lg px-3 p-2.5
								bg-green-400/10 text-green-500 inset-ring-green-500/20"
						@click="accpetInvite()">
						<p>Accetta</p>
					</button>
					<button class="cursor-pointer rounded-md inset-ring text-lg px-3 p-2.5
									bg-red-400/10 text-red-500 inset-ring-red-500/20"
							@click="rejectInvite(); closePopup()">
						<p>Rifiuta</p>
					</button>
				</div>
				<div v-if="tourOpen.status != 'open'" class="flex gap-3 rounded-xl border p-5 mt-4 w-full justify-center
						animate-card inset-ring bg-red-500/10 text-red-100 border-red-800/10 inset-ring-red-500/20">
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-6" viewBox="0 0 16 16">
					  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
					  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
					</svg>
					<h2>Invito scaduto</h2>
				</div>
            </div>
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