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

const props = defineProps({
    players: {
        type: Array,
        required: true,
        // atteso: array di 8 elementi { id, name }
    },
    matches: {
        type: Array,
        default: () => [],
    },
});

// Nome sicuro anche se manca il player (bye/placeholder)
function playerName(p) {
    return p?.username ?? 'TBD';
}

// Trova il vincitore di un match del round precedente, se disponibile
function winnerOf(roundIndex, matchIndex) {
    const round = props.matches?.[roundIndex];
    const match = round?.[matchIndex];
    if (!match?.winnerId) return null;
    // cerca il player corrispondente nell'elenco originale
    return props.players.find(p => p.id_user === match.winnerId) ?? { username: 'TBD' };
}

// Costruisce i 3 round da visualizzare: quarti, semifinali, finale
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
    <div class="bracket-outer w-full h-full rounded-3xl border border-border-default bg-bg-default p-6 text-text-default overflow-auto">
        <div class="bracket-container">
            <div
                v-for="(round, ri) in rounds"
                :key="ri"
                class="round"
                :class="{ 'round-last': ri === rounds.length - 1 }"
            >
                <div
                    v-for="(pair, pi) in round"
                    :key="pi"
                    class="pair"
                    :class="{ 'has-connector': ri < rounds.length - 1 }"
                >
                    <div class="match">
                        <div class="player">{{ playerName(pair.top) }}</div>
                        <div class="player">{{ playerName(pair.bottom) }}</div>
                    </div>
                </div>
            </div>

            <!-- Colonna finale: mostra il campione -->
            <div class="round round-champion">
                <div class="champion-box">
                    <span class="champion-label">Campione</span>
                    <span class="champion-name">{{ playerName(champion) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Variabili di layout: modificale per cambiare dimensioni del bracket */
.bracket-container {
    --match-h: 3.25rem;   /* altezza di un box match (2 righe player) */
    --pair-gap: 1.25rem;  /* spazio verticale tra i due match di una coppia */
    --stub: 1.75rem;      /* lunghezza della linea orizzontale tra i round */
    --line-color: var(--color-border-default, #999);

    display: flex;
    align-items: stretch;
    min-height: 32rem; /* altezza totale fissa: fondamentale per l'allineamento */
    gap: var(--stub);
}

.round {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-width: 11rem;
}

.pair {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--pair-gap);
}

.match {
    height: var(--match-h);
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid var(--color-border-default);
    border-radius: 0.75rem;
    background: var(--color-bg-darker);
    overflow: hidden;
}

.player {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    font-size: 0.9rem;
}

.player:first-child {
    border-bottom: 1px solid var(--color-border-default);
}

/* Linea "a staffa" che unisce i due match di una coppia e prosegue
   verso il match del round successivo */
.pair.has-connector::after {
    content: '';
    position: absolute;
    top: calc(var(--match-h) / 2);
    bottom: calc(var(--match-h) / 2);
    right: calc(-1 * var(--stub));
    width: var(--stub);
    border-top: 2px solid var(--line-color);
    border-right: 2px solid var(--line-color);
    border-bottom: 2px solid var(--line-color);
}

/* Colonna finale con il nome del campione */
.round-champion {
    justify-content: center;
}

.champion-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 1rem 1.5rem;
    border: 2px solid var(--color-form-icon, var(--color-border-default));
    border-radius: 0.75rem;
    background: var(--color-bg-darker);
}

.champion-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
}

.champion-name {
    font-size: 1.1rem;
    font-weight: 600;
}
</style>
