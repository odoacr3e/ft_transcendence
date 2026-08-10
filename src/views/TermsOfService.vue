<script setup>
import { useI18n } from 'vue-i18n';

const { t, tm, rt} = useI18n();
</script>

<template>
    <div class="flex flex-col p-6 z-2 bg-bg-darker rounded-3xl w-7xl gap-6">
        <div class="flex">
            <h2 class="text-text-default text-4xl font-semibold w-full">{{ t('legal.service.title') }}</h2>
            <div class="text-text-second flex gap-2 self-baseline-last justify-self-end whitespace-nowrap">
                <h3><b>{{ t('legal.service.date.title') }}</b></h3>
                <p v-html="t('legal.service.date.desc')"></p>
            </div>
        </div>
        <div class="text-text-second">
            <h3><b>{{ t('legal.service.intro.title') }}</b></h3>
            <p v-html="t('legal.service.intro.desc')"></p>
        </div>
        <ul class="text-text-second columns-2 gap-8 list-decimal pl-5 text-[17px]">
            <li v-for="(title, desc, index) in tm('legal.service.list')" class="break-inside-avoid mb-4">
                <b>{{ rt(desc) }}</b>
                <p>{{ rt(title) }}</p>
                <div v-if="index == 1">
                    <ul class="flex flex-col list-disc pl-5 my-2">
                        <li v-for="line in tm('legal.service.behavior')">
                            {{ rt(line) }}
                        </li>
                    </ul>
                    <p>{{ t('legal.service.ban') }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>