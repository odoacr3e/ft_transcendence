
import { prisma } from "../lib/prisma.js";

export async function getAllUserMatches(id_user) {
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
					end_date: true,
					round: true,
					tournaments: {
						select: {
							id_tournament: true,
							name: true,
							status: true,
							created_at: true,
							users: {
								select: {
									id_user: true,
									username: true
								}
							}
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
		date: um.matches.end_date.toISOString().split('T')[0],
		// team: um.team,
		tournament: um.matches.tournaments ? { 
			id_tournament: um.matches.tournaments.id_tournament,
			name: um.matches.tournaments.name,
			status: um.matches.tournaments.status,
			round: um.matches.round,
			created_at: um.matches.tournaments.created_at.toISOString().split('T')[0],
			creator: {"id_user": um.matches.tournaments.users.id_user, "username": um.matches.tournaments.users.username}
		} : null
	}));
}
