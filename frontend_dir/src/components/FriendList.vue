<script setup>
    import TagTitle from './TagTitle.vue';
    import StatusOnline from './StatusOnline.vue';
    import { computed } from 'vue';
    import { defaultAvatar, rejectRequest, handleAvatarError } from '../scripts/Helper/CompUtils';

    const prop = defineProps({
  	    	friendlist: Array,
            removeF: Boolean
	    });

    const visibleFriendlist = computed(() => prop.friendlist.filter((b) => b.friend_status !== 'pending'));

</script>

<template>
        <div v-for="(besties, index) in visibleFriendlist" :key="besties.friend.id_user">
            <RouterLink :to="{ name: 'user_page', params: { username: besties.friend.username } }">
                <div class="flex my-3 ml-2 relative">
                    <img class="size-13 rounded-full object-cover" :src="besties.friend.image ? `${besties.friend.image}` : defaultAvatar" @error="handleAvatarError"/>
                    <StatusOnline :user_id="besties.friend.id_user" v-if="removeF"/>
                    <div class="mx-2">
                        <p class="text-white hover:underline" v-if="besties.friend.username.length <= 15">
                            {{ besties.friend.username }}</p>
                        <p class="text-white hover:underline" v-if="besties.friend.username.length > 15">
                            {{ besties.friend.username.slice(0, 14) + "..." }}</p>
                        <div class="flex items-center gap-1">
                            <TagTitle :title="besties.friend.title" class="mt-1"/>
                            <p class="text-[#4e4e4e8c]">|</p>
                            <p class="text-zinc-300 text-sm">Punti: {{ besties.friend.points }}</p>
                        </div>
                    </div>
                    <button @click.stop.prevent="rejectRequest(besties.friend.id_user)" v-if="removeF"
                                class="h-[80%] p-1.25 px-2 mr-1 ml-auto cursor-pointer self-center rounded-md inset-ring text-sm
                                    bg-red-400/10 text-red-500 inset-ring-red-500/20">Elimina amicizia</button>
                </div>
            </RouterLink>
            <hr v-if="index !== visibleFriendlist.length - 1" class="text-[#4e4e4e80] border-dashed">
        </div>
</template>

<style scoped>
</style>