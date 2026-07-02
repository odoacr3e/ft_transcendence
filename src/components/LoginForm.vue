<script setup>
	import { useAuthStore }	from "../stores/auth.st";
	import { useRouter }	from 'vue-router';
	import { ref }			from 'vue';

	const formData = ref({
	  username: '',
	  password: ''
	});
	const	auth = useAuthStore(),
			visible = ref(false),
			error = ref(false),
			error_card = ref(false),
			router = useRouter();

	async function submitForm() {
		const resp = await auth.login(formData.value);
		if (!resp)	{ router.push('/me'); }
		else		{ error.value = true; error_card.value = true; }
	}

	function show() { visible.value = !visible.value; }
</script>

<template>
	<div v-if="error_card" class="flex gap-2.5 absolute items-center rounded-xl border px-5 py-4
		translate-x-8.5 -translate-y-80 animate-card inset-ring bg-red-500/10 text-red-100 border-red-800/10 inset-ring-red-500/20">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-100">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
		</svg>
		<div>
			<h2 class="">Credenziali errate</h2>
			<p class="text-sm">Controlla username e password e riprova.</p>
		</div>
	</div>
	<div class="justify-self-center justify-items-center">
		<form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white">
			<div class="form flex w-sm mb-5" :class="{ 'animate-shake': error }" @animationend="error = false">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
				<input placeholder="Nome utente" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username">
			</div>
			<div class="mb-4.5">
				<div class="form flex w-sm mb-0.5" :class="{ 'animate-shake': error }" @animationend="error = false">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
					</svg>
					<input placeholder="Password" size="31" class="pl-2 text-base" v-model="formData.password"
							:type="visible ? 'text' : 'password'">
					<button type="button" @click="show()" class="ml-3">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 8.155 7.36 5.5 12 5.5c4.638 0 8.573 2.655 9.963 6.428.07.207.07.431 0 .639C20.577 15.845 16.64 18.5 12 18.5c-4.638 0-8.573-2.655-9.963-6.428Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
							<path v-if="visible" stroke-linecap="round" stroke-linejoin="round" d="M3 3 21 21" />
						</svg>

					</button>
				</div>
				<u><a class="justify-self-center text-[80%] text-[#882a2a] cursor-pointer hover:text-[#af3d3d] active:text-[#d1aaaa]">Password dimenticata?</a></u>
			</div>
			<input id="submit" class="cursor-pointer justify-self-center w-sm mt-1.5 p-3 text-base bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]"
					v-bind:class="{'pointer-events-none grayscale': !formData.username || !formData.password,
						'pointer-events-auto grayscale-0 ': formData.username && formData.password }"        
					type="submit" value="Accedi">
		</form>
	</div>
</template>

<style scoped>
	div.form {
		padding: 15px;
		border-width: 1px;
		border-radius: 7px;
		border-color: #4e4e4e8c;
		color: #dcdfe4c0;
		justify-self: center;
	}

	div.form:focus-within {
		border-color: #f1e8e870;
	}

	div.form:hover {
		border-color: #f1e8e870;
		transition: border 0.25s ease-in-out;
	}

	input:focus {
		outline: 0;
	}

	#submit {
		transition: filter 0.2s ease-in-out;
	}
</style>