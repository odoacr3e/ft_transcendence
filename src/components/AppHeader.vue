<script setup>
	import { ref, onMounted }					from 'vue';
	import { useClickOutside }					from '@/scripts/Helper/generalUtils';
	import { rework_date, defaultAvatar, handleAvatarError }	from '../scripts/Helper/CompUtils';
	import { useAuthStore }	from "../stores/auth.st";
	import { useMsgStore }	from '../stores/msg.st';
	import { storeToRefs }	from 'pinia';
	import { useI18n }		from 'vue-i18n';
	import { api }			from '../router/api/client';
	import router			from '../router/index.js';
	
import { debug } from "@/scripts/Data/Variables";
	defineOptions({ inheritAttrs: false });
	
	const	{ t, locale } = useI18n({ useScope: 'global' }),
			msgStore = useMsgStore(),
			authStore = useAuthStore(),
			{ user } = storeToRefs(authStore),
			p_bool = ref(false),
			n_bool = ref(false),
			l_bool = ref(false),
			p_dropdown = ref(null),
			n_dropdown = ref(null),
			lang_dropdown = ref(null),
			popUp = ref(false),
			tourOpen = ref(null),
			db = ref([]),
			searchUser = ref("");

	async function submitForm() {
		await authStore.logout();
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

	//un dropdown per chiamata: il listener resta attaccato solo mentre quel menu e' aperto
	useClickOutside(p_dropdown,    () => { p_bool.value = false; }, { when: p_bool });
	useClickOutside(n_dropdown,    () => { n_bool.value = false; }, { when: n_bool });
	useClickOutside(lang_dropdown, () => { l_bool.value = false; }, { when: l_bool });

	async function readMsg(msg)
	{
		if (msg.status === "not_read")
		{
			msg.status = 'read';
			try {
				await api.patch("/api/notifications", { id_notification: Number(msg.id_notification) }); }
			catch(err) { console.error(err); }
		}
	}

	async function fetchTour(msg) {
		try {
            tourOpen.value = (await api.get(`/api/tournaments/${msg.description.slice(msg.description.indexOf('%') + 1)}`)).data.tournament;
			if (!tourOpen.value) { tourOpen.value = null; }
        }
        catch { tourOpen.value = null; }
		tourOpen.value.msg = msg;
	}

	async function accpetInvite() {
		// useSockStore().socket.emit("join_tournament",
		// 	{ tournament_pwd: tourOpen.value.msg.description.slice(tourOpen.value.msg.description.indexOf('|') + 1, tourOpen.value.msg.description.indexOf('%')) }, 
		// 	(resp) => { 
		// 		if (resp.log)
		// 			closePopup();
		// 			router.push(`/tournament/${tourOpen.value.id_tournament}`);
		// 	});

		//solo per test
		try {
			await api.post("/api/tournaments/addPlayers", {id_tournament: tourOpen.value.id_tournament, id_users: [user.value.id_user]}); }
		catch(err) { console.error(err); }
		closePopup();
		router.push(`/tournament/${tourOpen.value.id_tournament}`);
	}

	async function rejectInvite() {
		debug("Per ora e' inutile :)");
	}

	const closePopup = () => { popUp.value = false; };

	onMounted(async () => {
		try {
			if (user.value) { db.value = (await api.get("/api/users")).data.users; } }
		catch { debug("user non loggato, impossibile fare fetch su db");}
    });
</script>

<template>
	<datalist id="users">
		<!-- idk e' l'unico modo che ho trovato per far in modo che dopo il click sull'option questo non ricompaia -->
		<RouterLink to="/">
			<option v-for="user in db" :key="user.username" :value="user.username"></option> <!-- la key va messa per permettere a vue di indicizzare i contenuti così da midificare il DOM solo per le cose che sono cambiate --> 
		</RouterLink>
	</datalist>

	<div class="grid grid-cols-3 z-11 w-lvw h-15 bg-bg-default border-b border-border-second justify-center" v-bind="$attrs">
		<RouterLink to="/" id="button" class="w-fit">
			<div class="flex justify-self-start">
				<img src="../assets/CrownIcon.png" alt="" class="place-self-center size-15 ml-3" :draggable="false">
				<h1 class="text-text-default text-4xl place-self-center">ChessZ</h1>
			</div>
		</RouterLink>
		<div class="flex bg-bg-second w-[150%] justify-self-center rounded-4xl h-11 self-center content-center border border-border-default overflow-hidden">
			<img src="../assets/search.png" alt="" class="size-7 self-center ml-3" :draggable="false">
			<form @submit.prevent="goToUser">
				<input v-model="searchUser" type="search" name="searchBar" id="searchBar" :placeholder="t('common.search')" autocomplete="off"
					class="justify-self-center rounded-4xl h-10 w-235 pl-3 pt-1 text-text-default"
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
					<div v-if="msgStore.msgRecevied && Array.from(msgStore.msgRecevied).find(m => m.status === 'not_read') !== undefined">
						<span class="absolute inline-flex translate-x-5.5 -translate-y-3.5 size-3 animate-ping rounded-full bg-notif-on opacity-75"></span>
						<span class="absolute justify-self-end translate-x-5.5 -translate-y-3.5 size-3 rounded-full bg-notif-on"></span>
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
					<div v-if="n_bool" class="mt-1.25 px-2 absolute bg-bg-darker border border-border-second w-76.5"
						:class="msgStore.msgRecevied.size > 3 ? 'w-79 max-h-[40vh] overflow-y-auto' : ''">
						<div v-if="msgStore.msgRecevied" v-for="m in [...msgStore.msgRecevied].reverse()"
							class="bg-bg-default p-2 my-2 rounded-sm text-text-default">
							<div class="flex gap-2 pb-1 items-center">
								<span class="py-1 block size-2 rounded-full"
									:class="{	'bg-notif-on' : m.status === 'not_read',
												'bg-zinc-500' : m.status === 'read' }"/> <!--NOTE ✓-->
								<h3 v-if="m.description[0] === ' ' && m.title === 'F'" class="text-md">{{ t('header.inv.friendTitle') }}</h3>
								<h3 v-if="m.description[0] === ' ' && m.title === 'T'" class="text-md">{{ t('header.inv.tourTitle') }}</h3>
								<h3 v-if="m.title !== 'F' && m.title !== 'T'" class="text-md">{{ m.title }}</h3>
								<p class="text-text-last">|</p>
								<p class="text-xs text-text-third">{{ rework_date(m.creation_date) }}</p>
							</div>
							<hr class="w-full justify-self-start text-text-last">
							<div class="items-end">
								<RouterLink v-if="m.description[0] === ' ' && m.title === 'F'" :to="{ name: 'user_page', params: { username: m.sender.username } }"
									@click="readMsg(m)">
									<div class="flex gap-1 text-text-second text-sm pt-2.5 pb-1">
										<p class="hover:underline">{{ t('header.inv.friendNotif', {sender: m.sender.username}) }}</p>
									</div>
								</RouterLink>

								<div v-if="m.description[0] === ' ' && m.title === 'T'"
									@click="readMsg(m); fetchTour(m); n_bool = false; popUp = true;" class="cursor-pointer">
									<div class="flex gap-1 text-text-second text-sm pt-2.5 pb-1">
										<p class="hover:underline">{{ t('header.inv.tourNotif', {sender: m.sender.username, tour: m.description.slice(1, m.description.indexOf('|'))}) }}</p>
									</div>
								</div>

								<div v-if="m.description[0] !== ' '">
									<p class="text-text-second text-sm pt-2.5 pb-1">{{ m.description }}</p>
									<div class="ml-auto -mt-3.5 flex gap-1 h-fit w-fit" v-if="m.sender">
										<p class="text-xs text-text-third">
											{{ t('common.by') }}</p>
										<RouterLink :to="{ name: 'user_page', params: { username: m.sender.username } }">
											<p class="text-xs text-text-third hover:underline" v-if="m.sender.username.length <= 10">
												{{ m.sender.username }}</p>
											<p class="text-xs text-text-third hover:underline" v-if="m.sender.username.length > 10">
												{{ m.sender.username.slice(0, 9) + "..." }}</p>
										</RouterLink>
									</div>
								</div>
							</div>
						</div>
						<div v-if="!msgStore.msgRecevied.size" class="flex p-2 my-2 rounded-sm text-text-default">
							<p class="mx-auto">{{ t('header.zeroNotif') }}</p>
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
					<h2 class="text-text-default text-lg place-self-center mr-2">{{ user.username }}</h2>
					<img
						:src="user.image ? `${user.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
						class="size-12 rounded-full place-self-center mr-1 object-cover">
					<svg
						class="size-4 text-text-default transition-transform duration-200"
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
					<div v-if="p_bool" class="mt-1.25 p-2 absolute right-0 bg-bg-darker origin-top border border-border-second min-w-full">
						<RouterLink to="/me" @click="p_bool = false">
							<p class="text-text-default hover:underline">{{ t('header.profile') }}</p>
						</RouterLink>
						<hr class="w-full justify-self-start text-text-last">
						<RouterLink to="/me/edit" @click="p_bool = false">
							<p class="text-text-default hover:underline">{{ t('header.settings') }}</p>
						</RouterLink>
						<hr class="w-full justify-self-start text-text-last">
						<div class="relative" ref="lang_dropdown">
							<button
								type="button"
								class="flex w-full items-center justify-between gap-3 text-text-default hover:underline"
								@click="l_bool = !l_bool"
								:aria-expanded="l_bool"
								aria-haspopup="listbox">
								<span>{{ locale === 'it' ? 'Italiano' : 'English' }}</span>
								<svg class="size-3 transition-transform duration-200" :class="{ 'rotate-180': l_bool }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
								<div v-if="l_bool" class="absolute right-full top-0 mr-2 min-w-28 rounded-md border border-border-second bg-bg-darker p-1 shadow-lg">
									<button type="button" class="block w-full rounded px-3 py-1.5 text-left text-text-default hover:bg-bg-default" @click="locale = 'en'; l_bool = false">English</button>
									<button type="button" class="block w-full rounded px-3 py-1.5 text-left text-text-default hover:bg-bg-default" @click="locale = 'it'; l_bool = false">Italiano</button>
								</div>
							</Transition>
						</div>
						<hr class="w-full justify-self-start text-text-last">
						<button @click="submitForm(); p_bool = false" class="cursor-pointer text-text-default hover:underline">
							{{ t('header.logout') }}
						</button>
					</div>
				</Transition>
			</div>
		</div>
 
		<div v-if="user === null" class="justify-self-end place-self-center">
			<RouterLink to="/log" class="flex mr-3">
				<button class="flex cursor-pointer w-25 justify-center p-2 text-base bg-main-color rounded-[7px] text-text-default
								hover:bg-linear-to-t from-main-color to-light-button">{{ t('header.login') }}</button>
			</RouterLink>
		</div>
	</div>

	<div v-if="popUp && tourOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-bg-blur backdrop-blur-xs px-4" @click.self="closePopup()">
        <div class="w-full max-w-md rounded-3xl border border-border-default bg-bg-default p-6 text-text-default shadow-2xl">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm uppercase tracking-widest text-text-tour-friend">{{ t('common.tournament', 1) }}</p>
                    <div class="flex items-center justify-start gap-2 mt-1">
                        <RouterLink to="/tournaments" class="hover:underline">
                            <h3 class="text-2xl">{{ tourOpen.name }}</h3>
                        </RouterLink>
                        <p class="text-text-last">|</p>
                        <h4 :class="{	'text-text-win-open' : tourOpen.status === 'open',
										'text-text-draw-await' : tourOpen.status === 'ongoing',
										'text-text-lose-closed' : tourOpen.status === 'closed' }">
							{{ tourOpen.status }}
						</h4>
                    </div>
                    <hr class="w-[192%] justify-self-start text-text-last my-1">
                    <p class="text-sm text-text-second ml-1">{{ t('header.inv.creation', {date: rework_date(tourOpen.created_at)}) }}
                        <RouterLink :to="{ name: 'user_page', params: { username: tourOpen.created_by.username } }" class="hover:underline">
                            {{ tourOpen.created_by.username }}
                        </RouterLink>
                    </p>
                </div>
                <button type="button" class="text-2xl leading-none text-text-third hover:text-text-default" @click="closePopup()">&times;</button>
            </div>
            <div class="mt-6 mb-3 flex flex-col gap-2 justify-self-center items-center text-center">
				 <p v-html="$t('header.inv.desc', {tourName: tourOpen.name, tourCreator: tourOpen.created_by.username})"></p>
				<div v-if="tourOpen.status == 'open'" class="flex gap-10 w-max justify-self-end-safe pt-5">
					<button class="cursor-pointer rounded-md inset-ring text-lg px-3 p-2.5
								bg-bg-accept text-online-accept inset-ring-inset-accept"
						@click="accpetInvite()">
						<p>{{ t('common.accept') }}</p>
					</button>
					<button class="cursor-pointer rounded-md inset-ring text-lg px-3 p-2.5
									bg-bg-reject text-text-lose-closed inset-ring-inset-reject"
							@click="rejectInvite(); closePopup()">
						<p>{{ t('common.reject') }}</p>
					</button>
				</div>
				<div v-if="tourOpen.status != 'open'" class="flex gap-3 rounded-xl border p-5 mt-4 w-full justify-center
						animate-card inset-ring bg-bg-error text-text-error border-border-error inset-ring-inset-error">
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-6" viewBox="0 0 16 16">
					  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
					  <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
					</svg>
					<h2>{{ t('header.inv.expired') }}</h2>
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