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
			<img src="../assets/add-friend.png" alt="" class="size-6">
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
						'bg-blue-400/10 text-blue-500 inset-ring-blue-500/20' : state === 'Amici' }"
		v-if="state === 'In attesa...' || state === 'Amici'">
		<img v-if="state === 'Amici'" src="../assets/friend.png" alt="" class="size-6">
		<div v-if="state === 'In attesa...'" class="animate-spin h-7 w-7 border-3 border-gray-300 border-t-transparent rounded-full"></div>
		<p>{{ state }}</p>
	</div>


</template>

<style scoped>
</style>