
import * as lib from "../lib/lib.js";
const { prisma } = lib.conn;


/**
 * @param {Match} match 
 */
const createMatch = async (match) => {
	const m = await prisma.matches.create({
		data: {
			start_date: match.start_date,
			id_tournament: match.tournament_id,
			round: match.tournament_round,
			end_date: new Date().toISOString(),
			history: match.Log()
		}
	});
	return ;
}

export const matchQuery = { createMatch }