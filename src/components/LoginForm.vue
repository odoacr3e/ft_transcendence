<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router'

    const formData = ref({
      username: '',
      password: ''
    });
    const   visible = ref(false),
        router = useRouter();

	async function submitForm() {
		try
		{
			const response = await fetch("http://localhost:8080/auth/login", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData.value),
				credentials: "include"
	  		});

			if (!response.ok)
				throw new Error(`Errore: ${response.status}`);

			const match = await response.json();
			console.log(match);

			window.location.href = 'http://localhost:8080/api/users/me';
			// router.replace('http://localhost:8080/api/users');
			// router.push('/users');
		}
		catch (error) {
	  		console.error('Login fallito:', error);
		}
	}

    function asset(path) {
        return new URL(path, import.meta.url).href;
    }

    function show() { visible.value = !visible.value; }
</script>

<template>
    <div class="justify-self-center justify-items-center">
        <form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white">
            <div class="form flex w-sm mb-5">
                <img src="../assets/UserIcon.png" alt="" class="size-6" >
                <input placeholder="Nome utente" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username">
            </div>
            <div class="mb-4.5">
                <div class="form flex w-sm mb-0.5">
                    <img src="../assets/PasswordIcon.png" alt="" class="size-6">
                    <input placeholder="Password" size="31" class="pl-2 text-base" v-model="formData.password"
                            :type="visible ? 'text' : 'password'">
                    <button type="button" @click="show()" class="ml-3">
                        <img class="size-5" :src="visible ? asset('../assets/EyeClose.png') : asset('../assets/EyeOpen.png')"  alt="Eye">
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
        border-color: #f1e8e8af;
    }

    input:focus {
        outline: 0;
    }

    #submit {
        transition: filter 0.2s ease-in-out;
    }
</style>