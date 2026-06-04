<script setup>
    import { ref } from 'vue';

    const formData = ref({
        name: '',
        surname: '',
        email: '',
        username: '',
        password: '',
        nationality: ''
    });
    const visible = ref(false);

   function submitForm() {
      fetch("http://localhost:8080/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.value)
      })
    }

    function asset(path) {
        return new URL(path, import.meta.url).href;
    }

    function show() { visible.value = !visible.value; }
</script>

<template>
    <div class="justify-self-center justify-items-center mt-3">
        <form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white">
            <div class="form flex w-sm mb-3">
                <img src="../assets/UserIcon.png" alt="" class="size-6" >
                <input placeholder="Nome" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.name">
            </div>
            <div class="form flex w-sm mb-3">
                <img src="../assets/UserIcon.png" alt="" class="size-6" >
                <input placeholder="Cognome" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.surname">
            </div>
            <div class="form flex w-sm mb-3">
                <img src="../assets/UserIcon.png" alt="" class="size-6" >
                <input placeholder="Nome utente" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username">
            </div>
            <div class="form flex w-sm mb-3">
                <img src="../assets/Email.png" alt="" class="size-6" >
                <input placeholder="Email" size="35" class="pl-2 text-base" autofocus="true" type="email" v-model="formData.email">
            </div>
            <div class="mb-2.5">
                <div class="form flex w-sm mb-0.5">
                    <img src="../assets/PasswordIcon.png" alt="" class="size-6">
                    <input placeholder="Password" size="31" class="pl-2 text-base" :type="visible ? 'text' : 'password'" v-model="formData.password">
                    <button type="button" @click="show()" class="ml-3">
                        <img class="size-5" :src="visible ? asset('../assets/EyeClose.png') : asset('../assets/EyeOpen.png')" alt="">
                    </button>
                </div>
            </div>
            <div class="form flex w-sm mb-3">
                <img src="../assets/World.png" alt="" class="size-6" >
                <input placeholder="Nazionalita'" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.nationality">
            </div>
            <input class="cursor-pointer justify-self-center w-sm mt-1.5 p-3 text-base bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]" type="submit" value="Registrati">
        </form>
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
        border-color: #f1e8e8af;
    }

    div.form:hover {
        border-color: #f1e8e8af;
        animation: hover 0.4s ease-in-out ;
    }

    input:focus {
        outline: 0;
    }

</style>