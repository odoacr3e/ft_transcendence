<script setup>
import { useI18n } from 'vue-i18n';

const { t, tm, rt} = useI18n();
</script>

<template>
    <div class="flex flex-col p-6 z-2 bg-bg-darker rounded-3xl w-3xl gap-4">
        <h2 class="text-text-default text-4xl font-semibold">{{ t('legal.privacy.title') }}</h2>
        <p class="text-text-second">{{ t('legal.privacy.desc') }}</p>
        <ul class="text-text-second flex flex-col gap-2 list-disc pl-5">
            <li v-for="line in tm('legal.privacy.list')">
                {{ rt(line) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>