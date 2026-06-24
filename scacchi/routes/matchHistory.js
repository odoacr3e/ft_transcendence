
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import { response } from "express";
import { matchHistoryQuery } from "../query/matchHistoryQuery.js";
const { prisma } = lib.conn;
export const matchHistoryRouter = lib.include.express.Router();

matchHistoryRouter.get('/', checkJwt, async (req, res) => {
	try {
		const matches = matchHistoryQuery.getAllUserMatches(req.user.id_user);
		return res.status(200).json(jsonResponse.ResponseSuccess({ matches: matches }));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving another user's friendships"));
	}
});