
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { getNotify, postNotify } from "../query/notifiyQuery.js";
import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import { globals } from '../Classes/Globals/globals.js';
const { prisma } = lib.conn.prisma;
export const tournamentsRouter = lib.include.express.Router();

// NOTE: /api/tournaments

tournamentsRouter.get('/', checkJwt, () => {

});