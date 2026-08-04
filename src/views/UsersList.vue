<script setup>
    import TagTitle from '../components/TagTitle.vue';
    import { defaultAvatar, handleAvatarError }    from '../scripts/Helper/CompUtils';
    import { ref, watch }       from 'vue';
    import { useI18n }          from 'vue-i18n';
    import { api }              from '../router/api/client';
    
    const { t } = useI18n(),
	prop = defineProps({
	    query: {
	    	type: String,
	    	default: ''
	    }
	}),
    db = ref([]);

    async function loadUserData(username) {
        try { db.value = (await api.get(`/api/users/?username=${username}`)).data.users; }
        catch { db.value = []; }
    };

    watch(
        () => prop.query,
        (username) => {
            loadUserData(username);
        },
        { immediate: true }
    );

</script>

<template>
    <div class="flex flex-col z-2 bg-bg-default rounded-3xl mt-10">
        <div class="text-text-default text-2xl mx-7.5 mt-7.5">
            <h2 v-if="query.length > 11" v-html="$t('menu.userList', { nUser: db.length, search: query.slice(0, 10) + '...' })"></h2>
            <h2 v-if="query.length <= 11" v-html="$t('menu.userList', { nUser: db.length, search: query })"></h2>
            <hr class="text-text-last self-center w-auto">
        </div>
        <div class="p-8 grid grid-cols-4 gap-10 w-full" :class="db.length > 8 ? 'max-h-[75vh] overflow-y-auto' : ''">
            <div v-for="user in db" v-if="db" class="grid grid-cols-1 w-fit">
                <RouterLink :to="{ name: 'user_page', params: { username: user.username } }">
                    <img :src="user.image ? `${user.image}` : defaultAvatar" @error="handleAvatarError"
				        alt="" class="size-35 rounded-t-md place-self-center object-cover bg-linear-to-t from-main-color to-bg-default">
                    <div class="bg-bg-darker py-2 grid grid-cols-1 border-b border-x border-border-default rounded-b-md w-full justify-items-center">
                        <h3 class="text-text-default" v-if="user.username.length > 11">{{ user.username.slice(0, 10) + "..."}}</h3>
                        <h3 class="text-text-default" v-if="user.username.length <= 11">{{ user.username }}</h3>
                        <TagTitle :title="user?.title" class="mt-1 w-fit"/>
                    </div>
                </RouterLink>
            </div>
            <p v-if="!db[0]" class="text-text-default text-2xl col-span-4 place-self-center">
                :(</p>
        </div>
    </div>
</template>

<style scoped>
</style>