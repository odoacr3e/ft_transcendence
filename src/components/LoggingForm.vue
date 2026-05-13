<script setup>
    defineProps(['url'])
</script>

<template>
    <form :action="url" method="post" class="text-[#111318]">
        <span v-if="url === '/auth/register'">
            <b>Name:</b> <input class="form mt-0.5 ml-1.25" type="text" name="name"><br>
            <b>Surname:</b> <input class="form mt-0.5 ml-1.25" type="text" name="surname"><br>
            <b>Email:</b> <input class="form mt-0.5 ml-1.25" type="email" name="email"><br>
        </span>
        <b>Username:</b> <input class="form" autofocus="true" type="text" name="username"><br>
        <b>Password:</b> <input class="form mt-0.5 ml-1.25" type="password" name="password"><br>
        <span v-if="url === '/auth/register'">
            <b>Nationality:</b> <input class="form mt-0.5 ml-1.25" type="text" name="nationality"><br>
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