
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import { globals } from '../Classes/Globals/globals.js';
import { query } from "../lib/query.js";
const { tournamentsQuery } = query;
export const tournamentsRouter = lib.include.express.Router();

// NOTE: /api/tournaments

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca tutti i tornei a cui l'utente ha partecipato o sta partecipando
*/
tournamentsRouter.get('/', checkJwt, async (req, res) => {
	try {
		const tournaments = await tournamentsQuery.getAllUserTournaments(req.user.id_user);
		if (tournaments)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "tournaments": tournaments }))
		return res.status(400).json(jsonResponse.ResponseError("No tournaments found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving user tournaments"));
	}
});

tournamentsRouter.get('/:id/results',checkJwt, async (req, res) => {
	try {
		const results = await tournamentsQuery.getTournamentResults(req.params.id);
		return res.status(200).json(jsonResponse.ResponseSuccess({ results }));
	} catch (error) {
		console.log("Error:", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving tournaments results"));
	}
})

tournamentsRouter.get('/:id', checkJwt, async (req, res) => {
	try {
		const tournament = await tournamentsQuery.getTournamentById(req.params.id);
		if (tournament)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "tournament": tournament }))
		return res.status(400).json(jsonResponse.ResponseError("Tournament not found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving tournament by id"));
	}
});

tournamentsRouter.post('/', checkJwt, async (req, res) => {
	try {
		const tournament = await tournamentsQuery.createTournament(req.body.name, req.body.id_creator);
		if (tournament)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "tournament": tournament }));
		return res.status(400).json(jsonResponse.ResponseError("Impossible to create new tournament"));
	} catch (error) {
		if (error.code == 'P2002')
			return res.status(409).json(jsonResponse.ResponseError("Tournament already exists"));
		return res.status(500).json(jsonResponse.ResponseError("Server error creating new tournament"));
	}
});

tournamentsRouter.post('/addPlayers', checkJwt, async (req, res) => {
	try {
		const rows = await tournamentsQuery.addPlayersToTournament(req.body.id_tournament, req.body.id_users);
		if (rows.count > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "id_tournament": req.body.id_tournament, "playersAdded": rows.count }));
		return res.status(400).json(jsonResponse.ResponseError("No players were added to tournament"));
	} catch (error) {
		if (error.code == 'P2002')			
			return res.status(409).json(jsonResponse.ResponseError("One or more players are already subscribed to tournament"));
		if (error.code == 'P2003')			
			return res.status(500).json(jsonResponse.ResponseError(`User or tournament don't exist: ${error.meta}`));
		return res.status(500).json(jsonResponse.ResponseError(error.message));
	}
});

tournamentsRouter.patch('/', checkJwt, async (req, res) => {
	try {
		const updateTournament = await tournamentsQuery.updateTournamentStatus(req.body.id_tournament, req.body.status);
		return res.status(200).json(jsonResponse.ResponseSuccess({ updated_tournament: updateTournament }));
	} catch (error) {
		console.log("Error: ", error);
		if (error.code == 'P2025')
			return res.status(409).json(jsonResponse.ResponseError("Status is already set to this tournament or tournament not found"));
		return res.status(500).json(jsonResponse.ResponseError("Server error updating tournament status"));
	}
})
