<script setup>
import { useI18n } from 'vue-i18n';

const { t, tm, rt} = useI18n();
</script>

<template>
    <div class="flex flex-col p-6 z-2 bg-linear-to-t from-bg-default to-bg-darker md:rounded-3xl w-3xl gap-4">
        <h2 class="text-text-default max-md:text-3xl md:text-4xl font-semibold">{{ t('legal.privacy.title') }}</h2>
        <hr class="w-full justify-self-start text-text-last">
        <p class="text-text-second max-md:text-sm md:text-[16px]">{{ t('legal.privacy.desc') }}</p>
        <ul class="text-text-second flex flex-col gap-2 list-disc pl-5 max-md:text-[13px] md:text-[15px]">
            <li v-for="line in tm('legal.privacy.list')">
                {{ rt(line) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>