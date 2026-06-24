
import { useReducer } from "react";
import * as lib from "../lib/lib.js";
import { Result } from "../Classes/endPoint/result.js";
const { prisma } = lib.conn;

const getAllUserMatches = async (id_user) => {
	const userMatches = await prisma.users_matches.findMany({
		select: {
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
		player: um.users.username,
		opponent: um.matches.users_matches[0]?.users.username ?? null,
		result: um.outcome,
		team: um.team
	}));
}

export const matchHistoryQuery = { getAllUserMatches };