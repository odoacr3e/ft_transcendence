/**
 * @typedef {Object} HistoryEventDTO
 * @property {number}  counter
 * @property {string}  type        "Move" | "MoveBoost" | "Boost" | "Transform" | "EndTurn"
 * @property {string}  team        "white" | "black"
 * @property {string}  movedPiece
 * @property {string}  from
 * @property {string}  to
 * @property {boolean} [isBoosted]
 * @property {boolean} [captured]  // predisposto: oggi il backend non lo manda
 */

/**
 * @typedef {Object} MoveVM
 * @property {number}       counter
 * @property {string}       team
 * @property {string}       piece
 * @property {string}       from
 * @property {string}       to
 * @property {boolean}      boosted
 * @property {string|null}  transformedInto
 * @property {boolean}      captured
 * @property {"move"|"boost"} kind
 */

