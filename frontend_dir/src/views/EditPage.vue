<script setup>
    import AppHeader from '../components/AppHeader.vue';
    import { ref, computed }	from 'vue';
    import { useAuthStore }     from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
    import { useRouter }	    from 'vue-router';
    import { asset }            from '../scripts/Helper/CompUtils';
    import { api }              from '../router/api/client'

    const   authStore = useAuthStore(),
	        { user } = storeToRefs(authStore),
            formData = ref({
	        	name: '',
	        	surname: '',
	        	username: '',
	        	nationality: '',
                mfa: user.value.mfa
                // preferences: 0
	        }),
            avatarFile = ref(null),      // il File vero e proprio
            avatarPreview = ref(null),   // URL per l'anteprima
            router = useRouter(),
            error = ref(false);

    const avatarSrc = computed(() => {
        if (avatarPreview.value)
            return avatarPreview.value;
        return user.value.image ? user.value.image : asset('../assets/default.png');
    });

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        // validazione base
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Formato non supportato. Usa JPG, PNG o WEBP.');
            return;
        }
        const maxSizeMB = 10;
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`L'immagine supera i ${maxSizeMB}MB.`);
            return;
        }

        avatarFile.value = file;

        // libera l'URL precedente per evitare memory leak
        if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
        avatarPreview.value = URL.createObjectURL(file);
    }

    async function submitForm() {
        const fd = new FormData();
        let resp;

        if (formData.value.name)        { fd.append('name', formData.value.name); }
        if (formData.value.username)    { fd.append('username', formData.value.username); }
        if (formData.value.surname)     { fd.append('surname', formData.value.surname); }
        if (formData.value.nationality) { fd.append('nationality', formData.value.nationality); }
        if (formData.value.mfa !== user.value.mfa) { fd.append('mfa', formData.value.mfa); }
        // if (formData.value.preferences) { fd.append('preferences', formData.value.preferences); }

        if (!!avatarFile.value)
        {    
            fd.append('avatar', avatarFile.value);
            resp = await api.patch_m('/api/users', fd);
        }
        else
            resp = await authStore.update(fd);

        if (!resp) {
            await authStore.fetchMe(true);
            await router.replace('/me');
        }
        else		{ error.value = true; }
    }
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppHeader class="z-11"/>
        <div id="wrap" class="grow">
            <form @submit.prevent="submitForm" class="flex z-2 bg-[#181715] rounded-3xl w-[140vh] h-[80vh]">
                <div class="flex flex-col p-2 m-4 mr-2 rounded-3xl border border-[#4e4e4e8c] w-[30vh]">
                    <div class="cursr-pointer relative group m-5 rounded-full overflow-hidden">
                        <img :src="avatarSrc" alt="" class="size-50 rounded-full object-cover">
                        <input id="avatar-input" type="file" accept="image/png, image/jpeg, image/webp"
                            class="hidden" @change="handleAvatarChange">
                        <label for="avatar-input" class="absolute inset-0 size-50 flex flex-col items-center justify-center rounded-full
                            bg-[#55555577] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <p class="text-white">Cambia foto</p>
                            <p class="text-white text-xl leading-none">+</p>
                        </label>
                    </div>
                    <RouterLink to="/me/edit/pwd" class="mx-auto mt-80">
                        <u><a class="text-sm cursor-pointer text-[#882a2a] hover:text-[#af3d3d] active:text-[#d1aaaa]">Cambia password</a></u>
                    </RouterLink>
                    <input id="submit" class="cursor-pointer w-[90%] mt-auto mb-6 self-center p-3 
                        text-base bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]"
                        v-bind:class="{'pointer-events-none grayscale': !formData.name && !formData.surname && !formData.username && !formData.nationality && !avatarFile && formData.mfa === user.mfa ,
						    'pointer-events-auto grayscale-0': formData.name || formData.surname || formData.username || formData.nationality || avatarFile || formData.mfa !== user.mfa}"
			        	type="submit" value="Salva le modifiche">
                </div>
                <div class="flex flex-col p-2 m-4 ml-2 text-white bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c] w-[110vh]">
                    <h2 class="text-2xl m-5">Informazioni utente
                        <hr class="w-full justify-self-start text-[#4e4e4e8c]">
                    </h2>
                    <div class="grid grid-cols-2 grid-rows-3 gap-5 m-5 self-center">
                        <div>
                            <div class="flex gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <h3 class="text-xl">Nome</h3>
                            </div>
                            <div class="form flex w-sm mb-3">
                                <input :placeholder="user.name" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.name">
                            </div>
                        </div>

                        <div>
                            <div class="flex gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <h3 class="text-xl">Cognome</h3>
                            </div>
                            <div class="form flex w-sm mb-3">
                                <input :placeholder="user.surname" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.surname">
                            </div>
                        </div>

                        <div class="relative">
                            <div class="flex gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <h3 class="text-xl">Username</h3>
                            </div>
                            <div>
	                        	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" id="allert"
	                        		class="absolute size-6 text-red-100 animate-error -translate-x-8 translate-y-3 hidden transition-all duration-250 ease-in-out z-11"
	                        		:class="{ 'inline' : error }">
	                        		<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
	                        	</svg>
	                        	<div class="hidden p-3 animate-pop flex-col items-center text-center z-11 -translate-x-60 -translate-y-6
	                        			gap-2.5 absolute rounded-xl border inset-ring bg-[#2f1818]/80 text-red-100 border-red-800/10 inset-ring-red-500/20">	
	                        		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-100 self-center mx-auto">
	                        			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
	                        		</svg>
	                        		<div>
	                        			<h2>Credenziali errate</h2>
	                        			<p class="text-sm">Lo username deve avere</p>
                                        <p class="text-sm">almeno 4 caratteri</p>
	                        		</div>
	                        	</div>
	                        </div>
                            <div class="form flex w-sm mb-3">
                                <input :placeholder="user.username" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username">
                            </div>
                        </div>

                        <div>
                            <div class="flex gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <h3 class="text-xl">Email</h3>
                            </div>
                            <div class="p-2.5 border rounded-[7px] border-[#4e4e4e8c] text-[#dcdfe4c0] justify-self-center flex w-sm mb-3
                                        transition-colors duration-200 hover:bg-[#ad1e1e36] hover:border-[#eb2c2c2a]" id="email">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 absolute translate-x-42 opacity-0 transition-opacity duration-250">
                                  <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                                </svg>
                                <input disabled :placeholder="user.email" size="35" class="pl-2 text-base" autofocus="true" type="email">
                            </div>
                        </div>

                        <div>
                            <div class="flex gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
                                </svg>
                                <h3 class="text-xl">Nazionalità</h3>
                            </div>
                            <div class="form flex w-sm mb-3">
                                <input :placeholder="user.nationality" list="country" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.nationality">
                            </div>
                        </div>

                        <div>
                            <div class="flex gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                </svg>
                                <h3 class="text-xl">Autenticazione via OTP</h3>
                            </div>
                            <div class="flex w-sm mb-3 p-2.5 justify-self-center">
                                <label class="inline-flex items-center me-5 cursor-pointer">
                                  <input type="checkbox" class="sr-only peer" :checked="formData.mfa" v-model="formData.mfa">
                                  <span class="select-none me-3 text-sm font-medium text-heading">Disattivato</span>
                                  <div class="relative w-9 h-5 bg-neutral-quaternary rounded-full bg-[#0c0c0b]
                                        peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#882a2a]"></div>
                                  <span class="select-none ms-3 text-sm font-medium text-heading">Attivato</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
div.form {
		padding: 10px;
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

    #email:hover svg {
        opacity: 100%;
    }

    #allert:hover + div
	{
		display: inline;
	}

	#allert + div:hover {
		display: inline;
	}
</style>