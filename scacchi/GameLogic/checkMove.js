//@ts-check

import { error } from "../handlers/game/utils.js";
import { enumNames, arrayNames } from "../Macro/enums.js";
import {checkMateCheckAll} from "../GameLogic/checkMate.js";
import { DangerUpdate } from "../utils/moveUtils.js";
import { checkKingDanger } from "../utils/gameUtils.js";
import { includesOneOf } from "../utils/string.js";

/** @typedef {import("../Classes/Chess/match").Match} Match*/
/** @typedef {import("../Classes/endPoint/result").Result} Result*/
/** @typedef {import("../Classes/Chess/Pieces/pieces.js").Piece} Piece*/


