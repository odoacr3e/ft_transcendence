<script setup>
    import { ref } from 'vue';
    const prop = defineProps(['url']);

    const formData = ref({
//      name: '',
//      surname: '',
//      email: '',
      username: '',
      password: '',
//      nationality: ''
    });

   function submitForm() {
      fetch(prop.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.value)
      })
    }
</script>

<template>
    <div class="justify-self-center justify-items-center">
        <form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white">
            <div class="form flex w-sm mb-5">
                <img src="../assets/UserIcon.png" alt="" class="size-6" >
                <input placeholder="Email o nome utente" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username"><br>
            </div>
            <div class="mb-4.5">
                <div class="form flex w-sm mb-0.5">
                    <img src="../assets/PasswordIcon.png" alt="" class="size-6">
                    <input placeholder="Password" size="31" class="pl-2 text-base" type="password" v-model="formData.password"><br>
                    <button class="ml-3"><img class="size-5" src="../assets/EyeOpen.png" alt=""></button>
                </div>
                <u><a class="justify-self-center text-[80%] text-[#882a2a] cursor-pointer">Password dimenticata?</a></u>
            </div>
            <input class="cursor-pointer justify-self-center w-sm mt-1.5 p-3 text-base bg-[#882a2a] rounded-[7px] text-white" type="submit" value="Accedi">
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

</style>