
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { getNotify, postNotify } from "../query/notifiyQuery.js";
import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import { globals } from '../Classes/Globals/globals.js';
import { getAllUserTournaments } from "../query/tournamentsQuery.js"
const { prisma } = lib.conn.prisma;
export const tournamentsRouter = lib.include.express.Router();

// NOTE: /api/tournaments

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca tutti i tornei a cui l'utente ha partecipato
*/
tournamentsRouter.get('/', checkJwt, async (req, res) => {
	try {
		const tournaments = await getAllUserTournaments(req.user.id_user);
		if (tournaments)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "tournaments": tournaments }))
		return res.status(400).json(jsonResponse.ResponseError("No tournaments found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving user tournaments"));
	}
});