<script setup>
    import { ref }   from 'vue';
    import { useI18n }  from 'vue-i18n';

    const   { t } = useI18n(),
            select = ref(0),
            on = ref(false),
            bool = ref(false),
            array = ["king", "champ", "mino", "jester", "valk", "bastard"];
</script>

<template>
    <div class="flex z-2 bg-bg-darker md:rounded-3xl
            max-md:h-screen max-md:w-screen max-md:pt-15 max-lg:h-[80vh]">
        <div class="bg-bg-darker rounded-l-3xl flex flex-col gap-7 justify-center max-md:sticky" @click="on = true; bool = false;">
            <span class="text-text-default max-md:text-base lg:text-xl my-0 max-lg:-mb-5">⫘⫘⫘</span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 5;" :class="select == 5 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/pawn.png" alt="" class="max-md:size-14 md:size-18 lg:size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 4;" :class="select == 4 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/bishop.png" alt="" class="max-md:size-14 md:size-18 lg:size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 3;" :class="select == 3 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/knight.png" alt="" class="max-md:size-14 md:size-18 lg:size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 2;" :class="select == 2 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/rook.png" alt="" class="max-md:size-14 md:size-18 lg:size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 1;" :class="select == 1 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/queen.png" alt="" class="max-md:size-14 md:size-18 lg:size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 0;" :class="select == 0 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/king.png" alt="" class="max-md:size-14 md:size-18 lg:size-20"></span>
            <span class="text-text-default max-md:text-base lg:text-xl my-0 max-lg:-mt-5">⫘⫘⫘</span>
        </div>
        <div class="bg-bg-default flex flex-col relative overflow-hidden md:rounded-r-3xl
                md:w-[60vw]
                lg:w-[28vw] lg:min-w-118">
            <div class="relative max-md:h-[30vh] md:h-[40vw] overflow-hidden lg:hidden md:bg-bg-default">
                <img :draggable="false" src="../assets/KingSketch.png" alt="image"
                        class="absolute inset-0 size-full object-cover object-top 
                        max-md:mask-b-from-10% max-md:mask-b-to-100% max-md:pb-px max-md:p- max-md:scale-120 max-md:-mt-5
                        md:mask-b-from-10% md:mask-b-to-100% md:pb-px md:p-4 md:scale-120 md:-top-2/12">
            </div>
            <div class="flex flex-col m-9 max-lg:mt-0 mb-0.5 relative z-11 overflow-y-scroll">
                <h2 class="text-text-default max-md:text-xl md:text-3xl lg:text-4xl font-semibold">{{ t('codex.' + array[select] + '.name') }}</h2>
                <p class="text-text-third italic max-md:text-xs md:text-sm lg:text-[17px]">{{ t('codex.' + array[select] + '.quote') }}</p>
                <hr class="w-full justify-self-start text-text-last my-4">
                <p class="text-text-second h-full mb-[25%] max-md:text-xs md:text-sm lg:text-base max-[425px]:pb-5"
                    @animationend="on = false" :class="on ? 'fade-in' : ''">{{ t('codex.' + array[select] + '.lore') }}</p>
            </div>
            <div class="bg-linear-to-t from-bg-default to-bg-darker mt-auto max-md:p-3 md:p-6 justify-center border-t rounded-t-3xl 
                        border-border-default overflow-hidden absolute bottom-0 w-full z-12 transition-colors ease-in-out">
                <div class="grid transition-all duration-400 ease-in-out" :class="bool ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                    <div class="overflow-hidden">
                        <div class="py-2 pt-1">
                            <h2 class="text-text-default max-md:text-lg md:text-xl lg:text-2xl font-semibold mb-1">{{ t('codex.move') }}</h2>
                            <p class="text-text-second max-md:text-xs md:text-sm lg:text-base">{{ t('codex.' + array[select] + '.move') }}</p>
                        </div>
                        <hr class="w-full justify-self-start text-text-last my-4">
                        <div class="py-2 mb-2">
                            <div class="flex text-text-default font-semibold mb-1">
                                <h2 class="max-md:text-lg md:text-xl lg:text-2xl">{{ t('codex.ability') }} - {{ t('codex.' + array[select] + '.ability.name') }}</h2>
                                <div class="flex self-center ml-auto gap-2">
                                    <p class="max-md:text-base md:text-lg lg:text-xl">{{ t('codex.' + array[select] + '.ability.cost') }}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="max-md:size-4 md:size-5 lg:size-6">
                                        <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                                        <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                                        <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                                        <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-text-second max-md:text-xs md:text-sm lg:text-base">{{ t('codex.' + array[select] + '.ability.desc') }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-center max-md:mb-2" @click="bool = !bool">
                    <svg class="text-text-default self-center max-md:size-6 md:size-8 transition-transform duration-200" :class="{ 'rotate-180': !bool }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="text-text-default max-md:text-lg md:text-2xl font-semibold">{{ t('codex.title') }}</h2>
                </div>
            </div>
        </div>
        <div class="max-lg:hidden bg-bg-darker rounded-r-3xl border-l border-border-default py-7">
            <img :draggable="false" src="../assets/KingSketch.png" alt="" class="mx-3.5 scale-100">
        </div>
    </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 400ms ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 20%;
    transform: translatex(-10px);
  }
  to {
    opacity: 1;
    transform: translatex(0);
  }
}
</style>