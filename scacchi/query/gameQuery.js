
import { prisma } from "../lib/prisma.js";

/** @typedef {import("../Classes/Chess/match.js").Match} Match*/

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
	match.id = m.id_match;
}

/**
 * @param {Match} match 
 */
export async function createUsersMatch(match) {
	if (!match.users)
		return (console.log("Array of object match.user doesn't exist"));
	for (const u of match.users) {
		await prisma.users_matches.create({
			data: {
				id_match: match.id,
				id_user: u.id_user,
				outcome: u.outcome,
				team: u.startTeam
			}
		});
	};
}

// [
// 	{
// 		id_user: string,
// 		outcome: "Win" | "Lose" | "Draw",
// 		startTeam: "pezzi iniziali(definire format universale)" | null,
// 		team: "black" | "white" | ...  
// 	}
// ]