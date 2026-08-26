<script setup>
/**
 * TournamentBracket.vue
 * Bracket a eliminazione diretta per 8 giocatori (Quarti -> Semifinali -> Finale).
 *
 * Come usarlo:
 * <TournamentBracket :players="tournament.players" :matches="tournament.matches" />
 *
 * - "players": array di 8 oggetti { id, name }, nell'ordine dei tabelloni
 *   (posizione 0 vs 1, 2 vs 3, 4 vs 5, 6 vs 7 nei quarti).
 * - "matches" (opzionale): se vuoi mostrare i vincitori già decisi, passa una
 *   struttura tipo:
 *   [
 *     [ {winnerId}, {winnerId}, {winnerId}, {winnerId} ], // quarti
 *     [ {winnerId}, {winnerId} ],                          // semifinali
 *     [ {winnerId} ]                                        // finale
 *   ]
 *   Se non lo passi, i round successivi al primo mostrano "TBD".
 */
import { computed } from 'vue';
import { defaultAvatar, handleAvatarError }	from '../scripts/Helper/CompUtils';

const props = defineProps({
    players: { type: Array, required: true },
    matches: { type: Array, default: () => [] },
});

function playerName(p) { return p?.username ?? 'TBD'; }

function winnerOf(roundI, matchI) {
    const round = props.matches?.[roundI];
    const match = round?.[matchI];

    if (!match?.winnerId) { return null; }

    return (props.players.find(p => p.id_user === match.winnerId) ?? { username: 'TBD' });
}

const rounds = computed(() => {
    const p = props.players ?? [];

    const quarti = [
        { top: p[0], bottom: p[1] },
        { top: p[2], bottom: p[3] },
        { top: p[4], bottom: p[5] },
        { top: p[6], bottom: p[7] },
    ];

    const semi = [
        { top: winnerOf(0, 0), bottom: winnerOf(0, 1) },
        { top: winnerOf(0, 2), bottom: winnerOf(0, 3) },
    ];

    const finale = [
        { top: winnerOf(1, 0), bottom: winnerOf(1, 1) },
    ];

    return [quarti, semi, finale];
});

const champion = computed(() => winnerOf(2, 0));
</script>

<template>
        <div class="flex items-stretch min-h-145 gap-7">
            <div v-for="(round, ri) in rounds" :key="ri" class="flex flex-col justify-around min-w-90">
                <div v-for="(pair, pi) in round" :key="pi" class="relative flex flex-col justify-between gap-20 z-10">
                    <div class="pair h-25 flex flex-col justify-center border border-border-default rounded-lg bg-bg-darker overflow-hidden"
                        :class="{ 'semi rounded-l-none' : ri == 1, 'final rounded-l-none' : ri == 2 }">
                        <div class="player border-b border-border-default">
                            <img :src="pair.top?.image ? `${pair.top?.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
                                class="size-9 rounded-full place-self-center mr-2 object-cover" alt="">
                            {{ playerName(pair.top) }}</div>
                        <div class="player">
                            <img :src="pair.bottom?.image ? `${pair.bottom?.image}` : defaultAvatar" @error="handleAvatarError" :draggable="false"
                                class="size-9 rounded-full place-self-center mr-2 object-cover" alt="">
                            {{ playerName(pair.bottom) }}</div>
                    </div>
                </div>
            </div>
            <div class="relative flex flex-col gap-20 justify-center left-1">
                <div class="flex flex-col items-center gap-1 py-4 px-6 border-2 border-[#aeb0b3] rounded-lg bg-bg-darker">
                    <span class="text-sm uppercase tracking-wider text-text-second">Campione</span>
                    <span class="font-bold">{{ playerName(champion) }}</span>
                </div>
            </div>
        </div>
</template>

<style scoped>

.player {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    font-size: 1.3rem;
}

.pair::after {
    content: '';
    position: absolute;
    width: 2rem;
    right: calc(-1 * 2rem);
    bottom: calc((6.25rem - 0.25rem) / 2);
    border-top: 2px solid #aeb0b3;
    border-bottom: 2px solid #aeb0b3;
}

.semi::before {
    z-index: -1;
    content: '';
    position: absolute;
    height: calc(6.25rem * 1.49);
    border-right: 2px solid #aeb0b3;
    border-left: 2px solid #aeb0b3;
}

.final::before {
    z-index: -1;
    content: '';
    position: absolute;
    height: calc(6.25rem * 2.94);
    border-right: 2px solid #aeb0b3;
    border-left: 2px solid #aeb0b3;
}
</style>
