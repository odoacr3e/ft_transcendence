
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import { response } from "express";
const { prisma } = lib.conn;
export const matchHistoryRouter = lib.include.express.Router();

matchHistoryRouter.get('/', async (req, res) => {
	
});