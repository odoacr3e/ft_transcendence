
import * as lib from "../lib/lib.js";
const { prisma } = lib.conn;

const getAllUserMatches = async (id_user) => {
	const userMatches = await prisma.users_matches.findMany({
		select: {
			id_usermatch: true,
			outcome: true,
			team: true,
			matches: {
				select: {
					users_matches: {
						where: {
							id_user: { not: Number(id_user)}
						},
						select: {
							users: {
								select: {
									username: true
								}
							}
						}
					},
					round: true,
					tournaments: {
						select: {
							id_tournament: true,
							name: true,
							status: true
						}
					}
				}
			},
			users: {
				select: {
					username: true
				}
			}
		},
		where: {
			id_user: Number(id_user)
		}
	});
	return userMatches.map(um => ({
		id_usermatch: um.id_usermatch,
		player: um.users.username,
		opponent: um.matches.users_matches[0]?.users.username || null,
		result: um.outcome,
		team: um.team,
		tournament: um.matches.tournaments ? { 
			id_tournament: um.matches.tournaments.id_tournament,
			name: um.matches.tournaments.name,
			status: um.matches.tournaments.status,
			round: um.matches.round
		} : null
	}));
}

export const matchHistoryQuery = { getAllUserMatches };