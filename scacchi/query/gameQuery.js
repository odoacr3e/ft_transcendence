
import { prisma } from "../lib/prisma.js";
/**
 * @param {Match} match 
 */
export async function createMatch(match) {
	const m = await prisma.matches.create({
		data: {
			start_date: match.start_date,
			id_tournament: match.tournament_id,
			round: match.tournament_round,
			end_date: new Date().toISOString(),
			history: match.Log()
		}
	});
	return m;
}
