<script setup>
	import { useI18n }		from 'vue-i18n';

	import IconGlobe		from './icons/IconGlobe.vue';
	import IconRobot		from './icons/IconRobot.vue';
	import IconRanking		from './icons/IconRanking.vue';
	import IconTrophy		from './icons/IconTrophy.vue';
	import IconBook			from './icons/IconBook.vue';

    const { t } = useI18n();
</script>
    
<template>
    <div class="justify-self-end translate-x-45 text-text-default">
    </div>
    <div class="flex flex-col gap-4 justify-self-end w-full max-w-md translate-x-5">
        <div class="bg-bg-default text-text-default p-5 rounded-l-xl hover:-translate-x-5 transition-all">
			<RouterLink :to="{ name: 'playpage' }" class="flex items-center gap-4">
                <IconGlobe class="size-10"/>
                <b><h2 class="relative text-4xl">{{ t('menu.online') }}</h2></b>
            </RouterLink>
        </div>
		<div class="bg-bg-default text-text-default p-5 rounded-l-xl hover:-translate-x-5 transition-all">
            <RouterLink :to="{ name: 'playpage', query: { ai: '1' } }" class="flex items-center gap-4">
                <IconRobot class="size-10"/>
                <b><h2 class="relative text-4xl">{{ t('menu.bot') }}</h2></b>
            </RouterLink>
        </div>
        <div class="bg-bg-default text-text-default p-5 rounded-l-xl hover:-translate-x-5 transition-all">
            <RouterLink to="/leaderboard" class="flex items-center gap-4">
                <IconRanking class="size-10"/>
                <b><h2 class="relative text-4xl">{{ t('menu.lBoard') }}</h2></b>
            </RouterLink>
        </div>
        <div class="bg-bg-default text-text-default p-5 rounded-l-xl hover:-translate-x-5 transition-all">
            <RouterLink to="/tournaments" class="flex items-center gap-4">
                <IconTrophy class="size-10"/>
                <b><h2 class="relative text-4xl">{{ t('common.tournament', 2) }}</h2></b>
            </RouterLink>
        </div>
        <div class="bg-bg-default text-text-default p-5 rounded-l-xl hover:-translate-x-5 transition-all">
            <RouterLink to="/codex" class="flex items-center gap-4">
                <IconBook class="size-10"/>
                <b><h2 class="relative text-4xl">{{ t('menu.codex') }}</h2></b>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
    .wrap {
		position: relative;
		z-index: 10;
		font-size: 110%;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		user-select: none;
	}
</style>