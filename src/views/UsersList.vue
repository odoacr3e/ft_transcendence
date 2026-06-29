<script setup>
    import Header from '../components/Header.vue';
    import TagTitle from '../components/TagTitle.vue';
    import { ref, onMounted, watch }	from 'vue';
    import { api }				from '../router/api/client';
    import { asset }			from '../scripts/Helper/CompUtils';

    // router.push(`/?username=${username}`) il push va fatto ad una pagina intermedia dove avviene un fetch con questa querry
	const   prop = defineProps({
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
	<div class="min-h-screen flex flex-col">
        <Header/>
        <div id="wrap" class="grow">
            <div class="flex flex-col z-2 bg-[#201e1c] rounded-3xl mt-10">
                <h2 class="text-white text-2xl mx-7.5 mt-7.5" v-if="query.length > 11">
                    {{ db.length }} utenti trovati per "<b>{{ query.slice(0, 10) + "..." }}</b>"<hr class="text-[#4e4e4e8c]"></h2>
                <h2 class="text-white text-2xl mx-7.5 mt-7.5" v-if="query.length <= 11">
                    {{ db.length }} utenti trovati per "<b>{{ query }}</b>"<hr class="text-[#4e4e4e8c]"></h2>
                <div class="p-8 grid grid-cols-4 gap-10 w-full" :class="db.length > 8 ? 'max-h-[75vh] overflow-y-auto' : ''">
                    <div v-for="user in db" v-if="db" class="grid grid-cols-1 w-fit">
                        <RouterLink :to="{ name: 'user_page', params: { username: user.username } }">
                            <img :src="user.image ? asset(`${user.image}`) : asset('../assets/default.png')"
						        alt="" class="size-35 rounded-t-md place-self-center">
                            <div class="bg-[#181715] py-2 grid grid-cols-1 border-b border-x border-[#4e4e4e8c] rounded-b-md w-full justify-items-center">
                                <h3 class="text-white" v-if="user.username.length > 11">{{ user.username.slice(0, 10) + "..."}}</h3>
                                <h3 class="text-white" v-if="user.username.length <= 11">{{ user.username }}</h3>
                                <TagTitle :title="user?.title" class="mt-1 w-fit"/>
                            </div>
                        </RouterLink>
                    </div>
                    <p v-if="!db[0]" class="text-white text-2xl col-span-4 place-self-center">
                        :(</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #wrap {
            display: grid;
            grid-template-columns: max-content max-content;
            position: relative;
            justify-content: center;
            justify-items: center;
            align-items: center;
            z-index: 10;
            font-size: 110%;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            user-select: none;
        }
</style>