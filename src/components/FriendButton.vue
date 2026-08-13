<script setup>
	import router from '@/router/index.js';
	import { acceptRequest, rejectRequest }	from '../scripts/Helper/CompUtils';
	import { ref, onMounted, watch }		from 'vue';
	import { taskApi }						from '../router/api/task.api';
	import { useI18n }						from 'vue-i18n';
	import { api }							from '../router/api/client';

	
	//NOTE - Se volgio fare in modo che il bottone cambi appena clicckato (senza reload)
	// basta fare updateState dopo il sendReq, l'accetazione/rifiutoReq
	// Una cosa che però rimane non dinamica è se elimini l'amicizia da UserMe dalla lista


    const   { t } = useI18n();
	const   prop = defineProps({
  				user: Object
			}),
			friends = ref(null), state = ref(null);
 
	async function updateState() {
		try
		{
			friends.value = await taskApi.friendlist();
			const isFriend = friends.value.find(x => (x.friend.username === prop.user.username));
	
			if (isFriend) {
				if (isFriend.friend_status !== 'pending')
					state.value = 2;
				else if (isFriend.friend_status === 'pending') {
					if (isFriend.sender.username === prop.user.username)
						state.value = 1;
					else
						state.value = 0;
				}
			} else {
				state.value = -1;
			}
		}
		catch {}
	}

	onMounted(updateState); 
	watch(() => prop.user, updateState, { deep: true });

	async function sendRequest()
	{
		try
		{
			await api.post("/api/friends", { id_friend: prop.user.id_user });
			await api.post("/api/notifications", 
							{	title: "F",
								description: " ",
								id_receiver: prop.user.id_user });
		}
		catch(err) { console.log(err); }
		router.go(0);
	}
	
</script>

<template>
	<button class="flex w-max p-2.5 pl-4 gap-3 cursor-pointer rounded-md inset-ring justify-self-end-safe
					 bg-bg-accept text-online-accept inset-ring-inset-accept"
			@click="sendRequest()"
			v-if="state == -1">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
			</svg>
		<p>{{ t('userPage.sendRequest') }}</p>
	</button>



	<div class="w-max justify-self-end-safe" v-if="state ==  1">
		<button class="cursor-pointer rounded-l-md inset-ring p-2.5
					bg-bg-accept text-online-accept inset-ring-inset-accept"
			@click="acceptRequest(user.id_user)">
			<p>{{ t('common.accept') }}</p>
		</button>
		<button class="cursor-pointer rounded-r-md inset-ring p-2.5
						bg-bg-reject text-text-lose-closed inset-ring-inset-reject"
				@click="rejectRequest(user.id_user)">
			<p>{{ t('common.reject') }}</p>
		</button>
	</div>



	<div class="w-max p-2.5 pl-4 rounded-md inset-ring justify-self-end-safe flex gap-3"
		v-bind:class="{ 'bg-bg-await text-text-draw-await inset-ring-inset-await' : state == 0,
						'bg-bg-tour-friend text-text-tour-friend inset-ring-inset-tour-friend' : state == 2 }"
		v-if="state == 0 || state == 2">
		<svg v-if="state == 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
		</svg>
		<div v-if="state == 0" class="animate-spin h-7 w-7 border-3 border-text-draw-await border-t-transparent rounded-full"></div>
		<p v-if="state == 2">{{ t('common.friend', 2) }}</p>
		<p v-if="state == 0">{{ t('common.pending') }}</p>
	</div>


</template>

<style scoped>
</style>