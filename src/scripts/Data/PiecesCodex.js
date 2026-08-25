// SECTION - I DATI STATICI DEL KING'S CODEX

//direzioni base, dy negativo = verso il lato avversario
const ORTHO		= [[ 0,-1], [ 0, 1], [-1, 0], [ 1, 0]];
const DIAG		= [[-1,-1], [ 1,-1], [-1, 1], [ 1, 1]];
const STAR		= [...ORTHO, ...DIAG];
const KNIGHT	= [[ 1, 2], [ 2, 1], [ 2,-1], [ 1,-2], [-1,-2], [-2,-1], [-2, 1], [-1, 2]];

//raggio della griglia di anteprima: 2 -> 5x5 con il pezzo al centro
export const CODEX_RADIUS = 2;
//helper per scrivere le scene in modo compatto.
//role decide solo con che colore viene disegnata l'icona, non la logica.
const self	= (x, y, opts = {})			=> ({ x, y, role: 'self',		...opts });
const ally	= (x, y, type, opts = {})	=> ({ x, y, role: 'ally',	type,	...opts });
const enemy	= (x, y, type, opts = {})	=> ({ x, y, role: 'enemy',	type,	...opts });


/**
 * @typedef {Object} CodexPattern
 * @property {number[][]}   dirs		Direzioni (dx, dy) in cui il pezzo si muove
 * @property {boolean}      slide		Se scorre lungo la direzione o fa un passo solo
 * @property {number[][]}   [capture]	Direzioni in cui mangia soltanto (es. il Bastards)
 */

/**
 * @typedef {Object} CodexActor
 * @property {number}  x		Offset dal centro della griglia
 * @property {number}  y		Offset dal centro, negativo = verso l'avversario
 * @property {string}  [type]	Tipo del pezzo, default: il pezzo a cui appartiene la entry
 * @property {string}  [role]	'self' | 'ally' | 'enemy', decide il colore dell'icona
 */

/**
 * @typedef {Object} CodexMark
 * @property {number} x
 * @property {number} y
 * @property {string} [kind]	'move' (default) | 'capture'
 */

/**
 * @typedef {Object} CodexArrow
 * @property {number[]} from	[x, y] di partenza
 * @property {number[]} to		[x, y] di arrivo
 */

/**
 * @typedef {Object} CodexScene
 * @property {string}        [caption]		Riga di testo sotto la griglia
 * @property {CodexActor[]}  actors			Pezzi da mettere sulla griglia
 * @property {CodexMark[]}   [marks]		Caselle segnate a mano
 * @property {CodexPattern}  [pattern]		Pattern espanso automaticamente
 * @property {number}        [patternFrom]	Indice dell'attore da cui parte il pattern, default 0
 * @property {CodexArrow[]}  [arrows]		Frecce disegnate sopra la griglia
 */


/**
 * @typedef {Object} CodexEntry
 * @property {string}            name			Nome mostrato nel codex
 * @property {CodexPattern}      move			Movimento non potenziato
 * @property {CodexPattern|null} boost			Movimento potenziato, null se il boost non cambia pattern
 * @property {string}            baseText		Cosa fa il pezzo da base
 * @property {string}            boostText		Cosa fa il potenziamento
 * @property {CodexScene[]}      [baseScenes]	Scene disegnate a mano, hanno la precedenza su move
 * @property {CodexScene[]}      [boostScenes]	Scene disegnate a mano, hanno la precedenza su boost

 */

/** @type {Object<string, CodexEntry>} */
export const PIECES_CODEX = Object.freeze({
	King: {
		name:		"King",
		move:		{ dirs: STAR, slide: false },
		boost:		null,
		baseText:	"MOSSA BASE DEGLI SCACCHI",
		boostText:	"Potenzia a tuo rischio e pericolo.",
	},
	Champion: {
		name:		"Champion",
		move:		{ dirs: STAR, slide: true },
		boost:		{ dirs: STAR, slide: true },
		baseText:	"MOSSA BASE DEGLI SCACCHI",
		boostText:	"Due mosse in un turno: si sposta, poi riparte dalla casella\
					 d'arrivo. Ma attenzione, se si fa scacco al re avversario,\
					 oppure ci si muove in una casella minacciata da un pezzo\
					 avversario la mossa boostata si interrompe",
	},
	Minotaurus: {
		name:		"Minotaurus",
		move:		{ dirs: ORTHO, slide: true },
		boost:		{ dirs: ORTHO, slide: true },
		baseText:	"MOSSA BASE DEGLI SCACCHI",
		boostText:	"Due mosse in un turno: si sposta, poi riparte dalla casella d'arrivo.",
	},
	Jester: {
		name:		"Jester",
		move:		{ dirs: KNIGHT, slide: false },
		boost:		{ dirs: KNIGHT, slide: false },
		baseText:	"MOSSA BASE DEGLI SCACCHI",
		boostText:	"Mossa singola, ma su zone extra concesse dall'abilita'.",
	},
	Valkirya: {
		name:		"Valkirya",
		move:		{ dirs: DIAG, slide: true },
		boost:		{ dirs: DIAG, slide: true },
		baseText:	"MOSSA BASE DEGLI SCACCHI",
		boostText:	"Mossa singola che permette di mangiare un pezzo avversario senza\
					 muovere la valkirya stessa.\n Salta un qualsiasi pezzo lungo il raggio d'azione'.",
	},
	Bastards: {
		name:		"Bastards",
		move:		{ dirs: [[0,-1]], slide: false, capture: [[-1,-1], [1,-1]] },
		boost:		{ dirs: [[0,-1], [0,-2]], slide: false, capture: [[-1,-1], [1,-1]] },
		baseText:	"MOSSA BASE DEGLI SCACCHI",
		boostText:	"DUE MOSSE IN UN TURNO\
					\n\n - Un movimento regolare da scacchi classico\
					\n - Muove un pezzo che si trovava a distanza 1 dalla sua posizione precedente.",
		baseScenes: [
			{
				caption:	"Avanza di una casella, due se non si e' ancora mosso.\
							 Mangia solo in diagonale.",
				actors:		[ self(0, 1) ],
				marks:		[
					{ x:  0, y:  0 },
					{ x:  0, y: -1 },
					{ x: -1, y:  0, kind: 'capture' },
					{ x:  1, y:  0, kind: 'capture' },
				],
			},
		],

		boostScenes: [
			{
				caption:	"1. Il Bastard potenziato fa la sua mossa normale,\
							 qui l'avanzata doppia.",
				actors:		[ self(0, 1), ally(1, 1, "Valkirya") ],
				arrows:		[ { from: [0, 1], to: [0, -1] } ],
			},
			{
				caption:	"2. Nello stesso turno muove anche il pezzo che gli stava\
							 accanto, con le sue mosse classiche.",
				actors:			[ self(0, -1), ally(1, 1, "Valkirya") ],
				pattern:		{ dirs: DIAG, slide: true },
				patternFrom:	1,	
				arrows:			[ { from: [1, 1], to: [-1, -1] } ],
			},
		],

	},
});
