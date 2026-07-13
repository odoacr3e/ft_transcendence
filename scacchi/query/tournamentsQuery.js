
import { trace } from "node:console";
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

export async function getTournamentById(id_tournament) {
	const tournament = await prisma.tournaments.findUnique({
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
							username: true,
							image: true,
							points: true,
							title: true
						}
					}
				}
			}
		},
		where: { id_tournament: Number(id_tournament) }
	});
	if (!tournament)
		return (null);
	return ({
		id_tournament: tournament.id_tournament,
		name: tournament.name,
		status: tournament.status,
		created_at: tournament.created_at.toISOString().split('T')[0],
		created_by: { id_user: tournament.users.id_user, username: tournament.users.username },
		players: tournament.tournament_players.map(tp => tp.users)
	});
}

// NOTE: creazione nuovo torneo
export async function createTournament(name, id_creator) {
	const tournament = await prisma.tournaments.create({
		data: {
			name: name,
			created_at: new Date().toISOString(),
			status: 'open',
			created_by: id_creator
		},
		select: {
			id_tournament: true,
			status: true,
			created_at: true,
			name: true,
			users: {
				select: {
					id_user: true,
					username: true
				}
			}
		}
	});
	return ({
		id_tournament: tournament.id_tournament,
		name: tournament.name,
		status: tournament.status,
		created_at: tournament.created_at.toISOString().split('T')[0],
		created_by: { id_user: tournament.users.id_user, username: tournament.users.username }
	});
}

// NOTE: 
export async function updateTournamentStatus(id_tournament, status) {
	const validStatus = ['open', 'ongoing', 'closed'];
	if (!validStatus.includes(status))
		return null;
	const updated = await prisma.tournaments.update({
		where: {
			id_tournament: Number(id_tournament),
			status: { not: status }
		},
		data: { status: status },
		select: {
			id_tournament: true,
			status: true,
			created_at: true,
			name: true,
			users: {
				select: {
					id_user: true,
					username: true
				}
			}
		}
	});
	return ({
		id_tournament: updated.id_tournament,
		name: updated.name,
		status: updated.status,
		created_at: updated.created_at.toISOString().split('T')[0],
		created_by: { id_user: updated.users.id_user, username: updated.users.username }
	});
}

/**
 * 
 * @param {Number} id_tournament 
 * @param {Array<Number>} id_users
 * @returns number of records created
 * NOTE: aggiunge al torneo con id passato gli utenti che hanno id in id_users. Ritorna il numero di record creati 
 */
export async function addPlayersToTournament(id_tournament, id_users) {
	return await prisma.tournament_players.createMany({
		data: id_users.map(id => ({
			id_tournament: id_tournament,
			id_user: id
		}))
	});
}