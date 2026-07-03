
import { prisma } from "../lib/prisma.js";

export async function getAllUserTournaments(id_user) {
	const userTournaments = await prisma.tournament_players.findMany({
		where: {
			id_user: Number(id_user)
		},
		select: {
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
					},
					tournament_players: {
						select: {
							users: {
								select: {
									id_user: true,
									username: true
								}
							}
						}
					}
				}
			}
		}
	});
	return userTournaments.map(t => ({
		id_tournament: t.tournaments.id_tournament,
		name: t.tournaments.name,
		status: t.tournaments.status,
		created_at: t.tournaments.created_at.toISOString().split('T')[0],
		created_by: { id_user: t.tournaments.users.id_user, username: t.tournaments.users.username },
		players: t.tournaments.tournament_players.map(tp => tp.users)
	}));
}
