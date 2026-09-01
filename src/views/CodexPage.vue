<script setup>
    import { ref }   from 'vue';
    import { useI18n }  from 'vue-i18n';
    import IconCoins    from '@/components/icons/IconCoins.vue';
    import IconChevron  from '@/components/icons/IconChevron.vue';

    const   { t } = useI18n(),
            select = ref(0),
            on = ref(false),
            bool = ref(false),
            array = ["king", "champ", "mino", "jester", "valk", "bastard"];
</script>

<template>
    <div class="flex z-2 bg-bg-darker rounded-3xl">
        <div class="bg-bg-darker rounded-l-3xl flex flex-col gap-7 justify-center" @click="on = true; bool = false;">
            <span class="text-text-default text-xl my-0">⫘⫘⫘</span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 5;" :class="select == 5 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/pawn.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 4;" :class="select == 4 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/bishop.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 3;" :class="select == 3 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/knight.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 2;" :class="select == 2 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/rook.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 1;" :class="select == 1 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/queen.png" alt="" class="size-20"></span>
            <span class="rounded-l-lg cursor-pointer" @click="select = 0;" :class="select == 0 ? 'bg-bg-second' : ''">
                <img :draggable="false" src="../assets/pieces/white/king.png" alt="" class="size-20"></span>
            <span class="text-text-default text-xl my-0">⫘⫘⫘</span>
        </div>
        <div class="bg-bg-default flex flex-col w-lg relative overflow-hidden">
            <div class="flex flex-col m-9 mb-0.5 relative z-11">
                <h2 class="text-text-default text-4xl font-semibold">{{ t('codex.' + array[select] + '.name') }}</h2>
                <p class="text-text-third italic text-[17px]">{{ t('codex.' + array[select] + '.quote') }}</p>
                <hr class="w-full justify-self-start text-text-last my-4">
                <p class="text-text-second" @animationend="on = false" :class="on ? 'fade-in' : ''">{{ t('codex.' + array[select] + '.lore') }}</p>
            </div>
            <div class="bg-linear-to-t from-bg-default to-bg-darker mt-auto p-6 justify-center border-t rounded-t-3xl 
                        border-border-default overflow-hidden absolute bottom-0 w-full z-12 transition-colors ease-in-out">
                <div class="grid transition-all duration-400 ease-in-out" :class="bool ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                    <div class="overflow-hidden">
                        <div class="py-2 pt-1">
                            <h2 class="text-text-default text-2xl font-semibold mb-1">{{ t('codex.move') }}</h2>
                            <p class="text-text-second">{{ t('codex.' + array[select] + '.move') }}</p>
                        </div>
                        <hr class="w-full justify-self-start text-text-last my-4">
                        <div class="py-2 mb-2">
                            <div class="flex text-text-default font-semibold mb-1">
                                <h2 class="text-2xl">{{ t('codex.ability') }} - {{ t('codex.' + array[select] + '.ability.name') }}</h2>
                                <div class="flex self-center ml-auto gap-2">
                                    <p class="text-xl">{{ t('codex.' + array[select] + '.ability.cost') }}</p>
                                    <IconCoins class="size-6"/>
                                </div>
                            </div>
                            <p class="text-text-second">{{ t('codex.' + array[select] + '.ability.desc') }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-center" @click="bool = !bool">
                    <IconChevron class="text-text-default self-center size-8 transition-transform duration-200"
                        :class="{ 'rotate-180': !bool }"/>
                    <h2 class="text-text-default text-2xl font-semibold">{{ t('codex.title') }}</h2>
                </div>
            </div>
        </div>
        <div class="bg-bg-darker rounded-r-3xl border-l border-border-default py-7">
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