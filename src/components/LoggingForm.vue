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
    <form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-[#111318]">
        <span v-if="url === '/auth/register'">
            <b>Name:</b> <input class="form mt-0.5 ml-1.25" type="text" v-model="formData.name"><br>
            <b>Surname:</b> <input class="form mt-0.5 ml-1.25" type="text" v-model="formData.surname"><br>
            <b>Email:</b> <input class="form mt-0.5 ml-1.25" type="email" v-model="formData.email"><br>
        </span>
        <b>Username:</b> <input class="form" autofocus="true" type="text" v-model="formData.username"><br>
        <b>Password:</b> <input class="form mt-0.5 ml-1.25" type="password" v-model="formData.password"><br>
        <span v-if="url === '/auth/register'">
            <b>Nationality:</b> <input class="form mt-0.5 ml-1.25" type="text" v-model="formData.nationality"><br>
        </span>
        <b><input class="mt-2 p-1.5 bg-[#a52a2a] rounded-[10px] text-[#f1f5f7]" type="submit" value="Submit"></b>
    </form>
</template>

<style scoped>
    input.form {
        padding: 4px;
        border-width: 1px;
        border-radius: 9px;
        background-color: #3b2a2a56;
        border-color: #e9dbdb5e;
        color: #dcdfe4;
    }

    input:focus {
        background-color: #3b2a2aa2;
        border-color: #f1e8e8af;
        outline: 0;
    }
</style>