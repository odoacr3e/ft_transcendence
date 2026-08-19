<script setup>
    import { defaultAvatar, handleAvatarError }	from '../scripts/Helper/CompUtils';
    import { useAuthStore }						from "../stores/auth.st";
    import { storeToRefs }						from 'pinia';
	import { useI18n }							from 'vue-i18n';
    import { ref }								from 'vue';
	import router								from '../router/index.js';
	
console.log = () => 
{
	console.debug("PERICOLO MUCCHE");
};

    const	{ t } = useI18n(),
    	   formData = ref({
	              password: ''
	            }),
            authStore = useAuthStore(),
            { user } = storeToRefs(authStore),
            visible = ref(false),
			error = ref(false);

    async function submitForm() {
		const resp = await authStore.changePwd(formData.value);
		if (!resp)	{ router.push('/me'); }
		else		{ error.value = true; }
	}

	function show() { visible.value = !visible.value; }
</script>

<template>
    <div class="flex flex-col z-2 bg-bg-darker rounded-3xl w-[70vh] h-[70vh]">
        <h2 class="text-text-default text-3xl self-center m-9">{{ t('userPage.edit.changePwd') }}</h2>
        <div class="flex flex-col justify-center w-fit px-8 py-5 mb-4 mx-auto bg-bg-default rounded-3xl border border-border-default">
            <img :src="user.image ? `${user.image}` : defaultAvatar" @error="handleAvatarError"
                    alt="" class="size-35 rounded-full m-5 mx-auto object-cover">
            <h3 class="text-text-default text-2xl self-center">{{ user.username }}</h3>
            <h4 class="text-text-second text-md self-center">{{ user.name }} {{ user.surname }}</h4>
            <h5 class="text-text-third text-sm self-center">{{ user.nationality }}</h5>
        </div>
        <form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-text-default self-center flex flex-col">
	    	<div class="form self-center border-border-default text-form-icon flex w-102 m-4 mb-0" :class="{ 'animate-shake': error }" @animationend="error = false">
	    		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
	    			<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
	    		</svg>
	    		<input :placeholder="t('userPage.edit.newPwd')" size="31" class="pl-2 text-base" v-model="formData.password"
	    				:type="visible ? 'text' : 'password'">
	    		<button type="button" @click="show()" class="ml-7">
	    			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
	    				<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 8.155 7.36 5.5 12 5.5c4.638 0 8.573 2.655 9.963 6.428.07.207.07.431 0 .639C20.577 15.845 16.64 18.5 12 18.5c-4.638 0-8.573-2.655-9.963-6.428Z" />
	    				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
	    				<path v-if="visible" stroke-linecap="round" stroke-linejoin="round" d="M3 3 21 21" />
	    			</svg>
	    		</button>
	    	</div>
            <div class="text-xs mx-5 mb-4 mt-1 self-center justify-self-center text-main-color" 
                :class="{ 'transition-colors duration-200 text-text-error': error, 'transition-colors duration-200 text-main-color': !error, }" 
                @animationend="error = false">
				<p class="w-102 text-center">{{ t('userPage.edit.desc') }}</p>
            </div>
	    	<input id="submit" class="cursor-pointer justify-self-center w-sm p-3 text-base self-center mt-4
                            bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button"
	    			v-bind:class="{'pointer-events-none grayscale': !formData.password,
	    				'pointer-events-auto grayscale-0 ': formData.password }"
	    			type="submit" :value="t('userPage.edit.saveChanges')">
	    </form>
    </div>
</template>

<style scoped>
    div.form {
		padding: 15px;
		border-width: 1px;
		border-radius: 7px;
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