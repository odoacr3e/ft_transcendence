<script setup>
    import { defaultAvatar, handleAvatarError }    from '../scripts/Helper/CompUtils';
    import { ref, computed }	from 'vue';
    import { useAuthStore }     from "../stores/auth.st";
    import { storeToRefs }      from 'pinia';
    import { useRouter }	    from 'vue-router';

    const   authStore = useAuthStore(),
	        { user } = storeToRefs(authStore),
            formData = ref({
	        	name: '',
	        	surname: '',
	        	username: '',
	        	nationality: '',
                preset: '',
                mfa: !!user.value.mfa,
                preferences: 0
	        }),
            avatarFile = ref(null),      // il File vero e proprio
            avatarPreview = ref(null),   // URL per l'anteprima
            router = useRouter(),
            error = ref(false),
            removeAvatar = ref(false);

    const avatarSrc = computed(() => {
        if (avatarPreview.value)
            return avatarPreview.value;
        return user.value.image ? user.value.image : defaultAvatar;
    });

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (removeAvatar.value) { removeAvatar.value = false; }
        if (formData.value.preset) { formData.value.preset = ''; }

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

        if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value);
        avatarPreview.value = URL.createObjectURL(file);
    }

    function handleAvatarRemove()
    {
        if (!user.value.image && !avatarFile.value) { return; }
        if (avatarFile.value || formData.value.preset)
        {
            formData.value.preset = '';
            avatarPreview.value = user.value.image ? user.value.image : defaultAvatar;
        }
        else
        {
            if (user.value.image) { removeAvatar.value = true; }
            avatarPreview.value = defaultAvatar;
        }
        avatarFile.value = null;
    }

    async function submitForm() {
        const fd = new FormData();

        if (formData.value.name)        { fd.append('name', formData.value.name); }
        if (formData.value.surname)     { fd.append('surname', formData.value.surname); }
        if (formData.value.username)    { fd.append('username', formData.value.username); }
        if (formData.value.nationality) { fd.append('nationality', formData.value.nationality); }
        if (formData.value.mfa !== user.value.mfa) { fd.append('mfa', formData.value.mfa); }
        // if (formData.value.preferences) { fd.append('preferences', formData.value.preferences); }
        
        if (formData.value.preset) { fd.append('preset', formData.value.preset); }
        else
        {
            if (avatarFile.value)                       { fd.append('avatar', avatarFile.value); }
            else if (!avatarFile.value && removeAvatar.value) { fd.append('avatar', ''); }    
        }
        
        const resp = await authStore.update(fd);
        if (!resp)
        {
            await authStore.fetchMe(true);
            await router.replace('/me');
        }
        else { error.value = true; }
    }
</script>

<template>
    <form @submit.prevent="submitForm" class="flex z-2 bg-[#181715] rounded-3xl w-[140vh] h-[80vh]">
        <div class="flex flex-col p-2 m-4 mr-2 rounded-3xl border border-[#4e4e4e8c] w-[30vh]">
            <div class="cursr-pointer relative group m-5 mb-1 rounded-full overflow-hidden">
                <img :src="avatarSrc" @error="handleAvatarError" alt="" class="size-50 rounded-full object-cover">
                <input id="avatar-input" type="file" accept="image/png, image/jpeg, image/webp"
                    class="hidden" @change="handleAvatarChange">
                <label for="avatar-input" class="absolute inset-0 size-50 flex flex-col items-center justify-center rounded-full
                    bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <p class="text-white">Cambia foto</p>
                    <p class="text-white text-xl leading-none">+</p>
                </label>
            </div>
            <button type="button" class="mx-auto" @click="handleAvatarRemove">
                <u><a class="text-sm cursor-pointer text-[#882a2a] hover:text-[#af3d3d] active:text-[#d1aaaa]">Elimina avatar</a></u>
            </button>
            <div class="flex flex-col gap-3 mt-5 mx-2.5">
                <div class="flex w-full justify-evenly my-0.5">
                    <img @click="formData.preset = 'bastardo'; avatarPreview = '/media/presetIcon/bastardo.PNG'" 
                        :src="'/media/presetIcon/bastardo.PNG'" title="Bastardo" class="size-21 rounded-full object-cover cursor-pointer">
                    <img @click="formData.preset = 'sovrano'; avatarPreview = '/media/presetIcon/sovrano.PNG'"
                        :src="'/media/presetIcon/sovrano.PNG'" title="Sovrano" class="size-21 rounded-full object-cover cursor-pointer">
                </div>
                <!-- altri 4 preset-->
            </div>
            <RouterLink to="/me/edit/pwd" class="mx-auto mt-54">
                <u><a class="text-sm cursor-pointer text-[#882a2a] hover:text-[#af3d3d] active:text-[#d1aaaa]">Cambia password</a></u>
            </RouterLink>
            <input id="submit" class="cursor-pointer w-[90%] mt-auto mb-6 self-center p-3 
                text-base bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]"
                v-bind:class="{ 'pointer-events-none grayscale': !formData.name && !formData.surname && !formData.username 
                                                             && !formData.nationality && !formData.preset && formData.mfa === user.mfa 
                                                             && (!avatarFile && !removeAvatar) && !formData.preferences,
				                'pointer-events-auto grayscale-0': formData.name || formData.surname || formData.username 
                                                                || formData.nationality || formData.preset  || formData.mfa !== user.mfa 
                                                                || avatarFile || (!avatarFile && removeAvatar) || formData.preferences }"
	        	type="submit" value="Salva le modifiche">
        </div>
        <div class="flex flex-col m-4 ml-2 text-white bg-[#201e1c] rounded-3xl border border-[#4e4e4e8c] w-[110vh]">
            <h2 class="text-2xl m-5 p-2">Informazioni utente
                <hr class="w-full justify-self-start text-[#4e4e4e8c]">
            </h2>
            <div class="grid grid-cols-2 grid-rows-3 gap-5 m-5 mb-0 self-center">
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
                        <input :placeholder="user.surname" size="35" class="pl-2 text-base" type="text" v-model="formData.surname">
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
                        <input :placeholder="user.username" size="35" class="pl-2 text-base" type="text" v-model="formData.username">
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
                                transition-colors duration-200 hover:bg-[#ad1e1e36] hover:border-red-500/20" id="email">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 absolute translate-x-42 opacity-0 transition-opacity duration-250">
                          <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                        </svg>
                        <input disabled :placeholder="user.email" size="35" class="pl-2 text-base" type="email">
                    </div>
                </div>

                <div>
                    <div class="flex gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
                        </svg>
                        <h3 class="text-xl">Nazionalità</h3>
                    </div>
                    <div class="p-2.5 border rounded-[7px] border-[#4e4e4e8c] text-[#dcdfe4c0] justify-self-center flex w-sm mb-3
                                transition-colors duration-200 hover:bg-[#ad1e1e36] hover:border-red-500/20" id="email">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 absolute translate-x-42 opacity-0 transition-opacity duration-250">
                          <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                        </svg>
                        <input :placeholder="user.nationality" list="country" size="35" class="pl-2 text-base" type="text" v-model="formData.nationality">
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
                          <input type="checkbox" class="sr-only peer" v-model="formData.mfa">
                          <span class="select-none me-3 text-sm font-medium text-heading">Disattivato</span>
                          <div class="relative w-9 h-5 bg-neutral-quaternary rounded-full bg-[#181715]
                                peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#882a2a]"></div>
                          <span class="select-none ms-3 text-sm font-medium text-heading">Attivato</span>
                        </label>
                    </div>
                </div>

                <div class="col-span-2">
                    <div class="flex gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mt-1 size-6 text-[#dcdfe4c0]">
                            <path fill-rule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 1 1-9 0V4.125Zm4.5 14.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
                            <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257ZM12.738 17.625l6.474-6.474a1.875 1.875 0 0 0 0-2.651L15.5 4.787a1.875 1.875 0 0 0-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375Z" />
                        </svg>
                        <h3 class="text-xl">Tema</h3>
                    </div>
                    <div class="flex flex-col p-2.5 justify-self-center w-fit">
                        <div class="flex gap-10 my-3">
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="1" value="1" v-model="formData.preferences">
                                <label for="1" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#201e1c]"></div>
                                        <div class="rounded-tr-2xl bg-[#302d2a]"></div>
                                        <div class="rounded-bl-2xl bg-[#2f1818]"></div>
                                        <div class="rounded-br-2xl bg-[#882a2a]"></div>
                                    </div>
                                    Dark-Red
                                </label>
                            </div>
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="2" value="2" v-model="formData.preferences">
                                <label for="2" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#1d1d21]"></div>
                                        <div class="rounded-tr-2xl bg-[#2a2b30]"></div>
                                        <div class="rounded-bl-2xl bg-[#17252e]"></div>
                                        <div class="rounded-br-2xl bg-[#2a6287]"></div>
                                    </div>
                                    Dark-Blue
                                </label>
                            </div>
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="3" value="3" v-model="formData.preferences">
                                <label for="3" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#1d211f]"></div>
                                        <div class="rounded-tr-2xl bg-[#2a302d]"></div>
                                        <div class="rounded-bl-2xl bg-[#182e17]"></div>
                                        <div class="rounded-br-2xl bg-[#2d872a]"></div>
                                    </div>
                                    Dark-Green
                                </label>
                            </div>
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="4" value="4" v-model="formData.preferences">
                                <label for="4" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#20211d]"></div>
                                        <div class="rounded-tr-2xl bg-[#2f302a]"></div>
                                        <div class="rounded-bl-2xl bg-[#2e2917]"></div>
                                        <div class="rounded-br-2xl bg-[#87712a]"></div>
                                    </div>
                                    Dark-Yellow
                                </label>
                            </div>
                        </div>

                        <div class="flex gap-10 my-3">
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="5" value="5" v-model="formData.preferences">
                                <label for="5" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-xl bg-[#6b3838]"></div>
                                        <div class="rounded-tr-xl bg-[#c54444]"></div>
                                        <div class="rounded-bl-xl bg-[#beb9b5]"></div>
                                        <div class="rounded-br-xl bg-[#d9d6d3]"></div>
                                    </div>
                                    Light-Red
                                </label>
                            </div>
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="6" value="6" v-model="formData.preferences">
                                <label for="6" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#37586d]"></div>
                                        <div class="rounded-tr-2xl bg-[#4494c5]"></div>
                                        <div class="rounded-bl-2xl bg-[#bebec5]"></div>
                                        <div class="rounded-br-2xl bg-[#d3d5d9]"></div>
                                    </div>
                                    Light-Blue
                                </label>
                            </div>
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="7" value="7" v-model="formData.preferences">
                                <label for="7" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#396d37]"></div>
                                        <div class="rounded-tr-2xl bg-[#46c544]"></div>
                                        <div class="rounded-bl-2xl bg-[#bfc6c2]"></div>
                                        <div class="rounded-br-2xl bg-[#d4d9d7]"></div>
                                    </div>
                                    Light-Green
                                </label>
                            </div>
                            <div class="flex gap-2 w-[18vh]">
                                <input size="35" class="pl-2 text-base hidden" type="radio" id="8" value="8" v-model="formData.preferences">
                                <label for="8" class="flex gap-2 items-center">
                                    <div class="grid grid-cols-2 grid-rows-2 w-12 h-12 rounded-2xl border-2 border-[#181715e8]">
                                        <div class="rounded-tl-2xl bg-[#6d6237]"></div>
                                        <div class="rounded-tr-2xl bg-[#c7a643]"></div>
                                        <div class="rounded-bl-2xl bg-[#bec0b8]"></div>
                                        <div class="rounded-br-2xl bg-[#d8d9d3]"></div>
                                    </div>
                                    Light-Yellow
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!user.setpwd" class="flex items-center mt-auto px-5 p-2 rounded-b-3xl text-[80%] border bg-[#2f1818]/80 text-red-100 border-red-800/10 inset-ring-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-100 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p>Hai fatto accesso con il tuo account Google e in questo momento non hai una password.</p>
                <RouterLink to="/me/edit/pwd" class="mx-auto">
                    <u><a class="text-sm cursor-pointer text-[#882a2a] hover:text-[#af3d3d] active:text-[#d1aaaa]">Creane una per la tua sicurezza!</a></u>
                </RouterLink>
            </div>
        </div>
    </form>
    <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#201e1c" x="0" y="0" width="100" height="220"/>,<rect fill="#302d2a" x="100" y="0" width="100" height="220"/>,<rect fill="#2f1818" x="200" y="0" width="100" height="220"/>,<rect fill="#882a2a" x="300" y="0" width="100" height="220"/>,<rect fill="#af3d3d" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/201e1c-302d2a-2f1818-882a2a-af3d3d</text>
    </svg>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#1d1d21" x="0" y="0" width="100" height="220"/>,<rect fill="#2a2b30" x="100" y="0" width="100" height="220"/>,<rect fill="#17252e" x="200" y="0" width="100" height="220"/>,<rect fill="#2a6287" x="300" y="0" width="100" height="220"/>,<rect fill="#3e82b0" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/1d1d21-2a2b30-17252e-2a6287-3e82b0</text>
    </svg>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#1d211f" x="0" y="0" width="100" height="220"/>,<rect fill="#2a302d" x="100" y="0" width="100" height="220"/>,<rect fill="#182e17" x="200" y="0" width="100" height="220"/>,<rect fill="#2d872a" x="300" y="0" width="100" height="220"/>,<rect fill="#41b03e" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/1d211f-2a302d-182e17-2d872a-41b03e</text>
    </svg>

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#20211d" x="0" y="0" width="100" height="220"/>,<rect fill="#2f302a" x="100" y="0" width="100" height="220"/>,<rect fill="#2e2917" x="200" y="0" width="100" height="220"/>,<rect fill="#87712a" x="300" y="0" width="100" height="220"/>,<rect fill="#b0953e" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/20211d-2f302a-2e2917-87712a-b0953e</text>
    </svg> -->




    <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#beb9b5" x="0" y="0" width="100" height="220"/>,<rect fill="#d9d6d3" x="100" y="0" width="100" height="220"/>,<rect fill="#6b3838" x="200" y="0" width="100" height="220"/>,<rect fill="#c54444" x="300" y="0" width="100" height="220"/>,<rect fill="#c55959" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/beb9b5-d9d6d3-6b3838-c54444-c55959</text>
    </svg> -->


    <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#bebec5" x="0" y="0" width="100" height="220"/>,<rect fill="#d3d5d9" x="100" y="0" width="100" height="220"/>,<rect fill="#37586d" x="200" y="0" width="100" height="220"/>,<rect fill="#4494c5" x="300" y="0" width="100" height="220"/>,<rect fill="#5a9bc4" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/bebec5-d3d5d9-37586d-4494c5-5a9bc4</text>
    </svg> -->


    <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#bfc6c2" x="0" y="0" width="100" height="220"/>,<rect fill="#d4d9d7" x="100" y="0" width="100" height="220"/>,<rect fill="#396d37" x="200" y="0" width="100" height="220"/>,<rect fill="#46c544" x="300" y="0" width="100" height="220"/>,<rect fill="#5dc559" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/bfc6c2-d4d9d7-396d37-46c544-5dc559</text>
    </svg> -->


    <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xml:space="preserve">
        <rect fill="#bec0b8" x="0" y="0" width="100" height="220"/>,<rect fill="#d8d9d3" x="100" y="0" width="100" height="220"/>,<rect fill="#6d6237" x="200" y="0" width="100" height="220"/>,<rect fill="#c7a643" x="300" y="0" width="100" height="220"/>,<rect fill="#c5ac59" x="400" y="0" width="100" height="220"/>
        <text x="10" y="235" font-family="Arial" font-size="6" alignment-baseline="middle">Exported from Coolors.co</text>
        <text x="490" y="235" font-family="Arial" font-size="6" alignment-baseline="middle" text-anchor="end">https://coolors.co/bec0b8-d8d9d3-6d6237-c7a643-c5ac59</text>
    </svg> -->

</template>

<style scoped>
    input:checked + label div {
        border-color: #dcdfe4c0;
    }

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

    #allert:hover + div {
		display: inline;
	}

	#allert + div:hover {
		display: inline;
	}
</style>