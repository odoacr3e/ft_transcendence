<script setup>
	import router from '@/router/index.js';
	import { acceptRequest, rejectRequest }	from '../scripts/Helper/CompUtils';
	import { ref, onMounted, watch }		from 'vue';
	import { authApi }						from '../router/api/auth.api';
	import { api }							from '../router/api/client';

	const   prop = defineProps({
  			user: Object
		}),
			friends = ref(null), state = ref(null);
 
	async function updateState() {
		friends.value = await authApi.friendlist();
		const isFriend = friends.value.find(x => (x.friend.username === prop.user.username));

		if (isFriend) {
			if (isFriend.friend_status !== 'pending')
				state.value = "Amici";
			else if (isFriend.friend_status === 'pending') {
				if (isFriend.sender.username === prop.user.username)
					state.value = "Accetta";
				else
					state.value = "In attesa...";
			}
		} else {
			state.value = "Manda amicizia";
		}
	}

	onMounted(updateState); 
	watch(() => prop.user, updateState, { deep: true });

	async function sendRequest()
	{
		await api.post("/api/friends", { id_friend: prop.user.id_user });
		router.go(0);
	}
	
</script>

<template>
	<button class="flex w-max p-2.5 pl-4 gap-3 cursor-pointer rounded-md inset-ring justify-self-end-safe
					 bg-green-400/10 text-green-500 inset-ring-green-500/20"
			@click="sendRequest()"
			v-if="state === 'Manda amicizia'">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
			</svg>
		<p>{{ state }}</p>
	</button>



	<div class="w-max justify-self-end-safe" v-if="state ===  'Accetta'">
		<button class="cursor-pointer rounded-l-md inset-ring p-2.5
					bg-green-400/10 text-green-500 inset-ring-green-500/20"
			@click="acceptRequest(user.id_user)">
			<p>Accetta</p>
		</button>
		<button class="cursor-pointer rounded-r-md inset-ring p-2.5
						bg-red-400/10 text-red-500 inset-ring-red-500/20"
				@click="rejectRequest(user.id_user)">
			<p>Rifiuta</p>
		</button>
	</div>



	<div class="w-max p-2.5 pl-4 rounded-md inset-ring justify-self-end-safe flex gap-3"
		v-bind:class="{ 'bg-gray-200/10 text-gray-300 inset-ring-gray-300/20' : state === 'In attesa...',
						'bg-blue-400/10 text-blue-200 inset-ring-blue-500/20' : state === 'Amici' }"
		v-if="state === 'In attesa...' || state === 'Amici'">
		<svg v-if="state === 'Amici'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
		</svg>
		<div v-if="state === 'In attesa...'" class="animate-spin h-7 w-7 border-3 border-gray-300 border-t-transparent rounded-full"></div>
		<p>{{ state }}</p>
	</div>


</template>

<style scoped>
</style>