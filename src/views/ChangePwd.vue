<script setup>
    import AppHeader from '../components/AppHeader.vue';
    import { useAuthStore }	from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
	import { useRouter }	from 'vue-router';
    import { asset }            from '../scripts/Helper/CompUtils';
    import { ref }  			from 'vue';

    const   formData = ref({
	              password: ''
	            }),
            authStore = useAuthStore(),
            { user } = storeToRefs(authStore),
            visible = ref(false),
			error = ref(false),
            auth = useAuthStore(),
            router = useRouter();

    async function submitForm() {
		const resp = await auth.changePwd(formData.value);
		if (!resp)	{ router.push('/me'); }
		else		{ error.value = true; }
	}

	function show() { visible.value = !visible.value; }
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppHeader class="z-11"/>
        <div id="wrap" class="grow">
            <div class="flex flex-col z-2 bg-[#181715] rounded-3xl w-[70vh] h-[70vh]">
                <h2 class="text-white text-3xl self-center m-9">Cambia password</h2>
                <div class="flex flex-col justify-center w-fit p-2 mb-6 mx-auto bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c]">
                    <img :src="user.image ? asset(`${user.image}`) : asset('../assets/default.png')"
                            alt="" class="size-35 rounded-full m-5">
                    <h3 class="text-white text-2xl self-center">{{ user.username }}</h3>
                    <h4 class="text-zinc-300 text-md self-center">{{ user.name }} {{ user.username }}</h4>
                    <h5 class="text-zinc-500 text-sm self-center">{{ user.nationality }}</h5>
                </div>
                <form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white self-center flex flex-col">
		        	<div class="form flex w-sm m-4 mb-2" :class="{ 'animate-shake': error }" @animationend="error = false">
		        		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
		        			<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
		        		</svg>
		        		<input placeholder="Nuova password" size="31" class="pl-2 text-base" v-model="formData.password"
		        				:type="visible ? 'text' : 'password'">
		        		<button type="button" @click="show()" class="ml-3">
		        			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
		        				<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 8.155 7.36 5.5 12 5.5c4.638 0 8.573 2.655 9.963 6.428.07.207.07.431 0 .639C20.577 15.845 16.64 18.5 12 18.5c-4.638 0-8.573-2.655-9.963-6.428Z" />
		        				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
		        				<path v-if="visible" stroke-linecap="round" stroke-linejoin="round" d="M3 3 21 21" />
		        			</svg>
		        		</button>
		        	</div>
                    <div class="text-xs mx-5 self-center justify-self-center text-[#882a2a]" 
                        :class="{ 'transition-colors duration-200 text-[#c46b6b]': error, 'transition-colors duration-200 text-[#882a2a]': !error, }" 
                        @animationend="error = false">
                        <p>Ricorda, la password deve avere almeno 8 caratteri, un numero,</p>
                        <p> una maiuscola, una minuscola e un carattere speciale ($,%,#...)</p>
                    </div>
		        	<input id="submit" class="cursor-pointer justify-self-center w-sm p-3 text-base self-center mt-6
                                    bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]"
		        			v-bind:class="{'pointer-events-none grayscale': !formData.password,
		        				'pointer-events-auto grayscale-0 ': formData.password }"
		        			type="submit" value="Salva le modifiche">
		        </form>
            </div>
        </div>
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